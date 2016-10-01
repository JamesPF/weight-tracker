var list = $('#measurement-list');
var form = $('#measurement-entry');
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
      var parsedDate = d3.timeParse('%Y-%m-%d');
      var tooltipDate = d3.timeFormat('%b %e, %Y');
      var height = 550;
      var width = 1200;
      var margin = 50;

      var x = d3.scaleTime()
              .domain(d3.extent(measurementArray, function (d) {
                var date = parsedDate(d.date);
                return date;
              }))
              .range([0, (width - (3.5 * margin))]);

      var y = d3.scaleLinear()
              .domain([0, d3.max(measurementArray, function (d) {
                return d.weight;
              })])
              .range([(height - (1.5*margin)), margin]);

      // Creates axes on using the x and y scales above
      // Also creates grid lines that span the width and height of the graph
      var xAxis = d3.axisBottom()
                  .scale(x)
                  .ticks(d3.timeMonth)
                  .tickFormat(d3.timeFormat('%b %Y'))
                  .tickSizeInner(-(height - (2.5*margin)))
                  .tickSizeOuter(0);
      var yAxis = d3.axisLeft()
                  .scale(y)
                  .ticks(d3.max(measurementArray, function (d) {
                    return d.weight/10;
                  }))
                  .tickSizeInner(-(width - (3.5 * margin)));

      // Creates div for tooltip
      var div = d3.select('#chart')
                    .append('div')
                    .attr('class', 'tooltip')
                    .style('opacity', 0);

      var canvas = d3.select('#chart')
                    .append('svg')
                    .attr('height', height)
                    .attr('width', width)
                    .style('background', '#ECF0F1')
                    .style('display', 'block')
                    .style('margin', '0 auto')
                    .append('g')
                      .attr('transform', 'translate (90, -30)');

      // Generates the fill area beneath the data line
      var area = d3.area()
                   .x(function (d) {
                    var date = parsedDate(d.date);
                    return x(date);
                   })
                   .y0(height - (1.5*margin))
                   .y1(function (d) {return y(d.weight);})
                   .curve(d3.curveMonotoneX);

      // Generates the lines
      var line = d3.line()
                  .x(function (d) {
                    var date = parsedDate(d.date);
                    return x(date);
                  })
                  .y(function (d) {return y(d.weight);})
                  .curve(d3.curveMonotoneX);

      // Creates the fill area beneath the line
      canvas.append('path')
            .data([measurementArray])
            .attr('class', 'area')
            .attr('d', area);

      // Creates lines, and uses '.path' as selector to differentiate 'path' from the area creator above
      canvas.selectAll('.path')
              .data([measurementArray])
              .enter()
              .append('path')
                .attr('class', '.path')
                .attr('d', line)
                .attr('fill', 'none')
                .attr('stroke', '#2980B9')
                .attr('stroke-width', 3);

      // Appends x axis and moves it to bottom
      canvas.append('g')
              .attr('transform', 'translate (0, ' + (height - (1.5*margin)) + ')')
              .attr('class', 'x-axis')
              .call(xAxis)
              .selectAll('text')
                .style('text-anchor', 'start')
                .attr('transform', function (d) {
                  return 'rotate(75) translate(10, -4)';
                });

      // Appends y axis
      canvas.append('g')
              .call(yAxis);

      // Creates points representing data
      canvas.selectAll('circle')
              .data(measurementArray)
              .enter()
              .append('circle')
                .attr('fill', '#333')
                .attr('r', 3)
                .attr('cx', function (d) {
                  var date = parsedDate(d.date);
                  return x(date);
                })
                .attr('cy', function (d) {return y(d.weight);})
                // Displays tooltip
                .on('mouseover', function (d) {
                  div.transition()
                    .duration(500)
                    .style('opacity', 0);
                  div.transition()
                    .duration(200)
                    .style('opacity', 0.9);
                  div.html( 
                    '<p>' + d.weight + ' lbs on<br /> ' + tooltipDate(parsedDate(d.date)) + '</p>' + 
                    '<button class="edit">Edit</button>')
                  .style('left', (d3.event.pageX) + 'px')
                  .style('top', (d3.event.pageY - 28) + 'px');
                });

      // Sets label on y axis
      canvas.append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', 'translate(-35,' + (height / 2) + ')rotate(-90)')
            .attr('font-family', 'Helvetica')
            .attr('fill', '#222')
            .text('Weight');

      // Sets label on x axis
      canvas.append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', 'translate(' + ((width - (4 * margin)) / 2) + ',' + (height + 10) + ')')
            .attr('font-family', 'Helvetica')
            .attr('fill', '#222')
            .text('Date');

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









