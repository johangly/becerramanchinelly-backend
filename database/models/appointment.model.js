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
    }
  }, {
    tableName: 'appointments',
    timestamps: true,
  });

  Appointment.associate = function(models) {
    Appointment.hasMany(models.PaymentsAppointments, {
      foreignKey: 'id',
      as: 'PaymentAppointments',
    });
  };

  return Appointment;
}

