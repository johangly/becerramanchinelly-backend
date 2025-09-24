'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Modificar la columna 'name' para permitir valores nulos
    await queryInterface.changeColumn('users', 'name', {
      type: Sequelize.STRING,
      allowNull: true // Cambiado de false a true
    });

    // Asegurarse de que la columna 'role' permita valores nulos (por si acaso)
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Corregir el tipo de datos de cleark_id a STRING si es necesario
    await queryInterface.changeColumn('users', 'cleark_id', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    });
  },

  async down(queryInterface, Sequelize) {
    // Revertir los cambios si es necesario
    await queryInterface.changeColumn('users', 'name', {
      type: Sequelize.STRING,
      allowNull: false
    });

    // No es necesario revertir role ya que por defecto permitía null
    
    // Revertir cleark_id a INTEGER si es necesario
    await queryInterface.changeColumn('users', 'cleark_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      unique: true
    });
  }
};
