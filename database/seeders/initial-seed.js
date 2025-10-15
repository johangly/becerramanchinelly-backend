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

    await queryInterface.bulkInsert('PaymentsMethods', [{
      name: 'Stripe',
      description: 'Pago con tarjeta de crédito/débito a través de Stripe',
      is_active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'PayPal',
      description: 'Pago a través de la plataforma PayPal',
      is_active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Pago Externo',
      description: 'Pago realizado fuera de la plataforma (efectivo, transferencia, etc.)',
      is_active: true,
      createdAt: new Date(),
      updatedAt: new Date()
      }], {});
    
    await queryInterface.bulkInsert('Configurations', [
      {
        key: 'currency',
        value: 'USD',
        description: 'Moneda por defecto de la plataforma',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'phone',
        value: '+1-234-567-890',
        description: 'Número de teléfono de contacto',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'priceAppointment',
        value: '20.00',
        description: 'Precio por defecto de las citas',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});

    // Asegurarse de que solo una moneda sea la predeterminada
    // Esto se manejará en la lógica de la aplicación o con un trigger
  },

  

  async down(queryInterface, Sequelize) {
    // Eliminar todas las monedas
    await queryInterface.bulkDelete('Currencies', null, {});
    await queryInterface.bulkDelete('Configurations', null, {});
    await queryInterface.bulkDelete('PaymentsMethods', null, {});
  }
};
