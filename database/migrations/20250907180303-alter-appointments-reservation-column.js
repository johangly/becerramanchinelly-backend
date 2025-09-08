// migrations/XXXXXXXXXXXXXX-modify-appointments-allow-null-reservation.js
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('appointments', 'reservation', {
      type: Sequelize.INTEGER,
      allowNull: true, // Cambiado de false a true
      comment: 'ID de la reserva del usuario proporcionado por clerk, al momento de crearse es 0 o null',
    });
  },

  async down(queryInterface, Sequelize) {
    // Revertir el cambio (opcional, solo si necesitas rollback)
    await queryInterface.changeColumn('appointments', 'reservation', {
      type: Sequelize.INTEGER,
      allowNull: false, // Volver al estado original
      comment: 'ID de la reserva del usuario proporcionado por clerk',
    });
  }
};
