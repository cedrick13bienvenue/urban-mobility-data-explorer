import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'urban-mobility-data-explorer API',
    version: '1.0.0',
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
    {
      url: 'http://localhost:3000/api',
      description: 'API base path',
    },
  ],
  tags: [
    {
      name: 'Trips',
      description: 'Trip data retrieval and querying',
    },
    {
      name: 'Statistics',
      description: 'Statistical analysis endpoints',
    },
    {
      name: 'Analysis',
      description: 'Advanced analysis using custom algorithms',
    },
  ],
  components: {
    schemas: {
      Trip: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'Auto-incremented database ID',
            example: 1,
          },
          tripId: {
            type: 'string',
            description: 'Original trip ID from dataset',
            example: 'id2875421',
          },
          vendorId: {
            type: 'integer',
            description: 'Taxi vendor ID (1 or 2)',
            example: 2,
          },
          pickupDatetime: {
            type: 'string',
            format: 'date-time',
            description: 'Pickup timestamp',
            example: '2016-03-14T17:24:00.000Z',
          },
          dropoffDatetime: {
            type: 'string',
            format: 'date-time',
            description: 'Dropoff timestamp',
            example: '2016-03-14T17:32:00.000Z',
          },
          passengerCount: {
            type: 'integer',
            description: 'Number of passengers (1-6)',
            example: 1,
          },
          pickupLongitude: {
            type: 'number',
            format: 'float',
            description: 'Pickup longitude coordinate',
            example: -73.982155,
          },
          pickupLatitude: {
            type: 'number',
            format: 'float',
            description: 'Pickup latitude coordinate',
            example: 40.767937,
          },
          dropoffLongitude: {
            type: 'number',
            format: 'float',
            description: 'Dropoff longitude coordinate',
            example: -73.964630,
          },
          dropoffLatitude: {
            type: 'number',
            format: 'float',
            description: 'Dropoff latitude coordinate',
            example: 40.765602,
          },
          storeAndFwdFlag: {
            type: 'string',
            description: 'Store and forward flag (Y/N)',
            example: 'N',
          },
          tripDuration: {
            type: 'integer',
            description: 'Trip duration in seconds',
            example: 455,
          },
          tripDurationMinutes: {
            type: 'number',
            format: 'float',
            description: 'Derived: Trip duration in minutes',
            example: 7.58,
          },
          tripDistance: {
            type: 'number',
            format: 'float',
            description: 'Derived: Trip distance in kilometers (Haversine)',
            example: 2.45,
          },
          tripSpeedKmh: {
            type: 'number',
            format: 'float',
            description: 'Derived: Average speed in km/h',
            example: 19.42,
          },
          hourOfDay: {
            type: 'integer',
            description: 'Derived: Hour of day (0-23)',
            example: 17,
          },
          dayOfWeek: {
            type: 'integer',
            description: 'Derived: Day of week (0=Sunday, 6=Saturday)',
            example: 1,
          },
          isWeekend: {
            type: 'boolean',
            description: 'Derived: Weekend flag',
            example: false,
          },
          monthOfYear: {
            type: 'integer',
            description: 'Derived: Month (1-12)',
            example: 3,
          },
          isRushHour: {
            type: 'boolean',
            description: 'Derived: Rush hour flag (7-9 AM or 4-7 PM)',
            example: true,
          },
          tripCategory: {
            type: 'string',
            description: 'Derived: Trip category (short/medium/long)',
            example: 'medium',
            enum: ['short', 'medium', 'long'],
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'string',
            example: 'Error message',
          },
        },
      },
      Pagination: {
        type: 'object',
        properties: {
          page: {
            type: 'integer',
            example: 1,
          },
          limit: {
            type: 'integer',
            example: 50,
          },
          total: {
            type: 'integer',
            example: 10000,
          },
          totalPages: {
            type: 'integer',
            example: 200,
          },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;