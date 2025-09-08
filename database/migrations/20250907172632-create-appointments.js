'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('appointments', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      day: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      start_time: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      end_time: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      reservation: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'ID de la reserva del usuario proporcionado por clerk',
      },
      reservation_date: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: 'Fecha de la reserva',
      },
      status: {
        type: Sequelize.ENUM('disponible', 'reservado', 'completado'),
        allowNull: false,
        comment: 'Estado de la reserva',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('appointments');
  }
};
