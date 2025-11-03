import { Request, Response, NextFunction } from 'express';
import { getCache, setCache } from '../utils/cache';

/**
 * Cache middleware to cache GET requests
 * Usage: router.get('/endpoint', cacheMiddleware(60), controller)
 */
export const cacheMiddleware = (expirationInSeconds: number = 60) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Generate cache key from URL and query params
    const cacheKey = `cache:${req.originalUrl || req.url}`;

    try {
      // Try to get cached response
      const cachedResponse = await getCache(cacheKey);
      
      if (cachedResponse) {
        console.log(`[Cache] Hit: ${cacheKey}`);
        return res.json(cachedResponse);
      }

      console.log(`[Cache] Miss: ${cacheKey}`);

      // Store original json function
      const originalJson = res.json.bind(res);

      // Override json function to cache the response
      res.json = ((body: any) => {
        // Cache the response
        setCache(cacheKey, body, expirationInSeconds).catch(err => 
          console.error('Failed to cache response:', err)
        );

        // Send the response
        return originalJson(body);
      }) as any;

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

/**
 * No-cache middleware to disable caching for specific routes
 */
export const noCacheMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
};

