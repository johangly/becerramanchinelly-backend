'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('appointments', 'price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true, // Puedes cambiar a false si el precio es obligatorio
      comment: 'Precio de la cita',
      after: 'status' // Opcional: coloca el campo después de la columna 'status'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('appointments', 'price');
  }
};
