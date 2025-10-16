# Urban Mobility Data Explorer

A full-stack application for analyzing New York City taxi trip data with interactive visualizations, custom algorithms, and RESTful API.

## 🎥 Video Walkthrough

[[Walkthrough video link]](https://youtu.be/HTRyP40PnGE)

## 👥 Team Members

- **Saad Byiringiro**
- **Hannah Tuyishimire**
- **Cedrick Bienvenue**

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)

---

## ✨ Features

### 🎨 Frontend Dashboard

- **Real-time Analytics**: Live charts and statistics
- **Interactive Filters**: Time, distance, location, vendor filtering
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Dark theme with orange accents and smooth animations
- **Data Visualization**: Charts, heatmaps, and statistical summaries

### 🔧 Backend API

- **RESTful Endpoints**: Comprehensive API for all data operations
- **Swagger Documentation**: Interactive API documentation
- **Custom Algorithms**: K-Means clustering and IQR outlier detection
- **Data Processing**: CSV parsing with validation and feature engineering
- **Performance Optimized**: Efficient queries with proper indexing

### 📊 Data Analysis

- **K-Means Clustering**: Groups trips by distance patterns
- **Outlier Detection**: Identifies unusual trip durations using IQR method
- **Haversine Distance**: Accurate GPS distance calculations
- **Feature Engineering**: Derived metrics like speed, rush hour flags, trip categories

---

## 🛠 Tech Stack

### Frontend

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with flexbox/grid
- **JavaScript (ES6+)** - Interactive functionality
- **Chart.js** - Data visualization
- **Leaflet** - Interactive maps
- **Font Awesome** - Icons

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe development
- **PostgreSQL** - Relational database
- **Sequelize** - ORM and migrations
- **Swagger** - API documentation

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **PostgreSQL** (v12.0 or higher)
- **Git** (for cloning the repository)

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/cedrick13bienvenue/urban-mobility-data-explorer.git
cd urban-mobility-data-explorer
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install
```

### 3. **⚠️ IMPORTANT: Add Dataset File**

**Before proceeding with database setup, you MUST add the dataset:**

1. Download the NYC Taxi Trip dataset (`train.csv`)
2. Place it in the `backend/data/` directory

```bash
# Your directory structure should look like:
backend/
├── data/
│   └── train.csv          # ← Place your dataset here
├── src/
├── scripts/
└── package.json
```

**Without the `train.csv` file, the data loading step will fail!**

### 4. Environment Setup

**⚠️ Important: Update these values for your setup:**

Create a `.env` file in the `backend/` directory:

```bash
cd backend
touch .env
```

Add the following configuration to `backend/.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nyc_taxi_db
DB_USER=postgres
DB_PASSWORD=your_password        # ⚠️ CHANGE THIS to your PostgreSQL password

# Server Configuration
PORT=3000
NODE_ENV=development

# Data Processing
DATA_FILE_PATH=./data/train.csv  # Path to your dataset
LOG_FILE_PATH=./logs/processing.log
```

**Configuration Variables:**

| Variable         | Default Value           | Description                                  |
| ---------------- | ----------------------- | -------------------------------------------- |
| `DB_HOST`        | `localhost`             | PostgreSQL server host                       |
| `DB_PORT`        | `5432`                  | PostgreSQL server port                       |
| `DB_NAME`        | `nyc_taxi_db`           | Database name                                |
| `DB_USER`        | `postgres`              | Database username                            |
| `DB_PASSWORD`    | `your_password`         | **⚠️ Change this!** Your PostgreSQL password |
| `PORT`           | `3000`                  | Backend server port                          |
| `DATA_FILE_PATH` | `./data/train.csv`      | Path to your CSV dataset                     |
| `LOG_FILE_PATH`  | `./logs/processing.log` | Path for processing logs                     |

### 5. Database Setup

```bash
# Make sure you're in the backend directory
cd backend

# Start PostgreSQL service (if not already running)
# macOS:   brew services start postgresql
# Linux:   sudo systemctl start postgresql
# Windows: net start postgresql-x64-14

