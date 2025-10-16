// Chart Configuration and Management
class ChartManager {
  constructor() {
    this.charts = {};
    this.colors = {
      primary: "#ff6b35",
      secondary: "#6c757d",
      success: "#28a745",
      warning: "#ffc107",
      danger: "#dc3545",
      info: "#17a2b8",
      light: "#f8f9fa",
      dark: "#343a40",
      purple: "#6f42c1",
      blue: "#007bff",
    };

    this.chartColors = [
      "#ff6b35",
      "#6f42c1",
      "#007bff",
      "#28a745",
      "#ffc107",
      "#dc3545",
      "#17a2b8",
      "#6c757d",
    ];
  }

  // Initialize all charts
  async initializeCharts() {
    try {
      await this.loadDashboardCharts();
    } catch (error) {
      console.error("Error initializing charts:", error);
      utils.showError("Failed to load chart data");
    }
  }

  // Load dashboard charts
  async loadDashboardCharts() {
    try {
      // Load summary data
      const summaryData = await api.getStatsSummary();
      this.updateSummaryCards(summaryData.data);

      // Load hourly chart
      const hourlyData = await api.getHourlyStats();
      this.createHourlyChart(hourlyData.data);

      // Load daily chart
      const dailyData = await api.getDailyStats();
      this.createDailyChart(dailyData.data);

      // Load vendor chart
      const vendorData = await api.getVendorStats();
      this.createVendorChart(vendorData.data);
    } catch (error) {
      console.error("Error loading dashboard charts:", error);
      throw error;
    }
  }

  // Load clustering charts
  async loadClusteringCharts() {
    try {
      // Show loading placeholders
      this.showLoadingPlaceholders(["clusterSummary"]);
      this.showChartLoading("clusteringChartLoading");

      // Load clustering analysis
      const clusteringData = await api.getClusteringAnalysis();
      this.createClusteringChart(clusteringData.data);
      this.updateClusterSummary(clusteringData.data);
    } catch (error) {
      console.error("Error loading clustering charts:", error);
      this.hideChartLoading("clusteringChartLoading");
      throw error;
    }
  }

  // Load outlier charts
  async loadOutlierCharts() {
    try {
      // Show loading placeholders
      this.showLoadingPlaceholders(["outlierStats", "statisticalBounds"]);
      this.showChartLoading("outlierChartLoading");

      // Load outlier analysis
      const outlierData = await api.getOutlierAnalysis();
      this.createOutlierChart(outlierData.data);
      this.updateOutlierStats(outlierData.data);
    } catch (error) {
      console.error("Error loading outlier charts:", error);
      this.hideChartLoading("outlierChartLoading");
      throw error;
    }
  }

  // Update summary cards
  updateSummaryCards(data) {
    if (!data) return;

    const elements = {
      totalTrips: document.getElementById("totalTrips"),
      avgDistance: document.getElementById("avgDistance"),
      avgDuration: document.getElementById("avgDuration"),
      avgSpeed: document.getElementById("avgSpeed"),
    };

    if (elements.totalTrips) {
      elements.totalTrips.textContent = utils.formatNumber(data.totalTrips);
    }
    if (elements.avgDistance) {
      elements.avgDistance.textContent = utils.formatDecimal(data.avgDistance);
    }
    if (elements.avgDuration) {
      elements.avgDuration.textContent = utils.formatDecimal(data.avgDuration);
    }
    if (elements.avgSpeed) {
      elements.avgSpeed.textContent = utils.formatDecimal(data.avgSpeed);
    }
  }

