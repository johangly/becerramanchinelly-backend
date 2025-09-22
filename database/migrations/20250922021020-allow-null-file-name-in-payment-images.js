'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('paymentImages', 'file_name', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Nombre original del archivo'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('paymentImages', 'file_name', {
      type: Sequelize.STRING,
      allowNull: false,
      comment: 'Nombre original del archivo'
    });
  }
};