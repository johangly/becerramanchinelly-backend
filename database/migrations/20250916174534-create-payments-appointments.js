'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PaymentsAppointments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      appointmentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      paymentMethodId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pendiente', 'completado', 'fallido'),
        allowNull: false,
      },
      transactionDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      reference: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      client_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      client_email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      client_phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('PaymentsAppointments');
  }
};
