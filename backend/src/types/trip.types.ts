export interface TripAttributes {
  id: number;
  tripId: string;
  vendorId: number;
  pickupDatetime: Date;
  dropoffDatetime: Date;
  pickupLongitude: number;
  pickupLatitude: number;
  dropoffLongitude: number;
  dropoffLatitude: number;
  passengerCount: number;
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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RawTripData {
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

export interface CleanedTripData {
  tripId: string;
  vendorId: number;
  pickupDatetime: Date;
  dropoffDatetime: Date;
  pickupLongitude: number;
  pickupLatitude: number;
  dropoffLongitude: number;
  dropoffLatitude: number;
  passengerCount: number;
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

export interface TripStatistics {
  totalTrips: number;
  avgDistance: number;
  avgDuration: number;
  avgSpeed: number;
  avgPassengers: number;
}

export interface HourlyStatistics {
  hour: number;
  tripCount: number;
  avgDistance: number;
  avgDuration: number;
}

export interface DailyStatistics {
  day: number;
  dayName: string;
  tripCount: number;
  avgDistance: number;
  avgPassengers: number;
}

export interface VendorStatistics {
  vendorId: number;
  vendorName: string;
  tripCount: number;
  avgDistance: number;
  avgDuration: number;
  avgSpeed: number;
}

export interface ClusterResult {
  clusterIndex: number;
  centroid: number;
  count: number;
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
    tripDuration: number;
    tripDistance: number;
    tripDurationMinutes: number;
  }>;
}

export interface LocationData {
  pickup: {
    lat: number;
    lng: number;
  };
  dropoff: {
    lat: number;
    lng: number;
  };
}

export type TripCategory = 'short' | 'medium' | 'long';

export interface TripFilterParams {
  minDistance?: number;
  maxDistance?: number;
  minDuration?: number;
  maxDuration?: number;
  startDate?: string;
  endDate?: string;
  hourOfDay?: number;
  dayOfWeek?: number;
  isWeekend?: boolean;
  isRushHour?: boolean;
  vendorId?: number;
  tripCategory?: TripCategory;
  minPassengers?: number;
  maxPassengers?: number;
}