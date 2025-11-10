import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User';

// Load env vars
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/marketing-automation';

const verifyUser = async () => {
  try {
    // Connect to database
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
    console.log('📍 Database:', MONGO_URI);

    // Find all users
    const users = await User.find({});
    console.log(`\n📊 Total users in database: ${users.length}`);

    if (users.length === 0) {
      console.log('\n⚠️  No users found in database!');
      console.log('Run: npm run seed:admin');
      process.exit(0);
    }

    // Show all users
    console.log('\n👥 Users:');
    for (const user of users) {
      console.log('-----------------------------------');
      console.log('ID:', user._id);
      console.log('Email:', user.email);
      console.log('Name:', user.name);
      console.log('Role:', user.role);
      console.log('Created:', user.createdAt);
    }
    console.log('-----------------------------------');

    // Test password for admin user
    const adminUser = await User.findOne({ email: 'admin@unicaribe.edu.do' }).select('+password');

    if (adminUser) {
      console.log('\n🔐 Testing password for admin user...');
      const testPassword = '123456';
      const isMatch = await adminUser.comparePassword(testPassword);

      if (isMatch) {
        console.log('✅ Password verification successful! Password "123456" works.');
      } else {
        console.log('❌ Password verification failed! Password "123456" does not match.');
        console.log('The password may have been hashed incorrectly.');
      }
    }

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

verifyUser();
