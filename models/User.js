const Sequelize = require("sequelize");
const { Model, DataTypes, Op } = require("sequelize");
const sequelize = new Sequelize("t6_6958", "root", "", {
	host: "localhost",
	dialect: "mysql",
	logging: false,
});

class User extends Model {}

User.init(
	{
		id_user: {
			type: DataTypes.STRING(4),
			primaryKey: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(1),
      allowNull: false
    }
	},
	{
		sequelize,
		timestamps: false,
		modelName: "User",
		tableName: "users",
	}
);

module.exports = User;