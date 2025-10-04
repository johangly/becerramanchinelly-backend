import { DataTypes } from 'sequelize';

export default (sequelize) => {
	const PaymentsAppointments = sequelize.define(
		'PaymentsAppointments',
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: 'users',
					key: 'id',
				},
			},
			appointment_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'appointments',
					key: 'id',
				},
			},
			paymentMethodId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'PaymentsMethods',
					key: 'id',
				},
			},
			amount: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: false,
			},
			status: {
				type: DataTypes.ENUM('pendiente', 'completado', 'fallido', 'refund', 'refunded'),
				allowNull: false,
			},
			currency: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			transactionDate: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			reference: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			client_name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			client_email: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			client_phone: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			notes: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			is_approved: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: false,
			},
		},
		{
			tableName: 'PaymentsAppointments',
			timestamps: true,
		}
	);

	PaymentsAppointments.associate = function (models) {
		PaymentsAppointments.belongsTo(models.User, {
			foreignKey: 'user_id',
			as: 'User',
		});
		PaymentsAppointments.belongsTo(models.Appointment, {
			foreignKey: 'appointment_id',
			as: 'Appointment',
		});
		PaymentsAppointments.belongsTo(models.PaymentsMethods, {
			foreignKey: 'payment_method_id',
			as: 'PaymentMethod',
		});
	};

	return PaymentsAppointments;
};
