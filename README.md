# NYC Taxi Trip Data Explorer - Backend

A full-stack enterprise-level application for analyzing New York City taxi trip data with advanced data processing, custom algorithms, and comprehensive RESTful API with Swagger documentation.

## 🎥 Video Walkthrough

[Insert your video link here]

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Custom Algorithms](#custom-algorithms)
- [Project Structure](#project-structure)
- [Dataset Information](#dataset-information)

## ✨ Features

- **Data Processing Pipeline**: Clean and process raw NYC taxi trip CSV data
- **Custom Algorithms**:
  - K-Means clustering for trip distance analysis (manual implementation)
  - IQR-based outlier detection (manual QuickSort implementation)
  - Haversine distance calculation
- **PostgreSQL Database**: Normalized schema with proper indexing
- **RESTful API**: Comprehensive endpoints for data querying and analysis
- **Swagger Documentation**: Interactive API documentation at `/api-docs`
- **Feature Engineering**: Derived features (speed, distance, time-based patterns, rush hour detection)
- **Data Validation**: Robust handling of missing values, outliers, and edge cases

## 🛠 Tech Stack

- **Backend**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Data Processing**: csv-parser
- **Documentation**: Swagger/OpenAPI 3.0

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- npm (v8 or higher)
- PostgreSQL (v12 or higher)
- Git

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <your-github-repo-url>
cd nyc-taxi-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nyc_taxi_db
DB_USER=postgres
DB_PASSWORD=your_password

# Server Configuration
PORT=3000
NODE_ENV=development

# Data Processing
DATA_FILE_PATH=./data/train.csv
LOG_FILE_PATH=./logs/processing.log
```

## 💾 Database Setup

### Install PostgreSQL

**Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**macOS:**

```bash
brew install postgresql
brew services start postgresql
```

**Windows:**
Download from [PostgreSQL Official Website](https://www.postgresql.org/download/windows/)

### Create Database

```bash
# Access PostgreSQL shell
sudo -u postgres psql

# In PostgreSQL shell, run:
CREATE DATABASE nyc_taxi_db;
CREATE USER your_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE nyc_taxi_db TO your_user;
\q
```

## 🏃 Running the Application

### 1. Prepare Your Data

Place the `train.csv` file in the `data/` directory:

```bash
mkdir -p data
# Copy your train.csv file to the data directory
cp /path/to/train.csv ./data/
```

**Dataset Format:**
Your CSV should have the following columns:

- `id` - Trip identifier
- `vendor_id` - Vendor ID (1 or 2)
- `pickup_datetime` - Format: "DD/MM/YYYY HH:mm"
- `dropoff_datetime` - Format: "DD/MM/YYYY HH:mm"
- `passenger_count` - Number of passengers (1-6)
- `pickup_longitude` - Pickup longitude
- `pickup_latitude` - Pickup latitude
- `dropoff_longitude` - Dropoff longitude
- `dropoff_latitude` - Dropoff latitude
- `store_and_fwd_flag` - Y or N
- `trip_duration` - Duration in seconds

### 2. Process and Load Data

This script will clean, validate, and load the data into PostgreSQL:

```bash
npm run process-data
```

**Expected output:**

```
=== NYC Taxi Data Processing Started ===
Connecting to database...
✓ Database connection established successfully.
✓ Database models synchronized.
Starting CSV processing...
Processed 10000 records...
Processed 20000 records...
...
=== Processing Complete ===
Total records processed: 100000
Successfully loaded: 95234
Skipped/Invalid: 4766
Success rate: 95.23%
Duration: 45.32 seconds
```

### 3. Start the Server

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm run build
npm start
```

The server will start on `http://localhost:3000`

### 4. Verify Installation

Test the health endpoint:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "success": true,
  "message": "NYC Taxi Trip Data API is running",
  "timestamp": "2024-10-08T10:30:00.000Z",
  "documentation": "http://localhost:3000/api-docs"
}
```

## 📡 API Documentation

### Interactive Documentation

Access the full Swagger documentation at:

```
http://localhost:3000/api-docs
```

### Base URL

```
http://localhost:3000/api
```

### Key Endpoints

#### 1. Get All Trips (with filtering and pagination)

```
GET /api/trips
```

**Query Parameters:**

- `page` (default: 1) - Page number
- `limit` (default: 50) - Results per page
- `sortBy` (default: pickupDatetime) - Field to sort by
- `sortOrder` (default: DESC) - ASC or DESC
- `minDistance` / `maxDistance` - Distance range in km
- `minDuration` / `maxDuration` - Duration range in seconds
- `startDate` / `endDate` - Date range (ISO format)
- `hourOfDay` (0-23) - Filter by hour
- `dayOfWeek` (0-6) - Filter by day (0=Sunday)
- `isWeekend` (true/false) - Weekend filter
- `isRushHour` (true/false) - Rush hour filter
- `vendorId` (1 or 2) - Filter by vendor
- `tripCategory` (short/medium/long) - Trip category filter
- `minPassengers` / `maxPassengers` - Passenger count range

**Example:**

```bash
curl "http://localhost:3000/api/trips?page=1&limit=10&minDistance=5&isRushHour=true"
```

#### 2. Get Trip by ID

```
GET /api/trips/:id
```

#### 3. Get Overall Statistics

```
GET /api/trips/stats/summary
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalTrips": 95234,
    "avgDistance": 3.45,
    "avgDuration": 15.8,
    "avgSpeed": 18.5,
    "avgPassengers": 1.6
  }
}
```

#### 4. Get Hourly Statistics

```
GET /api/trips/stats/hourly
```

Returns trip statistics grouped by hour of day (0-23).

#### 5. Get Daily Statistics

```
GET /api/trips/stats/daily
```

Returns trip statistics grouped by day of week.

#### 6. Get Vendor Statistics

```
GET /api/trips/stats/vendor
```

Returns statistics grouped by vendor (1=Creative Mobile Technologies, 2=VeriFone Inc.).

#### 7. K-Means Clustering Analysis

```
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
    }
  ],
  "metadata": {
    "k": 3,
    "totalPoints": 10000
  }
}
```

#### 8. Outlier Detection

```
GET /api/trips/analysis/outliers
```

Detects trip duration outliers using IQR method with manual QuickSort.

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
    "outlierTrips": [...]
  }
}
```

