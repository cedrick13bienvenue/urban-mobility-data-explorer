# NYC Taxi Trip Data Explorer - Backend

A full-stack enterprise-level application for analyzing New York City taxi trip data with advanced data processing, custom algorithms, and comprehensive RESTful API with Swagger documentation.

## 🎥 Video Walkthrough

[Walkthrough video link]

## Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Custom Algorithms](#custom-algorithms)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Data Processing](#data-processing)
- [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- PostgreSQL (v12 or higher)
- Git

### Setup (5 minutes)

```bash
# 1. Clone repository
git clone <your-github-repo-url>
cd nyc-taxi-backend

# 2. Install dependencies
npm install

# 3. Create .env file
cat > .env << 'EOF'
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nyc_taxi_db
DB_USER=postgres
DB_PASSWORD=postgres
PORT=3000
NODE_ENV=development
DATA_FILE_PATH=./data/train.csv
LOG_FILE_PATH=./logs/processing.log
EOF

# 4. Start PostgreSQL
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
# Windows: Start PostgreSQL from Services

# 5. Create database
psql -U postgres -c "CREATE DATABASE nyc_taxi_db;"

# 6. Start server
npm run dev
```

The API will be available at `http://localhost:3000` and Swagger docs at `http://localhost:3000/api-docs`.

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone <your-github-repo-url>
cd nyc-taxi-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nyc_taxi_db
DB_USER=postgres
DB_PASSWORD=postgres

# Server Configuration
PORT=3000
NODE_ENV=development

# Data Processing
DATA_FILE_PATH=./data/train.csv
LOG_FILE_PATH=./logs/processing.log
```

---

## Database Setup

### Install PostgreSQL

**macOS:**

```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download from [PostgreSQL Official Website](https://www.postgresql.org/download/windows/)

### Create Database and User

```bash
# Login to PostgreSQL
psql -U postgres

# In the PostgreSQL shell, run:
CREATE DATABASE nyc_taxi_db;
CREATE USER backend WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE nyc_taxi_db TO backend;
\q
```

Or use this command directly:

```bash
psql -U postgres -c "CREATE DATABASE nyc_taxi_db;"
```

---

## 🏃 Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

Output:

```
✓ Database connection established successfully.
[INFO] Server is running on port 3000
[INFO] API Documentation: http://localhost:3000/api-docs
```

### Production Build

```bash
npm run build
npm start
```

### Available Scripts

```bash
# Development server with auto-reload
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Run data processing
npm run process-data

# Validate data integrity
npm run validate-data

# TypeScript compiler check
npm run tsc
```

---

## Data Processing Pipeline

### Load NYC Taxi Data

Place your `train.csv` file in the `data/` directory:

```bash
mkdir -p data
cp /path/to/train.csv ./data/
```

### Process and Load Data

```bash
npm run process-data
```

**Expected output:**

```
=== NYC Taxi Data Processing Started ===
Connecting to database...
✓ Database connection established successfully.
Starting CSV processing...
Processed 10000 records...
Processed 20000 records...
=== Processing Complete ===
Total records processed: 1458644
Successfully loaded: 1387234
Skipped/Invalid: 71410
Success rate: 95.10%
Duration: 154.23 seconds
```

### Validate Loaded Data

```bash
npm run validate-data
```

Checks data quality and generates a report:

- Invalid speeds
- Zero distance trips
- Invalid passenger counts
- Future dates
- Data quality score

---

## API Documentation

### Interactive Swagger UI

```
http://localhost:3000/api-docs
```

Access comprehensive interactive API documentation, including request/response examples and test endpoints.

### Health Check

```bash
curl http://localhost:3000/health

# Response:
{
  "success": true,
  "message": "NYC Taxi Trip Data API is running",
  "timestamp": "2024-10-08T10:30:00.000Z"
}
```

### Base URL

```
http://localhost:3000/api
```

### Trips Endpoints

#### Get All Trips (with filtering and pagination)

```bash
GET /api/trips
```

**Query Parameters:**

| Parameter     | Type    | Default        | Description                        |
| ------------- | ------- | -------------- | ---------------------------------- |
| page          | integer | 1              | Page number                        |
| limit         | integer | 50             | Results per page (max 1000)        |
| sortBy        | string  | pickupDatetime | Field to sort by                   |
| sortOrder     | string  | DESC           | ASC or DESC                        |
| minDistance   | number  | -              | Minimum distance (km)              |
| maxDistance   | number  | -              | Maximum distance (km)              |
| minDuration   | integer | -              | Minimum duration (seconds)         |
| maxDuration   | integer | -              | Maximum duration (seconds)         |
| startDate     | string  | -              | Start date (ISO format)            |
| endDate       | string  | -              | End date (ISO format)              |
| hourOfDay     | integer | -              | Hour of day (0-23)                 |
| dayOfWeek     | integer | -              | Day of week (0=Sunday, 6=Saturday) |
| isWeekend     | boolean | -              | Weekend filter                     |
| isRushHour    | boolean | -              | Rush hour filter                   |
| vendorId      | integer | -              | Vendor ID (1 or 2)                 |
| tripCategory  | string  | -              | Trip category (short/medium/long)  |
| minPassengers | integer | -              | Minimum passenger count            |
| maxPassengers | integer | -              | Maximum passenger count            |

**Examples:**

```bash
# Get trips during rush hour
curl "http://localhost:3000/api/trips?isRushHour=true&limit=50"

# Get short distance trips on weekends
curl "http://localhost:3000/api/trips?tripCategory=short&isWeekend=true"

# Get trips by specific vendor
curl "http://localhost:3000/api/trips?vendorId=1&limit=100"

# Combined filters
curl "http://localhost:3000/api/trips?minDistance=5&maxDistance=10&hourOfDay=17&limit=50"
```

#### Get Single Trip

```bash
GET /api/trips/:id
```

**Example:**

```bash
curl http://localhost:3000/api/trips/1
```

#### Get Heatmap Data

```bash
GET /api/trips/heatmap?limit=5000
```

Returns pickup and dropoff coordinates for map visualization.

**Example:**

```bash
curl "http://localhost:3000/api/trips/heatmap?limit=1000"
```

### Statistics Endpoints

#### Overall Statistics

```bash
GET /api/trips/stats/summary
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalTrips": 1387234,
    "avgDistance": 3.47,
    "avgDuration": 15.2,
    "avgSpeed": 18.9,
    "avgPassengers": 1.58
  }
}
```

#### Hourly Statistics

```bash
GET /api/trips/stats/hourly
```

Statistics grouped by hour of day (0-23). Useful for visualizing hourly patterns.

#### Daily Statistics

```bash
GET /api/trips/stats/daily
```

Statistics grouped by day of week. Useful for comparing weekday vs weekend patterns.

#### Vendor Statistics

```bash
GET /api/trips/stats/vendor
```

Statistics grouped by vendor. Useful for vendor comparison analysis.

### Analysis Endpoints

#### K-Means Clustering

```bash
GET /api/trips/analysis/clusters?k=3&limit=10000
```

**Parameters:**

- `k` (default: 3) - Number of clusters (2-10)
- `limit` (default: 10000) - Number of trips to analyze

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "clusterIndex": 0,
      "centroid": 1.25,
      "count": 4532,
      "avgDuration": 8.2,
      "avgSpeed": 15.3,
      "label": "Short Distance"
    },
    {
      "clusterIndex": 1,
      "centroid": 5.5,
      "count": 3891,
      "avgDuration": 18.5,
      "avgSpeed": 17.8,
      "label": "Medium Distance"
    },
    {
      "clusterIndex": 2,
      "centroid": 15.3,
      "count": 1577,
      "avgDuration": 45.2,
      "avgSpeed": 20.1,
      "label": "Long Distance"
    }
  ],
  "metadata": {
    "k": 3,
    "totalPoints": 10000
  }
}
```

#### Outlier Detection

```bash
GET /api/trips/analysis/outliers
```

Detects unusual trips using IQR method. Useful for data quality analysis.

**Response:**

```json
{
  "success": true,
  "data": {
    "outlierCount": 234,
    "totalTrips": 10000,
    "outlierPercentage": 2.34,
    "lowerBound": 180,
    "upperBound": 3600,
    "outlierTrips": [
      {
        "id": 123,
        "tripDuration": 5400,
        "tripDistance": 45.2,
        "tripDurationMinutes": 90.0
      }
    ]
  }
}
```

---

## Custom Algorithms

### 1. K-Means Clustering

**Purpose:** Group trips into clusters based on distance to identify patterns.

**Implementation Details:**

- K-means++ initialization for better centroid placement
- Iterative assignment and centroid update
- Convergence detection
- Manual sorting for cluster ordering

**Time Complexity:** O(n × k × iterations)
**Space Complexity:** O(n + k)

**Algorithm Pseudo-code:**

```
1. Initialize k centroids using k-means++
2. REPEAT until convergence or max iterations:
   a. Assign each trip to nearest centroid
   b. Update centroids to mean of assigned points
   c. Check if centroids changed significantly
