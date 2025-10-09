import { Request, Response, NextFunction } from 'express';
import { APP_CONFIG } from '../config/constants';

export const validateTripQuery = (req: Request, res: Response, next: NextFunction): void => {
  const { page, limit, minDistance, maxDistance, minFare, maxFare } = req.query;

  // Validate page
  if (page && (isNaN(Number(page)) || Number(page) < 1)) {
    res.status(400).json({ success: false, error: 'Invalid page number' });
    return;
  }

  // Validate limit
  if (limit && (isNaN(Number(limit)) || Number(limit) < 1 || Number(limit) > APP_CONFIG.API.MAX_LIMIT)) {
    res.status(400).json({ 
      success: false, 
      error: `Invalid limit. Must be between 1 and ${APP_CONFIG.API.MAX_LIMIT}` 
    });
    return;
  }

  // Validate distance range
  if (minDistance && maxDistance && Number(minDistance) > Number(maxDistance)) {
    res.status(400).json({ success: false, error: 'minDistance cannot be greater than maxDistance' });
    return;
  }

  // Validate fare range
  if (minFare && maxFare && Number(minFare) > Number(maxFare)) {
    res.status(400).json({ success: false, error: 'minFare cannot be greater than maxFare' });
    return;
  }

  next();
};

export const validateClusterParams = (req: Request, res: Response, next: NextFunction): void => {
  const { k, limit } = req.query;

  // Validate k
  if (k && (isNaN(Number(k)) || Number(k) < 2 || Number(k) > 10)) {
    res.status(400).json({ success: false, error: 'k must be between 2 and 10' });
    return;
  }

  // Validate limit
  if (limit && (isNaN(Number(limit)) || Number(limit) < 100)) {
    res.status(400).json({ success: false, error: 'limit must be at least 100 for meaningful clustering' });
    return;
  }

  next();
};

export const validateTripId = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;

  if (!id || isNaN(Number(id)) || Number(id) < 1) {
    res.status(400).json({ success: false, error: 'Invalid trip ID' });
    return;
  }

  next();
};