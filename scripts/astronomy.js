var margin = {top: 40, right: 40, bottom: 40, left:100},
width = $(window).width() - margin.left - margin.right,
height = $(window).height() - margin.top - margin.bottom- 100,
columns = ["z", "mass", "mass_err", "SFR", "sSFR", "Z_Mannucci", "Z_Dopita", "deltaZ", "Z_R23", "Z_NHa", "q", "surf_bright", "HaHb", "bdec_frac_err", "logR23", "logNHa", "OIII/OII", "NII/OII", "OIII/SII", "NII/SII", "Hbeta_ratio", "Hdelta_eqw", "D4000", "vdisp", "A_v"];

var xValue = function(d) { return +d.sSFR;}, // data -> value
    xScale = d3.scale.linear().range([0, width - margin.left - margin.right ]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) { return +d.q;}, // data -> value
    yScale = d3.scale.linear().range([height - margin.top - margin.bottom, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var maindiv = d3.select("body").append("div");
maindiv.append("div").attr("style", "text-align: center;").html("Hiya, add your select menu here");
var svg = maindiv.append('svg')
    .attr('class', 'chart')
    .attr('width', width)
    .attr('height', height + 10).append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');


// CREATE DIVS
var div1 = d3.select("body").append("div").attr("style", "display: inline-block;");
var div2 = d3.select("body").append("div").attr("style", "display: inline-block;");
var div3 = d3.select("body").append("div").attr("style", "display: inline-block;");
var div4 = d3.select("body").append("div").attr("style", "display: inline-block;");

// SELECT MENUS

div1.append("div").attr("style", "text-align: center;").html("Hiya, add your select menu here");
div2.append("div").attr("style", "text-align: center;").html("Hiya, add your select menu here");
div3.append("div").attr("style", "text-align: center;").html("Hiya, add your select menu here");
div4.append("div").attr("style", "text-align: center;").html("Hiya, add your select menu here");

// CREATE HISTORGRAMS
var hist1 = div1
	.append("svg")
  .attr('class', 'chart')
		.attr("width", width/2)
		.attr("height", (height/2 + 20) )
	.append("g").attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');


var hist2 = div2
  	.append("svg")
    .attr('class', 'chart')
  		.attr("width", width/2)
  		.attr("height", (height/2 + 20) )
  	.append("g").attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');


var hist3 = div3
    	.append("svg")
      .attr('class', 'chart')
    		.attr("width", width/2)
    		.attr("height", (height/2 + 20) )
    	.append("g").attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');


var hist4 = div4
      	.append("svg")
        .attr('class', 'chart')
      		.attr("width", width/2)
      		.attr("height", (height/2 + 20) )
      	.append("g").attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');




d3.csv("data/data_good_small.csv", function(error, data) {
  var valshist1 = [];
  var valshist2 = [];
  var valshist3 = [];
  var valshist4 = [];
  data.forEach(function(d) {
      d.sSFR = +d.sSFR;
      d.q = +d.q;
      valshist1.push(+d["Z_Dopita"]);
      valshist2.push(+d["sSFR"]);
      valshist3.push(+d["Z_Mannucci"]);
      valshist4.push(+d["mass_err"]);
  });

//SCATTER PLOT

  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
 yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  svg.append("g")
      .attr("class", "x axis")
      .attr('transform', 'translate(0, ' + (height - margin.top - margin.bottom) + ')')
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("dx", width-margin.left)
      .attr("dy", "3em")
      .style("text-anchor", "end")
      .text("Specific Star Formation Rate (sSFR), M⊕/yr");

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
      .text("q");

  svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", "#333")
        .on("mouseover", function(d) {
          d3.select(this).attr("r", 4 ).style("fill", "#79B441");
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html("<div class=\"tip\"> q:  " + d.q + " M⊕ <br/> sSFR:  " + d.sSFR + " M⊕/yr </div>")
               .style("left", (d3.event.pageX + 10) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
        d3.select(this).attr("r", 3.5 ).style("fill", "#333");
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });



// HISTOGRAMS

var histwidth = width/2 - margin.right - margin.left;

// HISTOGRAMS 1

var tickshist1 = 12;

// A formatter for counts.
var formatCount = d3.format(",.0f");
var x = d3.scale.linear()
    .domain([Math.floor(d3.min(valshist1)), Math.ceil(d3.max(valshist1))])
    .range([0, histwidth]);

// Generate a histogram using twenty uniformly-spaced bins.
var bardata = d3.layout.histogram()
    .bins(x.ticks(tickshist1))
    (valshist1);


var y = d3.scale.linear()
    .domain([0, d3.max(bardata, function(d) { return d.y; })])
    .range([height/2 - margin.top - margin.bottom, 0]);

var histx = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var histy = d3.svg.axis()
        .scale(y)
        .orient("left");

var bar = hist1.selectAll(".bar")
    .data(bardata)
  .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

var exactwidth = (((histwidth)/x.ticks(tickshist1).length) - 1)

bar.append("rect")
    .attr("x", 1)
    .attr("width", exactwidth)
    .attr("height", function(d) { return height/2 - margin.top - margin.bottom - y(d.y); });

bar.append("text")
    .attr("dy", "-1em")
    .attr("class", "histext")
    .attr("y", 6)
    .attr("x", exactwidth/2 )
    .attr("text-anchor", "middle")
    .text(function(d) { var c = formatCount(d.y); if((d.y) > 15){ return c; }; });

hist1.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height/2 - margin.top - margin.bottom) + ")")
    .call(histx)
    .append("text")
      .attr("class", "label")
      .attr("dx", width/2-margin.left)
      .attr("dy", "3em")
      .style("text-anchor", "end")
      .text("Z")
      .append("tspan")
      .attr("baseline-shift", "sub")
      .text("Dopita");

hist1.append("g")
    .attr("class", "y axis")
    .call(histy)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".7em")
    .style("text-anchor", "end")
    .text("Number of Galaxies");

//  HISTOGRAMS 2


var tickshist2 = 10;

var x2 = d3.scale.linear()
    .domain([Math.floor(d3.min(valshist2))-1, Math.ceil(d3.max(valshist2))+1])
    .range([0, histwidth]);

// Generate a histogram using twenty uniformly-spaced bins.
var bardata2 = d3.layout.histogram()
    .bins(x2.ticks(tickshist2))
    (valshist2);

var y2 = d3.scale.linear()
    .domain([0, d3.max(bardata2, function(d) { return d.y; })])
    .range([height/2 - margin.top - margin.bottom, 0]);

var hist2x = d3.svg.axis()
    .scale(x2)
    .orient("bottom");

var hist2y = d3.svg.axis()
        .scale(y2)
        .orient("left");

var bar2 = hist2.selectAll(".bar")
    .data(bardata2)
  .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(" + x2(d.x) + "," + y2(d.y) + ")"; });


var exactwidth2 = (((histwidth)/x2.ticks(tickshist2).length) - 1)

bar2.append("rect")
    .attr("x", 1)
    .attr("width", exactwidth2)
    .attr("height", function(d) { return height/2 - margin.top - margin.bottom - y2(d.y); });

bar2.append("text")
    .attr("dy", "-1em")
    .attr("class", "histext")
    .attr("y", 6)
    .attr("x", exactwidth2/2 )
    .attr("text-anchor", "middle")
    .text(function(d) {  var c = formatCount(d.y); if((d.y) > 15){ return c; };  });

hist2.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height/2 - margin.top - margin.bottom) + ")")
    .call(hist2x)
    .append("text")
      .attr("class", "label")
      .attr("dx", width/2-margin.left)
      .attr("dy", "3em")
      .style("text-anchor", "end")
      .text("sSFR")
      .append("tspan")
      .attr("baseline-shift", "sub")
      .text("");

