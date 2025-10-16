# Urban Mobility Data Explorer - Frontend

A modern, interactive web dashboard for exploring NYC taxi trip data with comprehensive analytics and visualizations.

## Features

### 🎯 **Dashboard Overview**

- **Summary Cards**: Total trips, average distance, duration, and speed metrics
- **Interactive Charts**: Hourly patterns, daily patterns, and vendor performance
- **Real-time Data**: Live updates from backend APIs
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### 📊 **Advanced Analytics**

- **K-Means Clustering**: Analyze trip distance patterns with customizable cluster count
- **Outlier Detection**: Identify unusual trip durations using statistical analysis
- **Temporal Patterns**: Visualize trip patterns across different time dimensions
- **Location Heatmaps**: Interactive maps showing pickup/dropoff density

### 🔍 **Data Explorer**

- **Comprehensive Filtering**: Filter by distance, duration, time, vendor, and category
- **Advanced Sorting**: Sort by pickup time, distance, duration, or speed
- **Pagination**: Navigate through large datasets efficiently
- **Trip Details**: Click any trip for detailed information modal

### 🎨 **Modern UI/UX**

- **Clean Design**: Following modern design principles with dark green background
- **Interactive Elements**: Hover effects, smooth transitions, and animations
- **Color-coded Categories**: Visual distinction for short/medium/long distance trips
- **Keyboard Shortcuts**: Quick navigation and search functionality

## Technical Implementation

### **Architecture**

- **Modular JavaScript**: Separate modules for API, charts, filters, and app logic
- **Chart.js Integration**: Professional charts with interactive controls
- **Leaflet Maps**: Interactive heatmaps for location visualization
- **Responsive CSS**: Mobile-first design with CSS Grid and Flexbox

### **Key Components**

#### **API Service (`js/api.js`)**

- Centralized API communication
- Error handling and loading states
- Utility functions for data formatting
- Debounced search functionality

#### **Chart Manager (`js/charts.js`)**

- Chart.js integration with custom styling
- Interactive chart controls
- Real-time data updates
- Multiple chart types (line, bar, doughnut)

#### **Filter Manager (`js/filters.js`)**

- Advanced filtering and sorting
- Pagination handling
- Trip detail modals
- Real-time filter updates

#### **Main App (`js/app.js`)**

- Application initialization
- Navigation management
- Responsive behavior
- Keyboard shortcuts

## Getting Started

### **Prerequisites**

- Backend server running on `http://localhost:3000`
- Modern web browser with JavaScript enabled

### **Installation**

1. Ensure the backend is running and accessible
2. Open `index.html` in a web browser
3. The dashboard will automatically load data from the backend APIs

### **Usage**

#### **Navigation**

- Use the sidebar to switch between different views
- Keyboard shortcuts: `1-6` for quick navigation
- `Cmd/Ctrl + F` for search

#### **Dashboard**

- View summary statistics and key metrics
- Interact with charts using control buttons
- Switch between different data visualizations

#### **Data Explorer**

- Apply filters using the filter panel
- Sort data by different criteria
- Click on trip rows for detailed information
- Navigate through pages using pagination controls

#### **Analytics**

- Adjust clustering parameters
- Refresh outlier analysis
- Explore temporal patterns

## API Integration

The frontend integrates with the following backend endpoints:

- `GET /api/trips/stats/summary` - Overall statistics
- `GET /api/trips/stats/hourly` - Hourly trip patterns
- `GET /api/trips/stats/daily` - Daily trip patterns
- `GET /api/trips/stats/vendor` - Vendor performance
- `GET /api/trips` - Filtered trip data with pagination
- `GET /api/trips/analysis/clusters` - K-means clustering
- `GET /api/trips/analysis/outliers` - Outlier detection
- `GET /api/trips/heatmap` - Location data for maps

## Visualizations

### **Chart Types**

1. **Line Charts**: Hourly patterns with multiple metrics
2. **Bar Charts**: Daily patterns and clustering results
3. **Doughnut Charts**: Vendor distribution and outlier analysis
4. **Heatmaps**: Location density using Leaflet maps

### **Interactive Features**

- Chart control buttons for switching data views
- Hover tooltips with detailed information
- Click-to-drill-down functionality
- Real-time data updates

## Responsive Design

### **Breakpoints**

- **Desktop**: Full sidebar and multi-column layouts
- **Tablet**: Collapsible sidebar with adjusted grid
- **Mobile**: Single-column layout with mobile menu

### **Mobile Features**

- Touch-friendly interface
- Swipe navigation
- Optimized chart sizes
- Mobile menu toggle

## Browser Support

- **Chrome**: 80+
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+

## Performance Optimizations

- **Debounced Search**: Prevents excessive API calls
- **Chart Lazy Loading**: Charts load only when needed
- **Data Pagination**: Handles large datasets efficiently
- **Responsive Images**: Optimized for different screen sizes

## Future Enhancements

- **Export Functionality**: Download charts and data
- **Advanced Filters**: Date range pickers and more options
- **Real-time Updates**: WebSocket integration
- **User Preferences**: Saveable dashboard configurations
- **Advanced Analytics**: More statistical analysis tools

## Contributing

1. Follow the existing code structure
2. Use consistent naming conventions
3. Add comments for complex logic
4. Test on multiple browsers
5. Ensure responsive design

## License

This project is part of the Urban Mobility Data Explorer assignment.
