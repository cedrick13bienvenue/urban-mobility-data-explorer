/**
 * Custom Algorithm: K-Means Clustering for Trip Distance Analysis
 * 
 * This manual implementation groups trips into clusters based on distance
 * without using any built-in clustering libraries.
 * 
 * Purpose: Identify patterns in trip distances (short, medium, long trips)
 * and analyze their characteristics.
 * 
 * Algorithm: K-Means Clustering
 * Time Complexity: O(n * k * iterations) where n = number of trips, k = number of clusters
 * Space Complexity: O(n + k)
 */

export interface TripDataPoint {
  id: number;
  distance: number;
  fare: number;
  duration: number;
  speed: number;
}

export interface Cluster {
  centroid: number;
  points: TripDataPoint[];
  avgFare: number;
  avgDuration: number;
  avgSpeed: number;
  count: number;
}

export class KMeansClusterer {
  private k: number;
  private maxIterations: number;
  private tolerance: number;

  constructor(k: number = 3, maxIterations: number = 100, tolerance: number = 0.001) {
    this.k = k;
    this.maxIterations = maxIterations;
    this.tolerance = tolerance;
  }

  /**
   * Initialize centroids using k-means++ algorithm for better initial placement
   * Time Complexity: O(n * k)
   */
  private initializeCentroids(data: TripDataPoint[]): number[] {
    const centroids: number[] = [];
    
    // Pick first centroid randomly
    const firstIndex = Math.floor(Math.random() * data.length);
    centroids.push(data[firstIndex].distance);

    // Pick remaining centroids based on distance from existing ones
    for (let i = 1; i < this.k; i++) {
      const distances: number[] = [];
      
      for (let j = 0; j < data.length; j++) {
        let minDist = Infinity;
        
        // Find minimum distance to any existing centroid
        for (let c = 0; c < centroids.length; c++) {
          const dist = Math.abs(data[j].distance - centroids[c]);
          if (dist < minDist) {
            minDist = dist;
          }
        }
        
        distances.push(minDist);
      }
      
      // Pick point with maximum minimum distance
      let maxDistIndex = 0;
      let maxDist = distances[0];
      
      for (let j = 1; j < distances.length; j++) {
        if (distances[j] > maxDist) {
          maxDist = distances[j];
          maxDistIndex = j;
        }
      }
      
      centroids.push(data[maxDistIndex].distance);
    }

    return centroids;
  }

  /**
   * Assign each point to the nearest centroid
   * Time Complexity: O(n * k)
   */
  private assignPointsToClusters(data: TripDataPoint[], centroids: number[]): number[] {
    const assignments: number[] = [];

    for (let i = 0; i < data.length; i++) {
      let minDistance = Infinity;
      let clusterIndex = 0;

      // Find nearest centroid
      for (let j = 0; j < centroids.length; j++) {
        const distance = Math.abs(data[i].distance - centroids[j]);
        if (distance < minDistance) {
          minDistance = distance;
          clusterIndex = j;
        }
      }

      assignments.push(clusterIndex);
    }

    return assignments;
  }

  /**
   * Update centroids based on mean of assigned points
   * Time Complexity: O(n)
   */
  private updateCentroids(data: TripDataPoint[], assignments: number[]): number[] {
    const newCentroids: number[] = new Array(this.k).fill(0);
    const counts: number[] = new Array(this.k).fill(0);

    // Sum up distances for each cluster
    for (let i = 0; i < data.length; i++) {
      const cluster = assignments[i];
      newCentroids[cluster] += data[i].distance;
      counts[cluster]++;
    }

    // Calculate means
    for (let i = 0; i < this.k; i++) {
      if (counts[i] > 0) {
        newCentroids[i] /= counts[i];
      }
    }

    return newCentroids;
  }

  /**
   * Check if centroids have converged
   * Time Complexity: O(k)
   */
  private hasConverged(oldCentroids: number[], newCentroids: number[]): boolean {
    for (let i = 0; i < this.k; i++) {
      if (Math.abs(oldCentroids[i] - newCentroids[i]) > this.tolerance) {
        return false;
      }
    }
    return true;
  }

  /**
   * Calculate cluster statistics
   * Time Complexity: O(n)
   */
  private calculateClusterStats(data: TripDataPoint[], assignments: number[], centroids: number[]): Cluster[] {
    const clusters: Cluster[] = [];

    for (let i = 0; i < this.k; i++) {
      const clusterPoints: TripDataPoint[] = [];
      let totalFare = 0;
      let totalDuration = 0;
      let totalSpeed = 0;

      // Collect points in this cluster
      for (let j = 0; j < data.length; j++) {
        if (assignments[j] === i) {
          clusterPoints.push(data[j]);
          totalFare += data[j].fare;
          totalDuration += data[j].duration;
          totalSpeed += data[j].speed;
        }
      }

      const count = clusterPoints.length;

      clusters.push({
        centroid: centroids[i],
        points: clusterPoints,
        avgFare: count > 0 ? totalFare / count : 0,
        avgDuration: count > 0 ? totalDuration / count : 0,
        avgSpeed: count > 0 ? totalSpeed / count : 0,
        count: count
      });
    }

    return clusters;
  }

