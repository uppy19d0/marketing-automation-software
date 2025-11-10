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

dotenv.config();

const app: Application = express();

// MongoDB connection with caching for serverless
let cachedDb: typeof mongoose | null = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/marketing-automation';

  try {
    const db = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    cachedDb = db;
    console.log('✅ MongoDB connected successfully');
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    throw error;
  }
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});

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
app.use(async (req: Request, res: Response, next: any) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
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
app.get('/api', (req: Request, res: Response) => {
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