hist2.append("g")
    .attr("class", "y axis")
    .call(hist2y)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".7em")
    .style("text-anchor", "end")
    .text("Number of Galaxies");

//  HISTOGRAMS 3


var tickshist3 = 10;

    var x3 = d3.scale.linear()
        .domain([Math.floor(d3.min(valshist3))-1, Math.ceil(d3.max(valshist3))+1])
        .range([0, histwidth]);

    // Generate a histogram using twenty uniformly-spaced bins.
    var bardata3 = d3.layout.histogram()
        .bins(x3.ticks(tickshist3))
        (valshist3);

    var y3 = d3.scale.linear()
        .domain([0, d3.max(bardata3, function(d) { return d.y; })])
        .range([height/2 - margin.top - margin.bottom, 0]);

    var hist3x = d3.svg.axis()
        .scale(x3)
        .orient("bottom");

    var hist3y = d3.svg.axis()
            .scale(y3)
            .orient("left");

    var bar3 = hist3.selectAll(".bar")
        .data(bardata3)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x3(d.x) + "," + y3(d.y) + ")"; });


    var exactwidth3 = (((histwidth)/x3.ticks(tickshist3).length) - 1);
    bar3.append("rect")
        .attr("x", 1)
        .attr("width", exactwidth3)
        .attr("height", function(d) { return height/2 - margin.top - margin.bottom - y3(d.y); });

    bar3.append("text")
        .attr("dy", "-1em")
        .attr("class", "histext")
        .attr("y", 6)
        .attr("x", exactwidth3/2 )
        .attr("text-anchor", "middle")
        .text(function(d) {  var c = formatCount(d.y); if((d.y) > 15){ return c; };  });

    hist3.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height/2 - margin.top - margin.bottom) + ")")
        .call(hist3x)
        .append("text")
          .attr("class", "label")
          .attr("dx", width/2-margin.left)
          .attr("dy", "3em")
          .style("text-anchor", "end")
          .text("Z")
          .append("tspan")
          .attr("baseline-shift", "sub")
          .text("Mannucci");

    hist3.append("g")
        .attr("class", "y axis")
        .call(hist3y)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".7em")
        .style("text-anchor", "end")
        .text("Number of Galaxies");

