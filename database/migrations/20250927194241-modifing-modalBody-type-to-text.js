// Crear un nuevo archivo de migración
// Ejemplo: YYYYMMDDHHmmss-change-modalbody-to-text.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('notifications', 'modalBody', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Contenido adicional para mostrar en un modal'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('notifications', 'modalBody', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};