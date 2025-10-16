export const APP_CONFIG = {
  // NYC Geographic Bounds
  NYC_BOUNDS: {
    MIN_LATITUDE: 40.5,
    MAX_LATITUDE: 41.0,
    MIN_LONGITUDE: -74.3,
    MAX_LONGITUDE: -73.7,
  },

  // Trip Validation Rules
  VALIDATION: {
    MIN_PASSENGER_COUNT: 1,
    MAX_PASSENGER_COUNT: 6,
    MIN_TRIP_DISTANCE: 0.1, // miles
    MAX_TRIP_DISTANCE: 100, // miles
    MIN_FARE_AMOUNT: 2.5, // dollars
    MAX_FARE_AMOUNT: 500, // dollars
    MIN_TIP_AMOUNT: 0,
    MAX_TIP_AMOUNT: 200,
    MIN_TRIP_SPEED: 1, // km/h
    MAX_TRIP_SPEED: 100, // km/h
    MIN_YEAR: 2000,
    MAX_YEAR: 2025,
  },

  // Processing Settings
  PROCESSING: {
    DEFAULT_BATCH_SIZE: 1000,
    MAX_BATCH_SIZE: 5000,
  },

  // API Settings
  API: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 50,
    MAX_LIMIT: 1000,
  },

  // Payment Types
  PAYMENT_TYPES: {
    1: 'Credit Card',
    2: 'Cash',
    3: 'No Charge',
    4: 'Dispute',
    5: 'Unknown',
    6: 'Voided Trip',
  },

  // Days of Week
  DAYS_OF_WEEK: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],

  // Conversion Constants
  CONVERSIONS: {
    MILES_TO_KM: 1.60934,
    MS_TO_MINUTES: 1000 * 60,
  },
};

export const ERROR_MESSAGES = {
  DATABASE_CONNECTION_FAILED: 'Failed to connect to database',
  INVALID_TRIP_ID: 'Invalid trip ID provided',
  TRIP_NOT_FOUND: 'Trip not found',
  DATA_PROCESSING_FAILED: 'Data processing failed',
  FILE_NOT_FOUND: 'Data file not found',
  INVALID_PARAMETERS: 'Invalid request parameters',
  SERVER_ERROR: 'Internal server error',
};

export const SUCCESS_MESSAGES = {
  DATA_LOADED: 'Data loaded successfully',
  TRIP_RETRIEVED: 'Trip retrieved successfully',
  STATS_CALCULATED: 'Statistics calculated successfully',
};
