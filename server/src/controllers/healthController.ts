import { Request, Response } from 'express';
import mongoose from 'mongoose';

/**
 * @desc    Health check endpoint
 * @route   GET /api/health
 * @access  Public
 */
export const healthCheck = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Check MongoDB connection
    const dbStatus = mongoose.connection.readyState;
    const dbStatusMap: { [key: number]: string } = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    const isHealthy = dbStatus === 1;

    const healthData = {
      success: true,
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbStatusMap[dbStatus] || 'unknown',
        connected: isHealthy,
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        unit: 'MB',
      },
      version: '1.0.0',
    };

    res.status(isHealthy ? 200 : 503).json(healthData);
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      message: 'Health check failed',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * @desc    Detailed health check with database ping
 * @route   GET /api/health/detailed
 * @access  Public
 */
export const detailedHealthCheck = async (_req: Request, res: Response): Promise<void> => {
  try {
    const startTime = Date.now();
    
    // Ping database
    let dbPing = null;
    let dbError = null;
    
    try {
      const pingStart = Date.now();
      if (mongoose.connection.db) {
        await mongoose.connection.db.admin().ping();
        dbPing = Date.now() - pingStart;
      } else {
        dbError = 'Database connection not established';
      }
    } catch (error) {
      dbError = error instanceof Error ? error.message : 'Database ping failed';
    }

    const responseTime = Date.now() - startTime;
    const dbStatus = mongoose.connection.readyState;
    const isHealthy = dbStatus === 1 && !dbError;

    const detailedHealth = {
      success: true,
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      uptime: {
        seconds: Math.floor(process.uptime()),
        formatted: formatUptime(process.uptime()),
      },
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbStatus === 1 ? 'connected' : 'disconnected',
        connected: dbStatus === 1,
        ping: dbPing ? `${dbPing}ms` : null,
        error: dbError,
        name: mongoose.connection.name || 'unknown',
        host: mongoose.connection.host || 'unknown',
      },
      memory: {
        heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`,
        rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
        external: `${Math.round(process.memoryUsage().external / 1024 / 1024)} MB`,
      },
      cpu: {
        user: process.cpuUsage().user,
        system: process.cpuUsage().system,
      },
      version: {
        app: '1.0.0',
        node: process.version,
        platform: process.platform,
      },
    };

    res.status(isHealthy ? 200 : 503).json(detailedHealth);
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      message: 'Detailed health check failed',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * @desc    Readiness check (for Kubernetes/orchestration)
 * @route   GET /api/health/ready
 * @access  Public
 */
export const readinessCheck = async (_req: Request, res: Response): Promise<void> => {
  try {
    const dbStatus = mongoose.connection.readyState;
    const isReady = dbStatus === 1;

    if (isReady) {
      res.status(200).json({
        success: true,
        ready: true,
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(503).json({
        success: false,
        ready: false,
        message: 'Service not ready',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    res.status(503).json({
      success: false,
      ready: false,
      message: 'Readiness check failed',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * @desc    Liveness check (for Kubernetes/orchestration)
 * @route   GET /api/health/live
 * @access  Public
 */
export const livenessCheck = (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    alive: true,
    timestamp: new Date().toISOString(),
  });
};

// Helper function to format uptime
function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
}
