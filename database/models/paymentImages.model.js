import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  const PaymentImage = sequelize.define('PaymentImages', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    payment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Pago asociado a esta imagen',
    },
    file_path: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Ruta o URL donde está almacenada la imagen',
    },
    file_name: {
      type: DataTypes.STRING,
      comment: 'Nombre original del archivo',
    },
    uploaded_by: {
      type: DataTypes.INTEGER,
      comment: 'Usuario que subió la imagen',
    },
    uploaded_at: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Fecha y hora de la subida',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Permite desactivar/ocultar imágenes sin borrarlas',
    },
  }, {
    tableName: 'paymentImages',
    timestamps: true,
  });

  PaymentImage.associate = (models) => {
    // Relación con PaymentsAppointments
    PaymentImage.belongsTo(models.PaymentsAppointments, {
      foreignKey: 'payment_id',
      as: 'PaymentAppointment',
    });

    // Relación con User
    PaymentImage.belongsTo(models.User, {
      foreignKey: 'uploaded_by',
      as: 'User',
    });
  };

  return PaymentImage;
};
