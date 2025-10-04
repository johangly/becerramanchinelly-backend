'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('appointments', 'meetingPlatformId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'MeetingPlatforms',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('appointments', 'meetingPlatformId');
  }
};
