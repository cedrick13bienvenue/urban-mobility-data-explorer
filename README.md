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

### 3. Environment Setup

**⚠️ Important: Update these values for your setup:**

| Variable      | Default Value   | Where to Change | Description                                  |
| ------------- | --------------- | --------------- | -------------------------------------------- |
| `DB_HOST`     | `localhost`     | `backend/.env`  | PostgreSQL server host                       |
| `DB_PORT`     | `5432`          | `backend/.env`  | PostgreSQL server port                       |
| `DB_NAME`     | `nyc_taxi_db`   | `backend/.env`  | Database name                                |
| `DB_USER`     | `postgres`      | `backend/.env`  | Database username                            |
| `DB_PASSWORD` | `your_password` | `backend/.env`  | **⚠️ Change this!** Your PostgreSQL password |
| `PORT`        | `3000`          | `backend/.env`  | Backend server port                          |

**Configuration Files to Update:**

1. **`backend/src/config/database.ts`** - Database connection settings

   ```typescript
   // Default values (can be overridden by .env)
   host: process.env.DB_HOST || 'localhost',
   port: parseInt(process.env.DB_PORT || '5432'),
   database: process.env.DB_NAME || 'nyc_taxi_db',
   username: process.env.DB_USER || 'postgres',
   password: process.env.DB_PASSWORD || '',
   ```

2. **`backend/scripts/setupDb.ts`** - Database setup script
   ```typescript
   // These values are read from .env file
   const DB_HOST = process.env.DB_HOST || "localhost";
   const DB_PORT = parseInt(process.env.DB_PORT || "5432");
   const DB_NAME = process.env.DB_NAME || "nyc_taxi_db";
   const DB_USER = process.env.DB_USER || "postgres";
   const DB_PASSWORD = process.env.DB_PASSWORD || "";
   ```

### 4. Database Setup

```bash
# Start PostgreSQL service
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
# Windows: net start postgresql-x64-14

# Automated database and table setup
cd backend
npm run db:setup
```

**What `npm run db:setup` does:**

- ✅ Connects to PostgreSQL server
- ✅ Creates database `nyc_taxi_db` if it doesn't exist
- ✅ Creates all required tables with proper indexes
- ✅ Sets up the complete database schema
- ✅ Provides next steps guidance

### 5. Load Data

```bash
# Process and load CSV data
npm run process-data
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
