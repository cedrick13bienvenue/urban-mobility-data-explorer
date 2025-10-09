import fs from 'fs';
import csv from 'csv-parser';
import Trip from '../models/Trip';

interface RawTripData {
  id?: string;
  pickup_datetime?: string;
  dropoff_datetime?: string;
  pickup_longitude?: string;
  pickup_latitude?: string;
  dropoff_longitude?: string;
  dropoff_latitude?: string;
  passenger_count?: string;
  trip_distance?: string;
  fare_amount?: string;
  tip_amount?: string;
  total_amount?: string;
  payment_type?: string;
  [key: string]: string | undefined;
}

interface ProcessingStats {
  totalRecords: number;
  processedRecords: number;
  skippedRecords: number;
  errors: string[];
}

interface CleanedTripData {
  pickupDatetime: Date;
  dropoffDatetime: Date;
  pickupLongitude: number;
  pickupLatitude: number;
  dropoffLongitude: number;
  dropoffLatitude: number;
  passengerCount: number;
  tripDistance: number;
  fareAmount: number;
  tipAmount: number;
  totalAmount: number;
  paymentType: number;
  tripDurationMinutes: number;
  tripSpeedKmh: number;
  farePerKm: number;
  tipPercentage: number;
  hourOfDay: number;
  dayOfWeek: number;
  isWeekend: boolean;
}

export class DataProcessor {
  private stats: ProcessingStats = {
    totalRecords: 0,
    processedRecords: 0,
    skippedRecords: 0,
    errors: []
  };

  private logFilePath: string;

  constructor(logFilePath: string = './logs/processing.log') {
    this.logFilePath = logFilePath;
    this.initializeLogFile();
  }

  private initializeLogFile(): void {
    const logDir = this.logFilePath.substring(0, this.logFilePath.lastIndexOf('/'));
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    fs.writeFileSync(this.logFilePath, `Data Processing Log - ${new Date().toISOString()}\n\n`);
  }

  private logError(message: string): void {
    const logMessage = `[${new Date().toISOString()}] ${message}\n`;
    fs.appendFileSync(this.logFilePath, logMessage);
    this.stats.errors.push(message);
  }

  private isValidCoordinate(lat: number, lon: number): boolean {
    // NYC bounding box: roughly 40.5-41.0 N, -74.3 to -73.7 W
    return (
      lat >= 40.5 && lat <= 41.0 &&
      lon >= -74.3 && lon <= -73.7
    );
  }

  private isValidTimestamp(date: Date): boolean {
    const year = date.getFullYear();
    return year >= 2000 && year <= 2025 && !isNaN(date.getTime());
  }

  private calculateDerivedFeatures(
    pickupDatetime: Date,
    dropoffDatetime: Date,
    tripDistance: number,
    fareAmount: number,
    tipAmount: number
  ): {
    tripDurationMinutes: number;
    tripSpeedKmh: number;
    farePerKm: number;
    tipPercentage: number;
    hourOfDay: number;
    dayOfWeek: number;
    isWeekend: boolean;
  } {
    const durationMs = dropoffDatetime.getTime() - pickupDatetime.getTime();
    const tripDurationMinutes = durationMs / (1000 * 60);
    
    // Convert miles to km (1 mile = 1.60934 km)
    const tripDistanceKm = tripDistance * 1.60934;
    
    // Calculate speed in km/h
    const tripSpeedKmh = tripDurationMinutes > 0 
      ? (tripDistanceKm / tripDurationMinutes) * 60 
      : 0;
    
    // Calculate fare per km
    const farePerKm = tripDistanceKm > 0 
      ? fareAmount / tripDistanceKm 
      : 0;
    
    // Calculate tip percentage
    const tipPercentage = fareAmount > 0 
      ? (tipAmount / fareAmount) * 100 
      : 0;
    
    const hourOfDay = pickupDatetime.getHours();
    const dayOfWeek = pickupDatetime.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    return {
      tripDurationMinutes,
      tripSpeedKmh,
      farePerKm,
      tipPercentage,
      hourOfDay,
      dayOfWeek,
      isWeekend
    };
  }

