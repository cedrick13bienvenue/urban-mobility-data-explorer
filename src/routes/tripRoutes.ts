import { Router } from 'express';
import { TripController } from '../controllers/tripController';

const router = Router();
const tripController = new TripController();

/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Get all trips with filtering and pagination
 *     description: Retrieve a paginated list of trips with optional filtering by distance, duration, date, time, and passenger count
 *     tags: [Trips]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *           maximum: 1000
 *         description: Number of results per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: pickupDatetime
 *           enum: [pickupDatetime, dropoffDatetime, tripDistance, tripDuration, tripSpeedKmh]
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           default: DESC
 *           enum: [ASC, DESC]
 *         description: Sort order
 *       - in: query
 *         name: minDistance
 *         schema:
 *           type: number
 *         description: Minimum trip distance in km
 *       - in: query
 *         name: maxDistance
 *         schema:
 *           type: number
 *         description: Maximum trip distance in km
 *       - in: query
 *         name: minDuration
 *         schema:
 *           type: integer
 *         description: Minimum trip duration in seconds
 *       - in: query
 *         name: maxDuration
 *         schema:
 *           type: integer
 *         description: Maximum trip duration in seconds
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter trips after this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter trips before this date
 *       - in: query
 *         name: hourOfDay
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 23
 *         description: Filter by hour of day
 *       - in: query
 *         name: dayOfWeek
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 6
 *         description: Filter by day of week (0=Sunday)
 *       - in: query
 *         name: isWeekend
 *         schema:
 *           type: boolean
 *         description: Filter by weekend
 *       - in: query
 *         name: isRushHour
 *         schema:
 *           type: boolean
 *         description: Filter by rush hour
 *       - in: query
 *         name: vendorId
 *         schema:
 *           type: integer
 *           enum: [1, 2]
 *         description: Filter by vendor ID
 *       - in: query
 *         name: tripCategory
 *         schema:
 *           type: string
 *           enum: [short, medium, long]
 *         description: Filter by trip category
 *       - in: query
 *         name: minPassengers
 *         schema:
 *           type: integer
 *         description: Minimum passenger count
 *       - in: query
 *         name: maxPassengers
 *         schema:
 *           type: integer
 *         description: Maximum passenger count
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Trip'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/trips', (req, res) => tripController.getAllTrips(req, res));


/**
 * @swagger
 * /api/trips/heatmap:
 *   get:
 *     summary: Get location heatmap data
 *     description: Retrieve pickup and dropoff coordinates for heatmap visualization
 *     tags: [Trips]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5000
 *         description: Maximum number of coordinates to return
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       pickup:
 *                         type: object
 *                         properties:
 *                           lat:
 *                             type: number
 *                           lng:
 *                             type: number
 *                       dropoff:
 *                         type: object
 *                         properties:
 *                           lat:
 *                             type: number
 *                           lng:
 *                             type: number
 */
router.get('/trips/heatmap', (req, res) => tripController.getLocationHeatmap(req, res));

/**
 * @swagger
 * /api/trips/stats/summary:
 *   get:
 *     summary: Get overall statistics
 *     description: Calculate aggregate statistics across all trips
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalTrips:
 *                       type: integer
 *                       example: 95234
 *                     avgDistance:
 *                       type: number
 *                       example: 3.45
 *                     avgDuration:
 *                       type: number
 *                       example: 15.8
 *                     avgSpeed:
 *                       type: number
 *                       example: 18.5
 *                     avgPassengers:
 *                       type: number
 *                       example: 1.6
 */
router.get('/trips/stats/summary', (req, res) => tripController.getStatsSummary(req, res));

/**
 * @swagger
 * /api/trips/stats/hourly:
 *   get:
 *     summary: Get hourly statistics
 *     description: Get trip statistics grouped by hour of day (0-23)
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       hour:
 *                         type: integer
 *                         example: 17
 *                       tripCount:
 *                         type: integer
 *                         example: 4532
 *                       avgDistance:
 *                         type: number
 *                         example: 3.2
 *                       avgDuration:
 *                         type: number
 *                         example: 14.5
 */
router.get('/trips/stats/hourly', (req, res) => tripController.getHourlyStats(req, res));

/**
 * @swagger
 * /api/trips/stats/daily:
 *   get:
 *     summary: Get daily statistics
 *     description: Get trip statistics grouped by day of week
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       day:
 *                         type: integer
 *                         example: 1
 *                       dayName:
 *                         type: string
 *                         example: Monday
 *                       tripCount:
 *                         type: integer
 *                         example: 15234
 *                       avgDistance:
 *                         type: number
 *                         example: 3.5
 *                       avgPassengers:
 *                         type: number
 *                         example: 1.5
 */
router.get('/trips/stats/daily', (req, res) => tripController.getDailyStats(req, res));

/**
 * @swagger
 * /api/trips/stats/vendor:
 *   get:
 *     summary: Get vendor statistics
 *     description: Get trip statistics grouped by vendor
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/trips/stats/vendor', (req, res) => tripController.getVendorStats(req, res));

/**
 * @swagger
 * /api/trips/analysis/clusters:
 *   get:
 *     summary: K-Means clustering analysis
 *     description: Perform K-Means clustering on trip distances using custom algorithm implementation
 *     tags: [Analysis]
 *     parameters:
 *       - in: query
 *         name: k
 *         schema:
 *           type: integer
 *           default: 3
 *           minimum: 2
 *           maximum: 10
 *         description: Number of clusters
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10000
 *         description: Number of trips to analyze
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       clusterIndex:
 *                         type: integer
 *                         example: 0
 *                       centroid:
 *                         type: number
 *                         example: 1.25
 *                       count:
 *                         type: integer
 *                         example: 4532
 *                       avgDuration:
 *                         type: number
 *                         example: 8.2
 *                       avgSpeed:
 *                         type: number
 *                         example: 15.3
 *                       label:
 *                         type: string
 *                         example: Short Distance
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     k:
 *                       type: integer
 *                     totalPoints:
 *                       type: integer
 */
router.get('/trips/analysis/clusters', (req, res) => tripController.getDistanceClusters(req, res));

/**
 * @swagger
 * /api/trips/analysis/outliers:
 *   get:
 *     summary: Outlier detection
 *     description: Detect outliers in trip duration using IQR method with custom QuickSort implementation
 *     tags: [Analysis]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     outlierCount:
 *                       type: integer
 *                       example: 234
 *                     totalTrips:
 *                       type: integer
 *                       example: 10000
 *                     outlierPercentage:
 *                       type: number
 *                       example: 2.34
 *                     lowerBound:
 *                       type: number
 *                       example: 180
 *                     upperBound:
 *                       type: number
 *                       example: 3600
 */
router.get('/trips/analysis/outliers', (req, res) => tripController.detectDurationOutliers(req, res));


/**
 * @swagger
 * /api/trips/{id}:
 *   get:
 *     summary: Get a single trip by ID
 *     description: Retrieve detailed information about a specific trip
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Trip database ID
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Trip'
 *       404:
 *         description: Trip not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 */
router.get('/trips/:id', (req, res) => tripController.getTripById(req, res));

export default router;