import { createApp } from './app';
import { env } from './config/env';
import { syncDatabase } from './db/sync';
import { sequelize } from './models';

async function main(): Promise<void> {
  await syncDatabase();

  const server = createApp().listen(env.PORT, () => {
    console.log(`Quiz Builder API listening on http://localhost:${env.PORT}`);
  });

  const shutdown = (signal: string) => {
    console.log(`${signal} received, shutting down...`);
    server.close(() => {
      sequelize.close().finally(() => process.exit(0));
    });
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
