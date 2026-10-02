import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { quizRouter } from './modules/quizzes/quiz.routes';

// Outside production, accept any local port: `next dev` moves to 3001+ when 3000 is busy.
const LOCALHOST_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

function allowedOrigins(): (string | RegExp)[] {
  const configured = env.CORS_ORIGIN.split(',').map((origin) => origin.trim());
  return env.NODE_ENV === 'production' ? configured : [...configured, LOCALHOST_ORIGIN];
}

export function createApp(): Express {
  const app = express();

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cors({ origin: allowedOrigins() }));
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });
  app.use('/quizzes', quizRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
