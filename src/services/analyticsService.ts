import Trip from '../models/Trip';
import { Op } from 'sequelize';
import {
  TripStatistics,
  HourlyStatistics,
  DailyStatistics,
  PaymentStatistics,
} from '../types/trip.types';
import { getDayName, getPaymentTypeName } from '../utils/helpers';

export class AnalyticsService {
  /**
   * Calculate overall statistics
   */
  public async calculateOverallStats(): Promise<TripStatistics | null> {
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
      return null;
    }

    let totalDistance = 0;
    let totalFare = 0;
    let totalTip = 0;
    let totalDuration = 0;
    let totalSpeed = 0;
    let totalPassengers = 0;

    for (const trip of trips) {
      totalDistance += trip.tripDistance;
      totalFare += trip.fareAmount;
      totalTip += trip.tipAmount;
      totalDuration += trip.tripDurationMinutes;
      totalSpeed += trip.tripSpeedKmh;
      totalPassengers += trip.passengerCount;
    }

    const count = trips.length;

    return {
      totalTrips: count,
      avgDistance: totalDistance / count,
      avgFare: totalFare / count,
      avgTip: totalTip / count,
      avgDuration: totalDuration / count,
      avgSpeed: totalSpeed / count,
      avgPassengers: totalPassengers / count,
      totalRevenue: totalFare + totalTip,
    };
  }

  /**
   * Calculate hourly statistics
   */
  public async calculateHourlyStats(): Promise<HourlyStatistics[]> {
    const trips = await Trip.findAll({
      attributes: ['hourOfDay', 'tripDistance', 'fareAmount', 'tripDurationMinutes'],
    });

    const hourlyData: { [key: number]: { 
      count: number; 
      totalDistance: number; 
      totalFare: number; 
      totalDuration: number;
    } } = {};

    // Initialize all hours
    for (let i = 0; i < 24; i++) {
      hourlyData[i] = { count: 0, totalDistance: 0, totalFare: 0, totalDuration: 0 };
    }

    // Aggregate data
    for (const trip of trips) {
      const hour = trip.hourOfDay;
      hourlyData[hour].count++;
      hourlyData[hour].totalDistance += trip.tripDistance;
      hourlyData[hour].totalFare += trip.fareAmount;
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
        avgFare: data.count > 0 ? data.totalFare / data.count : 0,
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
      attributes: ['dayOfWeek', 'tripDistance', 'fareAmount', 'passengerCount'],
    });

    const dailyData: { [key: number]: { 
      count: number; 
      totalDistance: number; 
      totalFare: number; 
      totalPassengers: number;
    } } = {};

    // Initialize all days
    for (let i = 0; i < 7; i++) {
      dailyData[i] = { count: 0, totalDistance: 0, totalFare: 0, totalPassengers: 0 };
    }

    // Aggregate data
    for (const trip of trips) {
      const day = trip.dayOfWeek;
      dailyData[day].count++;
      dailyData[day].totalDistance += trip.tripDistance;
      dailyData[day].totalFare += trip.fareAmount;
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
        avgFare: data.count > 0 ? data.totalFare / data.count : 0,
        avgPassengers: data.count > 0 ? data.totalPassengers / data.count : 0,
      });
    }

    return result;
  }

  /**
   * Calculate payment type statistics
   */
  public async calculatePaymentStats(): Promise<PaymentStatistics[]> {
    const trips = await Trip.findAll({
      attributes: ['paymentType', 'fareAmount', 'tipAmount', 'tripDistance'],
    });

    const paymentData: { [key: number]: { 
      count: number; 
      totalFare: number; 
      totalTip: number; 
      totalDistance: number;
    } } = {};

    // Aggregate data
    for (const trip of trips) {
      const paymentType = trip.paymentType;
      if (!paymentData[paymentType]) {
        paymentData[paymentType] = { count: 0, totalFare: 0, totalTip: 0, totalDistance: 0 };
      }

      paymentData[paymentType].count++;
      paymentData[paymentType].totalFare += trip.fareAmount;
      paymentData[paymentType].totalTip += trip.tipAmount;
      paymentData[paymentType].totalDistance += trip.tripDistance;
    }

    // Calculate averages
    const result: PaymentStatistics[] = [];
    for (const paymentType in paymentData) {
      const data = paymentData[paymentType];
      const type = parseInt(paymentType);
      result.push({
        paymentType: type,
        paymentTypeName: getPaymentTypeName(type),
        tripCount: data.count,
        avgFare: data.totalFare / data.count,
        avgTip: data.totalTip / data.count,
        avgDistance: data.totalDistance / data.count,
        totalRevenue: data.totalFare + data.totalTip,
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
    weekend: { avgFare: number; avgDistance: number; avgTip: number; tripCount: number };
    weekday: { avgFare: number; avgDistance: number; avgTip: number; tripCount: number };
  }> {
    const weekendTrips = await Trip.findAll({
      where: { isWeekend: true },
      attributes: ['fareAmount', 'tripDistance', 'tipAmount'],
    });

    const weekdayTrips = await Trip.findAll({
      where: { isWeekend: false },
      attributes: ['fareAmount', 'tripDistance', 'tipAmount'],
    });

    const calculateAvg = (trips: Trip[]) => {
      if (trips.length === 0) return { avgFare: 0, avgDistance: 0, avgTip: 0, tripCount: 0 };
      
      let totalFare = 0;
      let totalDistance = 0;
      let totalTip = 0;

      for (const trip of trips) {
        totalFare += trip.fareAmount;
        totalDistance += trip.tripDistance;
        totalTip += trip.tipAmount;
      }

      return {
        avgFare: totalFare / trips.length,
        avgDistance: totalDistance / trips.length,
        avgTip: totalTip / trips.length,
        tripCount: trips.length,
      };
    };

    return {
      weekend: calculateAvg(weekendTrips),
      weekday: calculateAvg(weekdayTrips),
    };
  }
}
