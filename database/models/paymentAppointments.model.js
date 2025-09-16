export default (sequelize, DataTypes) => {
	const PaymentsAppointments = sequelize.define(
		"PaymentsAppointments",
		{
			appointmentId: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			paymentMethodId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			amount: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: false,
			},
			status: {
				type: DataTypes.ENUM(
					"pendiente",
					"completado",
					"fallido"
				),
				allowNull: false,
			},
			transactionDate: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			reference: {
				type: DataTypes.STRING,
				allowNull: true,
				Comment: "Referencia de la transacción, si aplica",
			},
			client_name: {
				type: DataTypes.STRING,
				allowNull: false,
				Comment: "Nombre del cliente",
			},
			client_email: {
				type: DataTypes.STRING,
				allowNull: false,
				Comment: "Email del cliente",
			},
			client_phone: {
				type: DataTypes.STRING,
				allowNull: true,
				Comment: "Teléfono del cliente",
			},
			notes: {
				type: DataTypes.TEXT,
				allowNull: true,
				Comment: "Notas adicionales sobre el pago",
			},
		},
		{
			tableName: "PaymentsAppointments",
			timestamps: true,
		}
	);

    PaymentsAppointments.associate = function(models) {
        PaymentsAppointments.belongsTo(models.Appointment, {
            foreignKey: 'appointmentId',
            as: 'appointment'
        });
        PaymentsAppointments.belongsTo(models.PaymentsMethods, {
			foreignKey: "paymentMethodId",
			as: "paymentMethod",
		});
    };

	return PaymentsAppointments;
};