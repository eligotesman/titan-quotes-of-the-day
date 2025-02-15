import cors from 'cors';
import express from 'express';
import routes from './routes';

import { CONFIG } from './config';
import { dbService } from './services/db.service';

const app = express();
const PORT = CONFIG.PORT;

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await dbService.close();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});