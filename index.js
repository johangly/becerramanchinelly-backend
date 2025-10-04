import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import logger from './utils/logger.js';
import db from './database/index.js';
import appointmentsRoutes from './routes/appointments.routes.js';
import paymentsRoutes from './routes/payments.routes.js';
import manualPaymentsRoutes from './routes/manualPaymentsAppointments.routes.js';
import path from 'path';
import currenciesRoutes from './routes/currencies.routes.js';
import usersRoutes from './routes/users.routes.js';
import configRoutes from './routes/config.routes.js';
import paymentsMethodsRoutes from './routes/paymentsMethods.routes.js';
import paymentStripeRoutes from './routes/paymentStripe.routes.js';
import notificationsRoutes from './routes/notifications.routes.js';
import meettingsRoutes from './routes/mettings.routes.js';
import generateLinkRoutes from './routes/generateLink.routes.js';
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use
const uploadsDir = path.join(process.cwd(), 'uploads');

app.use('/uploads', express.static(uploadsDir,{
   setHeaders: (res, path) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Content-Security-Policy', "img-src * data:;");
  }
}));
const API_PREFIX = process.env.API_PREFIX || '/api';

// Este endpoint no debe ir despues de express.json()
app.use(`${API_PREFIX}/users`, usersRoutes);

app.use(express.json());
app.use(`${API_PREFIX}/appointments`, appointmentsRoutes);
app.use(`${API_PREFIX}/payments`, paymentsRoutes);
app.use(`${API_PREFIX}/manual-payments`, manualPaymentsRoutes);
app.use(`${API_PREFIX}/currencies`, currenciesRoutes);
app.use(`${API_PREFIX}/config`, configRoutes);
app.use(`${API_PREFIX}/payment-methods`, paymentsMethodsRoutes);
app.use(`${API_PREFIX}/payment-stripe`,paymentStripeRoutes);
app.use(`${API_PREFIX}/notifications`, notificationsRoutes);
app.use(`${API_PREFIX}/meetings`, meettingsRoutes);
app.use(`${API_PREFIX}/generate-link`, generateLinkRoutes);
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

