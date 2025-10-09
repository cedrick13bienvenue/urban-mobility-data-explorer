import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Trip attributes interface
interface TripAttributes {
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
  
  // Derived features
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

// For creation, id is optional
interface TripCreationAttributes extends Optional<TripAttributes, 'id'> {}

// Trip model class
class Trip extends Model<TripAttributes, TripCreationAttributes> implements TripAttributes {
  public id!: number;
  public pickupDatetime!: Date;
  public dropoffDatetime!: Date;
  public pickupLongitude!: number;
  public pickupLatitude!: number;
  public dropoffLongitude!: number;
  public dropoffLatitude!: number;
  public passengerCount!: number;
  public tripDistance!: number;
  public fareAmount!: number;
  public tipAmount!: number;
  public totalAmount!: number;
  public paymentType!: number;
  
  public tripDurationMinutes!: number;
  public tripSpeedKmh!: number;
  public farePerKm!: number;
  public tipPercentage!: number;
  public hourOfDay!: number;
  public dayOfWeek!: number;
  public isWeekend!: boolean;
  
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
    passengerCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'passenger_count',
    },
    tripDistance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'trip_distance',
    },
    fareAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'fare_amount',
    },
    tipAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'tip_amount',
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'total_amount',
    },
    paymentType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'payment_type',
    },
    
    // Derived features
    tripDurationMinutes: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'trip_duration_minutes',
    },
    tripSpeedKmh: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'trip_speed_kmh',
    },
    farePerKm: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'fare_per_km',
    },
    tipPercentage: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'tip_percentage',
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
  },
  {
    sequelize,
    tableName: 'trips',
    indexes: [
      { fields: ['pickup_datetime'] },
      { fields: ['dropoff_datetime'] },
      { fields: ['trip_distance'] },
      { fields: ['fare_amount'] },
      { fields: ['hour_of_day'] },
      { fields: ['day_of_week'] },
      { fields: ['is_weekend'] },
    ],
  }
);

export default Trip;