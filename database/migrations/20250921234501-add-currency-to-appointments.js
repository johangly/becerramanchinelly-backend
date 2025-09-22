'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Agregar la columna currency_id a la tabla appointments
    await queryInterface.addColumn('appointments', 'currency_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'ID de la moneda en la que se cobrará la cita',
      references: {
        model: 'Currencies',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Crear un índice para mejorar el rendimiento de las consultas
    await queryInterface.addIndex('appointments', ['currency_id']);
  },

  async down(queryInterface, Sequelize) {
    // Eliminar el índice
    await queryInterface.removeIndex('appointments', ['currency_id']);
    
    // Eliminar la columna currency_id
    await queryInterface.removeColumn('appointments', 'currency_id');
  }
};
