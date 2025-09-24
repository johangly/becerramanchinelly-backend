'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('notifications', [
      // Notificación de éxito (pago recibido)
      {
        id: 1,
        title: 'Pago Recibido',
        body: 'Se ha recibido un pago por $1,500.00 MXN',
        type: 'success',
        seen: false,
        user_id: 1,
        payment_id: 1,
        createdAt: new Date('2025-09-22T10:30:00'),
        updatedAt: new Date('2025-09-22T10:30:00')
      },
      // Notificación informativa (cita próxima)
      {
        id: 2,
        title: 'Cita Próxima',
        body: 'Tienes una cita programada para mañana a las 10:00 AM con el Dr. Pérez',
        type: 'info',
        seen: false,
        user_id: 1,
        payment_id: null,
        createdAt: new Date('2025-09-22T09:15:00'),
        updatedAt: new Date('2025-09-22T09:15:00')
      },
      // Notificación de advertencia (recordatorio de pago)
      {
        id: 3,
        title: 'Recordatorio de Pago',
        body: 'Recuerda realizar el pago de tu próxima cita antes del 25 de Septiembre',
        type: 'warning',
        seen: true,
        user_id: 1,
        payment_id: 1,
        createdAt: new Date('2025-09-21T16:45:00'),
        updatedAt: new Date('2025-09-21T16:45:00')
      },
      // Notificación de error (pago fallido)
      {
        id: 4,
        title: 'Pago Fallido',
        body: 'Hubo un error al procesar tu pago. Por favor, verifica los datos de tu tarjeta',
        type: 'error',
        seen: false,
        user_id: 1,
        payment_id: 1,
        createdAt: new Date('2025-09-21T14:20:00'),
        updatedAt: new Date('2025-09-21T14:20:00')
      },
      // Otro tipo de notificación
      {
        id: 5,
        title: 'Nuevo Mensaje',
        body: 'Tienes un nuevo mensaje en el sistema. Por favor, revisa tu bandeja de entrada',
        type: 'other',
        seen: true,
        user_id: 1,
        payment_id: null,
        createdAt: new Date('2025-09-20T18:30:00'),
        updatedAt: new Date('2025-09-20T18:30:00')
      },
      // Notificación de confirmación
      {
        id: 6,
        title: 'Cita Confirmada',
        body: 'Tu cita para el 25 de Septiembre a las 15:00 ha sido confirmada exitosamente',
        type: 'success',
        seen: false,
        user_id: 1,
        payment_id: null,
        createdAt: new Date('2025-09-20T11:10:00'),
        updatedAt: new Date('2025-09-20T11:10:00')
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('notifications', null, {});
  }
};
