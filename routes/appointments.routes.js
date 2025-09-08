import express from 'express';
import db from '../database/index.js';
import { Op } from 'sequelize';
// Configura Multer para guardar el archivo en memoria.
// Esto es ideal para archivos pequeños como el que describes.
const router = express.Router();

router.use(express.json());

// Obtener todas las citas de la semana actual (de lunes a sábado)
router.get('/', async (req, res) => {
  try {
    // Obtener la fecha actual
    const now = new Date();
    
    // Obtener el día de la semana (0 = domingo, 1 = lunes, ..., 6 = sábado)
    const currentDay = now.getDay();
    
    // Calcular la diferencia de días hasta el próximo lunes
    // Si es domingo (0), sumamos 1 día para llegar al lunes de la próxima semana
    // Si es otro día, calculamos cuántos días faltan para el próximo lunes
    const diffDays = currentDay === 0 ? 1 : 8 - currentDay;
    
    // Crear fecha de inicio (lunes de la semana actual a mediodía)
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffDays);
    monday.setHours(12, 0, 0, 0); // Mediodía (12:00:00) para evitar problemas de zona horaria
    
    // Crear fecha de fin (sábado de la semana actual a mediodía)
    const saturday = new Date(monday);
    saturday.setDate(monday.getDate() + 5); // 5 días después del lunes es sábado
    saturday.setHours(12, 0, 0, 0); // Mediodía (12:00:00) para evitar problemas de zona horaria

    // Obtener las citas de la semana actual (de lunes a sábado)
    const appointments = await db.Appointment.findAll({
      where: {
        day: {
          [Op.gte]: monday,  // Mayor o igual al lunes
          [Op.lte]: saturday // Menor o igual al sábado
        }
      },
      order: [
        ['day', 'ASC'],
        ['start_time', 'ASC']
      ]
    });

    res.json({
        startDate: monday,
        endDate: saturday,
        appointments: appointments
    });

  } catch (error) {
    console.error('Error al obtener las citas:', error);
    res.status(500).json({ 
      message: 'Error al obtener las citas',
      error: error.message 
    });
  }
});

// Obtener un número de teléfono por ID
router.get('/:id', async (req, res) => {
  try {
    const phoneNumber = await db.PhoneNumbers.findByPk(req.params.id);
    if (!phoneNumber) {
      return res.status(404).json({
        status: 'error',
        message: 'Número de teléfono no encontrado' });
    }
    res.json({
      status: 'success',
      phoneNumber: phoneNumber
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: 'Error al obtener el número de teléfono' });
  }
});

// Crear una nueva cita
router.post('/', async (req, res) => {
  try {
    const { day, start_time, end_time, reservation, status } = req.body;
    
    // Validar campos requeridos
    if (!day || !start_time || !end_time) {
      return res.status(400).json({
        status: 'error',
        message: 'Los campos day, start_time y end_time son obligatorios'
      });
    }

    // Crear la fecha de la cita (el día seleccionado a las 00:00:00)
    const appointmentDate = new Date(day);
    
    const newAppointment = await db.Appointment.create({
      day: appointmentDate, // Guardamos la fecha completa
      start_time: start_time,
      end_time: end_time,
      reservation: reservation || null,
      reservation_date: null, // Usamos la misma fecha para reservation_date
      status: status || 'disponible'
    });

    res.status(201).json({
      status: 'success',
      data: newAppointment
    });
  } catch (error) {
    console.error('Error al crear la cita:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Error al crear la cita',
      error: error.message 
    });
  }
});

// Actualizar un número de teléfono
router.put('/:id', async (req, res) => {
  try {
    const phoneNumber = await db.PhoneNumbers.findByPk(req.params.id);
    if (!phoneNumber) {
      return res.status(404).json({ message: 'Número de teléfono no encontrado' });
    }

    const { phoneNumber: newPhoneNumber, status } = req.body;
    await phoneNumber.update({
      phoneNumber: newPhoneNumber,
      status: status || phoneNumber.status
    });
    res.json(phoneNumber);
  } catch (error) {
    console.log('error al actualizar numero de telefono', error);
    res.status(500).json({ message: 'Error al actualizar el número de teléfono' });
  }
});

// Eliminar un número de teléfono
router.delete('/:id', async (req, res) => {
  try {
    const phoneNumber = await db.PhoneNumbers.findByPk(req.params.id);
    if (!phoneNumber) {
      return res.status(404).json({ message: 'Número de teléfono no encontrado' });
    }
    await phoneNumber.destroy();
    res.json({ message: 'Número de teléfono eliminado exitosamente' });
  } catch (error) {
    console.log('error al eliminar numero de telefono', error);
    res.status(500).json({ message: 'Error al eliminar el número de teléfono' });
  }
});

export default router;