#### 9. Location Heatmap Data

```
GET /api/trips/heatmap?limit=5000
```

Returns pickup and dropoff coordinates for visualization.

## 🧮 Custom Algorithms

### 1. K-Means Clustering (`src/services/customAlgorithm.ts`)

**Purpose**: Group trips into clusters based on distance to identify patterns (short, medium, long trips).

**Implementation**:

- K-means++ initialization for better centroid placement
- Iterative assignment and centroid update
- Convergence detection
- Manual bubble sort for cluster ordering

**Time Complexity**: O(n × k × iterations)
**Space Complexity**: O(n + k)

**Pseudo-code**:

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

**Purpose**: Identify unusual trip durations that may indicate errors or special cases.

**Implementation**:

- Manual QuickSort for data sorting
- Quartile calculation (Q1, Q3)
- IQR = Q3 - Q1
- Outliers: values < Q1 - 1.5×IQR or > Q3 + 1.5×IQR

**Time Complexity**: O(n log n)
**Space Complexity**: O(n)

### 3. Haversine Distance Calculation

**Purpose**: Calculate accurate distances between coordinates on Earth's surface.

**Implementation**: Uses the Haversine formula to compute the great-circle distance between two points.

**Formula**:

```
a = sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlon/2)
c = 2 × atan2(√a, √(1−a))
distance = R × c (where R = Earth's radius = 6371 km)
```

## 📁 Project Structure