  private cleanRecord(raw: RawTripData): CleanedTripData | null {
    try {
      // Parse dates
      const pickupDatetime = new Date(raw.pickup_datetime || '');
      const dropoffDatetime = new Date(raw.dropoff_datetime || '');

      // Validate timestamps
      if (!this.isValidTimestamp(pickupDatetime) || !this.isValidTimestamp(dropoffDatetime)) {
        this.logError(`Invalid timestamps: pickup=${raw.pickup_datetime}, dropoff=${raw.dropoff_datetime}`);
        return null;
      }

      // Check trip duration is positive
      if (dropoffDatetime <= pickupDatetime) {
        this.logError(`Invalid trip duration: dropoff before or equal to pickup`);
        return null;
      }

      // Parse numeric fields
      const pickupLongitude = parseFloat(raw.pickup_longitude || '');
      const pickupLatitude = parseFloat(raw.pickup_latitude || '');
      const dropoffLongitude = parseFloat(raw.dropoff_longitude || '');
      const dropoffLatitude = parseFloat(raw.dropoff_latitude || '');
      const passengerCount = parseInt(raw.passenger_count || '0');
      const tripDistance = parseFloat(raw.trip_distance || '0');
      const fareAmount = parseFloat(raw.fare_amount || '0');
      const tipAmount = parseFloat(raw.tip_amount || '0');
      const totalAmount = parseFloat(raw.total_amount || '0');
      const paymentType = parseInt(raw.payment_type || '0');

      // Validate coordinates
      if (!this.isValidCoordinate(pickupLatitude, pickupLongitude)) {
        this.logError(`Invalid pickup coordinates: ${pickupLatitude}, ${pickupLongitude}`);
        return null;
      }

      if (!this.isValidCoordinate(dropoffLatitude, dropoffLongitude)) {
        this.logError(`Invalid dropoff coordinates: ${dropoffLatitude}, ${dropoffLongitude}`);
        return null;
      }

      // Validate passenger count
      if (passengerCount < 1 || passengerCount > 6) {
        this.logError(`Invalid passenger count: ${passengerCount}`);
        return null;
      }

      // Validate trip distance (reasonable range: 0.1 to 100 miles)
      if (tripDistance < 0.1 || tripDistance > 100) {
        this.logError(`Invalid trip distance: ${tripDistance}`);
        return null;
      }

      // Validate fare amount (reasonable range: $2.50 to $500)
      if (fareAmount < 2.5 || fareAmount > 500) {
        this.logError(`Invalid fare amount: ${fareAmount}`);
        return null;
      }

      // Validate tip amount (should be non-negative and reasonable)
      if (tipAmount < 0 || tipAmount > 200) {
        this.logError(`Invalid tip amount: ${tipAmount}`);
        return null;
      }

      // Calculate derived features
      const derivedFeatures = this.calculateDerivedFeatures(
        pickupDatetime,
        dropoffDatetime,
        tripDistance,
        fareAmount,
        tipAmount
      );

      // Validate trip speed (reasonable range: 1 to 100 km/h)
      if (derivedFeatures.tripSpeedKmh < 1 || derivedFeatures.tripSpeedKmh > 100) {
        this.logError(`Invalid trip speed: ${derivedFeatures.tripSpeedKmh} km/h`);
        return null;
      }

      return {
        pickupDatetime,
        dropoffDatetime,
        pickupLongitude,
        pickupLatitude,
        dropoffLongitude,
        dropoffLatitude,
        passengerCount,
        tripDistance,
        fareAmount,
        tipAmount,
        totalAmount,
        paymentType,
        ...derivedFeatures
      };
    } catch (error) {
      this.logError(`Error cleaning record: ${error}`);
      return null;
    }
  }

  public async processCSV(filePath: string, batchSize: number = 1000): Promise<ProcessingStats> {
    console.log(`Starting data processing from: ${filePath}`);
    
    const cleanedRecords: CleanedTripData[] = [];
    const seenRecords = new Set<string>(); // For duplicate detection

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row: RawTripData) => {
          this.stats.totalRecords++;

          // Check for duplicates based on key fields
          const recordKey = `${row.pickup_datetime}-${row.dropoff_datetime}-${row.pickup_longitude}-${row.pickup_latitude}`;
          if (seenRecords.has(recordKey)) {
            this.logError(`Duplicate record detected: ${recordKey}`);
            this.stats.skippedRecords++;
            return;
          }

          const cleanedRecord = this.cleanRecord(row);

          if (cleanedRecord) {
            cleanedRecords.push(cleanedRecord);
            seenRecords.add(recordKey);
            this.stats.processedRecords++;

            // Insert in batches
            if (cleanedRecords.length >= batchSize) {
              this.insertBatch(cleanedRecords.splice(0, batchSize));
            }
          } else {
            this.stats.skippedRecords++;
          }

          // Log progress every 10000 records
          if (this.stats.totalRecords % 10000 === 0) {
            console.log(`Processed ${this.stats.totalRecords} records...`);
          }
        })
        .on('end', async () => {
          // Insert remaining records
          if (cleanedRecords.length > 0) {
            await this.insertBatch(cleanedRecords);
          }

          console.log('\n=== Processing Complete ===');
          console.log(`Total Records: ${this.stats.totalRecords}`);
          console.log(`Processed Records: ${this.stats.processedRecords}`);
          console.log(`Skipped Records: ${this.stats.skippedRecords}`);
          console.log(`Error Count: ${this.stats.errors.length}`);
          console.log(`Log file: ${this.logFilePath}`);

          resolve(this.stats);
        })
        .on('error', (error) => {
          console.error('Error reading CSV:', error);
          reject(error);
        });
    });
  }

  private async insertBatch(records: CleanedTripData[]): Promise<void> {
    try {
      await Trip.bulkCreate(records, {
        validate: true,
        hooks: false
      });
      console.log(`✓ Inserted batch of ${records.length} records`);
    } catch (error) {
      console.error('Error inserting batch:', error);
      this.logError(`Batch insert error: ${error}`);
    }
  }

  public getStats(): ProcessingStats {
    return this.stats;
  }
}