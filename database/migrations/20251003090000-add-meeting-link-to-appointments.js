'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('appointments', 'meeting_link', {
      type: Sequelize.STRING(512),
      allowNull: true,
      comment: 'Enlace a la reunión (Zoom, Meet, Teams, etc.)'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('appointments', 'meeting_link');
  }
};
