export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cleark_id: {
      type: DataTypes.INTEGER,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'users',
    timestamps: true,
  });

  User.associate = (models) => {
    // Aquí puedes definir las asociaciones. Por ejemplo:
    User.hasMany(models.Notification, {
      foreignKey: 'user_id',
      as: 'Notifications',
    });
  };

  return User;
};
