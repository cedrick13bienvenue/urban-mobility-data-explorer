import { exec } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const DB_NAME = process.env.DB_NAME || 'nyc_taxi_db';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '5432';
const OUTPUT_DIR = path.join(process.cwd(), 'exports');
const OUTPUT_FILE = path.join(OUTPUT_DIR, `database_dump_${Date.now()}.sql`);

async function exportDatabase() {
  console.log('=== Database Export Utility ===');
  console.log(`Database: ${DB_NAME}`);
  console.log(`User: ${DB_USER}`);
  console.log(`Output: ${OUTPUT_FILE}`);

  // creating exports directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // building pg_dump command
  const command = `PGPASSWORD=${process.env.DB_PASSWORD} pg_dump -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -f ${OUTPUT_FILE}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`✗ Export failed: ${error.message}`);
      process.exit(1);
    }

    if (stderr) {
      console.warn(`Warning: ${stderr}`);
    }

    console.log(`✓ Database exported successfully to ${OUTPUT_FILE}`);
    console.log(`\nYou can restore this database using:`);
    console.log(`psql -U ${DB_USER} -d ${DB_NAME} -f ${OUTPUT_FILE}`);
    process.exit(0);
  });
}

exportDatabase();
