import User from '../models/User';

/**
 * Seeds the database with initial data
 * This function is called automatically when the server starts
 */
export const seedDatabase = async (): Promise<void> => {
  try {
    // Check if admin user exists
    const adminExists = await User.findOne({ email: 'admin@unicaribe.edu.do' });

    if (!adminExists) {
      // Create admin user
      await User.create({
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
      console.log('✅ Admin user created: admin@unicaribe.edu.do');
    } else {
      console.log('ℹ️  Admin user already exists');
    }
  } catch (error: any) {
    console.error('❌ Error seeding database:', error.message);
  }
};
