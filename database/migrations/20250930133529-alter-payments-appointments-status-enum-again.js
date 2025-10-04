'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Usamos una consulta SQL directa para modificar el ENUM, que es más confiable en MySQL.
    await queryInterface.sequelize.query(
      "ALTER TABLE `PaymentsAppointments` MODIFY COLUMN `status` ENUM('pendiente', 'completado', 'fallido', 'reembolso', 'reembolsado') NOT NULL;"
    );
  },

  async down(queryInterface, Sequelize) {
    // Revertimos al estado anterior conocido.
    await queryInterface.sequelize.query(
      "ALTER TABLE `PaymentsAppointments` MODIFY COLUMN `status` ENUM('pendiente', 'completado', 'fallido', 'refund') NOT NULL;"
    );
  },
};