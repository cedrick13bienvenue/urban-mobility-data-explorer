import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Trip from '../models/Trip';
import { KMeansClusterer, OutlierDetector, TripDataPoint, Cluster } from '../services/customAlgorithm';

export class TripController {
  /**
   * GET /api/trips
   * Fetch trips with filtering, sorting, and pagination
   */
  public async getAllTrips(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 50,
        sortBy = 'pickupDatetime',
        sortOrder = 'DESC',
        minDistance,
        maxDistance,
        minFare,
        maxFare,
        startDate,
        endDate,
        hourOfDay,
        dayOfWeek,
        isWeekend,
        minPassengers,
        maxPassengers,
      } = req.query;

      // Build where clause
      const whereClause: any = {};

      if (minDistance || maxDistance) {
        whereClause.tripDistance = {};
        if (minDistance) whereClause.tripDistance[Op.gte] = parseFloat(minDistance as string);
        if (maxDistance) whereClause.tripDistance[Op.lte] = parseFloat(maxDistance as string);
      }

      if (minFare || maxFare) {
        whereClause.fareAmount = {};
        if (minFare) whereClause.fareAmount[Op.gte] = parseFloat(minFare as string);
        if (maxFare) whereClause.fareAmount[Op.lte] = parseFloat(maxFare as string);
      }

      if (startDate || endDate) {
        whereClause.pickupDatetime = {};
        if (startDate) whereClause.pickupDatetime[Op.gte] = new Date(startDate as string);
        if (endDate) whereClause.pickupDatetime[Op.lte] = new Date(endDate as string);
      }

      if (hourOfDay) {
        whereClause.hourOfDay = parseInt(hourOfDay as string);
      }

      if (dayOfWeek) {
        whereClause.dayOfWeek = parseInt(dayOfWeek as string);
      }

      if (isWeekend !== undefined) {
        whereClause.isWeekend = isWeekend === 'true';
      }

      if (minPassengers || maxPassengers) {
        whereClause.passengerCount = {};
        if (minPassengers) whereClause.passengerCount[Op.gte] = parseInt(minPassengers as string);
        if (maxPassengers) whereClause.passengerCount[Op.lte] = parseInt(maxPassengers as string);
      }

      // Calculate offset
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

      // Fetch trips
      const { rows: trips, count: total } = await Trip.findAndCountAll({
        where: whereClause,
        order: [[sortBy as string, sortOrder as string]],
        limit: parseInt(limit as string),
        offset: offset,
      });

