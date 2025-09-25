export default (sequelize, DataTypes) => {

  const Configuration = sequelize.define('Configuration', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },

    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Nombre único para la configuración',
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'El valor de la configuración, ej: "true", "email", "both"',
    },
    description: {
      type: DataTypes.TEXT,
      comment: 'Explicación de lo que hace la configuración para el administrador',
    }
  }, {
    tableName: 'Configurations',
    timestamps: true,
    comment: 'Tabla de configuraciones del sistema'
  });

  return Configuration;
};
