import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Trip attributes interface matching the actual dataset
interface TripAttributes {
  id: number;
  tripId: string; // Original ID from dataset
  vendorId: number;
  pickupDatetime: Date;
  dropoffDatetime: Date;
  passengerCount: number;
  pickupLongitude: number;
  pickupLatitude: number;
  dropoffLongitude: number;
  dropoffLatitude: number;
  storeAndFwdFlag: string;
  tripDuration: number; // Trip duration in seconds from dataset
  
  // Derived features
  tripDurationMinutes: number;
  tripDistance: number; // Calculated using Haversine formula
  tripSpeedKmh: number;
  hourOfDay: number;
  dayOfWeek: number;
  isWeekend: boolean;
  monthOfYear: number;
  isRushHour: boolean;
  tripCategory: string; // 'short', 'medium', 'long' based on distance
  
  createdAt?: Date;
  updatedAt?: Date;
}

// For creation, id is optional
interface TripCreationAttributes extends Optional<TripAttributes, 'id'> {}

// Trip model class
class Trip extends Model<TripAttributes, TripCreationAttributes> implements TripAttributes {
  public id!: number;
  public tripId!: string;
  public vendorId!: number;
  public pickupDatetime!: Date;
  public dropoffDatetime!: Date;
  public passengerCount!: number;
  public pickupLongitude!: number;
  public pickupLatitude!: number;
  public dropoffLongitude!: number;
  public dropoffLatitude!: number;
  public storeAndFwdFlag!: string;
  public tripDuration!: number;
  
  public tripDurationMinutes!: number;
  public tripDistance!: number;
  public tripSpeedKmh!: number;
  public hourOfDay!: number;
  public dayOfWeek!: number;
  public isWeekend!: boolean;
  public monthOfYear!: number;
  public isRushHour!: boolean;
  public tripCategory!: string;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model
Trip.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tripId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'trip_id',
    },
    vendorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'vendor_id',
    },
    pickupDatetime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'pickup_datetime',
    },
    dropoffDatetime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'dropoff_datetime',
    },
    passengerCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'passenger_count',
    },
    pickupLongitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'pickup_longitude',
    },
    pickupLatitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'pickup_latitude',
    },
    dropoffLongitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'dropoff_longitude',
    },
    dropoffLatitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'dropoff_latitude',
    },
    storeAndFwdFlag: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'store_and_fwd_flag',
    },
    tripDuration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'trip_duration',
    },
    
    // Derived features
    tripDurationMinutes: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'trip_duration_minutes',
    },
    tripDistance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'trip_distance',
    },
    tripSpeedKmh: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'trip_speed_kmh',
    },
    hourOfDay: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'hour_of_day',
    },
    dayOfWeek: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'day_of_week',
    },
    isWeekend: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'is_weekend',
    },
    monthOfYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'month_of_year',
    },
    isRushHour: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'is_rush_hour',
    },
    tripCategory: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'trip_category',
    },
  },
  {
    sequelize,
    tableName: 'trips',
    indexes: [
      { fields: ['trip_id'], unique: true },
      { fields: ['pickup_datetime'] },
      { fields: ['dropoff_datetime'] },
      { fields: ['trip_distance'] },
      { fields: ['trip_duration'] },
      { fields: ['hour_of_day'] },
      { fields: ['day_of_week'] },
      { fields: ['is_weekend'] },
      { fields: ['month_of_year'] },
      { fields: ['is_rush_hour'] },
      { fields: ['vendor_id'] },
      { fields: ['trip_category'] },
    ],
  }
);

export default Trip;