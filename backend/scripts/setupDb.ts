import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = parseInt(process.env.DB_PORT || "5432");
const DB_NAME = process.env.DB_NAME || "nyc_taxi_db";
const DB_USER = process.env.DB_USER || "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD || "";

async function createDatabaseIfNotExists() {
  // Connect to postgres database to create the target database
  const adminSequelize = new Sequelize({
    host: DB_HOST,
    port: DB_PORT,
    database: "postgres", // Connect to default postgres database
    username: DB_USER,
    password: DB_PASSWORD,
    dialect: "postgres",
    logging: false,
  });

  try {
    await adminSequelize.authenticate();
    console.log("✓ Connected to PostgreSQL server");

    // Check if database exists
    const [results] = await adminSequelize.query(
      `SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'`
    );

    if (results.length === 0) {
      console.log(`📝 Creating database: ${DB_NAME}`);
      await adminSequelize.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(`✓ Database '${DB_NAME}' created successfully`);
    } else {
      console.log(`✓ Database '${DB_NAME}' already exists`);
    }

    await adminSequelize.close();
  } catch (error) {
    console.error("✗ Error creating database:", error);
    throw error;
  }
}

async function setupTables() {
  // Import after database is created
  const { connectDatabase } = await import("../src/config/database");
  const sequelize = (await import("../src/config/database")).default;

  try {
    await connectDatabase();
    console.log("✓ Connected to target database");

    // Sync models to create tables
    console.log("📝 Creating tables...");
    await sequelize.sync({ alter: false });
    console.log("✓ Tables created successfully");

    await sequelize.close();
  } catch (error) {
    console.error("✗ Error setting up tables:", error);
    throw error;
  }
}

async function setupDatabase() {
  try {
    console.log("🚀 Starting database setup...");
    console.log(`📊 Target database: ${DB_NAME}`);
    console.log(`🏠 Host: ${DB_HOST}:${DB_PORT}`);
    console.log(`👤 User: ${DB_USER}`);

    // Step 1: Create database if it doesn't exist
    await createDatabaseIfNotExists();

    // Step 2: Create tables
    await setupTables();

    console.log("🎉 Database setup completed successfully!");
    console.log("📋 Next steps:");
    console.log('   1. Run "npm run process-data" to load CSV data');
    console.log('   2. Run "npm run dev" to start the server');

    process.exit(0);
  } catch (error) {
    console.error("💥 Database setup failed:", error);
    process.exit(1);
  }
}

setupDatabase();
