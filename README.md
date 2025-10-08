# NYC Taxi Trip Data Explorer - Backend

A full-stack enterprise-level application for analyzing New York City taxi trip data with advanced data processing, custom algorithms, and RESTful API.

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

## ✨ Features

- **Data Processing Pipeline**: Clean and process raw NYC taxi trip CSV data
- **Custom Algorithms**:
  - K-Means clustering for trip distance analysis
  - IQR-based outlier detection
  - Manual QuickSort implementation
- **PostgreSQL Database**: Normalized schema with proper indexing
- **RESTful API**: Comprehensive endpoints for data querying and analysis
- **Feature Engineering**: Derived features (speed, fare per km, tip percentage, etc.)
- **Data Validation**: Robust handling of missing values, outliers, and edge cases

## 🛠 Tech Stack

- **Backend**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Data Processing**: csv-parser

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
  "timestamp": "2024-10-08T10:30:00.000Z"
}
```

## 📡 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Endpoints

#### 1. Get All Trips (with filtering and pagination)

```
GET /api/trips
```

**Query Parameters:**

- `page` (default: 1) - Page number
- `limit` (default: 50) - Results per page
- `sortBy` (default: pickupDatetime) - Field to sort by
- `sortOrder` (default: DESC) - ASC or DESC
- `minDistance` - Minimum trip distance
- `maxDistance` - Maximum trip distance
- `minFare` - Minimum fare amount
- `maxFare` - Maximum fare amount
- `startDate` - Filter by start date (ISO format)
- `endDate` - Filter by end date (ISO format)
- `hourOfDay` - Filter by hour (0-23)
- `dayOfWeek` - Filter by day (0=Sunday, 6=Saturday)
- `isWeekend` - true/false
- `minPassengers` - Minimum passenger count
- `maxPassengers` - Maximum passenger count

**Example:**

```bash
curl "http://localhost:3000/api/trips?page=1&limit=10&minFare=10&maxFare=50"
```

#### 2. Get Trip by ID

```
GET /api/trips/:id
```

**Example:**

```bash
curl http://localhost:3000/api/trips/123
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
    "avgFare": 12.34,
    "avgTip": 2.15,
    "avgDuration": 15.8,
    "avgSpeed": 18.5,
    "avgPassengers": 1.6,
    "totalRevenue": 1234567.89
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

#### 6. Get Payment Type Statistics

```
GET /api/trips/stats/payment
```

Returns statistics grouped by payment method.

#### 7. K-Means Clustering Analysis

```
GET /api/trips/analysis/clusters?k=3&limit=10000
```

**Parameters:**

