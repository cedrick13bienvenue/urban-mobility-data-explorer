import { Router } from 'express';
import tripRoutes from './tripRoutes';
// import { HealthController } from '../controllers/healthController';

const router = Router();
// const healthController = new HealthController();

// Health check routes
// router.get('/health', (req, res) => healthController.healthCheck(req, res));
// router.get('/status', (req, res) => healthController.statusCheck(req, res));

// Trip routes
router.use('/', tripRoutes);

export default router;