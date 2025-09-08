import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import logger from './utils/logger.js';
import db from './database/index.js';
import appointmentsRoutes from './routes/appointments.routes.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const API_PREFIX = process.env.API_PREFIX || '/api';

// Endpoint para enviar mensajes
app.use(`${API_PREFIX}/appointments`, appointmentsRoutes);

// Endpoint para verificar conexión
app.get(`${API_PREFIX}/`, (req, res) => {
  res.json({ message: 'Bienvenido a la API' });
});

// Start server
const PORT = process.env.PORT || 3000;

db.sequelize.authenticate().then(() => {
  db.initialize();
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  logger.error('Database connection error:', err);
});