      res.json({
        success: true,
        data: trips,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          totalPages: Math.ceil(total / parseInt(limit as string)),
        },
      });
    } catch (error) {
      console.error('Error fetching trips:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch trips' });
    }
  }

  /**
   * GET /api/trips/:id
   * Fetch a single trip by ID
   */
  public async getTripById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const trip = await Trip.findByPk(id);

      if (!trip) {
        res.status(404).json({ success: false, error: 'Trip not found' });
        return;
      }

      res.json({ success: true, data: trip });
    } catch (error) {
      console.error('Error fetching trip:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch trip' });
    }
  }

  /**
   * GET /api/trips/stats/summary
   * Get overall statistics
   */
  public async getStatsSummary(req: Request, res: Response): Promise<void> {
    try {
      const trips = await Trip.findAll({
        attributes: [
          'tripDistance',
          'fareAmount',
          'tipAmount',
          'tripDurationMinutes',
          'tripSpeedKmh',
          'passengerCount',
        ],
      });

      if (trips.length === 0) {
        res.json({ success: true, data: null, message: 'No data available' });
        return;
      }

      // Calculate statistics manually
      let totalDistance = 0;
      let totalFare = 0;
      let totalTip = 0;
      let totalDuration = 0;
      let totalSpeed = 0;
      let totalPassengers = 0;

      for (let i = 0; i < trips.length; i++) {
        totalDistance += trips[i].tripDistance;
        totalFare += trips[i].fareAmount;
        totalTip += trips[i].tipAmount;
        totalDuration += trips[i].tripDurationMinutes;
        totalSpeed += trips[i].tripSpeedKmh;
        totalPassengers += trips[i].passengerCount;
      }

      const count = trips.length;

      res.json({
        success: true,
        data: {
          totalTrips: count,
          avgDistance: totalDistance / count,
          avgFare: totalFare / count,
          avgTip: totalTip / count,
          avgDuration: totalDuration / count,
          avgSpeed: totalSpeed / count,
          avgPassengers: totalPassengers / count,
          totalRevenue: totalFare + totalTip,
        },
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
    }
  }

  /**
   * GET /api/trips/stats/hourly
   * Get trip statistics by hour of day
   */
  public async getHourlyStats(req: Request, res: Response): Promise<void> {
    try {
      const trips = await Trip.findAll({
        attributes: ['hourOfDay', 'tripDistance', 'fareAmount', 'tripDurationMinutes'],
      });

      // Group by hour manually
      const hourlyData: { [key: number]: { count: number; totalDistance: number; totalFare: number; totalDuration: number } } = {};

      for (let i = 0; i < 24; i++) {
        hourlyData[i] = { count: 0, totalDistance: 0, totalFare: 0, totalDuration: 0 };
      }

      for (let i = 0; i < trips.length; i++) {
        const hour = trips[i].hourOfDay;
        hourlyData[hour].count++;
        hourlyData[hour].totalDistance += trips[i].tripDistance;
        hourlyData[hour].totalFare += trips[i].fareAmount;
        hourlyData[hour].totalDuration += trips[i].tripDurationMinutes;
      }

      // Calculate averages
      const result = [];
      for (let hour = 0; hour < 24; hour++) {
        const data = hourlyData[hour];
        result.push({
          hour,
          tripCount: data.count,
          avgDistance: data.count > 0 ? data.totalDistance / data.count : 0,
          avgFare: data.count > 0 ? data.totalFare / data.count : 0,
          avgDuration: data.count > 0 ? data.totalDuration / data.count : 0,
        });
      }

      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Error fetching hourly stats:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch hourly statistics' });
    }
  }

  /**
   * GET /api/trips/stats/daily
   * Get trip statistics by day of week
   */
  public async getDailyStats(req: Request, res: Response): Promise<void> {
    try {
      const trips = await Trip.findAll({
        attributes: ['dayOfWeek', 'tripDistance', 'fareAmount', 'passengerCount'],
      });

      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      // Group by day manually
      const dailyData: { [key: number]: { count: number; totalDistance: number; totalFare: number; totalPassengers: number } } = {};

      for (let i = 0; i < 7; i++) {
        dailyData[i] = { count: 0, totalDistance: 0, totalFare: 0, totalPassengers: 0 };
      }

      for (let i = 0; i < trips.length; i++) {
        const day = trips[i].dayOfWeek;
        dailyData[day].count++;
        dailyData[day].totalDistance += trips[i].tripDistance;
        dailyData[day].totalFare += trips[i].fareAmount;
        dailyData[day].totalPassengers += trips[i].passengerCount;
      }

      // Calculate averages
      const result = [];
      for (let day = 0; day < 7; day++) {
        const data = dailyData[day];
        result.push({
          day,
          dayName: daysOfWeek[day],
          tripCount: data.count,
          avgDistance: data.count > 0 ? data.totalDistance / data.count : 0,
          avgFare: data.count > 0 ? data.totalFare / data.count : 0,
          avgPassengers: data.count > 0 ? data.totalPassengers / data.count : 0,
        });
      }

      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Error fetching daily stats:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch daily statistics' });
    }
  }

  /**
   * GET /api/trips/analysis/clusters
   * Perform K-Means clustering on trip distances
   */
  public async getDistanceClusters(req: Request, res: Response): Promise<void> {
    try {
      const { k = 3, limit = 10000 } = req.query;

      // Fetch trip data for clustering
      const trips = await Trip.findAll({
        attributes: ['id', 'tripDistance', 'fareAmount', 'tripDurationMinutes', 'tripSpeedKmh'],
        limit: parseInt(limit as string),
      });

      if (trips.length === 0) {
        res.json({ success: true, data: [], message: 'No data available for clustering' });
        return;
      }

      // Prepare data points
      const dataPoints: TripDataPoint[] = trips.map(trip => ({
        id: trip.id,
        distance: trip.tripDistance,
        fare: trip.fareAmount,
        duration: trip.tripDurationMinutes,
        speed: trip.tripSpeedKmh,
      }));

      // Perform clustering
      const clusterer = new KMeansClusterer(parseInt(k as string));
      const clusters = clusterer.cluster(dataPoints);

      // Format response
      const formattedClusters = clusters.map((cluster, index) => ({
        clusterIndex: index,
        centroid: cluster.centroid,
        count: cluster.count,
        avgFare: cluster.avgFare,
        avgDuration: cluster.avgDuration,
        avgSpeed: cluster.avgSpeed,
        label: this.getClusterLabel(cluster.centroid),
      }));

      res.json({
        success: true,
        data: formattedClusters,
        metadata: {
          k: parseInt(k as string),
          totalPoints: trips.length,
        },
      });
    } catch (error) {
      console.error('Error performing clustering:', error);
      res.status(500).json({ success: false, error: 'Failed to perform clustering analysis' });
    }
  }

  /**
   * GET /api/trips/analysis/outliers
   * Detect outliers in fare amounts
   */
  public async detectFareOutliers(req: Request, res: Response): Promise<void> {
    try {
      const trips = await Trip.findAll({
        attributes: ['id', 'fareAmount', 'tripDistance', 'tipAmount'],
      });

      if (trips.length === 0) {
        res.json({ success: true, data: null, message: 'No data available' });
        return;
      }

      const fares = trips.map(trip => trip.fareAmount);

      const detector = new OutlierDetector();
      const { outliers, lowerBound, upperBound } = detector.detectOutliers(fares);

      // Find trips with outlier fares
      const outlierTrips = [];
      for (let i = 0; i < trips.length; i++) {
        if (trips[i].fareAmount < lowerBound || trips[i].fareAmount > upperBound) {
          outlierTrips.push({
            id: trips[i].id,
            fareAmount: trips[i].fareAmount,
            tripDistance: trips[i].tripDistance,
            tipAmount: trips[i].tipAmount,
          });
        }
      }

      res.json({
        success: true,
        data: {
          outlierCount: outliers.length,
          totalTrips: trips.length,
          outlierPercentage: (outliers.length / trips.length) * 100,
          lowerBound,
          upperBound,
          outlierTrips: outlierTrips.slice(0, 100), // Return first 100
        },
      });
    } catch (error) {
      console.error('Error detecting outliers:', error);
      res.status(500).json({ success: false, error: 'Failed to detect outliers' });
    }
  }

  /**
   * GET /api/trips/stats/payment
   * Get statistics by payment type
   */
  public async getPaymentTypeStats(req: Request, res: Response): Promise<void> {
    try {
      const trips = await Trip.findAll({
        attributes: ['paymentType', 'fareAmount', 'tipAmount', 'tripDistance'],
      });

      // Group by payment type manually
      const paymentData: { [key: number]: { count: number; totalFare: number; totalTip: number; totalDistance: number } } = {};

      for (let i = 0; i < trips.length; i++) {
        const paymentType = trips[i].paymentType;
        if (!paymentData[paymentType]) {
          paymentData[paymentType] = { count: 0, totalFare: 0, totalTip: 0, totalDistance: 0 };
        }

        paymentData[paymentType].count++;
        paymentData[paymentType].totalFare += trips[i].fareAmount;
        paymentData[paymentType].totalTip += trips[i].tipAmount;
        paymentData[paymentType].totalDistance += trips[i].tripDistance;
      }

      // Calculate averages
      const result = [];
      for (const paymentType in paymentData) {
        const data = paymentData[paymentType];
        result.push({
          paymentType: parseInt(paymentType),
          paymentTypeName: this.getPaymentTypeName(parseInt(paymentType)),
          tripCount: data.count,
          avgFare: data.totalFare / data.count,
          avgTip: data.totalTip / data.count,
          avgDistance: data.totalDistance / data.count,
          totalRevenue: data.totalFare + data.totalTip,
        });
      }

      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch payment statistics' });
    }
  }

  /**
   * GET /api/trips/heatmap
   * Get pickup location density data for heatmap
   */
  public async getLocationHeatmap(req: Request, res: Response): Promise<void> {
    try {
      const { limit = 5000 } = req.query;

      const trips = await Trip.findAll({
        attributes: ['pickupLatitude', 'pickupLongitude', 'dropoffLatitude', 'dropoffLongitude'],
        limit: parseInt(limit as string),
      });

      const heatmapData = trips.map(trip => ({
        pickup: {
          lat: trip.pickupLatitude,
          lng: trip.pickupLongitude,
        },
        dropoff: {
          lat: trip.dropoffLatitude,
          lng: trip.dropoffLongitude,
        },
      }));

      res.json({ success: true, data: heatmapData });
    } catch (error) {
      console.error('Error fetching heatmap data:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch heatmap data' });
    }
  }

  // Helper methods
  private getClusterLabel(centroid: number): string {
    if (centroid < 2) return 'Short Distance';
    if (centroid < 5) return 'Medium Distance';
    return 'Long Distance';
  }

  private getPaymentTypeName(type: number): string {
    const paymentTypes: { [key: number]: string } = {
      1: 'Credit Card',
      2: 'Cash',
      3: 'No Charge',
      4: 'Dispute',
      5: 'Unknown',
      6: 'Voided Trip',
    };
    return paymentTypes[type] || 'Unknown';
  }
}