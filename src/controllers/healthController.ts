import { Request, Response } from 'express';
import sequelize from '../config/database';
import { HealthCheckResponse } from '../types/api.types'

export class HealthController {
  /**
   * Basic health check
   */
  public async healthCheck(req: Request, res: Response): Promise<void> {
    const response: HealthCheckResponse = {
      success: true,
      message: 'NYC Taxi Trip Data API is running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };

    res.json(response);
  }

  /**
   * Detailed status check including database
   */
  public async statusCheck(req: Request, res: Response): Promise<void> {
    try {
      // Test database connection
      await sequelize.authenticate();
      
      const response: HealthCheckResponse = {
        success: true,
        message: 'All systems operational',
        timestamp: new Date().toISOString(),
        database: 'Connected',
        uptime: process.uptime(),
      };

      res.json(response);
    } catch (error) {
      res.status(503).json({
        success: false,
        message: 'Service degraded',
        timestamp: new Date().toISOString(),
        database: 'Disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}