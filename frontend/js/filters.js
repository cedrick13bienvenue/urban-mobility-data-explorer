// Filter and Sorting Management
class FilterManager {
  constructor() {
    this.currentFilters = {};
    this.currentPage = 1;
    this.pageSize = 50;
    this.currentSort = { field: "pickupDatetime", order: "DESC" };
    this.tripsData = [];
    this.totalPages = 1;

    this.initializeEventListeners();
  }

  // Initialize event listeners
  initializeEventListeners() {
    // Filter controls
    const applyBtn = document.getElementById("applyFilters");
    const clearBtn = document.getElementById("clearFilters");

    if (applyBtn) {
      applyBtn.addEventListener("click", () => this.applyFilters());
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => this.clearFilters());
    }

    // Sort controls
    const sortBy = document.getElementById("sortBy");
    const sortOrder = document.getElementById("sortOrder");

    if (sortBy) {
      sortBy.addEventListener("change", () => this.updateSorting());
    }

    if (sortOrder) {
      sortOrder.addEventListener("change", () => this.updateSorting());
    }

    // Pagination controls
    const prevBtn = document.getElementById("prevPage");
    const nextBtn = document.getElementById("nextPage");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => this.previousPage());
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => this.nextPage());
    }

    // Real-time filter updates (debounced)
    const filterInputs = document.querySelectorAll(
      "#trips-view input, #trips-view select"
    );
    filterInputs.forEach((input) => {
      input.addEventListener(
        "input",
        utils.debounce(() => {
          this.updateFiltersFromInputs();
        }, 500)
      );
    });
  }

  // Update filters from input elements
  updateFiltersFromInputs() {
    const filters = {};

    // Distance range
    const minDistance = document.getElementById("minDistance")?.value;
    const maxDistance = document.getElementById("maxDistance")?.value;
    if (minDistance) filters.minDistance = parseFloat(minDistance);
    if (maxDistance) filters.maxDistance = parseFloat(maxDistance);

    // Duration range
    const minDuration = document.getElementById("minDuration")?.value;
    const maxDuration = document.getElementById("maxDuration")?.value;
    if (minDuration) filters.minDuration = parseInt(minDuration) * 60; // Convert to seconds
    if (maxDuration) filters.maxDuration = parseInt(maxDuration) * 60; // Convert to seconds

    // Hour filter
    const hourFilter = document.getElementById("hourFilter")?.value;
    if (hourFilter) filters.hourOfDay = parseInt(hourFilter);

    // Day filter
    const dayFilter = document.getElementById("dayFilter")?.value;
    if (dayFilter) filters.dayOfWeek = parseInt(dayFilter);

    // Vendor filter
    const vendorFilter = document.getElementById("vendorFilter")?.value;
    if (vendorFilter) filters.vendorId = parseInt(vendorFilter);

    // Category filter
    const categoryFilter = document.getElementById("categoryFilter")?.value;
    if (categoryFilter) filters.tripCategory = categoryFilter;

    this.currentFilters = filters;
  }

  // Apply filters and load data
  async applyFilters() {
    try {
      utils.showLoading();
      this.updateFiltersFromInputs();
      this.currentPage = 1; // Reset to first page

      await this.loadTripsData();
      utils.hideLoading();
      utils.showSuccess("Filters applied successfully");
    } catch (error) {
      console.error("Error applying filters:", error);
      utils.hideLoading();
      utils.showError("Failed to apply filters");
    }
  }

  // Clear all filters
  clearFilters() {
    // Clear all input fields
    const inputs = document.querySelectorAll(
      '#trips-view input[type="number"], #trips-view select'
    );
    inputs.forEach((input) => {
      input.value = "";
    });

    // Reset filters
    this.currentFilters = {};
    this.currentPage = 1;

    // Reload data
    this.loadTripsData();
    utils.showSuccess("Filters cleared");
  }

  // Update sorting
  updateSorting() {
    const sortBy = document.getElementById("sortBy")?.value;
    const sortOrder = document.getElementById("sortOrder")?.value;

    if (sortBy && sortOrder) {
      this.currentSort = { field: sortBy, order: sortOrder };
      this.loadTripsData();
    }
  }

  // Load trips data with current filters and pagination
  async loadTripsData() {
    try {
      const params = {
        page: this.currentPage,
        limit: this.pageSize,
        sortBy: this.currentSort.field,
        sortOrder: this.currentSort.order,
        ...this.currentFilters,
      };

      const response = await api.getTrips(params);

      if (response.success) {
        this.tripsData = response.data;
        this.totalPages = response.pagination.totalPages;
        this.updateTripsTable();
        this.updatePaginationControls();
      } else {
        throw new Error("Failed to load trips data");
      }
    } catch (error) {
      console.error("Error loading trips data:", error);
      utils.showError("Failed to load trips data");
    }
  }

  // Update trips table with current data
  updateTripsTable() {
    const tbody = document.getElementById("tripsTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (this.tripsData.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center" style="padding: 2rem; color: #6c757d;">
            No trips found matching the current filters
          </td>
        </tr>
      `;
      return;
    }

    this.tripsData.forEach((trip) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${trip.tripId || trip.id}</td>
        <td>${utils.formatDate(trip.pickupDatetime)}</td>
        <td>${utils.formatDecimal(trip.tripDistance)}</td>
        <td>${utils.formatDecimal(trip.tripDurationMinutes)}</td>
        <td>${utils.formatDecimal(trip.tripSpeedKmh)}</td>
        <td>${trip.passengerCount}</td>
        <td>${utils.getVendorName(trip.vendorId)}</td>
        <td>
          <span class="category-badge category-${trip.tripCategory}">
            ${
              trip.tripCategory.charAt(0).toUpperCase() +
              trip.tripCategory.slice(1)
            }
          </span>
        </td>
      `;

      // Add click handler for row details
      row.addEventListener("click", () => {
        this.showTripDetails(trip);
      });

      tbody.appendChild(row);
    });
  }

  // Update pagination controls
  updatePaginationControls() {
    const prevBtn = document.getElementById("prevPage");
    const nextBtn = document.getElementById("nextPage");
    const pageInfo = document.getElementById("pageInfo");

    if (prevBtn) {
      prevBtn.disabled = this.currentPage <= 1;
    }

    if (nextBtn) {
      nextBtn.disabled = this.currentPage >= this.totalPages;
    }

    if (pageInfo) {
      pageInfo.textContent = `Page ${this.currentPage} of ${this.totalPages}`;
    }
  }

  // Navigate to previous page
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTripsData();
    }
  }

  // Navigate to next page
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadTripsData();
    }
  }

  // Show trip details modal
  showTripDetails(trip) {
    // Create modal element
    const modal = document.createElement("div");
    modal.className = "trip-details-modal";
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.3s ease-in;
    `;

    modal.innerHTML = `
      <div class="modal-content" style="
        background: white;
        border-radius: 12px;
        padding: 2rem;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      ">
        <div class="modal-header" style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e9ecef;
        ">
          <h3 style="margin: 0; color: #333;">Trip Details</h3>
          <button class="close-btn" style="
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #6c757d;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 6px;
            transition: all 0.2s ease;
          ">&times;</button>
        </div>
        <div class="modal-body">
          <div class="trip-details-grid" style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
          ">
            <div class="detail-item">
              <label style="font-weight: 600; color: #6c757d; font-size: 0.9rem;">Trip ID</label>
              <p style="margin: 0.5rem 0 0 0; color: #333;">${
                trip.tripId || trip.id
              }</p>
            </div>
            <div class="detail-item">
              <label style="font-weight: 600; color: #6c757d; font-size: 0.9rem;">Pickup Time</label>
              <p style="margin: 0.5rem 0 0 0; color: #333;">${utils.formatDate(
                trip.pickupDatetime
              )}</p>
            </div>
            <div class="detail-item">
              <label style="font-weight: 600; color: #6c757d; font-size: 0.9rem;">Dropoff Time</label>
              <p style="margin: 0.5rem 0 0 0; color: #333;">${utils.formatDate(
                trip.dropoffDatetime
              )}</p>
            </div>
            <div class="detail-item">
              <label style="font-weight: 600; color: #6c757d; font-size: 0.9rem;">Distance</label>
              <p style="margin: 0.5rem 0 0 0; color: #333;">${utils.formatDecimal(
                trip.tripDistance
              )} km</p>
            </div>
            <div class="detail-item">
              <label style="font-weight: 600; color: #6c757d; font-size: 0.9rem;">Duration</label>
              <p style="margin: 0.5rem 0 0 0; color: #333;">${utils.formatDecimal(
                trip.tripDurationMinutes
              )} minutes</p>
            </div>
            <div class="detail-item">
              <label style="font-weight: 600; color: #6c757d; font-size: 0.9rem;">Speed</label>
              <p style="margin: 0.5rem 0 0 0; color: #333;">${utils.formatDecimal(
                trip.tripSpeedKmh
              )} km/h</p>
            </div>
            <div class="detail-item">
              <label style="font-weight: 600; color: #6c757d; font-size: 0.9rem;">Passengers</label>
              <p style="margin: 0.5rem 0 0 0; color: #333;">${
                trip.passengerCount
              }</p>
            </div>
            <div class="detail-item">
              <label style="font-weight: 600; color: #6c757d; font-size: 0.9rem;">Vendor</label>
              <p style="margin: 0.5rem 0 0 0; color: #333;">${utils.getVendorName(
                trip.vendorId
              )}</p>
            </div>
            <div class="detail-item">
              <label style="font-weight: 600; color: #6c757d; font-size: 0.9rem;">Category</label>
              <p style="margin: 0.5rem 0 0 0; color: #333;">
                <span class="category-badge category-${trip.tripCategory}">
                  ${
                    trip.tripCategory.charAt(0).toUpperCase() +
                    trip.tripCategory.slice(1)
                  }
                </span>
              </p>
            </div>
            <div class="detail-item">
              <label style="font-weight: 600; color: #6c757d; font-size: 0.9rem;">Pickup Location</label>
              <p style="margin: 0.5rem 0 0 0; color: #333;">
                ${utils.formatDecimal(
                  trip.pickupLatitude,
                  4
                )}, ${utils.formatDecimal(trip.pickupLongitude, 4)}
              </p>
            </div>
            <div class="detail-item">
              <label style="font-weight: 600; color: #6c757d; font-size: 0.9rem;">Dropoff Location</label>
              <p style="margin: 0.5rem 0 0 0; color: #333;">
                ${utils.formatDecimal(
                  trip.dropoffLatitude,
                  4
                )}, ${utils.formatDecimal(trip.dropoffLongitude, 4)}
              </p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add close functionality
    const closeBtn = modal.querySelector(".close-btn");
    closeBtn.addEventListener("click", () => {
      modal.remove();
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    // Add to page
    document.body.appendChild(modal);
  }

  // Initialize trips view
  async initializeTripsView() {
    await this.loadTripsData();
  }
}

// Create global filter manager instance
const filterManager = new FilterManager();

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = FilterManager;
}
