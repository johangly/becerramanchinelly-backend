'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Cambiar el tipo de la columna cleark_id a STRING
    await queryInterface.changeColumn('users', 'cleark_id', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false // Ajusta según sea necesario
    });
  },

  async down(queryInterface, Sequelize) {
    // Revertir el cambio volviendo a INTEGER
    await queryInterface.changeColumn('users', 'cleark_id', {
      type: Sequelize.INTEGER,
      unique: true,
      allowNull: true // Ajusta según sea necesario
    });
  }
};