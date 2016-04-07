// Sets 'measurement' data model
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('measurement', {
		weight: {
			type: DataTypes.FLOAT,
			allowNull: false,
			validate: {
				len: [1, 7]
			}
		},
		date: {
			type: DataTypes.STRING,
			allowNull: false
		}
	});
};