import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User';

// Load env vars
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/marketing-automation';

const seedAdminUser = async () => {
  try {
    // Connect to database
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@unicaribe.edu.do' });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log('Email:', existingAdmin.email);
      console.log('Name:', existingAdmin.name);
      console.log('Role:', existingAdmin.role);
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      email: 'admin@unicaribe.edu.do',
      password: '123456',
      name: 'Administrador',
      role: 'admin',
      preferences: {
        language: 'es',
        timezone: 'America/Santo_Domingo',
        theme: 'system',
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('-----------------------------------');
    console.log('Email:', adminUser.email);
    console.log('Password: 123456');
    console.log('Name:', adminUser.name);
    console.log('Role:', adminUser.role);
    console.log('-----------------------------------');
    console.log('You can now login with these credentials');

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error seeding admin user:', error.message);
    process.exit(1);
  }
};

seedAdminUser();
