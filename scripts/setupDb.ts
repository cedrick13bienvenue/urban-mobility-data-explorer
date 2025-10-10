import { connectDatabase } from '../src/config/database';
import sequelize from '../src/config/database';

async function setupDatabase() {
  try {
    await connectDatabase();
    await sequelize.sync({ alter: false });
    console.log('✓ Database setup complete');
    process.exit(0);
  } catch (error) {
    console.error('✗ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();