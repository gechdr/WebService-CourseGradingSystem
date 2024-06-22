const Sequelize = require("sequelize");
const { Model, DataTypes, Op } = require("sequelize");
const sequelize = new Sequelize("t6_6958", "root", "", {
	host: "localhost",
	dialect: "mysql",
	logging: false,
});

class Review extends Model {}

Review.init(
	{
		id_review: {
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
    rating: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
    },
    review: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
	},
	{
		sequelize,
		timestamps: false,
		modelName: "Review",
		tableName: "reviews",
	}
);

module.exports = Review;