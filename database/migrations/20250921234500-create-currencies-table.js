'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Currencies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.STRING(3),
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      symbol: {
        type: Sequelize.STRING(5),
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      decimal_places: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 2
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Agregar índices para mejorar el rendimiento
    await queryInterface.addIndex('Currencies', ['code'], { unique: true });
    await queryInterface.addIndex('Currencies', ['is_active']);
    await queryInterface.addIndex('Currencies', ['is_default']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Currencies');
  }
};
