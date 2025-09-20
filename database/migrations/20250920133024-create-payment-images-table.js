'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('paymentImages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      payment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'PaymentsAppointments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Pago asociado a esta imagen'
      },
      file_path: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Ruta o URL donde está almacenada la imagen'
      },
      file_name: {
        type: Sequelize.STRING,
        comment: 'Nombre original del archivo'
      },
      uploaded_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'Usuario que subió la imagen'
      },
      uploaded_at: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: 'Fecha y hora de la subida'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Permite desactivar/ocultar imágenes sin borrarlas'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('paymentImages');
  }
};
