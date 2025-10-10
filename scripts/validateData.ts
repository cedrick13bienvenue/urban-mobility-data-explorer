import { Op } from 'sequelize';
import { connectDatabase } from '../src/config/database';
import Trip from '../src/models/Trip';
import logger from '../src/utils/logger';

async function validateData() {
  try {
    logger.info('=== Data Validation Started ===');
    
    await connectDatabase();

    // Total records
    const totalRecords = await Trip.count();
    logger.info(`Total records in database: ${totalRecords}`);

    if (totalRecords === 0) {
      logger.warn('No data found in database');
      process.exit(0);
    }

    // Check for invalid speeds
    const invalidSpeed = await Trip.count({
      where: {
        [Op.or]: [
          { tripSpeedKmh: { [Op.lt]: 0 } },
          { tripSpeedKmh: { [Op.gt]: 100 } }
        ]
      }
    });
    logger.info(`Records with invalid speed: ${invalidSpeed} (${(invalidSpeed / totalRecords * 100).toFixed(2)}%)`);

    // Check for zero distance trips
    const zeroDistance = await Trip.count({
      where: { tripDistance: { [Op.lte]: 0 } }
    });
    logger.info(`Records with zero/negative distance: ${zeroDistance} (${(zeroDistance / totalRecords * 100).toFixed(2)}%)`);

    // Check for invalid passenger counts
    const invalidPassengers = await Trip.count({
      where: {
        [Op.or]: [
          { passengerCount: { [Op.lt]: 1 } },
          { passengerCount: { [Op.gt]: 6 } }
        ]
      }
    });
    logger.info(`Records with invalid passenger count: ${invalidPassengers} (${(invalidPassengers / totalRecords * 100).toFixed(2)}%)`);

    // Check for future dates
    const futureDates = await Trip.count({
      where: {
        pickupDatetime: { [Op.gt]: new Date() }
      }
    });
    logger.info(`Records with future dates: ${futureDates} (${(futureDates / totalRecords * 100).toFixed(2)}%)`);

    // Check for invalid trip duration
    const invalidDuration = await Trip.count({
      where: { tripDurationMinutes: { [Op.lte]: 0 } }
    });
    logger.info(`Records with invalid duration: ${invalidDuration} (${(invalidDuration / totalRecords * 100).toFixed(2)}%)`);

    // Calculate data quality score
    const totalIssues = invalidSpeed + zeroDistance + invalidPassengers + futureDates + invalidDuration;
    const qualityScore = ((totalRecords - totalIssues) / totalRecords * 100).toFixed(2);

    logger.info('\n=== Validation Summary ===');
    logger.info(`Total Issues: ${totalIssues}`);
    logger.info(`Data Quality Score: ${qualityScore}%`);

    if (parseFloat(qualityScore) >= 95) {
      logger.info('✓ Data quality is EXCELLENT');
    } else if (parseFloat(qualityScore) >= 90) {
      logger.info('✓ Data quality is GOOD');
    } else if (parseFloat(qualityScore) >= 80) {
      logger.warn('⚠ Data quality is FAIR - consider re-processing');
    } else {
      logger.error('✗ Data quality is POOR - re-processing recommended');
    }

    // Sample statistics
    const sampleTrip = await Trip.findOne({
      order: [['createdAt', 'DESC']]
    });

    if (sampleTrip) {
      logger.info('\n=== Sample Trip ===');
      logger.info(`Trip ID: ${sampleTrip.id}`);
      logger.info(`Distance: ${sampleTrip.tripDistance.toFixed(2)} km`);
      logger.info(`Duration: ${sampleTrip.tripDurationMinutes.toFixed(2)} minutes`);
      logger.info(`Speed: ${sampleTrip.tripSpeedKmh.toFixed(2)} km/h`);
      logger.info(`Passengers: ${sampleTrip.passengerCount}`);
    }

    process.exit(0);
  } catch (error) {
    logger.error('Validation failed', error as Error);
    process.exit(1);
  }
}

validateData();