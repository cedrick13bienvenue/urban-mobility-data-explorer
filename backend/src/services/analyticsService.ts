import Trip from '../models/Trip';
import { Op } from 'sequelize';
import {
  TripStatistics,
  HourlyStatistics,
  DailyStatistics,
  VendorStatistics,
} from '../types/trip.types';
import { getDayName } from '../utils/helpers';

export class AnalyticsService {
  /**
   * Calculate overall statistics
   */
  public async calculateOverallStats(): Promise<TripStatistics | null> {
    const trips = await Trip.findAll({
      attributes: [
        'tripDistance',
        'tripDurationMinutes',
        'tripSpeedKmh',
        'passengerCount',
      ],
    });

    if (trips.length === 0) {
      return null;
    }

    let totalDistance = 0;
    let totalDuration = 0;
    let totalSpeed = 0;
    let totalPassengers = 0;

    for (const trip of trips) {
      totalDistance += trip.tripDistance;
      totalDuration += trip.tripDurationMinutes;
      totalSpeed += trip.tripSpeedKmh;
      totalPassengers += trip.passengerCount;
    }

    const count = trips.length;

    return {
      totalTrips: count,
      avgDistance: totalDistance / count,
      avgDuration: totalDuration / count,
      avgSpeed: totalSpeed / count,
      avgPassengers: totalPassengers / count,
    };
  }

  /**
   * Calculate hourly statistics
   */
  public async calculateHourlyStats(): Promise<HourlyStatistics[]> {
    const trips = await Trip.findAll({
      attributes: ['hourOfDay', 'tripDistance', 'tripDurationMinutes'],
    });

    const hourlyData: { [key: number]: { 
      count: number; 
      totalDistance: number; 
      totalDuration: number;
    } } = {};

    // Initialize all hours
    for (let i = 0; i < 24; i++) {
      hourlyData[i] = { count: 0, totalDistance: 0, totalDuration: 0 };
    }

    // Aggregate data
    for (const trip of trips) {
      const hour = trip.hourOfDay;
      hourlyData[hour].count++;
      hourlyData[hour].totalDistance += trip.tripDistance;
      hourlyData[hour].totalDuration += trip.tripDurationMinutes;
    }

    // Calculate averages
    const result: HourlyStatistics[] = [];
    for (let hour = 0; hour < 24; hour++) {
      const data = hourlyData[hour];
      result.push({
        hour,
        tripCount: data.count,
        avgDistance: data.count > 0 ? data.totalDistance / data.count : 0,
        avgDuration: data.count > 0 ? data.totalDuration / data.count : 0,
      });
    }

    return result;
  }

  /**
   * Calculate daily statistics
   */
  public async calculateDailyStats(): Promise<DailyStatistics[]> {
    const trips = await Trip.findAll({
      attributes: ['dayOfWeek', 'tripDistance', 'passengerCount'],
    });

    const dailyData: { [key: number]: { 
      count: number; 
      totalDistance: number; 
      totalPassengers: number;
    } } = {};

    // Initialize all days
    for (let i = 0; i < 7; i++) {
      dailyData[i] = { count: 0, totalDistance: 0, totalPassengers: 0 };
    }

    // Aggregate data
    for (const trip of trips) {
      const day = trip.dayOfWeek;
      dailyData[day].count++;
      dailyData[day].totalDistance += trip.tripDistance;
      dailyData[day].totalPassengers += trip.passengerCount;
    }

    // Calculate averages
    const result: DailyStatistics[] = [];
    for (let day = 0; day < 7; day++) {
      const data = dailyData[day];
      result.push({
        day,
        dayName: getDayName(day),
        tripCount: data.count,
        avgDistance: data.count > 0 ? data.totalDistance / data.count : 0,
        avgPassengers: data.count > 0 ? data.totalPassengers / data.count : 0,
      });
    }

    return result;
  }

  /**
   * Calculate vendor statistics
   */
  public async calculateVendorStats(): Promise<VendorStatistics[]> {
    const trips = await Trip.findAll({
      attributes: ['vendorId', 'tripDistance', 'tripDurationMinutes', 'tripSpeedKmh'],
    });

    const vendorData: { [key: number]: { 
      count: number; 
      totalDistance: number; 
      totalDuration: number;
      totalSpeed: number;
    } } = {};

    // Aggregate data
    for (const trip of trips) {
      const vendorId = trip.vendorId;
      if (!vendorData[vendorId]) {
        vendorData[vendorId] = { count: 0, totalDistance: 0, totalDuration: 0, totalSpeed: 0 };
      }

      vendorData[vendorId].count++;
      vendorData[vendorId].totalDistance += trip.tripDistance;
      vendorData[vendorId].totalDuration += trip.tripDurationMinutes;
      vendorData[vendorId].totalSpeed += trip.tripSpeedKmh;
    }

    // Calculate averages
    const result: VendorStatistics[] = [];
    for (const vendorId in vendorData) {
      const data = vendorData[vendorId];
      const id = parseInt(vendorId);
      result.push({
        vendorId: id,
        vendorName: `Vendor ${id}`,
        tripCount: data.count,
        avgDistance: data.totalDistance / data.count,
        avgDuration: data.totalDuration / data.count,
        avgSpeed: data.totalSpeed / data.count,
      });
    }

    return result;
  }

  /**
   * Find peak hours
   */
  public async findPeakHours(): Promise<{ hour: number; tripCount: number }[]> {
    const hourlyStats = await this.calculateHourlyStats();
    
    // Sort by trip count descending
    const sorted = [...hourlyStats].sort((a, b) => b.tripCount - a.tripCount);
    
    return sorted.slice(0, 5).map(stat => ({
      hour: stat.hour,
      tripCount: stat.tripCount,
    }));
  }

  /**
   * Calculate weekend vs weekday comparison
   */
  public async compareWeekendWeekday(): Promise<{
    weekend: { avgDistance: number; avgDuration: number; avgPassengers: number; tripCount: number };
    weekday: { avgDistance: number; avgDuration: number; avgPassengers: number; tripCount: number };
  }> {
    const weekendTrips = await Trip.findAll({
      where: { isWeekend: true },
      attributes: ['tripDistance', 'tripDurationMinutes', 'passengerCount'],
    });

    const weekdayTrips = await Trip.findAll({
      where: { isWeekend: false },
      attributes: ['tripDistance', 'tripDurationMinutes', 'passengerCount'],
    });

    const calculateAvg = (trips: Trip[]) => {
      if (trips.length === 0) return { avgDistance: 0, avgDuration: 0, avgPassengers: 0, tripCount: 0 };
      
      let totalDistance = 0;
      let totalDuration = 0;
      let totalPassengers = 0;

      for (const trip of trips) {
        totalDistance += trip.tripDistance;
        totalDuration += trip.tripDurationMinutes;
        totalPassengers += trip.passengerCount;
      }

      return {
        avgDistance: totalDistance / trips.length,
        avgDuration: totalDuration / trips.length,
        avgPassengers: totalPassengers / trips.length,
        tripCount: trips.length,
      };
    };

    return {
      weekend: calculateAvg(weekendTrips),
      weekday: calculateAvg(weekdayTrips),
    };
  }
}