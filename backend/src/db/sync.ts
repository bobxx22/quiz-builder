import { sequelize } from '../models';

/** Creates tables if they don't exist yet. */
export async function syncDatabase(): Promise<void> {
  await sequelize.authenticate();
  await sequelize.sync();
}

// Allow running directly: `npm run db:sync`
if (require.main === module) {
  syncDatabase()
    .then(() => {
      console.log('Database is ready.');
      return sequelize.close();
    })
    .catch((error) => {
      console.error('Database sync failed:', error);
      process.exit(1);
    });
}
