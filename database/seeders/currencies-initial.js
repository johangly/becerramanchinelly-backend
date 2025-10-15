'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Insertar monedas por defecto
    await queryInterface.bulkInsert('Currencies', [
      {
        code: 'MXN',
        name: 'Peso Mexicano',
        symbol: '$',
        is_active: true,
        decimal_places: 2,
        is_default: true, // Moneda por defecto
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'USD',
        name: 'Dólar Estadounidense',
        symbol: 'US$',
        is_active: true,
        decimal_places: 2,
        is_default: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'EUR',
        name: 'Euro',
        symbol: '€',
        is_active: true,
        decimal_places: 2,
        is_default: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // Asegurarse de que solo una moneda sea la predeterminada
    // Esto se manejará en la lógica de la aplicación o con un trigger
  },

  async down(queryInterface, Sequelize) {
    // Eliminar todas las monedas
    await queryInterface.bulkDelete('Currencies', null, {});
  }
};