  // Create hourly chart
  createHourlyChart(data) {
    const ctx = document.getElementById("hourlyChart");
    if (!ctx || !data) return;

    // Destroy existing chart
    if (this.charts.hourly) {
      this.charts.hourly.destroy();
    }

    const labels = data.map((item) => utils.getHourLabel(item.hour));
    const tripCounts = data.map((item) => item.tripCount);
    const avgDistances = data.map((item) => item.avgDistance);
    const avgDurations = data.map((item) => item.avgDuration);

    this.charts.hourly = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Trip Count",
            data: tripCounts,
            borderColor: this.colors.primary,
            backgroundColor: this.colors.primary + "20",
            tension: 0.4,
            yAxisID: "y",
          },
          {
            label: "Avg Distance (km)",
            data: avgDistances,
            borderColor: this.colors.purple,
            backgroundColor: this.colors.purple + "20",
            tension: 0.4,
            yAxisID: "y1",
          },
          {
            label: "Avg Duration (min)",
            data: avgDurations,
            borderColor: this.colors.blue,
            backgroundColor: this.colors.blue + "20",
            tension: 0.4,
            yAxisID: "y2",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            mode: "index",
            intersect: false,
          },
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: "Hour of Day",
            },
          },
          y: {
            type: "linear",
            display: true,
            position: "left",
            title: {
              display: true,
              text: "Trip Count",
            },
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            title: {
              display: true,
              text: "Avg Distance (km)",
            },
            grid: {
              drawOnChartArea: false,
            },
          },
          y2: {
            type: "linear",
            display: false,
            position: "right",
            title: {
              display: true,
              text: "Avg Duration (min)",
            },
            grid: {
              drawOnChartArea: false,
            },
          },
        },
        interaction: {
          mode: "nearest",
          axis: "x",
          intersect: false,
        },
      },
    });

    // Add chart control functionality
    this.addChartControls("hourlyChart", {
      trips: tripCounts,
      distance: avgDistances,
      duration: avgDurations,
    });
  }

  // Create daily chart
  createDailyChart(data) {
    const ctx = document.getElementById("dailyChart");
    if (!ctx || !data) return;

    // Destroy existing chart
    if (this.charts.daily) {
      this.charts.daily.destroy();
    }

    const labels = data.map((item) => item.dayName);
    const tripCounts = data.map((item) => item.tripCount);
    const avgDistances = data.map((item) => item.avgDistance);
    const avgPassengers = data.map((item) => item.avgPassengers);

    this.charts.daily = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Trip Count",
            data: tripCounts,
            backgroundColor: this.colors.primary + "80",
            borderColor: this.colors.primary,
            borderWidth: 1,
          },
          {
            label: "Avg Distance (km)",
            data: avgDistances,
            backgroundColor: this.colors.purple + "80",
            borderColor: this.colors.purple,
            borderWidth: 1,
            yAxisID: "y1",
          },
          {
            label: "Avg Passengers",
            data: avgPassengers,
            backgroundColor: this.colors.blue + "80",
            borderColor: this.colors.blue,
            borderWidth: 1,
            yAxisID: "y2",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: "Day of Week",
            },
          },
          y: {
            type: "linear",
            display: true,
            position: "left",
            title: {
              display: true,
              text: "Trip Count",
            },
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            title: {
              display: true,
              text: "Avg Distance (km)",
            },
            grid: {
              drawOnChartArea: false,
            },
          },
          y2: {
            type: "linear",
            display: false,
            position: "right",
            title: {
              display: true,
              text: "Avg Passengers",
            },
            grid: {
              drawOnChartArea: false,
            },
          },
        },
      },
    });

    // Add chart control functionality
    this.addChartControls("dailyChart", {
      trips: tripCounts,
      distance: avgDistances,
      passengers: avgPassengers,
    });
  }

  // Create vendor chart
  createVendorChart(data) {
    const ctx = document.getElementById("vendorChart");
    if (!ctx || !data) return;

    // Destroy existing chart
    if (this.charts.vendor) {
      this.charts.vendor.destroy();
    }

    const labels = data.map((item) => item.vendorName);
    const tripCounts = data.map((item) => item.tripCount);
    const avgDistances = data.map((item) => item.avgDistance);
    const avgSpeeds = data.map((item) => item.avgSpeed);

    this.charts.vendor = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Trip Count",
            data: tripCounts,
            backgroundColor: [
              this.colors.primary,
              this.colors.purple,
              this.colors.blue,
              this.colors.success,
            ],
            borderWidth: 2,
            borderColor: "#fff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.parsed;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${utils.formatNumber(
                  value
                )} trips (${percentage}%)`;
              },
            },
          },
        },
      },
    });

    // Add chart control functionality
    this.addChartControls("vendorChart", {
      trips: tripCounts,
      distance: avgDistances,
      speed: avgSpeeds,
    });
  }

  // Create clustering chart
  createClusteringChart(data) {
    const ctx = document.getElementById("clustersDetailChart");
    if (!ctx || !data) return;

    // Show loading
    this.showChartLoading("clusteringChartLoading");

    // Destroy existing chart
    if (this.charts.clustering) {
      this.charts.clustering.destroy();
    }

    const labels = data.map((item) => item.label);
    const counts = data.map((item) => item.count);
    const centroids = data.map((item) => item.centroid);

    this.charts.clustering = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Trip Count",
            data: counts,
            backgroundColor: this.chartColors.slice(0, data.length),
            borderColor: this.chartColors.slice(0, data.length),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              afterLabel: function (context) {
                const index = context.dataIndex;
                const centroid = centroids[index];
                return `Centroid: ${centroid.toFixed(2)} km`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Number of Trips",
            },
          },
          x: {
            title: {
              display: true,
              text: "Distance Category",
            },
          },
        },
      },
    });

    // Hide loading
    this.hideChartLoading("clusteringChartLoading");
  }

  // Create outlier chart
  createOutlierChart(data) {
    const ctx = document.getElementById("outliersDetailChart");
    if (!ctx || !data) return;

    // Show loading
    this.showChartLoading("outlierChartLoading");

    // Destroy existing chart
    if (this.charts.outlier) {
      this.charts.outlier.destroy();
    }

    const labels = ["Normal Trips", "Outlier Trips"];
    const values = [data.totalTrips - data.outlierCount, data.outlierCount];
    const colors = [this.colors.success, this.colors.danger];

    this.charts.outlier = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            borderWidth: 2,
            borderColor: "#fff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.parsed;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${utils.formatNumber(
                  value
                )} (${percentage}%)`;
              },
            },
          },
        },
      },
    });

    // Hide loading
    this.hideChartLoading("outlierChartLoading");
  }

  // Add chart controls functionality
  addChartControls(chartId, datasets) {
    const chartElement = document.getElementById(chartId);
    if (!chartElement) return;

    const controls = chartElement
      .closest(".chart-card")
      .querySelector(".chart-controls");
    if (!controls) return;

    const buttons = controls.querySelectorAll(".chart-btn");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        // Remove active class from all buttons
        buttons.forEach((btn) => btn.classList.remove("active"));
        // Add active class to clicked button
        button.classList.add("active");

        const chartType = button.dataset.chart;
        this.updateChartData(chartId, chartType, datasets);
      });
    });
  }

  // Update chart data based on control selection
  updateChartData(chartId, chartType, datasets) {
    const chart = this.charts[chartId.replace("Chart", "")];
    if (!chart || !datasets[chartType]) return;

    const newData = datasets[chartType];

    if (chart.config.type === "line") {
      // Update line chart
      chart.data.datasets.forEach((dataset, index) => {
        if (index === 0) {
          dataset.data = newData;
          dataset.label = this.getDatasetLabel(chartType);
        } else {
          dataset.hidden = true;
        }
      });
    } else if (chart.config.type === "bar") {
      // Update bar chart
      chart.data.datasets.forEach((dataset, index) => {
        if (index === 0) {
          dataset.data = newData;
          dataset.label = this.getDatasetLabel(chartType);
        } else {
          dataset.hidden = true;
        }
      });
    } else if (chart.config.type === "doughnut") {
      // Update doughnut chart
      chart.data.datasets[0].data = newData;
      chart.data.datasets[0].label = this.getDatasetLabel(chartType);
    }

    chart.update();
  }

  // Get dataset label based on chart type
  getDatasetLabel(chartType) {
    const labels = {
      trips: "Trip Count",
      distance: "Avg Distance (km)",
      duration: "Avg Duration (min)",
      passengers: "Avg Passengers",
      speed: "Avg Speed (km/h)",
    };
    return labels[chartType] || chartType;
  }

  // Update cluster summary
  updateClusterSummary(data) {
    const summaryElement = document.getElementById("clusterSummary");
    if (!summaryElement || !data) return;

    const totalTrips = data.reduce((sum, cluster) => sum + cluster.count, 0);
    const avgDistance =
      data.reduce((sum, cluster) => sum + cluster.centroid * cluster.count, 0) /
      totalTrips;

    summaryElement.innerHTML = `
      <div class="metric-value">${data.length}</div>
      <div class="metric-subtitle">Clusters Found</div>
      <div class="metric-trend">
        <i class="fas fa-chart-pie"></i>
        <span>${utils.formatNumber(totalTrips)} total trips</span>
      </div>
      <div class="metric-trend">
        <i class="fas fa-route"></i>
        <span>Avg distance: ${utils.formatDecimal(avgDistance)} km</span>
      </div>
    `;
  }

  // Update outlier statistics
  updateOutlierStats(data) {
    const statsElement = document.getElementById("outlierStats");
    const boundsElement = document.getElementById("statisticalBounds");

    if (!statsElement || !boundsElement || !data) return;

    statsElement.innerHTML = `
      <div class="metric-value">${utils.formatNumber(data.outlierCount)}</div>
      <div class="metric-subtitle">Outlier Trips</div>
      <div class="metric-trend">
        <i class="fas fa-percentage"></i>
        <span>${utils.formatDecimal(data.outlierPercentage)}% of total</span>
      </div>
      <div class="metric-trend">
        <i class="fas fa-list"></i>
        <span>${utils.formatNumber(data.totalTrips)} total trips</span>
      </div>
    `;

    boundsElement.innerHTML = `
      <div class="metric-value">${utils.formatDecimal(
        data.lowerBound / 60
      )} - ${utils.formatDecimal(data.upperBound / 60)}</div>
      <div class="metric-subtitle">Duration Range (minutes)</div>
      <div class="metric-trend">
        <i class="fas fa-clock"></i>
        <span>Lower bound: ${utils.formatDecimal(
          data.lowerBound / 60
        )} min</span>
      </div>
      <div class="metric-trend">
        <i class="fas fa-clock"></i>
        <span>Upper bound: ${utils.formatDecimal(
          data.upperBound / 60
        )} min</span>
      </div>
    `;
  }

  // Show outlier details table
  showOutlierDetails(data) {
    const tableElement = document.getElementById("outlierDetailsTable");
    const tbodyElement = document.getElementById("outlierTripsTableBody");

    if (!tableElement || !tbodyElement || !data) return;

    tableElement.style.display = "block";
    tbodyElement.innerHTML = "";

    if (data.outlierTrips && data.outlierTrips.length > 0) {
      data.outlierTrips.slice(0, 50).forEach((trip) => {
        const row = document.createElement("tr");
        const reason =
          trip.tripDuration < data.lowerBound ? "Too Short" : "Too Long";

        row.innerHTML = `
          <td>${trip.id}</td>
          <td>${utils.formatDecimal(trip.tripDurationMinutes)}</td>
          <td>${utils.formatDecimal(trip.tripDistance)}</td>
          <td>${utils.formatDecimal(
            trip.tripDistance / (trip.tripDurationMinutes / 60)
          )}</td>
          <td><span class="category-badge category-${
            trip.tripDistance < 2
              ? "short"
              : trip.tripDistance < 5
              ? "medium"
              : "long"
          }">${
          trip.tripDistance < 2
            ? "Short"
            : trip.tripDistance < 5
            ? "Medium"
            : "Long"
        }</span></td>
          <td><span class="outlier-reason ${reason
            .toLowerCase()
            .replace(" ", "-")}">${reason}</span></td>
        `;

        tbodyElement.appendChild(row);
      });
    } else {
      tbodyElement.innerHTML =
        '<tr><td colspan="6" class="text-center">No outlier trips found</td></tr>';
    }
  }

  // Refresh clustering analysis
  async refreshClusteringAnalysis() {
    try {
      utils.showLoading();
      const k = document.getElementById("clusterK")?.value || 3;
      const data = await api.getClusteringAnalysis(k);
      this.createClusteringChart(data.data);
      this.updateClusterSummary(data.data);
      utils.hideLoading();
      utils.showSuccess("Clustering analysis updated");
    } catch (error) {
      console.error("Error refreshing clustering:", error);
      utils.hideLoading();
      utils.showError("Failed to refresh clustering analysis");
    }
  }

  // Refresh outlier analysis
  async refreshOutlierAnalysis() {
    try {
      utils.showLoading();
      const data = await api.getOutlierAnalysis();
      this.createOutlierChart(data.data);
      this.updateOutlierStats(data.data);
      utils.hideLoading();
      utils.showSuccess("Outlier analysis updated");
    } catch (error) {
      console.error("Error refreshing outliers:", error);
      utils.hideLoading();
      utils.showError("Failed to refresh outlier analysis");
    }
  }

  // Show loading placeholders
  showLoadingPlaceholders(elementIds) {
    elementIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.innerHTML = `
          <div class="loading-placeholder">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading...</p>
          </div>
        `;
      }
    });
  }

  // Show chart loading
  showChartLoading(loadingId) {
    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) {
      loadingElement.style.display = "flex";
    }
  }

  // Hide chart loading
  hideChartLoading(loadingId) {
    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) {
      loadingElement.style.display = "none";
    }
  }

  // Destroy all charts
  destroyAllCharts() {
    Object.values(this.charts).forEach((chart) => {
      if (chart && typeof chart.destroy === "function") {
        chart.destroy();
      }
    });
    this.charts = {};
  }
}

// Create global chart manager instance
const chartManager = new ChartManager();

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = ChartManager;
}
