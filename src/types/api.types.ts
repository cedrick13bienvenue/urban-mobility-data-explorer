export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination?: PaginationParams;
}

export interface TripQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  minDistance?: number;
  maxDistance?: number;
  minFare?: number;
  maxFare?: number;
  startDate?: string;
  endDate?: string;
  hourOfDay?: number;
  dayOfWeek?: number;
  isWeekend?: boolean;
  minPassengers?: number;
  maxPassengers?: number;
}

export interface ClusterParams {
  k?: number;
  limit?: number;
}

export interface HeatmapParams {
  limit?: number;
}

export interface ProcessingStats {
  totalRecords: number;
  processedRecords: number;
  skippedRecords: number;
  errors: string[];
}

export interface HealthCheckResponse {
  success: boolean;
  message: string;
  timestamp: string;
  database?: string;
  uptime?: number;
}
