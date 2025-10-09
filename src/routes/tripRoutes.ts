import { Router } from 'express';
import { TripController } from '../controllers/tripController';

const router = Router();
const tripController = new TripController();

// Basic CRUD routes
router.get('/trips', (req, res) => tripController.getAllTrips(req, res));
router.get('/trips/:id', (req, res) => tripController.getTripById(req, res));

// Statistics routes
router.get('/trips/stats/summary', (req, res) => tripController.getStatsSummary(req, res));
router.get('/trips/stats/hourly', (req, res) => tripController.getHourlyStats(req, res));
router.get('/trips/stats/daily', (req, res) => tripController.getDailyStats(req, res));
router.get('/trips/stats/payment', (req, res) => tripController.getPaymentTypeStats(req, res));

// Analysis routes (using custom algorithms)
router.get('/trips/analysis/clusters', (req, res) => tripController.getDistanceClusters(req, res));
router.get('/trips/analysis/outliers', (req, res) => tripController.detectFareOutliers(req, res));

// Location data
router.get('/trips/heatmap', (req, res) => tripController.getLocationHeatmap(req, res));

export default router;