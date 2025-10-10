import fs from 'fs';
import csv from 'csv-parser';
import Trip from '../models/Trip';

interface RawTripData {
  id?: string;
  vendor_id?: string;
  pickup_datetime?: string;
  dropoff_datetime?: string;
  passenger_count?: string;
  pickup_longitude?: string;
  pickup_latitude?: string;
  dropoff_longitude?: string;
  dropoff_latitude?: string;
  store_and_fwd_flag?: string;
  trip_duration?: string;
  [key: string]: string | undefined;
}

interface ProcessingStats {
  totalRecords: number;
  processedRecords: number;
  skippedRecords: number;
  errors: string[];
}

interface CleanedTripData {
  tripId: string;
  vendorId: number;
  pickupDatetime: Date;
  dropoffDatetime: Date;
  passengerCount: number;
  pickupLongitude: number;
  pickupLatitude: number;
  dropoffLongitude: number;
  dropoffLatitude: number;
  storeAndFwdFlag: string;
  tripDuration: number;
  tripDurationMinutes: number;
  tripDistance: number;
  tripSpeedKmh: number;
  hourOfDay: number;
  dayOfWeek: number;
  isWeekend: boolean;
  monthOfYear: number;
  isRushHour: boolean;
  tripCategory: string;
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
    return year >= 2010 && year <= 2025 && !isNaN(date.getTime());
  }

  /**
   * Parse date in multiple formats:
   * - DD/MM/YYYY HH:mm (e.g., "14/03/2016 17:24")
   * - YYYY-MM-DD HH:mm:ss (e.g., "2016-03-14 17:24:55")
   * - ISO format (e.g., "2016-03-14T17:24:55.000Z")
   */
  private parseDate(dateStr: string): Date | null {
    try {
      if (!dateStr || typeof dateStr !== 'string') {
        return null;
      }

      const trimmed = dateStr.trim();

      // Try ISO format first
      if (trimmed.includes('T') || trimmed.includes('Z')) {
        const date = new Date(trimmed);
        if (!isNaN(date.getTime())) {
          return date;
        }
      }

      // Try YYYY-MM-DD HH:mm:ss format (with optional seconds)
      if (trimmed.match(/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}(:\d{2})?/)) {
        const parts = trimmed.split(' ');
        if (parts.length === 2) {
          const dateParts = parts[0].split('-');
          const timeParts = parts[1].split(':');

          if (dateParts.length === 3 && timeParts.length >= 2) {
            const year = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10);
            const day = parseInt(dateParts[2], 10);
            const hour = parseInt(timeParts[0], 10);
            const minute = parseInt(timeParts[1], 10);
            const second = timeParts.length > 2 ? parseInt(timeParts[2], 10) : 0;

            if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour) || isNaN(minute)) {
              return null;
            }

            if (day < 1 || day > 31 || month < 1 || month > 12 || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
              return null;
            }

            const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
            if (!isNaN(date.getTime())) {
              return date;
            }
          }
        }
      }

      // Try DD/MM/YYYY HH:mm format
      if (trimmed.match(/^\d{1,2}\/\d{1,2}\/\d{4}\s\d{1,2}:\d{2}/)) {
        const parts = trimmed.split(' ');
        if (parts.length === 2) {
          const dateParts = parts[0].split('/');
          const timeParts = parts[1].split(':');

          if (dateParts.length === 3 && timeParts.length >= 2) {
            const day = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10);
            const year = parseInt(dateParts[2], 10);
            const hour = parseInt(timeParts[0], 10);
            const minute = parseInt(timeParts[1], 10);

            if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hour) || isNaN(minute)) {
              return null;
            }

            if (day < 1 || day > 31 || month < 1 || month > 12 || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
              return null;
            }

            const date = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
            if (!isNaN(date.getTime())) {
              return date;
            }
          }
        }
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   * Returns distance in kilometers
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Determine if hour is rush hour
   * Morning rush: 7-9 AM
   * Evening rush: 4-7 PM
   */
  private isRushHour(hour: number): boolean {
    return (hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19);
  }

  /**
   * Categorize trip based on distance
   */
  private categorizeTripDistance(distance: number): string {
    if (distance < 2) return 'short';
    if (distance < 10) return 'medium';
    return 'long';
  }

  private calculateDerivedFeatures(
    pickupDatetime: Date,
    dropoffDatetime: Date,
    pickupLat: number,
    pickupLon: number,
    dropoffLat: number,
    dropoffLon: number,
    tripDuration: number
  ): {
    tripDurationMinutes: number;
    tripDistance: number;
    tripSpeedKmh: number;
    hourOfDay: number;
    dayOfWeek: number;
    isWeekend: boolean;
    monthOfYear: number;
    isRushHour: boolean;
    tripCategory: string;
  } {
    const tripDurationMinutes = tripDuration / 60;
    
    // Calculate distance using Haversine formula
    const tripDistance = this.calculateDistance(
      pickupLat,
      pickupLon,
      dropoffLat,
      dropoffLon
    );
    
    // Calculate speed in km/h
    const tripSpeedKmh = tripDurationMinutes > 0 
      ? (tripDistance / tripDurationMinutes) * 60 
      : 0;
    
    const hourOfDay = pickupDatetime.getUTCHours();
    const dayOfWeek = pickupDatetime.getUTCDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const monthOfYear = pickupDatetime.getUTCMonth() + 1; // 1-12
    const isRushHourFlag = this.isRushHour(hourOfDay);
    const tripCategory = this.categorizeTripDistance(tripDistance);

    return {
      tripDurationMinutes,
      tripDistance,
      tripSpeedKmh,
      hourOfDay,
      dayOfWeek,
      isWeekend,
      monthOfYear,
      isRushHour: isRushHourFlag,
      tripCategory
    };
  }

  private cleanRecord(raw: RawTripData): CleanedTripData | null {
    try {
      // Validate required fields
      if (!raw.id || !raw.pickup_datetime || !raw.dropoff_datetime) {
        this.logError(`Missing required fields: id=${raw.id}`);
        return null;
      }

      // Parse dates
      const pickupDatetime = this.parseDate(raw.pickup_datetime);
      const dropoffDatetime = this.parseDate(raw.dropoff_datetime);

      if (!pickupDatetime || !dropoffDatetime) {
        this.logError(`Invalid date format: pickup="${raw.pickup_datetime}", dropoff="${raw.dropoff_datetime}"`);
        return null;
      }

      // Validate timestamps
      if (!this.isValidTimestamp(pickupDatetime) || !this.isValidTimestamp(dropoffDatetime)) {
        this.logError(`Invalid timestamps: pickup=${pickupDatetime.toISOString()}, dropoff=${dropoffDatetime.toISOString()}`);
        return null;
      }

      // Check trip duration is positive
      if (dropoffDatetime <= pickupDatetime) {
        this.logError(`Invalid trip duration: dropoff before or equal to pickup for trip ${raw.id}`);
        return null;
      }

      // Parse numeric fields
      const vendorId = parseInt(raw.vendor_id || '0', 10);
      const pickupLongitude = parseFloat(raw.pickup_longitude || '');
      const pickupLatitude = parseFloat(raw.pickup_latitude || '');
      const dropoffLongitude = parseFloat(raw.dropoff_longitude || '');
      const dropoffLatitude = parseFloat(raw.dropoff_latitude || '');
      const passengerCount = parseInt(raw.passenger_count || '0', 10);
      const tripDuration = parseInt(raw.trip_duration || '0', 10);
      const storeAndFwdFlag = (raw.store_and_fwd_flag || 'N').toUpperCase();

      // Validate vendor ID
      if (vendorId < 1 || vendorId > 2) {
        this.logError(`Invalid vendor ID: ${vendorId} for trip ${raw.id}`);
        return null;
      }

      // Validate coordinates
      if (isNaN(pickupLatitude) || isNaN(pickupLongitude) || 
          !this.isValidCoordinate(pickupLatitude, pickupLongitude)) {
        this.logError(`Invalid pickup coordinates: ${pickupLatitude}, ${pickupLongitude} for trip ${raw.id}`);
        return null;
      }

      if (isNaN(dropoffLatitude) || isNaN(dropoffLongitude) ||
          !this.isValidCoordinate(dropoffLatitude, dropoffLongitude)) {
        this.logError(`Invalid dropoff coordinates: ${dropoffLatitude}, ${dropoffLongitude} for trip ${raw.id}`);
        return null;
      }

      // Validate passenger count
      if (passengerCount < 1 || passengerCount > 6) {
        this.logError(`Invalid passenger count: ${passengerCount} for trip ${raw.id}`);
        return null;
      }

      // Validate trip duration (1 second to 4 hours)
      if (tripDuration < 1 || tripDuration > 14400) {
        this.logError(`Invalid trip duration: ${tripDuration} seconds for trip ${raw.id}`);
        return null;
      }

      // Validate store and forward flag
      if (storeAndFwdFlag !== 'Y' && storeAndFwdFlag !== 'N') {
        this.logError(`Invalid store_and_fwd_flag: ${storeAndFwdFlag} for trip ${raw.id}`);
        return null;
      }

      // Calculate derived features
      const derivedFeatures = this.calculateDerivedFeatures(
        pickupDatetime,
        dropoffDatetime,
        pickupLatitude,
        pickupLongitude,
        dropoffLatitude,
        dropoffLongitude,
        tripDuration
      );

      // Validate trip speed (reasonable range: 0.5 to 120 km/h for city traffic)
      if (derivedFeatures.tripSpeedKmh < 0.5 || derivedFeatures.tripSpeedKmh > 120) {
        this.logError(`Invalid trip speed: ${derivedFeatures.tripSpeedKmh.toFixed(2)} km/h for trip ${raw.id}`);
        return null;
      }

      // Validate distance (0.1 km to 100 km)
      if (derivedFeatures.tripDistance < 0.1 || derivedFeatures.tripDistance > 100) {
        this.logError(`Invalid trip distance: ${derivedFeatures.tripDistance.toFixed(2)} km for trip ${raw.id}`);
        return null;
      }

      return {
        tripId: raw.id,
        vendorId,
        pickupDatetime,
        dropoffDatetime,
        pickupLongitude,
        pickupLatitude,
        dropoffLongitude,
        dropoffLatitude,
        passengerCount,
        storeAndFwdFlag,
        tripDuration,
        ...derivedFeatures
      };
    } catch (error) {
      this.logError(`Error cleaning record ${raw.id}: ${error}`);
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

          // Skip header row if it exists
          if (row.id === 'id' || row.id === 'ID') {
            return;
          }

          // Check for duplicates based on trip ID
          if (row.id && seenRecords.has(row.id)) {
            this.logError(`Duplicate record detected: ${row.id}`);
            this.stats.skippedRecords++;
            return;
          }

          const cleanedRecord = this.cleanRecord(row);

          if (cleanedRecord) {
            cleanedRecords.push(cleanedRecord);
            if (row.id) seenRecords.add(row.id);
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
      const result = await Trip.bulkCreate(records, {
        validate: true,
        hooks: false,
        ignoreDuplicates: false
      });
      console.log(`✓ Inserted batch of ${records.length} records`);
    } catch (error: any) {
      console.error('❌ Error inserting batch:', error.message);
      console.error('Error details:', error);
      this.logError(`Batch insert error: ${error.message}`);
      
      // Try inserting one by one to identify the problematic record
      console.log('Attempting to insert records individually to identify errors...');
      for (let i = 0; i < records.length; i++) {
        try {
          await Trip.create(records[i]);
        } catch (individualError: any) {
          console.error(`Record ${i} (${records[i].tripId}) failed:`, individualError.message);
          this.logError(`Individual insert failed for ${records[i].tripId}: ${individualError.message}`);
        }
      }
    }
  }

  public getStats(): ProcessingStats {
    return this.stats;
  }
}