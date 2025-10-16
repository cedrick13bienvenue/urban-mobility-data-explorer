import dotenv from 'dotenv';
import path from 'path';
import { connectDatabase } from '../src/config/database';
import { DataProcessor } from '../src/services/dataProcessor';
import logger from '../src/utils/logger';

// Load environment variables
dotenv.config();

const DATA_FILE_PATH = process.env.DATA_FILE_PATH || './data/train.csv';
const LOG_FILE_PATH = process.env.LOG_FILE_PATH || './logs/processing.log';
const BATCH_SIZE = 1000;

async function main() {
  try {
    logger.info('=== NYC Taxi Data Processing Started ===');
    logger.info(`Data file: ${DATA_FILE_PATH}`);
    logger.info(`Log file: ${LOG_FILE_PATH}`);
    logger.info(`Batch size: ${BATCH_SIZE}`);

    // Connect to database
    logger.info('Connecting to database...');
    await connectDatabase();

    // Initialize data processor
    logger.info('Initializing data processor...');
    const processor = new DataProcessor(LOG_FILE_PATH);

    // Process CSV file
    logger.info('Starting CSV processing...');
    const startTime = Date.now();

    const stats = await processor.processCSV(DATA_FILE_PATH, BATCH_SIZE);

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    // Display results
    logger.info('\n=== Processing Complete ===');
    logger.info(`Total records processed: ${stats.totalRecords}`);
    logger.info(`Successfully loaded: ${stats.processedRecords}`);
    logger.info(`Skipped/Invalid: ${stats.skippedRecords}`);
    logger.info(`Success rate: ${((stats.processedRecords / stats.totalRecords) * 100).toFixed(2)}%`);
    logger.info(`Duration: ${duration.toFixed(2)} seconds`);
    logger.info(`Processing speed: ${(stats.totalRecords / duration).toFixed(2)} records/second`);
    
    if (stats.errors.length > 0) {
      logger.warn(`\nTotal errors logged: ${stats.errors.length}`);
      logger.info(`Check log file for details: ${LOG_FILE_PATH}`);
    }

    logger.info('\n✓ Data processing and loading completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Fatal error during data processing', error as Error);
    process.exit(1);
  }
}

// Run the script
main();