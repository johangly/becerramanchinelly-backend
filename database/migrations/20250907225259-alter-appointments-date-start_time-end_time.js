export default {
  async up(queryInterface, Sequelize) {
    // Cambiar el tipo de 'day' de STRING a DATE
    await queryInterface.changeColumn('appointments', 'day', {
      type: Sequelize.DATE,
      allowNull: false,
    });

    // Cambiar el tipo de 'start_time' de STRING a TIME
    await queryInterface.changeColumn('appointments', 'start_time', {
      type: Sequelize.TIME,
      allowNull: false,
    });

    // Cambiar el tipo de 'end_time' de STRING a TIME
    await queryInterface.changeColumn('appointments', 'end_time', {
      type: Sequelize.TIME,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revertir los cambios (para rollback)
    await queryInterface.changeColumn('appointments', 'day', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('appointments', 'start_time', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('appointments', 'end_time', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};
