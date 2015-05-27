var margin = {top: 40, right: 40, bottom: 40, left:100},
width = $(window).width() - margin.left - margin.right,
height = $(window).height() - margin.top - margin.bottom- 100,
columns = ["z", "mass", "mass_err", "SFR", "sSFR", "Z_Mannucci", "Z_Dopita", "deltaZ", "Z_R23", "Z_NHa", "q", "surf_bright", "HaHb", "bdec_frac_err", "logR23", "logNHa", "OIII/OII", "NII/OII", "OIII/SII", "NII/SII", "Hbeta_ratio", "Hdelta_eqw", "D4000", "vdisp", "A_v"];

var xValue = function(d) { return +d.SFR;}, // data -> value
    xScale = d3.scale.linear().range([0, width/2 - margin.left - margin.right ]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) { return +d.mass;}, // data -> value
    yScale = d3.scale.linear().range([height - margin.top - margin.bottom, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


var svg = d3.select('body').append('svg')
    .attr('class', 'chart')
    .attr('width', width/2)
    .attr('height', height + 10).append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

var hist1 = d3.select("body")
	.append("svg")
  .attr('class', 'chart')
		.attr("width", width/4 + 10)
		.attr("height", (height - margin.top - margin.bottom) + 10)
	.append("g");
    // Generate a Bates distribution of 10 random variables.
    var values = d3.range(100).map(d3.random.bates(10));

    // A formatter for counts.
    var formatCount = d3.format(",.0f");
    var x = d3.scale.linear()
        .domain([0, 1])
        .range([0, width/4 - 10]);

    // Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.layout.histogram()
        .bins(x.ticks(10))
        (values);

    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.y; })])
        .range([height/2 - margin.top - margin.bottom, 0]);

    var histx = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var bar = hist1.selectAll(".bar")
        .data(data)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    bar.append("rect")
        .attr("x", 1)
        .attr("width", x(data[0].dx) - 1)
        .attr("height", function(d) { return height/2 - margin.top - margin.bottom - y(d.y); });

    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", 6)
        .attr("x", x(data[0].dx) / 2)
        .attr("text-anchor", "middle")
        .text(function(d) { return formatCount(d.y); });

    hist1.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height/2 - margin.top - margin.bottom) + ")")
        .call(histx);


d3.csv("trial.csv", function(error, data) {
  data.forEach(function(d) {
      d.SFR = +d.SFR;
      d.mass = +d.mass;
  });

  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
 yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  svg.append("g")
      .attr("class", "x axis")
      .attr('transform', 'translate(0, ' + (height - margin.top - margin.bottom) + ')')
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("dx", width/2-margin.left)
      .attr("dy", "3em")
      .style("text-anchor", "end")
      .text("Star Formation Rate (SFR), M⊕/yr");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Mass, M⊕");

  svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", "#333")
        .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html("<div class=\"tip\"> Mass:  " + d.mass + " M⊕ <br/> SFR:  " + d.SFR + " M⊕/yr </div>")
               .style("left", (d3.event.pageX + 10) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });



});


// function collectdata (data) {
//   var vals;
//   for(var i = 0; i < columns.length; i++){
//     vals.
//   }
// }
