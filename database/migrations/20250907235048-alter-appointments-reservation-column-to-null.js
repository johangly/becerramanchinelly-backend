// migrations/XXXXXXXXXXXXXX-modify-appointments-allow-null-reservation.js
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('appointments', 'reservation_date', {
      type: Sequelize.DATE,
      allowNull: true, // Cambiado de false a true
      comment: 'Fecha en que se realizo la reservacion',
    });
  },

  async down(queryInterface, Sequelize) {
    // Revertir el cambio (opcional, solo si necesitas rollback)
    await queryInterface.changeColumn('appointments', 'reservation_date', {
      type: Sequelize.DATE,
      allowNull: false, // Volver al estado original
      comment: 'Fecha en que se realizo la reservacion',
    });
  }
};
