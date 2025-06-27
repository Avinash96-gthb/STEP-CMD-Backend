import express from 'express';
import router from './routes';
import { errorHandler } from './utils/errorHandler';
import { connectDB } from './config/database';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import { seedIfNeeded } from './scripts/seed';
import cors from './utils/cors';

const app = express();

app.use(cors);
app.use(express.json());
app.use(router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();
    await seedIfNeeded();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
}

startServer();

export default app;