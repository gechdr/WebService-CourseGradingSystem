const Sequelize = require("sequelize");
const { Model, DataTypes, Op } = require("sequelize");
const sequelize = new Sequelize("t6_6958", "root", "", {
	host: "localhost",
	dialect: "mysql",
	logging: false,
});

class ClassEnrollment extends Model {}

ClassEnrollment.init(
	{
		id_enroll: {
			type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
			allowNull: false,
		},
		id_class: {
			type: DataTypes.STRING(4),
			allowNull: false,
		},
		id_student: {
			type: DataTypes.STRING(4),
			allowNull: false,
		},
    harian: {
      type: DataTypes.INTEGER(3),
      allowNull: true,
    },
    uts: {
      type: DataTypes.INTEGER(3),
      allowNull: true,
    },
    uas: {
      type: DataTypes.INTEGER(3),
      allowNull: true,
    }
    
	},
	{
		sequelize,
		timestamps: false,
		modelName: "ClassEnrollment",
		tableName: "class_enrollments",
	}
);
ClassEnrollment.removeAttribute("id");

module.exports = ClassEnrollment;