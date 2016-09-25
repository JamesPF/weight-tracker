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

      // Begins D3

      // Creates D3 Chart
      var width = 1200;
      var height = 500;

      var canvas = d3.select('#chart')
                    .attr('height', height)
                    .attr('width', width)
                    .style({
                      'background': '#bed', 
                      'margin': '0 auto', 
                      'margin-bottom': '50',
                      'display': 'block', 
                    })
                    .append('g')
                    .attr('transform', 'translate(10, 10)');

      var bars = canvas.selectAll('rect')
                  .data(measurementArray)
                  .enter()
                    .append('rect')
                    .attr('width', 3)
                    .attr('height', function (d) {return d.weight * 2;})
                    .attr('x', function (d, i) {return i * 5});

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









