import { APP_CONFIG } from '../config/constants';

/**
 * Format a date to ISO string
 */
export const formatDate = (date: Date): string => {
  return date.toISOString();
};

/**
 * Convert miles to kilometers
 */
export const milesToKm = (miles: number): number => {
  return miles * APP_CONFIG.CONVERSIONS.MILES_TO_KM;
};

/**
 * Convert milliseconds to minutes
 */
export const msToMinutes = (ms: number): number => {
  return ms / APP_CONFIG.CONVERSIONS.MS_TO_MINUTES;
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (part: number, whole: number): number => {
  if (whole === 0) return 0;
  return (part / whole) * 100;
};

/**
 * Round to specified decimal places
 */
export const roundToDecimal = (value: number, decimals: number = 2): number => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * Check if a date is weekend
 */
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

/**
 * Get payment type name
 */
export const getPaymentTypeName = (type: number): string => {
  return APP_CONFIG.PAYMENT_TYPES[type as keyof typeof APP_CONFIG.PAYMENT_TYPES] || 'Unknown';
};

/**
 * Get day name
 */
export const getDayName = (dayIndex: number): string => {
  return APP_CONFIG.DAYS_OF_WEEK[dayIndex] || 'Unknown';
};

/**
 * Validate coordinates are within NYC bounds
 */
export const isValidNYCCoordinate = (lat: number, lon: number): boolean => {
  return (
    lat >= APP_CONFIG.NYC_BOUNDS.MIN_LATITUDE &&
    lat <= APP_CONFIG.NYC_BOUNDS.MAX_LATITUDE &&
    lon >= APP_CONFIG.NYC_BOUNDS.MIN_LONGITUDE &&
    lon <= APP_CONFIG.NYC_BOUNDS.MAX_LONGITUDE
  );
};

/**
 * Parse date string safely
 */
export const parseDateSafe = (dateStr: string): Date | null => {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return null;
    }
    return date;
  } catch {
    return null;
  }
};

/**
 * Parse float safely
 */
export const parseFloatSafe = (value: string | undefined, defaultValue: number = 0): number => {
  if (!value) return defaultValue;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Parse int safely
 */
export const parseIntSafe = (value: string | undefined, defaultValue: number = 0): number => {
  if (!value) return defaultValue;
  const parsed = parseInt(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Calculate statistics for an array of numbers
 */
export const calculateStats = (
  numbers: number[]
): { min: number; max: number; mean: number; median: number } => {
  if (numbers.length === 0) {
    return { min: 0, max: 0, mean: 0, median: 0 };
  }

  const sorted = [...numbers].sort((a, b) => a - b);
  const sum = numbers.reduce((acc, val) => acc + val, 0);
  const mean = sum / numbers.length;
  const median =
    numbers.length % 2 === 0
      ? (sorted[numbers.length / 2 - 1] + sorted[numbers.length / 2]) / 2
      : sorted[Math.floor(numbers.length / 2)];

  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    mean,
    median,
  };
};