- `k` (default: 3) - Number of clusters
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
      "avgFare": 8.45,
      "avgDuration": 8.2,
      "avgSpeed": 15.3,
      "label": "Short Distance"
    },
    {
      "clusterIndex": 1,
      "centroid": 3.8,
      "count": 3421,
      "avgFare": 14.23,
      "avgDuration": 18.5,
      "avgSpeed": 20.1,
      "label": "Medium Distance"
    }
  ]
}
```

#### 8. Outlier Detection

```
GET /api/trips/analysis/outliers
```

Detects fare outliers using IQR method.

**Response:**

```json
{
  "success": true,
  "data": {
    "outlierCount": 234,
    "totalTrips": 10000,
    "outlierPercentage": 2.34,
    "lowerBound": 5.5,
    "upperBound": 45.8,
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

**Time Complexity**: O(n × k × iterations)
**Space Complexity**: O(n + k)

**Algorithm Steps**:

1. Initialize k centroids using k-means++
2. Assign each trip to nearest centroid
3. Update centroids to mean of assigned points
4. Repeat until convergence or max iterations
5. Calculate cluster statistics

### 2. Outlier Detection (IQR Method)

**Purpose**: Identify unusual fare amounts that may indicate errors or special cases.

**Implementation**:

- Manual QuickSort for data sorting
- Quartile calculation (Q1, Q3)
- IQR = Q3 - Q1
- Outliers: values < Q1 - 1.5×IQR or > Q3 + 1.5×IQR

**Time Complexity**: O(n log n)
**Space Complexity**: O(n)

## 📁 Project Structure

```
nyc-taxi-backend/
├── src/
│   ├── config/
│   │   └── database.ts          # Database configuration
│   ├── models/
│   │   └── Trip.ts              # Trip model with derived features
│   ├── services/
│   │   ├── dataProcessor.ts     # CSV processing & validation
│   │   └── customAlgorithm.ts   # K-Means & outlier detection
│   ├── routes/
│   │   └── tripRoutes.ts        # API route definitions
│   ├── controllers/
│   │   └── tripController.ts    # Request handlers
│   ├── middleware/
│   │   └── errorHandler.ts      # Error handling
│   ├── utils/
│   │   └── logger.ts            # Logging utility
│   └── server.ts                # Express app entry point
├── scripts/
│   └── processAndLoad.ts        # Data processing script
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

| Column                | Type      | Description                  |
| --------------------- | --------- | ---------------------------- |
| id                    | INTEGER   | Primary key                  |
| pickup_datetime       | TIMESTAMP | Pickup timestamp             |
| dropoff_datetime      | TIMESTAMP | Dropoff timestamp            |
| pickup_longitude      | FLOAT     | Pickup longitude             |
| pickup_latitude       | FLOAT     | Pickup latitude              |
| dropoff_longitude     | FLOAT     | Dropoff longitude            |
| dropoff_latitude      | FLOAT     | Dropoff latitude             |
| passenger_count       | INTEGER   | Number of passengers         |
| trip_distance         | FLOAT     | Trip distance (miles)        |
| fare_amount           | FLOAT     | Base fare                    |
| tip_amount            | FLOAT     | Tip amount                   |
| total_amount          | FLOAT     | Total fare                   |
| payment_type          | INTEGER   | Payment method               |
| trip_duration_minutes | FLOAT     | **Derived**: Trip duration   |
| trip_speed_kmh        | FLOAT     | **Derived**: Average speed   |
| fare_per_km           | FLOAT     | **Derived**: Fare efficiency |
| tip_percentage        | FLOAT     | **Derived**: Tip rate        |
| hour_of_day           | INTEGER   | **Derived**: Hour (0-23)     |
| day_of_week           | INTEGER   | **Derived**: Day (0-6)       |
| is_weekend            | BOOLEAN   | **Derived**: Weekend flag    |

**Indexes**: Created on frequently queried fields for performance.

## 🧪 Testing the API

### Using cURL

```bash
# Get trips with filters
curl "http://localhost:3000/api/trips?minFare=20&isWeekend=true&limit=5"

# Get statistics
curl http://localhost:3000/api/trips/stats/summary

# Run clustering
curl "http://localhost:3000/api/trips/analysis/clusters?k=4"
```

### Using Postman

1. Import the API endpoints
2. Set base URL: `http://localhost:3000/api`
3. Test each endpoint with different parameters

## 📊 Data Cleaning Logic

The data processor applies the following validations:

1. **Timestamp Validation**: Ensures valid dates between 2000-2025
2. **Coordinate Validation**: NYC bounding box (40.5-41.0°N, -74.3 to -73.7°W)
3. **Trip Duration**: Dropoff must be after pickup
4. **Passenger Count**: 1-6 passengers
5. **Trip Distance**: 0.1-100 miles (reasonable range)
6. **Fare Amount**: $2.50-$500 (excludes extreme values)
7. **Trip Speed**: 1-100 km/h (excludes physically impossible speeds)
8. **Duplicate Detection**: Based on key field combinations

All rejected records are logged in `logs/processing.log`.

## 🐛 Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution**: Ensure PostgreSQL is running and credentials in `.env` are correct.

### CSV File Not Found

```
Error: ENOENT: no such file or directory
```

**Solution**: Verify `DATA_FILE_PATH` in `.env` points to the correct file.

### Port Already in Use

```
Error: listen EADDRINUSE :::3000
```

**Solution**: Change `PORT` in `.env` or kill the process using port 3000:

```bash
lsof -ti:3000 | xargs kill -9
```

## 📝 Notes

- The data processing script can handle large CSV files through batch processing
- Processing speed: ~2000-5000 records/second (depending on hardware)
- For datasets >1M records, consider increasing batch size
- All custom algorithms are implemented without external libraries as per assignment requirements

## 👥 Team Members

[Add your team member names and contributions here]

## 📄 License

This project is created for educational purposes as part of a university assignment.

## 🙏 Acknowledgments

- NYC Taxi and Limousine Commission for the dataset
- Course instructors and TAs
