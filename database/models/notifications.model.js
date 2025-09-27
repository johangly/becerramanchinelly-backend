export default (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    body: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.ENUM('success', 'error', 'warning', 'info', 'other'),
      allowNull: false,
      defaultValue: 'Other',
    },
    seen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    payment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    modalBody: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Contenido adicional para mostrar en un modal'
    },
  }, {
    tableName: 'notifications',
    timestamps: true,
  });

  Notification.associate = (models) => {
    // Notification.belongsTo(models.User, {
    //   foreignKey: 'user_id',
    //   as: 'user',
    // });
    Notification.belongsTo(models.PaymentsAppointments, {
      foreignKey: 'id',
      as: 'PaymentsAppointments',
    });
  };

  return Notification;
};
