// API Configuration
const API_BASE_URL = "http://localhost:3000/api";

// API Service Class
class APIService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic fetch method with error handling
  async fetch(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // Get trip statistics summary
  async getStatsSummary() {
    return this.fetch("/trips/stats/summary");
  }

  // Get hourly statistics
  async getHourlyStats() {
    return this.fetch("/trips/stats/hourly");
  }

  // Get daily statistics
  async getDailyStats() {
    return this.fetch("/trips/stats/daily");
  }

  // Get vendor statistics
  async getVendorStats() {
    return this.fetch("/trips/stats/vendor");
  }

  // Get trips with filtering and pagination
  async getTrips(params = {}) {
    const queryParams = new URLSearchParams();

    Object.keys(params).forEach((key) => {
      if (
        params[key] !== undefined &&
        params[key] !== null &&
        params[key] !== ""
      ) {
        queryParams.append(key, params[key]);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/trips?${queryString}` : "/trips";

    return this.fetch(endpoint);
  }

  // Get clustering analysis
  async getClusteringAnalysis(k = 3, limit = 10000) {
    return this.fetch(`/trips/analysis/clusters?k=${k}&limit=${limit}`);
  }

  // Get outlier analysis
  async getOutlierAnalysis() {
    return this.fetch("/trips/analysis/outliers");
  }

  // Get location heatmap data
  async getLocationHeatmap(limit = 5000) {
    return this.fetch(`/trips/heatmap?limit=${limit}`);
  }

  // Get single trip by ID
  async getTripById(id) {
    return this.fetch(`/trips/${id}`);
  }
}

// Create global API instance
const api = new APIService();

// Utility functions
const utils = {
  // Format number with commas
  formatNumber(num) {
    return new Intl.NumberFormat().format(num);
  },

  // Format decimal to specified places
  formatDecimal(num, places = 2) {
    return parseFloat(num).toFixed(places);
  },

  // Format date
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  // Format time duration
  formatDuration(minutes) {
    if (minutes < 60) {
      return `${Math.round(minutes)}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  },

  // Get vendor name
  getVendorName(vendorId) {
    const vendors = {
      1: "Creative Mobile Technologies",
      2: "VeriFone Inc.",
    };
    return vendors[vendorId] || "Unknown";
  },

  // Get day name
  getDayName(dayIndex) {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[dayIndex] || "Unknown";
  },

  // Get hour label
  getHourLabel(hour) {
    if (hour === 0) return "12 AM";
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return "12 PM";
    return `${hour - 12} PM`;
  },

  // Show loading overlay
  showLoading() {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) {
      overlay.classList.add("active");
    }
  },

  // Hide loading overlay
  hideLoading() {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) {
      overlay.classList.remove("active");
    }
  },

  // Show error message
  showError(message) {
    // Create a simple error notification
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-notification";
    errorDiv.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: #dc3545;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;
    errorDiv.textContent = message;

    document.body.appendChild(errorDiv);

    // Auto remove after 5 seconds
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  },

  // Show success message
  showSuccess(message) {
    const successDiv = document.createElement("div");
    successDiv.className = "success-notification";
    successDiv.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;
    successDiv.textContent = message;

    document.body.appendChild(successDiv);

    // Auto remove after 3 seconds
    setTimeout(() => {
      successDiv.remove();
    }, 3000);
  },

  // Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function
  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },
};

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = { APIService, api, utils };
}
