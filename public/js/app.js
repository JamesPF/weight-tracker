var list = $('#measurement-list');
var form = $('#measurement-form');

$(document).ready(function () {

  $.ajax('/measurements', {
    type: 'GET',
    dataType: 'json',
    success: function (measurements) {
      measurements.forEach(function (measurement) {
        var weight = measurement.weight;
        var date = measurement.date;

        var recordedMeasurement = '<li>' + date + ': ' + weight + 'lbs</li>';
        $(list).append(recordedMeasurement);
      });
    }
  });

});

$(form).on('submit', function (event) {
  event.preventDefault();

  var date = form.find('input[name=date]');
  var weight = form.find('input[name=weight]');

  var measurement = {
    date: date.val(),
    weight: weight.val()
  };

  console.log(measurement);
});









