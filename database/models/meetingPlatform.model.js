import { DataTypes } from "sequelize";

export default (sequelize) => {
	const MeetingPlatform = sequelize.define(
		"MeetingPlatforms",
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			description: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			is_active: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true,
			},
		},
		{
			tableName: "MeetingPlatforms",
			timestamps: true,
		}
	);
	return MeetingPlatform;
};
