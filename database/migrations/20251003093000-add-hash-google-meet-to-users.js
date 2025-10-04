'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'hash_google_meet', {
      type: Sequelize.STRING(512),
      allowNull: true,
      comment: 'Hash para autenticación con Google Meet'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'hash_google_meet');
  }
};
