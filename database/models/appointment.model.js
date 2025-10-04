export default (sequelize, DataTypes) => {
  const Appointment = sequelize.define('Appointment', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    day: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    reservation: {
      type: DataTypes.INTEGER,
      allowNull: true,
      Comment: 'ID de la reserva del usuario proporcionado por clerk, al momento de crearse es 0 o null'
    },
    reservation_date: {
      type: DataTypes.DATE,
      allowNull: true,
      Comment: 'Fecha de la reserva'
    },
    status: {
      type: DataTypes.ENUM('disponible', 'reservado', 'completado', 'cancelado'),
      allowNull: false,
      Comment: 'Estado de la reserva'
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      Comment: '0 = activo, 1 = eliminado (soft delete)'
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Precio de la cita'
    },
    currency_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID de la moneda en la que se cobrará la cita',
      references: {
        model: 'Currencies',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    meetingPlatformId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'MeetingPlatforms',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      comment: 'ID de la plataforma de reunión (Zoom, Meet, etc.)'
    },
    meeting_link: {
      type: DataTypes.STRING(512),
      allowNull: true,
      comment: 'Enlace a la reunión (Zoom, Meet, Teams, etc.)'
    },
  }, {
    tableName: 'appointments',
    timestamps: true,
  });

  Appointment.associate = function(models) {
    Appointment.hasMany(models.PaymentsAppointments, {
      foreignKey: 'appointment_id',
      as: 'PaymentAppointments',
    });

    // Relación con Currency
    Appointment.belongsTo(models.Currency, {
      foreignKey: 'currency_id',
      as: 'currency',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    // Relación con MeetingPlatform
    Appointment.belongsTo(models.MeetingPlatforms, {
      foreignKey: 'meetingPlatformId',
      as: 'meetingPlatform',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  };

  return Appointment;
}

