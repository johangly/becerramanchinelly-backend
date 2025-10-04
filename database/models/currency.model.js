export default (sequelize, DataTypes) => {
  const Currency = sequelize.define('Currency', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(3),
      allowNull: false,
      unique: true,
      comment: 'Código de moneda ISO 4217 (ej: MXN, USD, EUR)'
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Nombre completo de la moneda (ej: Peso Mexicano, Dólar Americano, Euro)'
    },
    symbol: {
      type: DataTypes.STRING(5),
      allowNull: true,
      comment: 'Símbolo de la moneda (ej: $, €, £)'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Indica si la moneda está activa en el sistema'
    },
    decimal_places: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
      comment: 'Número de decimales que utiliza la moneda'
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Indica si es la moneda por defecto del sistema'
    }
  }, {
    tableName: 'Currencies',
    timestamps: true,
    comment: 'Tabla de monedas soportadas por el sistema'
  });

  // Relaciones con otros modelos
  Currency.associate = function(models) {
    // Una moneda puede estar en múltiples citas
    Currency.hasMany(models.Appointment, {
      foreignKey: 'currency_id',
      as: 'appointments',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  };

  return Currency;
};
