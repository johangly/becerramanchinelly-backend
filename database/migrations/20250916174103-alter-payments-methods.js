'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Eliminar las columnas 'amount' y 'currency'
    await queryInterface.removeColumn('PaymentsMethods', 'amount');
    await queryInterface.removeColumn('PaymentsMethods', 'currency');

    // Añadir la columna 'name'
    await queryInterface.addColumn('PaymentsMethods', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Modificar la columna 'description' para que no sea nula
    await queryInterface.changeColumn('PaymentsMethods', 'description', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revertir la modificación de la columna 'description' a nula
    await queryInterface.changeColumn('PaymentsMethods', 'description', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Eliminar la columna 'name'
    await queryInterface.removeColumn('PaymentsMethods', 'name');

    // Añadir de nuevo las columnas 'amount' y 'currency'
    await queryInterface.addColumn('PaymentsMethods', 'amount', {
      type: Sequelize.DECIMAL,
    });
    await queryInterface.addColumn('PaymentsMethods', 'currency', {
      type: Sequelize.STRING,
    });
  }
};
