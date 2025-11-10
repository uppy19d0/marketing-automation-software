import mongoose from 'mongoose';
import { seedDatabase } from '../utils/seedDatabase';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/marketing-automation';

    await mongoose.connect(mongoURI);

    console.log('✅ MongoDB connected successfully');

    // Seed database with initial data
    await seedDatabase();

    // Connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

export default connectDB;
