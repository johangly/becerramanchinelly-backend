export default {
  async up(queryInterface, Sequelize) {
    // Cambiar el tipo de 'day' de STRING a DATE
    await queryInterface.changeColumn('appointments', 'status', {
      type: Sequelize.ENUM('disponible', 'reservado', 'completado', 'cancelado'),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revertir los cambios (para rollback)
    await queryInterface.changeColumn('appointments', 'status', {
      type: Sequelize.ENUM('disponible', 'reservado', 'completado'),
      allowNull: false,
    });
  }
};