3. Calculate cluster statistics
4. Sort clusters by centroid value
5. Return clusters with metadata
```

### 2. Outlier Detection (IQR Method)

**Purpose:** Identify unusual trip durations.

**Implementation Details:**

- Manual QuickSort for data sorting
- Quartile calculation (Q1, Q3)
- IQR = Q3 - Q1
- Outliers: values < Q1 - 1.5×IQR or > Q3 + 1.5×IQR

**Time Complexity:** O(n log n) for sorting
**Space Complexity:** O(n)

### 3. Haversine Distance Calculation

**Purpose:** Calculate accurate distances between GPS coordinates.

**Formula:**

```
a = sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlon/2)
c = 2 × atan2(√a, √(1−a))
distance = R × c (where R = 6371 km)
```

---

## Project Structure

```
nyc-taxi-backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # Database configuration
│   │   ├── constants.ts         # Application constants
│   │   └── swagger.ts           # Swagger/OpenAPI config
│   ├── models/
│   │   └── Trip.ts              # Trip model definition
│   ├── services/
│   │   ├── dataProcessor.ts     # CSV processing & validation
│   │   ├── analyticsService.ts  # Analytics calculations
│   │   └── customAlgorithm.ts   # K-Means & outlier detection
│   ├── routes/
│   │   └── tripRoutes.ts        # API route definitions
│   ├── controllers/
│   │   └── tripController.ts    # Request handlers
│   ├── middleware/
│   │   └── errorHandler.ts      # Error handling
│   ├── types/
│   │   ├── trip.types.ts        # Trip type definitions
│   │   └── api.types.ts         # API response types
│   ├── utils/
│   │   ├── logger.ts            # Logging utility
│   │   └── helpers.ts           # Helper functions
│   └── server.ts                # Express app entry point
├── scripts/
│   ├── processAndLoad.ts        # Main data processing script
│   ├── validateData.ts          # Data validation script
│   └── setupDb.ts               # Database initialization
├── data/
│   └── train.csv                # Raw dataset (user-provided)
├── logs/
│   ├── app.log                  # Application logs
│   └── processing.log           # Data processing logs
├── .env                         # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## Database Schema

