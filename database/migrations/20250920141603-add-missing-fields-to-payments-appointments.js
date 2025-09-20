'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Añadir la columna user_id
    await queryInterface.addColumn('PaymentsAppointments', 'user_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Añadir la columna currency
    await queryInterface.addColumn('PaymentsAppointments', 'currency', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // Añadir la columna is_approved
    await queryInterface.addColumn('PaymentsAppointments', 'is_approved', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    });

    // Cambiar la columna appointment_id para que no sea nula
    // Ten en cuenta que esto podría fallar si ya hay filas con valores nulos
    await queryInterface.addColumn('PaymentsAppointments', 'appointment_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'appointments',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // Eliminar las columnas añadidas
    await queryInterface.removeColumn('PaymentsAppointments', 'user_id');
    await queryInterface.removeColumn('PaymentsAppointments', 'currency');
    await queryInterface.removeColumn('PaymentsAppointments', 'is_approved');

    // Revertir el cambio de 'appointment_id' a nulo
    await queryInterface.removeColumn('PaymentsAppointments', 'appointment_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  }
};
