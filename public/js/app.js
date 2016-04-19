var list = $('#measurement-list');
var form = $('#measurement-form');
var measurementArray = [];

$(document).ready(function () {

  // GET measurements from server when DOM loads
  $.ajax('/measurements', {
    type: 'GET',
    dataType: 'json',
    success: function (measurements) {
      measurements.forEach(function (measurement) {
        var weight = measurement.weight;
        var date = measurement.date;
        var recordedMeasurement = {weight, date};

        measurementArray.push(recordedMeasurement);
      });

      // Sort measurementArray in chronological order
      measurementArray.sort(function (a, b) {
        return new Date(a.date) - new Date(b.date);
      });

      // Display measurement Array in list in html
      measurementArray.forEach(function (measurement) {
        var recordedMeasurement = '<li>' + moment(measurement.date).format('MMMM Do YYYY') + ': ' + measurement.weight + ' lbs</li>';
        $(list).append(recordedMeasurement);
      });
    }
  });

});

// POST form data to server
$(form).on('submit', function (event) {
  event.preventDefault();

  var date = form.find('input[name=date]');
  var weight = form.find('input[name=weight]');

  var measurement = {
    'date': date.val(),
    'weight': weight.val()
  };

  $.ajax('/measurements', {
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(measurement),
    success: function (data) {
      console.log(data);
    }
  });

});

// D3 Chart

var data = [
  {weight: 142, date: '3/14/16'},
  {weight: 145.6, date: '3/21/16'},
  {weight: 146.2, date: '3/28/16'},
  {weight: 148.2, date: '4/4/16'},
  {weight: 149.2, date: '4/11/16'},
  {weight: 146.6, date: '4/18/16'}
];

var chart = d3.select('#chart').append('g')
            .classed('display', true);









