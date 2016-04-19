var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var measurements = [];

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
	res.send('Weight tracker API root');
});


// GET all measurements
app.get('/measurements', function (req, res) {

	db.measurement.findAll().then(function (measurements) {
		res.json(measurements);
	}, function (e) {
		res.status(500).send();
	});

});


// GET single measurement
app.get('/measurements/:id', function (req, res) {
	var measurementId = parseInt(req.params.id, 10);

	db.measurement.findOne({
		where: {
			id: measurementId
		}
	}).then(function (measurement) {
		if (!!measurement) {
			res.json(measurement.toJSON());
		} else {
			res.status(404).send();
		}
	}, function (e) {
		res.status(500).send();
	});

});


// POST new measurement
app.post('/measurements', function (req, res) {
	var body = _.pick(req.body, 'weight', 'date');
	console.log(body);

	db.measurement.create(body).then(function (measurement) {
		res.json(measurement.toJSON());
		console.log('Success');
	}, function (e) {
		res.status(400).json(e);
	});
});

// PUT update measurement
app.put('/measurements/:id', function (req, res) {
	var measurementId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'weight', 'date');

  var attributes = {};

  if (body.hasOwnProperty('weight')) {
  	attributes.weight = body.weight;
  }

  if (body.hasOwnProperty('date')) {
  	attributes.date = body.date;
  }

  db.measurement.findOne({
  	where: {
  		id: measurementId
  	}
  }).then(function (measurement) {
  	if (measurement) {
  		measurement.update(attributes).then(function (measurement) {
  			res.json(measurement.toJSON());
  		}, function (e) {
  			res.status(400).json(e);
  		});
  	} else {
  		res.status(404).send();
  	}
  }, function () {
  	res.status(500).send();
  });
	
});


// DELETE measurement
app.delete('/measurements/:id', function (req, res) {
	var measurementId = parseInt(req.params.id, 10);

	db.measurement.destroy({
		where: {
			id: measurementId
		}
	}).then(function (rowsDeleted) {
		if (rowsDeleted === 0) {
			res.status(404).json({
				error: 'No measurement with that id.'
			});
		} else {
			res.status(204).send();
		}
	}, function () {
		res.status(500).send();
	});

});


db.sequelize.sync().then(function () {
	app.listen(PORT, function () {
	  console.log('Express listening on port ' + PORT);
  });
});









