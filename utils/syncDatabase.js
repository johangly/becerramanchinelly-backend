import definePaymentsAppointments from '../database/models/paymentAppointments.model.js'; // Importa la función que define el modelo
import { Sequelize } from 'sequelize';
import _config from '../database/config/config.js';

const env = process.env.NODE_ENV || 'development';
const currentEnvConfig = _config[env];
let sequelize;

sequelize = new Sequelize(currentEnvConfig.database, currentEnvConfig.username, currentEnvConfig.password, {
  host: currentEnvConfig.host,
  port: parseInt(currentEnvConfig.port, 10),
  dialect: 'mysql',
  timezone: '-04:00',
});
const PaymentsAppointments = definePaymentsAppointments(sequelize);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos exitosa.');

    // Sincronizar el modelo con la base de datos
    await PaymentsAppointments.sync({ alter: true }); // Usa { force: true } para recrear la tabla
    console.log('Tabla sincronizada con éxito.');
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
  } finally {
    await sequelize.close();
  }
})();