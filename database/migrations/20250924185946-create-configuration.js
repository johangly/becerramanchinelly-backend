'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Configurations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      key: {
        type: Sequelize.STRING
      },
      value: {
        type: Sequelize.TEXT
      },
      description: {
        type: Sequelize.TEXT
      },
      
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Configurations');
  }
};