### Table: `trips`

| Column                | Type         | Description                         | Indexed |
| --------------------- | ------------ | ----------------------------------- | ------- |
| id                    | INTEGER      | Primary key                         | ✓       |
| trip_id               | VARCHAR(255) | Original trip ID                    | ✓       |
| vendor_id             | INTEGER      | Vendor (1 or 2)                     | ✓       |
| pickup_datetime       | TIMESTAMP    | Pickup time                         | ✓       |
| dropoff_datetime      | TIMESTAMP    | Dropoff time                        | ✓       |
| pickup_longitude      | FLOAT        | Pickup longitude                    |         |
| pickup_latitude       | FLOAT        | Pickup latitude                     |         |
| dropoff_longitude     | FLOAT        | Dropoff longitude                   |         |
| dropoff_latitude      | FLOAT        | Dropoff latitude                    |         |
| passenger_count       | INTEGER      | Passenger count (1-6)               |         |
| store_and_fwd_flag    | VARCHAR(1)   | Store/forward flag (Y/N)            |         |
| trip_duration         | INTEGER      | Duration in seconds                 | ✓       |
| trip_duration_minutes | FLOAT        | Duration in minutes (derived)       |         |
| trip_distance         | FLOAT        | Distance in km (derived, Haversine) | ✓       |
| trip_speed_kmh        | FLOAT        | Average speed (derived)             |         |
| hour_of_day           | INTEGER      | Hour 0-23 (derived)                 | ✓       |
| day_of_week           | INTEGER      | Day 0-6 (derived)                   | ✓       |
| is_weekend            | BOOLEAN      | Weekend flag (derived)              | ✓       |
| month_of_year         | INTEGER      | Month 1-12 (derived)                | ✓       |
| is_rush_hour          | BOOLEAN      | Rush hour flag (derived)            | ✓       |
| trip_category         | VARCHAR(20)  | short/medium/long (derived)         | ✓       |
| createdAt             | TIMESTAMP    | Record creation time                |         |
| updatedAt             | TIMESTAMP    | Record update time                  |         |

