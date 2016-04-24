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


      // Create D3 chart based off of data
      var data = measurementArray;

      var margin = {
        top: -20,
        bottom: 20,
        left: 40,
        right: 20
      }

      var svg = d3.select('#chart');

      // Creates group for elements on chart
      var chart = d3.select('#chart').append('g')
                  .classed('display', true)
                  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

     // Creates tooltip for displaying date and weight on mouseover
      var tooltipDiv = d3.select('body').append('div')
                .attr('class', 'tooltip')
                .style('opacity', 0);

      // Formats date for tooltip display
      var dateFormat = d3.time.format('%m/%e/%y');

      // Formats date for creating lines and points
      var dateParser = d3.time.format('%Y-%m-%e').parse;

      // Create scales
      // Sets x scale based on time
      var x = d3.time.scale()
              // Returns an array consisting of the lowest value and the highest date value
              .domain(d3.extent(data, function (d) {
                var date = dateParser(d.date);
                return date;
              }))
              .range([0,(1200 - margin.left - margin.right)]);

      // Sets y scale to a linear scale
      var y = d3.scale.linear()
              // Goes from 0 to the highest weight value
              .domain([0, d3.max(data, function (d) {
                return d.weight + 10;
              })])
              .range([(500 - margin.top - margin.bottom),0]);

      // Create x axis
      // Puts the x axis on the bottom, with a tick every 7 days
      var xAxis = d3.svg.axis()
                  .scale(x)
                  .orient('bottom')
                  .ticks(d3.time.months, 1)
                  .tickFormat(d3.time.format('%m/%e/%y'));

      // Create y axis
      var yAxis = d3.svg.axis()
                  .scale(y)
                  .orient('left')
                  .ticks(20);

      // Create line for connecting points
      var line = d3.svg.line()
                  .x(function (d) {
                    var date = dateParser(d.date);
                    return x(date);
                  })
                  .y(function (d) {
                    return y(d.weight);
                  })
                  .interpolate('monotone');

      function plot (params) {
        // Append the x and y axes
        this.append('g')
            .classed('x axis', true)
            .attr('transform', 'translate(0,500)')
            .call(params.axis.x);

        this.append('g')
            .classed('y axis', true)
            .attr('transform', 'translate(0,0)')
            .call(params.axis.y);

        // enter()
        // Add line
        this.selectAll('.line')
            .data([params.data])
            .enter()
              .append('path')
              .classed('line', true);
        // Create data points
        this.selectAll('.point')
            .data(params.data)
            .enter()
              // appends SVG circles 4px wide using the 'data' array
              .append('circle')
              .classed('point', true)
              .attr('r', 2);

        // update
        this.selectAll('.line')
            .attr('d', function (d) {
              return line(d);
            })
        this.selectAll('.point')
            .attr('cx', function (d) {
              var date = dateParser(d.date);
              return x(date);
            })
            .attr('cy', function (d) {
              return y(d.weight);
            })
            // Displays date and weight on mouseover
            .on('mouseover', function (d) {
              tooltipDiv.transition()
                .duration(200)
                .style('opacity', .9);
              tooltipDiv.html('<span>' + dateFormat(new Date(d.date)) + '<br />' + d.weight + ' lbs</span>')
                .style('left', (d3.event.pageX + 14) + 'px')
                .style('top', (d3.event.pageY - 28) + 'px')
            })
            .on('mouseout', function (d) {
              tooltipDiv.transition()
                .duration(200)
                .style('opacity', 0);
            });

        // exit()
        this.selectAll('.line')
            .data([params.data])
            .exit()
              .remove();
        this.selectAll('.point')
            .data(params.data)
            .exit()
              .remove();
      }

      // Calls 'plot' function
      // Using '.call' means 'this' gets set to 'chart'
      plot.call(chart, {
        data: data,
        axis: {
          x: xAxis,
          y: yAxis
        }
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
// Sample data
// var data = [
//   {weight: 142, date: '2016-03-14'},
//   {weight: 145.6, date: '2016-03-21'},
//   {weight: 146.2, date: '2016-03-28'},
//   {weight: 148.2, date: '2016-04-4'},
//   {weight: 149.2, date: '2016-04-11'},
//   {weight: 146.6, date: '2016-04-18'}
// ];









