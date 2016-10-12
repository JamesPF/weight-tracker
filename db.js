var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

// Determines whether to use live production db or local production db
if (env === 'production') {
	// Connects to postgres db if on heroku
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres'
	})
} else {
	// Connects to sqlite db if on local
	sequelize = new Sequelize(undefined, undefined, undefined, {
	  'dialect': 'sqlite',
	  'storage': __dirname + '/data/dev-weight-tracker-api.sqlite'
  });
}

// Creates db
var db = {};

// Creates measurement, and brings in measurement from measurement.js
db.measurement = sequelize.import(__dirname + '/models/measurement.js');
db.user = sequelize.import(__dirname + '/models/user.js');

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Allows db to be used in other files
module.exports = db;