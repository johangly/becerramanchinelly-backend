export default (sequelize, DataTypes) => {
	const PaymentsMethods = sequelize.define(
		"PaymentsMethods",
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			name:{
				type: DataTypes.STRING,
				allowNull: false,
            },
			description: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			is_active: {
				type: DataTypes.BOOLEAN,
			},
			createdAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
		},
		{
			tableName: "PaymentsMethods",
			timestamps: true,
		}
	);
    PaymentsMethods.associate = function(models) {
        PaymentsMethods.hasMany(models.PaymentsAppointments, {
            foreignKey: 'paymentMethodId',
            as: 'paymentAppointments'
        });
    };
    
	return PaymentsMethods;
};