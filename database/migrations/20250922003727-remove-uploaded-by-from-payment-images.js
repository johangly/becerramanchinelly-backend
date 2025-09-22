'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Eliminar la columna uploaded_by
    await queryInterface.removeColumn('paymentImages', 'uploaded_by');
  },

  async down(queryInterface, Sequelize) {
    // Para revertir la migración, volver a agregar la columna
    await queryInterface.addColumn('paymentImages', 'uploaded_by', {
      type: Sequelize.INTEGER,
      comment: 'Usuario que subió la imagen',
      allowNull: true
    });
  }
};