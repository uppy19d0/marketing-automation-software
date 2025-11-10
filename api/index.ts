import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import routes
import healthRoutes from '../server/src/routes/healthRoutes';
import authRoutes from '../server/src/routes/authRoutes';
import contactRoutes from '../server/src/routes/contactRoutes';
import campaignRoutes from '../server/src/routes/campaignRoutes';
import segmentRoutes from '../server/src/routes/segmentRoutes';
import landingPageRoutes from '../server/src/routes/landingPageRoutes';
import { errorHandler, notFound } from '../server/src/middleware/errorHandler';
import { seedDatabase } from '../server/src/utils/seedDatabase';

dotenv.config();

const app: Application = express();

// Trust proxy - Required for rate limiting behind proxies (Vercel, AWS Lambda, etc.)
app.set('trust proxy', 1);

console.log('🔧 [Config] Environment variables loaded');
console.log('🔧 [Config] MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('🔧 [Config] NODE_ENV:', process.env.NODE_ENV || 'development');

// MongoDB connection with caching for serverless
let cachedDb: typeof mongoose | null = null;
let isSeeded = false;

async function connectToDatabase() {
  console.log('🔄 [DB] Attempting to connect to database...');
  console.log('🔄 [DB] Cached connection exists:', !!cachedDb);

  if (cachedDb) {
    console.log('✅ [DB] Using cached database connection');
    console.log('✅ [DB] Connection state:', mongoose.connection.readyState);
    return cachedDb;
  }

  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/marketing-automation';
  console.log('🔄 [DB] MongoDB URI:', mongoURI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs

  try {
    console.log('🔄 [DB] Connecting to MongoDB...');
    const db = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    cachedDb = db;
    console.log('✅ [DB] MongoDB connected successfully');
    console.log('✅ [DB] Database name:', mongoose.connection.name);
    console.log('✅ [DB] Connection state:', mongoose.connection.readyState);
    console.log('✅ [DB] Host:', mongoose.connection.host);

    // Run database seeding only once
    if (!isSeeded) {
      console.log('🌱 [DB] Running database seeding...');
      await seedDatabase();
      isSeeded = true;
      console.log('✅ [DB] Database seeding completed');
    } else {
      console.log('ℹ️  [DB] Database already seeded, skipping...');
    }

    return db;
  } catch (error) {
    console.error('❌ [DB] MongoDB connection failed:', error);
    console.error('❌ [DB] Error details:', {
      name: (error as Error).name,
      message: (error as Error).message,
    });
    throw error;
  }
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip rate limiting for health checks
  skip: (req) => req.path === '/api/health' || req.path === '/api/health/live',
});

console.log('🔧 [Config] Rate limiting configured (100 requests per 15 minutes)');
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database before handling requests
app.use(async (_req: Request, res: Response, next: any) => {
  console.log('🔄 [Middleware] Database connection middleware triggered');
  try {
    console.log('🔄 [Middleware] Calling connectToDatabase...');
    await connectToDatabase();
    console.log('✅ [Middleware] Database connection successful, proceeding to next middleware');
    next();
  } catch (error) {
    console.error('❌ [Middleware] Database connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: (error as Error).message,
    });
  }
});

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/segments', segmentRoutes);
app.use('/api/landing-pages', landingPageRoutes);

// Root route
app.get('/api', (_req: Request, res: Response) => {
  res.json({
    message: 'Marketing Automation API',
    version: '1.0.0',
    status: 'active',
  });
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

export default app;