---

## Data Processing

### CSV Format

Expected columns:

```csv
id,vendor_id,pickup_datetime,dropoff_datetime,passenger_count,pickup_longitude,pickup_latitude,dropoff_longitude,dropoff_latitude,store_and_fwd_flag,trip_duration
```

### Derived Features

The processor calculates:

1. **Trip Distance (km)**: Haversine formula from coordinates

   - Range: 0.1-100 km

2. **Trip Speed (km/h)**: distance / duration × 3600

   - Range: 1-120 km/h

3. **Rush Hour Flag**: Boolean for 7-9 AM and 4-7 PM
   - Purpose: Traffic pattern analysis

Additional features:

- **Trip Category**: short (<2km), medium (2-10km), long (>10km)
- **Time Features**: hour, day, weekend, month
- **Trip Duration (minutes)**: converted from seconds

### Data Validation

Validations applied to all records:

- **Timestamps**: Valid dates 2000-2025, dropoff after pickup
- **Coordinates**: NYC bounding box (40.5-41.0°N, -74.3 to -73.7°W)
- **Duration**: 1 second to 4 hours
- **Passengers**: 1-6 people
- **Vendor**: 1 or 2
- **Speed/Distance**: Physically realistic values
- **Duplicates**: Based on unique trip ID

### Processing Performance

- **Speed**: 2,000-5,000 records/second
- **Batch Size**: 1,000 records per database insert
- **For 1M+ records**: Typical duration 2-3 minutes

---

## Troubleshooting

### Database Connection Errors

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**

- Start PostgreSQL: `brew services start postgresql` (macOS), `sudo systemctl start postgresql` (Linux), or `net start postgresql-x64-14` (Windows as Administrator)
- Verify `.env` credentials match your PostgreSQL setup
- Check PostgreSQL is listening on port 5432

### Port Already in Use

```
Error: listen EADDRINUSE :::3000
```

**Solution:**

```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

Or change `PORT` in `.env`

### CSV File Not Found

```
Error: ENOENT: no such file or directory
```

**Solution:**

- Verify `DATA_FILE_PATH` in `.env`
- Ensure `data/` directory exists: `mkdir -p data`
- Check file permissions

### Date Parsing Errors

```
Invalid date format: pickup=...
```

**Solution:**

- Verify CSV dates are in "YYYY-MM-DD HH:mm:ss" format
- Check for extra spaces in date fields
- Review sample records at top of CSV

### Memory Issues

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run process-data
```

### Database is Empty

Check if data was loaded:

```bash
psql -U postgres -d nyc_taxi_db -c "SELECT COUNT(*) FROM trips;"
```

If result is 0, run data processing:

```bash
npm run process-data
```

---

## Common Development Tasks

### Test API Endpoints

```bash
# Get all trips
curl http://localhost:3000/api/trips?limit=10

# Get summary statistics
curl http://localhost:3000/api/trips/stats/summary

# Get hourly statistics
curl http://localhost:3000/api/trips/stats/hourly

# Run clustering analysis
curl "http://localhost:3000/api/trips/analysis/clusters?k=3"
```

### Check Logs

```bash
# Application logs
tail -f logs/app.log

# Processing logs
tail -f logs/processing.log
```

### Reset Database

```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE nyc_taxi_db;"
psql -U postgres -c "CREATE DATABASE nyc_taxi_db;"

# Then restart server
npm run dev
```

### Validate Data Quality

```bash
npm run validate-data
```

---

## Security Notes

- Environment variables store sensitive database credentials
- Input validation on all API endpoints
- Sequelize ORM prevents SQL injection
- Error handling prevents information leakage
- CORS enabled (configure for production)

---

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [Sequelize ORM](https://sequelize.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Swagger/OpenAPI Specification](https://swagger.io/specification/)
- [Haversine Formula](https://en.wikipedia.org/wiki/Haversine_formula)

---

## 👥 Team

- Saad Byiringiro
- Hannah Tuyishimire
- Cedrick Bienvenue
