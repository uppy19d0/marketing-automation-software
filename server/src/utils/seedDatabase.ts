import User from '../models/User';

/**
 * Seeds the database with initial data
 * This function is called automatically when the server starts
 */
export const seedDatabase = async (): Promise<void> => {
  console.log('🌱 [Seed] Starting database seeding process...');
  try {
    console.log('🔄 [Seed] Checking for existing admin user...');
    // Check if admin user exists
    const adminExists = await User.findOne({ email: 'admin@unicaribe.edu.do' });
    console.log('🔄 [Seed] Admin user exists:', !!adminExists);

    if (!adminExists) {
      console.log('🔄 [Seed] Creating admin user...');
      // Create admin user
      const newAdmin = await User.create({
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
      console.log('✅ [Seed] Admin user created successfully!');
      console.log('✅ [Seed] Email:', newAdmin.email);
      console.log('✅ [Seed] Name:', newAdmin.name);
      console.log('✅ [Seed] Role:', newAdmin.role);
      console.log('✅ [Seed] Password: 123456 (default)');
    } else {
      console.log('ℹ️  [Seed] Admin user already exists, skipping creation');
      console.log('ℹ️  [Seed] Existing admin email:', adminExists.email);
    }
  } catch (error: any) {
    console.error('❌ [Seed] Error seeding database:', error);
    console.error('❌ [Seed] Error message:', error.message);
    console.error('❌ [Seed] Error stack:', error.stack);
    // Don't throw error to prevent server startup failure
  }
};
