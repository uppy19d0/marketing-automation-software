import express from 'express';
import {
  healthCheck,
  detailedHealthCheck,
  readinessCheck,
  livenessCheck,
} from '../controllers/healthController';

const router = express.Router();

/**
 * Health check routes
 */

// Basic health check
router.get('/', healthCheck);

// Detailed health check with database ping
router.get('/detailed', detailedHealthCheck);

// Readiness probe (for Kubernetes/orchestration)
router.get('/ready', readinessCheck);

// Liveness probe (for Kubernetes/orchestration)
router.get('/live', livenessCheck);

export default router;