// /  HISTOGRAMS 4


var tickshist4 = 14;

  var x4 = d3.scale.linear()
      .domain([Math.floor(d3.min(valshist4))-1, Math.ceil(d3.max(valshist4))+1])
      .range([0, histwidth]);

  // Generate a histogram using twenty uniformly-spaced bins.
  var bardata4 = d3.layout.histogram()
      .bins(x4.ticks(tickshist4))
      (valshist4);

  var y4 = d3.scale.linear()
      .domain([0, d3.max(bardata4, function(d) { return d.y; })])
      .range([height/2 - margin.top - margin.bottom, 0]);

  var hist4x = d3.svg.axis()
      .scale(x4)
      .orient("bottom");

  var hist4y = d3.svg.axis()
          .scale(y4)
          .orient("left");

  var bar4 = hist4.selectAll(".bar")
      .data(bardata4)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d) { return "translate(" + x4(d.x) + "," + y4(d.y) + ")"; });


  var exactwidth4 = (((histwidth)/x4.ticks(tickshist4).length) - 1);
  bar4.append("rect")
      .attr("x", 1)
      .attr("width", exactwidth4)
      .attr("height", function(d) { return height/2 - margin.top - margin.bottom - y4(d.y); });

  bar4.append("text")
      .attr("dy", "-1em")
      .attr("class", "histext")
      .attr("y", 6)
      .attr("x", exactwidth4/2 )
      .attr("text-anchor", "middle")
      .text(function(d) {  var c = formatCount(d.y); if((d.y) > 15){ return c; };  });

  hist4.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height/2 - margin.top - margin.bottom) + ")")
      .call(hist4x)
      .append("text")
        .attr("class", "label")
        .attr("dx", width/2-margin.left)
        .attr("dy", "3em")
        .style("text-anchor", "end")
        .text("mass")
        .append("tspan")
        .attr("baseline-shift", "sub")
        .text("err");

  hist4.append("g")
      .attr("class", "y axis")
      .call(hist4y)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".7em")
      .style("text-anchor", "end")
      .text("Number of Galaxies");

});


// function collectdata (data) {
//   var vals;
//   for(var i = 0; i < columns.length; i++){
//     vals.
//   }
// }