```
nyc-taxi-backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # Database configuration
│   │   ├── constants.ts         # Application constants
│   │   └── swagger.ts           # Swagger configuration
│   ├── models/
│   │   └── Trip.ts              # Trip model with derived features
│   ├── services/
│   │   ├── dataProcessor.ts     # CSV processing & validation
│   │   └── customAlgorithm.ts   # K-Means & outlier detection
│   ├── routes/
│   │   └── tripRoutes.ts        # API route definitions
│   ├── controllers/
│   │   ├── tripController.ts    # Request handlers
│   │   └── healthController.ts  # Health check handlers
│   ├── middleware/
│   │   ├── errorHandler.ts      # Error handling
│   │   ├── requestLogger.ts     # Request logging
│   │   └── validators.ts        # Input validation
│   ├── types/
│   │   ├── api.types.ts         # API type definitions
│   │   └── trip.types.ts        # Trip type definitions
│   ├── utils/
│   │   ├── logger.ts            # Logging utility
│   │   └── helpers.ts           # Helper functions
│   └── server.ts                # Express app entry point
├── scripts/
│   ├── processAndLoad.ts        # Data processing script
│   ├── validateData.ts          # Data validation script
│   └── exportDatabase.ts        # Database export utility
├── data/
│   └── train.csv                # Raw dataset (you provide)
├── logs/
│   ├── app.log                  # Application logs
│   ├── error.log                # Error logs
│   └── processing.log           # Data processing logs
├── .env                         # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🗃️ Database Schema

### Table: `trips`

| Column                | Type      | Description                           | Indexed |
| --------------------- | --------- | ------------------------------------- | ------- |
| id                    | INTEGER   | Primary key (auto-increment)          | ✓       |
| trip_id               | STRING    | Original trip ID from dataset         | ✓       |
| vendor_id             | INTEGER   | Vendor ID (1 or 2)                    | ✓       |
| pickup_datetime       | TIMESTAMP | Pickup timestamp                      | ✓       |
| dropoff_datetime      | TIMESTAMP | Dropoff timestamp                     | ✓       |
| pickup_longitude      | FLOAT     | Pickup longitude                      |         |
| pickup_latitude       | FLOAT     | Pickup latitude                       |         |
| dropoff_longitude     | FLOAT     | Dropoff longitude                     |         |
| dropoff_latitude      | FLOAT     | Dropoff latitude                      |         |
| passenger_count       | INTEGER   | Number of passengers (1-6)            |         |
| store_and_fwd_flag    | STRING(1) | Store and forward flag (Y/N)          |         |
| trip_duration         | INTEGER   | Trip duration (seconds)               | ✓       |
| trip_duration_minutes | FLOAT     | **Derived**: Duration in minutes      |         |
| trip_distance         | FLOAT     | **Derived**: Distance (km, Haversine) | ✓       |
| trip_speed_kmh        | FLOAT     | **Derived**: Average speed (km/h)     |         |
| hour_of_day           | INTEGER   | **Derived**: Hour (0-23)              | ✓       |
| day_of_week           | INTEGER   | **Derived**: Day (0=Sun, 6=Sat)       | ✓       |
| is_weekend            | BOOLEAN   | **Derived**: Weekend flag             | ✓       |
| month_of_year         | INTEGER   | **Derived**: Month (1-12)             | ✓       |
| is_rush_hour          | BOOLEAN   | **Derived**: Rush hour flag           | ✓       |
| trip_category         | STRING    | **Derived**: short/medium/long        | ✓       |

**Indexes**: Created on frequently queried fields for optimal performance.

## 📊 Dataset Information

### Data Format

The application expects a CSV file with the following structure:

```csv
id,vendor_id,pickup_datetime,dropoff_datetime,passenger_count,pickup_longitude,pickup_latitude,dropoff_longitude,dropoff_latitude,store_and_fwd_flag,trip_duration
id2875421,2,14/03/2016 17:24,14/03/2016 17:32,1,-73.98215485,40.767936706542969,-73.96463013,40.765602111816406,N,455
```

### Derived Features

The system calculates three key derived features as required:

1. **Trip Distance (km)**: Calculated using the Haversine formula from pickup/dropoff coordinates

   - Purpose: Accurate distance measurement accounting for Earth's curvature
   - Range: 0.1 - 100 km (validated)

2. **Trip Speed (km/h)**: Calculated as `(distance / duration) × 3600`

   - Purpose: Identify traffic patterns and detect anomalies
   - Range: 1 - 120 km/h (validated for city traffic)

3. **Rush Hour Flag**: Boolean indicating if trip started during rush hours
   - Morning rush: 7:00 AM - 9:00 AM
   - Evening rush: 4:00 PM - 7:00 PM
   - Purpose: Analyze traffic patterns and pricing dynamics

Additional derived features:

- **Trip Category**: Categorizes trips as short (<2km), medium (2-10km), or long (>10km)
- **Time-based features**: Hour of day, day of week, weekend flag, month
- **Trip Duration (minutes)**: Conversion from seconds for easier analysis

## 🧪 Data Cleaning Logic

The data processor applies the following validations:

1. **Timestamp Validation**:

   - Parses "DD/MM/YYYY HH:mm" format
   - Ensures valid dates between 2000-2025
   - Validates dropoff after pickup

2. **Coordinate Validation**:

   - NYC bounding box (40.5-41.0°N, -74.3 to -73.7°W)
   - Rejects coordinates outside NYC area

3. **Trip Duration**:

   - Range: 1 second to 4 hours (14,400 seconds)
   - Rejects extremely short or long trips

4. **Passenger Count**:

   - Range: 1-6 passengers
   - Industry standard validation

5. **Trip Distance**:

   - Range: 0.1-100 km (calculated)
   - Rejects unrealistic distances

6. **Trip Speed**:

   - Range: 1-120 km/h
   - Excludes physically impossible speeds

7. **Vendor ID**:

   - Must be 1 or 2
   - Validates against known vendors

8. **Store and Forward Flag**:

   - Must be 'Y' or 'N'
   - Data integrity check

9. **Duplicate Detection**:
   - Based on unique trip ID
   - Prevents data redundancy

All rejected records are logged in `logs/processing.log` with detailed reasons.

## 🐛 Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution**:

- Ensure PostgreSQL is running: `sudo systemctl status postgresql`
- Verify credentials in `.env` match your PostgreSQL setup
- Check PostgreSQL is listening on port 5432

### CSV File Not Found

```
Error: ENOENT: no such file or directory
```

**Solution**:

- Verify `DATA_FILE_PATH` in `.env` points to the correct file
- Ensure the `data/` directory exists
- Check file permissions

### Port Already in Use

```
Error: listen EADDRINUSE :::3000
```

**Solution**:

- Change `PORT` in `.env` or kill the process:

```bash
# Find process
lsof -ti:3000
# Kill process
lsof -ti:3000 | xargs kill -9
```

### Date Parsing Errors

```
Invalid date format: pickup=...
```

**Solution**:

- Ensure CSV dates are in "DD/MM/YYYY HH:mm" format
- Check for extra spaces or invalid characters
- Review sample data format in dataset section

### Memory Issues with Large Datasets

**Solution**:

- Increase Node.js memory limit:

```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run process-data
```

- Process data in smaller batches by adjusting `BATCH_SIZE` in script

## 📝 API Usage Examples

### Using cURL

```bash
# Get all trips from a specific vendor
curl "http://localhost:3000/api/trips?vendorId=1&limit=10"

