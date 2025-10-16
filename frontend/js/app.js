// Main Application Controller
class App {
  constructor() {
    this.currentView = "dashboard";
    this.heatmap = null;
    this.isInitialized = false;

    this.initializeApp();
  }

  // Initialize the application
  async initializeApp() {
    try {
      this.setupEventListeners();
      this.updateCurrentDate();
      await this.loadInitialData();
      this.isInitialized = true;

      console.log("Urban Mobility Data Explorer initialized successfully");
    } catch (error) {
      console.error("Error initializing application:", error);
      utils.showError("Failed to initialize application");
    }
  }

  // Setup event listeners
  setupEventListeners() {
    // Navigation
    this.setupNavigation();

    // Search functionality
    this.setupSearch();

    // Chart controls
    this.setupChartControls();

    // Heatmap controls
    this.setupHeatmapControls();

    // Responsive behavior
    this.setupResponsiveBehavior();

    // Keyboard shortcuts
    this.setupKeyboardShortcuts();
  }

  // Setup navigation
  setupNavigation() {
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        const view = item.dataset.view;
        if (view) {
          this.switchView(view);
        }
      });
    });
  }

  // Switch between views
  switchView(viewName) {
    // Update navigation
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active");
    });

    const activeNavItem = document.querySelector(`[data-view="${viewName}"]`);
    if (activeNavItem) {
      activeNavItem.classList.add("active");
    }

    // Update views
    document.querySelectorAll(".view").forEach((view) => {
      view.classList.remove("active");
    });

    const targetView = document.getElementById(`${viewName}-view`);
    if (targetView) {
      targetView.classList.add("active");
      this.currentView = viewName;

      // Load view-specific data
      this.loadViewData(viewName);
    }
  }

  // Load data for specific view
  async loadViewData(viewName) {
    try {
      switch (viewName) {
        case "dashboard":
          await chartManager.loadDashboardCharts();
          break;
        case "trips":
          await filterManager.initializeTripsView();
          break;
        case "patterns":
          await this.initializeHeatmap();
          break;
        case "clusters":
          await chartManager.loadClusteringCharts();
          break;
        case "outliers":
          await chartManager.loadOutlierCharts();
          break;
      }
    } catch (error) {
      console.error(`Error loading ${viewName} view:`, error);
      utils.showError(`Failed to load ${viewName} data`);
    }
  }

  // Setup search functionality
  setupSearch() {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.performSearch(searchInput.value);
        }
      });

      // Add search suggestions
      searchInput.addEventListener(
        "input",
        utils.debounce((e) => {
          this.showSearchSuggestions(e.target.value);
        }, 300)
      );
    }
  }

  // Perform search
  performSearch(query) {
    if (!query.trim()) return;

    // For now, just show a message - could be extended to search trips
    utils.showSuccess(`Searching for: "${query}"`);

    // Clear search input
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.value = "";
    }
  }

  // Show search suggestions
  showSearchSuggestions(query) {
    // Placeholder for search suggestions
    // Could be extended to show recent searches or common queries
  }

  // Setup chart controls
  setupChartControls() {
    // Clustering refresh button
    const refreshClustersBtn = document.getElementById("refreshClusters");
    if (refreshClustersBtn) {
      refreshClustersBtn.addEventListener("click", () => {
        chartManager.refreshClusteringAnalysis();
      });
    }

    // Cluster K selector
    const clusterKSelect = document.getElementById("clusterK");
    if (clusterKSelect) {
      clusterKSelect.addEventListener("change", () => {
        chartManager.refreshClusteringAnalysis();
      });
    }

    // Outlier refresh button
    const refreshOutliersBtn = document.getElementById("refreshOutliers");
    if (refreshOutliersBtn) {
      refreshOutliersBtn.addEventListener("click", () => {
        chartManager.refreshOutlierAnalysis();
      });
    }

    // Show outlier details button
    const showOutlierDetailsBtn = document.getElementById("showOutlierDetails");
    if (showOutlierDetailsBtn) {
      showOutlierDetailsBtn.addEventListener("click", async () => {
        try {
          utils.showLoading();
          const data = await api.getOutlierAnalysis();
          chartManager.showOutlierDetails(data.data);
          utils.hideLoading();
        } catch (error) {
          console.error("Error loading outlier details:", error);
          utils.hideLoading();
          utils.showError("Failed to load outlier details");
        }
      });
    }

    // Hide outlier details button
    const hideOutlierDetailsBtn = document.getElementById("hideOutlierDetails");
    if (hideOutlierDetailsBtn) {
      hideOutlierDetailsBtn.addEventListener("click", () => {
        const tableElement = document.getElementById("outlierDetailsTable");
        if (tableElement) {
          tableElement.style.display = "none";
        }
      });
    }
  }

  // Setup heatmap controls
  setupHeatmapControls() {
    const heatmapButtons = document.querySelectorAll("[data-heatmap]");
    heatmapButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Remove active class from all buttons
        heatmapButtons.forEach((btn) => btn.classList.remove("active"));
        // Add active class to clicked button
        button.classList.add("active");

        const heatmapType = button.dataset.heatmap;
        this.updateHeatmap(heatmapType);
      });
    });
  }

  // Initialize heatmap
  async initializeHeatmap() {
    try {
      if (this.heatmap) {
        this.heatmap.remove();
      }

      // Create map container
      const container = document.getElementById("heatmapContainer");
      if (!container) return;

      // Initialize Leaflet map
      this.heatmap = L.map("heatmapContainer").setView([40.7128, -74.006], 11);

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(this.heatmap);

      // Load heatmap data
      await this.loadHeatmapData("pickup");
    } catch (error) {
      console.error("Error initializing heatmap:", error);
      utils.showError("Failed to initialize heatmap");
    }
  }

  // Load heatmap data
  async loadHeatmapData(type = "pickup") {
    try {
      utils.showLoading();

      const response = await api.getLocationHeatmap(5000);
      if (!response.success || !response.data) {
        throw new Error("No heatmap data available");
      }

      // Clear existing markers
      if (this.heatmap) {
        this.heatmap.eachLayer((layer) => {
          if (layer instanceof L.CircleMarker) {
            this.heatmap.removeLayer(layer);
          }
        });
      }

      // Add markers
      const data = response.data.slice(0, 1000); // Limit for performance
      data.forEach((trip) => {
        const coords = type === "pickup" ? trip.pickup : trip.dropoff;

        if (coords.lat && coords.lng) {
          L.circleMarker([coords.lat, coords.lng], {
            radius: 3,
            fillColor: "#ff6b35",
            color: "#ff6b35",
            weight: 1,
            opacity: 0.7,
            fillOpacity: 0.5,
          }).addTo(this.heatmap);
        }
      });

      utils.hideLoading();
    } catch (error) {
      console.error("Error loading heatmap data:", error);
      utils.hideLoading();
      utils.showError("Failed to load heatmap data");
    }
  }

  // Update heatmap type
  updateHeatmap(type) {
    this.loadHeatmapData(type);
  }

  // Setup responsive behavior
  setupResponsiveBehavior() {
    // Handle window resize
    window.addEventListener(
      "resize",
      utils.throttle(() => {
        this.handleResize();
      }, 250)
    );

    // Handle mobile menu toggle
    this.setupMobileMenu();
  }

  // Handle window resize
  handleResize() {
    // Redraw charts on resize
    Object.values(chartManager.charts).forEach((chart) => {
      if (chart && typeof chart.resize === "function") {
        chart.resize();
      }
    });

    // Resize heatmap
    if (this.heatmap) {
      setTimeout(() => {
        this.heatmap.invalidateSize();
      }, 100);
    }
  }

  // Setup mobile menu
  setupMobileMenu() {
    // Add mobile menu toggle button
    const header = document.querySelector(".header");
    if (header && window.innerWidth <= 768) {
      const menuToggle = document.createElement("button");
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      menuToggle.className = "mobile-menu-toggle";
      menuToggle.style.cssText = `
        display: none;
        background: none;
        border: none;
        font-size: 1.2rem;
        color: #333;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 6px;
        transition: all 0.2s ease;
      `;

      menuToggle.addEventListener("click", () => {
        const sidebar = document.querySelector(".sidebar");
        sidebar.classList.toggle("open");
      });

      header.insertBefore(menuToggle, header.firstChild);

      // Show/hide based on screen size
      const updateMenuToggle = () => {
        if (window.innerWidth <= 768) {
          menuToggle.style.display = "block";
        } else {
          menuToggle.style.display = "none";
          document.querySelector(".sidebar").classList.remove("open");
        }
      };

      window.addEventListener("resize", updateMenuToggle);
      updateMenuToggle();
    }
  }

  // Setup keyboard shortcuts
  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      // Cmd/Ctrl + F for search
      if ((e.metaKey || e.ctrlKey) && e.key === "f") {
        e.preventDefault();
        const searchInput = document.getElementById("searchInput");
        if (searchInput) {
          searchInput.focus();
        }
      }

      // Escape to close modals
      if (e.key === "Escape") {
        const modals = document.querySelectorAll(".trip-details-modal");
        modals.forEach((modal) => modal.remove());
      }

      // Number keys for navigation
      if (e.key >= "1" && e.key <= "5" && !e.ctrlKey && !e.metaKey) {
        const views = [
          "dashboard",
          "trips",
          "patterns",
          "clusters",
          "outliers",
        ];
        const viewIndex = parseInt(e.key) - 1;
        if (views[viewIndex]) {
          this.switchView(views[viewIndex]);
        }
      }
    });
  }

  // Load initial data
  async loadInitialData() {
    try {
      utils.showLoading();

      // Load dashboard data
      await chartManager.loadDashboardCharts();

      utils.hideLoading();
    } catch (error) {
      console.error("Error loading initial data:", error);
      utils.hideLoading();
      utils.showError("Failed to load initial data");
    }
  }

  // Update current date
  updateCurrentDate() {
    const dateElement = document.getElementById("current-date");
    if (dateElement) {
      const now = new Date();
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      dateElement.textContent = now.toLocaleDateString("en-US", options);
    }
  }

  // Add filter functionality
  setupAddFilter() {
    const addFilterBtn = document.querySelector(".add-asset-btn");
    if (addFilterBtn) {
      addFilterBtn.addEventListener("click", () => {
        // Switch to trips view and show filter panel
        this.switchView("trips");

        // Scroll to filters section
        const filtersSection = document.querySelector(".filters-section");
        if (filtersSection) {
          filtersSection.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  }

  // Get application statistics
  async getAppStats() {
    try {
      const summary = await api.getStatsSummary();
      return summary.data;
    } catch (error) {
      console.error("Error getting app stats:", error);
      return null;
    }
  }

  // Refresh all data
  async refreshAllData() {
    try {
      utils.showLoading();

      // Refresh current view data
      await this.loadViewData(this.currentView);

      utils.hideLoading();
      utils.showSuccess("Data refreshed successfully");
    } catch (error) {
      console.error("Error refreshing data:", error);
      utils.hideLoading();
      utils.showError("Failed to refresh data");
    }
  }
}

// Initialize application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Create global app instance
  window.app = new App();

  // Setup add filter functionality
  window.app.setupAddFilter();

  // Add refresh button functionality
  const refreshBtn = document.createElement("button");
  refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
  refreshBtn.title = "Refresh Data";
  refreshBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #ff6b35;
    color: white;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    transition: all 0.2s ease;
  `;

  refreshBtn.addEventListener("click", () => {
    window.app.refreshAllData();
  });

  refreshBtn.addEventListener("mouseenter", () => {
    refreshBtn.style.transform = "scale(1.1)";
  });

  refreshBtn.addEventListener("mouseleave", () => {
    refreshBtn.style.transform = "scale(1)";
  });

  document.body.appendChild(refreshBtn);
});

// Add CSS for category badges
const style = document.createElement("style");
style.textContent = `
  .category-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .category-short {
    background: #d4edda;
    color: #155724;
  }
  
  .category-medium {
    background: #fff3cd;
    color: #856404;
  }
  
  .category-long {
    background: #f8d7da;
    color: #721c24;
  }
  
  .error-notification,
  .success-notification {
    animation: slideIn 0.3s ease-out;
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);