  /**
   * Main clustering algorithm
   * Time Complexity: O(n * k * iterations)
   * Space Complexity: O(n + k)
   * 
   * Pseudo-code:
   * 1. Initialize k centroids using k-means++
   * 2. REPEAT until convergence or max iterations:
   *    a. Assign each point to nearest centroid
   *    b. Update centroids to mean of assigned points
   *    c. Check if centroids changed significantly
   * 3. Calculate final cluster statistics
   * 4. Return clusters with metadata
   */
  public cluster(data: TripDataPoint[]): Cluster[] {
    if (data.length === 0) {
      return [];
    }

    // Step 1: Initialize centroids
    let centroids = this.initializeCentroids(data);
    let assignments: number[] = [];
    let iteration = 0;

    // Step 2: Iterate until convergence
    while (iteration < this.maxIterations) {
      // Assign points to clusters
      assignments = this.assignPointsToClusters(data, centroids);

      // Update centroids
      const newCentroids = this.updateCentroids(data, assignments);

      // Check convergence
      if (this.hasConverged(centroids, newCentroids)) {
        console.log(`K-Means converged after ${iteration + 1} iterations`);
        centroids = newCentroids;
        break;
      }

      centroids = newCentroids;
      iteration++;
    }

    // Step 3: Calculate final statistics
    const clusters = this.calculateClusterStats(data, assignments, centroids);

    // Sort clusters by centroid (distance)
    this.sortClusters(clusters);

    return clusters;
  }

  /**
   * Manual bubble sort to sort clusters by centroid
   * Time Complexity: O(k^2)
   * Note: Using manual implementation as required by assignment
   */
  private sortClusters(clusters: Cluster[]): void {
    const n = clusters.length;
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (clusters[j].centroid > clusters[j + 1].centroid) {
          // Swap
          const temp = clusters[j];
          clusters[j] = clusters[j + 1];
          clusters[j + 1] = temp;
        }
      }
    }
  }
}

/**
 * Helper function to identify outliers using IQR method
 * Time Complexity: O(n log n) for sorting
 * Space Complexity: O(n)
 * 
 * This is another custom algorithm implementation
 */
export class OutlierDetector {
  /**
   * Manual quicksort implementation
   * Time Complexity: O(n log n) average, O(n^2) worst case
   */
  private quickSort(arr: number[], left: number = 0, right: number = arr.length - 1): void {
    if (left < right) {
      const pivotIndex = this.partition(arr, left, right);
      this.quickSort(arr, left, pivotIndex - 1);
      this.quickSort(arr, pivotIndex + 1, right);
    }
  }

  private partition(arr: number[], left: number, right: number): number {
    const pivot = arr[right];
    let i = left - 1;

    for (let j = left; j < right; j++) {
      if (arr[j] <= pivot) {
        i++;
        // Swap
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }

    // Swap pivot
    const temp = arr[i + 1];
    arr[i + 1] = arr[right];
    arr[right] = temp;

    return i + 1;
  }

  /**
   * Calculate quartiles manually
   */
  private calculateQuartiles(sortedData: number[]): { q1: number; q3: number; iqr: number } {
    const n = sortedData.length;
    const q1Index = Math.floor(n * 0.25);
    const q3Index = Math.floor(n * 0.75);

    const q1 = sortedData[q1Index];
    const q3 = sortedData[q3Index];
    const iqr = q3 - q1;

    return { q1, q3, iqr };
  }

  /**
   * Detect outliers using IQR method
   * Time Complexity: O(n log n)
   * Space Complexity: O(n)
   */
  public detectOutliers(values: number[]): { outliers: number[]; lowerBound: number; upperBound: number } {
    if (values.length === 0) {
      return { outliers: [], lowerBound: 0, upperBound: 0 };
    }

    // Create copy and sort
    const sortedValues = [...values];
    this.quickSort(sortedValues);

    // Calculate quartiles
    const { q1, q3, iqr } = this.calculateQuartiles(sortedValues);

    // Calculate bounds
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    // Identify outliers
    const outliers: number[] = [];
    for (let i = 0; i < values.length; i++) {
      if (values[i] < lowerBound || values[i] > upperBound) {
        outliers.push(values[i]);
      }
    }

    return { outliers, lowerBound, upperBound };
  }
}