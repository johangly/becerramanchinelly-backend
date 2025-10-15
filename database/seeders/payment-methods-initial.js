'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Insertar métodos de pago por defecto
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
  },

  // El método `down` se encarga de eliminar los datos si se necesita
  async down (queryInterface, Sequelize) {
    // Elimina todos los métodos de pago
    await queryInterface.bulkDelete('PaymentsMethods', null, {});
  }
};