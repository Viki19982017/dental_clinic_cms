import redisClient from '../config/redis';

/**
 * Cache utility functions for Redis
 */

// Default cache expiration time (1 hour)
const DEFAULT_EXPIRATION = 3600;

/**
 * Get data from cache
 */
export const getCache = async (key: string): Promise<any | null> => {
  try {
    if (!redisClient.isOpen) {
      return null;
    }
    
    const data = await redisClient.get(key);
    if (!data) {
      return null;
    }
    
    return JSON.parse(data);
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

/**
 * Set data in cache
 */
export const setCache = async (
  key: string, 
  data: any, 
  expirationInSeconds: number = DEFAULT_EXPIRATION
): Promise<boolean> => {
  try {
    if (!redisClient.isOpen) {
      return false;
    }
    
    await redisClient.setEx(key, expirationInSeconds, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Cache set error:', error);
    return false;
  }
};

/**
 * Delete data from cache
 */
export const deleteCache = async (key: string): Promise<boolean> => {
  try {
    if (!redisClient.isOpen) {
      return false;
    }
    
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error('Cache delete error:', error);
    return false;
  }
};

/**
 * Delete multiple keys matching a pattern
 */
export const deleteCachePattern = async (pattern: string): Promise<boolean> => {
  try {
    if (!redisClient.isOpen) {
      return false;
    }
    
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    return true;
  } catch (error) {
    console.error('Cache delete pattern error:', error);
    return false;
  }
};

/**
 * Clear all cache
 */
export const clearCache = async (): Promise<boolean> => {
  try {
    if (!redisClient.isOpen) {
      return false;
    }
    
    await redisClient.flushAll();
    return true;
  } catch (error) {
    console.error('Cache clear error:', error);
    return false;
  }
};

/**
 * Check if key exists in cache
 */
export const cacheExists = async (key: string): Promise<boolean> => {
  try {
    if (!redisClient.isOpen) {
      return false;
    }
    
    const exists = await redisClient.exists(key);
    return exists === 1;
  } catch (error) {
    console.error('Cache exists error:', error);
    return false;
  }
};

/**
 * Get or set cache with a function
 * If cache exists, return it. Otherwise, execute the function and cache the result.
 */
export const getOrSetCache = async <T>(
  key: string,
  fetchFunction: () => Promise<T>,
  expirationInSeconds: number = DEFAULT_EXPIRATION
): Promise<T> => {
  // Try to get from cache
  const cachedData = await getCache(key);
  if (cachedData !== null) {
    console.log(`Cache hit: ${key}`);
    return cachedData as T;
  }

  // Cache miss - fetch data
  console.log(`Cache miss: ${key}`);
  const data = await fetchFunction();
  
  // Store in cache
  await setCache(key, data, expirationInSeconds);
  
  return data;
};

/**
 * Cache key generators
 */
export const CacheKeys = {
  patient: (id: number) => `patient:${id}`,
  patients: (page: number, limit: number) => `patients:page:${page}:limit:${limit}`,
  appointment: (id: number) => `appointment:${id}`,
  appointments: (date?: string) => date ? `appointments:date:${date}` : 'appointments:all',
  todayAppointments: () => `appointments:today:${new Date().toISOString().split('T')[0]}`,
  treatment: (id: number) => `treatment:${id}`,
  treatments: (patientId?: number) => patientId ? `treatments:patient:${patientId}` : 'treatments:all',
  invoice: (id: number) => `invoice:${id}`,
  invoices: (patientId?: number) => patientId ? `invoices:patient:${patientId}` : 'invoices:all',
  staff: (id: number) => `staff:${id}`,
  staffAll: () => 'staff:all',
  dentists: () => 'staff:dentists',
  dashboardStats: () => `dashboard:stats:${new Date().toISOString().split('T')[0]}`
};

