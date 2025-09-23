export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cleark_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      comment: 'ID del usuario en Clerk',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Nombre completo del usuario',
    },
    email: {
      type: DataTypes.STRING,
      unique:true,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'user',
      comment: 'Rol del usuario en la aplicación',
    },
  }, {
    tableName: 'users',
    timestamps: true,
  });

  User.associate = (models) => {
    // Relación con notificaciones
    User.hasMany(models.Notification, {
      foreignKey: 'user_id',
      as: 'notifications',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return User;
};