# Get trips during rush hour on weekdays
curl "http://localhost:3000/api/trips?isRushHour=true&isWeekend=false"

# Get long distance trips
curl "http://localhost:3000/api/trips?tripCategory=long&limit=20"

# Get hourly statistics
curl "http://localhost:3000/api/trips/stats/hourly"

# Run clustering analysis
curl "http://localhost:3000/api/trips/analysis/clusters?k=4&limit=5000"

# Detect outliers
curl "http://localhost:3000/api/trips/analysis/outliers"
```

### Using JavaScript/Fetch

```javascript
// Get trips with filters
const response = await fetch(
  "http://localhost:3000/api/trips?minDistance=5&maxDistance=10&isWeekend=true"
);
const data = await response.json();
console.log(data);

// Get clustering analysis
const clusters = await fetch(
  "http://localhost:3000/api/trips/analysis/clusters?k=3"
);
const clusterData = await clusters.json();
console.log(clusterData);
```

### Using Python

```python
import requests

# Get overall statistics
response = requests.get('http://localhost:3000/api/trips/stats/summary')
stats = response.json()
print(stats)

# Get trips with filters
params = {
    'minDistance': 5,
    'isRushHour': True,
    'limit': 100
}
response = requests.get('http://localhost:3000/api/trips', params=params)
trips = response.json()
print(f"Found {len(trips['data'])} trips")
```

## 🚀 Performance Optimization

The backend implements several optimizations:

1. **Database Indexing**: Strategic indexes on frequently queried fields
2. **Batch Processing**: Data insertion in configurable batches (default: 1000 records)
3. **Query Pagination**: Prevents memory overflow on large result sets
4. **Connection Pooling**: PostgreSQL connection pool (max: 10 connections)
5. **Efficient Algorithms**: Optimized K-Means and QuickSort implementations

**Processing Speed**:

- Typical: 2,000-5,000 records/second
- Depends on hardware and batch size
- For 1M+ records, consider increasing batch size to 5000

## 📈 Insights You Can Derive

Using the API, you can discover:

1. **Peak Hours**: Identify busiest times of day/week
2. **Distance Patterns**: Cluster analysis reveals trip categories
3. **Speed Analysis**: Average speeds by time of day and location
4. **Vendor Comparison**: Performance metrics by vendor
5. **Weekend vs Weekday**: Travel pattern differences
6. **Rush Hour Impact**: Traffic congestion effects on trip duration
7. **Anomaly Detection**: Identify unusual trips via outlier detection
8. **Seasonal Trends**: Monthly patterns in taxi usage

## 🔒 Security Considerations

- Environment variables for sensitive data
- Input validation on all endpoints
- SQL injection protection via Sequelize ORM
- CORS enabled (configure for production)
- Error handling prevents information leakage

## 📚 Additional Resources

- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Swagger/OpenAPI Specification](https://swagger.io/specification/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Haversine Formula Explained](https://en.wikipedia.org/wiki/Haversine_formula)

## 👥 Team Members

- Saad Byiringiro
- Hannah Tuyishimire
- Cedrick Bienvenue
