export interface TripAttributes {
  id: number;
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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RawTripData {
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

export interface CleanedTripData {
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

export interface TripStatistics {
  totalTrips: number;
  avgDistance: number;
  avgFare: number;
  avgTip: number;
  avgDuration: number;
  avgSpeed: number;
  avgPassengers: number;
  totalRevenue: number;
}

export interface HourlyStatistics {
  hour: number;
  tripCount: number;
  avgDistance: number;
  avgFare: number;
  avgDuration: number;
}

export interface DailyStatistics {
  day: number;
  dayName: string;
  tripCount: number;
  avgDistance: number;
  avgFare: number;
  avgPassengers: number;
}

export interface PaymentStatistics {
  paymentType: number;
  paymentTypeName: string;
  tripCount: number;
  avgFare: number;
  avgTip: number;
  avgDistance: number;
  totalRevenue: number;
}

export interface ClusterResult {
  clusterIndex: number;
  centroid: number;
  count: number;
  avgFare: number;
  avgDuration: number;
  avgSpeed: number;
  label: string;
}

export interface OutlierResult {
  outlierCount: number;
  totalTrips: number;
  outlierPercentage: number;
  lowerBound: number;
  upperBound: number;
  outlierTrips: Array<{
    id: number;
    fareAmount: number;
    tripDistance: number;
    tipAmount: number;
  }>;
}