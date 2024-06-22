const Sequelize = require("sequelize");
const { Model, DataTypes, Op } = require("sequelize");
const sequelize = new Sequelize("t6_6958", "root", "", {
	host: "localhost",
	dialect: "mysql",
	logging: false,
});

class Class extends Model {}

Class.init(
	{
		id_class: {
			type: DataTypes.STRING(4),
			primaryKey: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
    id_teacher: {
      type: DataTypes.STRING(4),
      allowNull: false,
    }
	},
	{
		sequelize,
		timestamps: false,
		modelName: "Class",
		tableName: "classes",
	}
);

module.exports = Class;