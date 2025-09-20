'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Elimina la columna 'appointmentId' de la tabla 'PaymentsAppointments'
    await queryInterface.removeColumn('PaymentsAppointments', 'appointmentId');
  },

  async down(queryInterface, Sequelize) {
    // Reversión: Añade la columna 'appointmentId' de nuevo
    await queryInterface.addColumn('PaymentsAppointments', 'appointmentId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Appointments',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  }
};