# Run automated database setup
npm run db:setup
```

**What `npm run db:setup` does:**

- ✅ Connects to PostgreSQL server
- ✅ Creates database `nyc_taxi_db` if it doesn't exist
- ✅ Creates all required tables with proper indexes
- ✅ Sets up the complete database schema

**Expected Output:**

```
🚀 Starting database setup...
📊 Target database: nyc_taxi_db
🏠 Host: localhost:5432
👤 User: postgres
✓ Connected to PostgreSQL server
✓ Database 'nyc_taxi_db' already exists
✓ Connected to target database
📝 Creating tables...
✓ Tables created successfully

🎉 Database setup completed successfully!
📋 Next steps:
   1. Run "npm run process-data" to load CSV data
   2. Run "npm run dev" to start the server
```

### 6. Load Data

**⚠️ Make sure `train.csv` is in the `backend/data/` directory before running this step!**

```bash
# Process and load CSV data into the database
npm run process-data
```

**What this does:**

- ✅ Reads the `train.csv` file from `backend/data/`
- ✅ Validates and cleans the data
- ✅ Calculates derived features (distance, speed, time categories)
- ✅ Loads data into PostgreSQL in batches
- ✅ Creates detailed processing logs

**Expected Output:**

```
=== NYC Taxi Data Processing Started ===
Data file: ./data/train.csv
Connecting to database...
✓ Database connection established successfully.
Initializing data processor...
Starting CSV processing...

Processing: [████████████████████] 100% | 1458644/1458644 records

=== Processing Complete ===
Total records processed: 1458644
Successfully loaded: 1458644
Skipped/Invalid: 0
Success rate: 100.00%
Duration: 120.45 seconds
Processing speed: 12109.23 records/second

✓ Data processing and loading completed successfully!
```

**Optional: Validate Data**

```bash
npm run validate-data
```

### 6. Frontend Configuration (Optional)

The frontend connects to the backend API. If you're running the backend on a different host/port, update the API configuration:

**File: `frontend/js/api.js`**

```javascript
// Update the base URL if your backend runs on different host/port
const API_BASE_URL = "http://localhost:3000"; // Change this if needed

// Example for different configurations:
// const API_BASE_URL = 'http://your-server.com:3000';  // Remote server
// const API_BASE_URL = 'http://localhost:8080';         // Different port
```

**File: `frontend/index.html`** (if using different CDN versions)

```html
<!-- Update these if you need different versions -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js"></script>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css"
/>
```

### 7. Start the Application

```bash
# Start backend server
npm run dev

# In a new terminal, serve frontend
cd frontend
# Open index.html in your browser or use a local server
```

### 7. Access the Application

- **Backend API**: `http://localhost:3000`
- **API Documentation**: `http://localhost:3000/api-docs`

---

## 📁 Project Structure

```
urban-mobility-data-explorer/
├── 📁 backend/                    # Backend API and services
│   ├── 📁 src/
│   │   ├── 📁 config/            # Database & Swagger config
│   │   ├── 📁 models/            # Sequelize models
│   │   ├── 📁 services/          # Data processing & algorithms
│   │   ├── 📁 controllers/       # Request handlers
│   │   ├── 📁 routes/            # API routes
│   │   ├── 📁 middleware/        # Error handling
│   │   ├── 📁 types/             # TypeScript types
│   │   └── 📁 utils/             # Helpers & logger
│   ├── 📁 scripts/               # Data processing scripts
│   ├── 📁 data/                  # CSV files
│   ├── 📁 logs/                  # Application logs
│   ├── 📄 package.json           # Backend dependencies
│   └── 📄 README.md              # Backend documentation
├── 📁 frontend/                   # Frontend dashboard
│   ├── 📁 js/                    # JavaScript modules
│   │   ├── 📄 app.js             # Main application logic
│   │   ├── 📄 api.js             # API communication
│   │   ├── 📄 charts.js          # Chart management
│   │   └── 📄 filters.js         # Data filtering
│   ├── 📄 index.html             # Main HTML file
│   ├── 📄 styles.css             # CSS styling
│   └── 📄 README.md              # Frontend documentation
├── 📄 README.md                   # This file
└── 📄 .gitignore                 # Git ignore rules
```

**Made with ❤️ by Team Urban Mobility**
