'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Modificar la columna payment_method_id para agregar las referencias
    await queryInterface.addColumn('PaymentsAppointments', 'payment_method_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      references: {
        model: 'PaymentsMethods',
        key: 'id'
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('PaymentsAppointments', 'payment_method_id');
  }
};
