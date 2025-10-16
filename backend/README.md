# Urban Mobility Data Explorer

A full-stack application for analyzing New York City taxi trip data with custom algorithms and RESTful API.

## 🎥 Video Walkthrough

[Walkthrough video link]

## Team Members

- Saad Byiringiro
- Hannah Tuyishimire
- Cedrick Bienvenue

---

## Quick Start

### Prerequisites

- Node.js (v16+)
- PostgreSQL (v12+)
- npm (v8+)

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd urban-mobility-data-explorer

# Install dependencies
npm install

# Create .env file
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
```

### Database Setup

```bash
# Start PostgreSQL
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
# Windows: net start postgresql-x64-14 (as Administrator)

# Automated database and table setup
npm run db:setup
```

**What `npm run db:setup` does:**

- ✅ Connects to PostgreSQL server
- ✅ Creates database `nyc_taxi_db` if it doesn't exist
- ✅ Creates all required tables with proper indexes
- ✅ Sets up the complete database schema
- ✅ Provides next steps guidance

### Run Application

```bash
# Process data (after database setup)
npm run process-data

# Start server
npm run dev
```

Server runs at `http://localhost:3000`  
API Documentation at `http://localhost:3000/api-docs`

---

## API Endpoints

### Health Check

```bash
GET /health
```

### Trips

```bash
GET /api/trips                    # List trips with filters
GET /api/trips/:id                # Single trip
GET /api/trips/heatmap            # Location data
```

### Statistics

```bash
GET /api/trips/stats/summary      # Overall statistics
GET /api/trips/stats/hourly       # Hourly patterns
GET /api/trips/stats/daily        # Daily patterns
GET /api/trips/stats/vendor       # Vendor comparison
```

### Analysis

```bash
GET /api/trips/analysis/clusters  # K-Means clustering
GET /api/trips/analysis/outliers  # Outlier detection
```

### Query Parameters

Common filters: `page`, `limit`, `minDistance`, `maxDistance`, `minDuration`, `maxDuration`, `hourOfDay`, `dayOfWeek`, `isWeekend`, `isRushHour`, `vendorId`, `tripCategory`

**Example:**

```bash
curl "http://localhost:3000/api/trips?isRushHour=true&limit=50"
```

---

## Custom Algorithms

### K-Means Clustering

- Groups trips by distance patterns
- Manual implementation with k-means++ initialization
- Time Complexity: O(n × k × iterations)

### Outlier Detection (IQR)

- Identifies unusual trip durations
- Manual QuickSort implementation
- Time Complexity: O(n log n)

### Haversine Distance

- Calculates accurate GPS distances
- Accounts for Earth's curvature

---

## Derived Features

1. **Trip Distance (km)** - Calculated using Haversine formula
2. **Trip Speed (km/h)** - Derived from distance and duration
3. **Rush Hour Flag** - Boolean for 7-9 AM and 4-7 PM periods

Additional: Trip category (short/medium/long), time-based features (hour, day, weekend, month)

---

## Project Structure

```
urban-mobility-data-explorer/
├── src/
│   ├── config/          # Database & Swagger config
│   ├── models/          # Trip model
│   ├── services/        # Data processing & algorithms
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   ├── middleware/      # Error handling
│   ├── types/           # TypeScript types
│   └── utils/           # Helpers & logger
├── scripts/             # Data processing scripts
├── data/                # CSV files
├── logs/                # Application logs
└── README.md
```

---

## Database Schema

**Table: trips**

Key columns: `trip_id`, `vendor_id`, `pickup_datetime`, `dropoff_datetime`, `passenger_count`, coordinates, `trip_duration`, `trip_distance`, `trip_speed_kmh`, `is_rush_hour`, `trip_category`

Indexes on: `trip_id`, `pickup_datetime`, `trip_distance`, `trip_duration`, `hour_of_day`, `day_of_week`, `is_weekend`, `vendor_id`, `trip_category`

---

## Data Processing

### CSV Format

```csv
id,vendor_id,pickup_datetime,dropoff_datetime,passenger_count,
pickup_longitude,pickup_latitude,dropoff_longitude,dropoff_latitude,
store_and_fwd_flag,trip_duration
```

### Validation Rules

- Coordinates: NYC bounds (40.5-41.0°N, -74.3 to -73.7°W)
- Duration: 1 second to 4 hours
- Passengers: 1-6
- Vendor: 1 or 2
- Speed: 1-120 km/h

---

## Troubleshooting

**Database connection failed:**

```bash
# Verify PostgreSQL is running
brew services list | grep postgresql  # macOS
sudo systemctl status postgresql      # Linux
Get-Service postgresql*               # Windows PowerShell
```

**Port in use:**

```bash
lsof -ti:3000 | xargs kill -9
```

**CSV not found:**

```bash
mkdir -p data
cp /path/to/train.csv ./data/
```

---

## Available Scripts

```bash
npm run dev              # Development server
npm run build            # Build TypeScript
npm start                # Production server
npm run db:setup         # Create database and tables
npm run db:create        # Alias for db:setup
npm run db:migrate       # Run Sequelize migrations
npm run db:migrate:undo  # Undo last migration
npm run db:migrate:status # Check migration status
npm run process-data     # Load CSV data
npm run validate-data    # Check data quality
npm run setup            # Complete setup (db + data)
```

---

## Technologies

- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL with Sequelize ORM
- **Documentation:** Swagger/OpenAPI 3.0
- **Data Processing:** Custom algorithms (no ML libraries)

---
