import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const CONFIG = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  FAVQS_API_KEY: process.env.FAVQS_API_KEY || '',
  PORT: process.env.PORT || 3000,
  MAX_QUOTES_COUNT: 50,
  QUOTES_PER_PAGE: 25,
  RATE_LIMIT_INTERVAL_MS: 20000,
  RATE_LIMIT_MAX_REQUESTS: 30,
};
