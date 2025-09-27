'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('notifications', 'modalBody', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Contenido adicional para mostrar en un modal'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('notifications', 'modalBody');
  }
};
