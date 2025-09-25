import express from 'express';
import db from '../database/index.js';
import { Op } from 'sequelize';
import { TZDate } from "@date-fns/tz";
import { format, setHours, isSameDay } from 'date-fns';
// Configura Multer para guardar el archivo en memoria.
// Esto es ideal para archivos pequeños como el que describes.
const router = express.Router();

router.use(express.json());

const ZONE = process.env.ZONE_TIME

// Función para convertir tiempo en formato HH:MM:SS a segundos
const timeToSeconds = (timeStr) => {
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  return hours * 3600 + minutes * 60 + (seconds || 0);
};

// Obtener todas las citas de la semana actual (de lunes a sábado)
router.get('/', async (req, res) => {
  try {
    let startDate, endDate;

    // Si se proporcionan fechas en la consulta, usarlas
    if (req.query.startDate && req.query.endDate) {
      startDate = new TZDate(req.query.startDate, ZONE);
      endDate = new TZDate(req.query.endDate, ZONE);

      // Asegurarse de que las fechas sean válidas
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({
          message: 'Formato de fecha inválido. Use YYYY-MM-DD'
        });
      }

      // Establecer la hora a mediodía para evitar problemas de zona horaria
      startDate = setHours(startDate, 0, 0, 0);
      endDate = setHours(endDate, 23, 59, 59); // Fin del día
    } else {
      // Si no se proporcionan fechas, usar la lógica de la semana actual
      const now = new TZDate(new Date(), ZONE);
      const currentDay = now.getDay();
      const diffDays = currentDay === 0 ? 1 : 1 - currentDay;

      startDate = new TZDate(now);
      startDate.setDate(now.getDate() + diffDays);
      startDate = setHours(startDate, 0, 0, 0);

      endDate = new TZDate(startDate);
      endDate.setDate(startDate.getDate() + 5);
      endDate = setHours(endDate, 23, 59, 59);
    }
    // Obtener las citas en el rango de fechas
    const appointments = await db.Appointment.findAll({
      where: {
        day: {
          [Op.gte]: startDate,
          [Op.lte]: endDate
        }
      },
      order: [
        ['day', 'ASC'],
        ['start_time', 'ASC']
      ]
    });

    res.json({
      startDate: startDate,
      endDate: endDate,
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
    const phoneNumber = await db.Appointment.findByPk(req.params.id);
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
    const { day, start_time, end_time, reservation, status,price } = req.body;

    // Validar campos requeridos
    if (!day || !start_time || !end_time) {
      return res.status(400).json({
        status: 'error',
        message: 'Los campos day, start_time y end_time son obligatorios'
      });
    }

    // Crear la fecha de la cita (el día seleccionado a las 00:00:00)
    const appointmentDate = new TZDate(`${day}T12:00:00`, ZONE);

    const newAppointment = await db.Appointment.create({
      day: appointmentDate, // Guardamos la fecha completa
      start_time: start_time,
      end_time: end_time,
      reservation: reservation || null,
      reservation_date: null, // Usamos la misma fecha para reservation_date
      status: status || 'disponible',
      price: price || 0
    });

    res.status(201).json({
      status: 'success',
      newAppointment: newAppointment
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

// Actualizar una cita
router.put('/:id', async (req, res) => {
  try {
    const appointment = await db.Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Cita no encontrada'
      });
    }

    // Validar que la cita no esté eliminada lógicamente
    if (appointment.isDeleted) {
      return res.status(400).json({
        status: 'error',
        message: 'No se puede actualizar una cita eliminada'
      });
    }

    const { day, start_time, end_time, status, price } = req.body;
    const now = new TZDate(new Date(), ZONE);
    const currentTime = now.toTimeString().slice(0, 8); // Formato HH:MM:SS
    const currentDate = now.toISOString().split('T')[0];
    const appointmentDate = day ? new TZDate(day, ZONE).toISOString().split('T')[0] : null;

    // Validaciones de tiempo
    // 1. Validar campos requeridos
    if (!start_time || !end_time) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor completa todos los campos de tiempo'
      });
    }
    if (!price) {
      return res.status(400).json({
        status: 'error',
        message: 'Por favor completa el campo de precio'
      });
    }

    // 2. Validar fecha (si se proporciona)
    if (day) {
      const today = now ? new TZDate(now, ZONE).toISOString().split('T')[0] : null;
      if (appointmentDate < today.internal) {
        return res.status(400).json({
          status: 'error',
          message: 'No se puede programar una cita en una fecha pasada'
        });
      }

      // 3. Si es el día actual, validar hora de inicio vs hora actual
      if (appointmentDate === currentDate) {
        const startTimeSec = timeToSeconds(start_time);
        const currentTimeSec = timeToSeconds(currentTime);

        if (startTimeSec < currentTimeSec) {
          return res.status(400).json({
            status: 'error',
            message: 'La hora de inicio no puede ser menor a la hora actual'
          });
        }
      }
    }

    // 4. Validar que la hora de inicio sea menor que la hora final
    if (start_time && end_time) {
      const startTimeSec = timeToSeconds(start_time);
      const endTimeSec = timeToSeconds(end_time);

      if (startTimeSec > endTimeSec) {
        return res.status(400).json({
          status: 'error',
          message: 'La hora de inicio debe ser anterior a la hora final'
        });
      }
    }
    const dateToSave = new TZDate(`${day}T12:00:00`, ZONE);
    console.log("dateToSave",dateToSave)
    // Actualizar solo los campos permitidos
    const updateData = {};
    if (day) updateData.day = dateToSave;
    if (start_time) updateData.start_time = start_time;
    if (end_time) updateData.end_time = end_time;
    if (status) updateData.status = status;
    if (price) updateData.price = price;

    // Validar que la cita no esté eliminada lógicamente
    if (appointment.isDeleted) {
      return res.status(400).json({
        status: 'error',
        message: 'No se puede actualizar una cita eliminada'
      });
    }

    await appointment.update(updateData);

    res.json({
      status: 'success',
      message: 'Cita actualizada exitosamente',
      data: appointment
    });

  } catch (error) {
    console.error('Error al actualizar la cita:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al actualizar la cita',
      error: error.message
    });
  }
});

// Eliminar un número de teléfono (eliminación lógica)
router.delete('/:id', async (req, res) => {
  try {
    const phoneNumber = await db.Appointment.findByPk(req.params.id);
    if (!phoneNumber) {
      return res.status(404).json({ message: 'Número de teléfono no encontrado' });
    }

    // Actualizar el campo isDeleted a true en lugar de borrar
    await phoneNumber.update({
      isDeleted: true,
      status: 'cancelado' // Opcional: también puedes actualizar el estado si lo deseas
    });

    res.json({
      message: 'Número de teléfono marcado como eliminado exitosamente',
      data: phoneNumber
    });
  } catch (error) {
    console.error('Error al marcar como eliminado el número de teléfono:', error);
    res.status(500).json({
      message: 'Error al marcar como eliminado el número de teléfono',
      error: error.message
    });
  }
});

export default router;
