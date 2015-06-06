var margin = {top: 40, right: 40, bottom: 40, left:100},
width = $(window).width() - margin.left - margin.right,
height = $(window).height() - margin.top - margin.bottom- 100,
columns = ["z", "mass", "mass_err", "SFR", "sSFR", "Z_Mannucci", "Z_Dopita", "deltaZ", "Z_R23", "Z_NHa", "q", "surf_bright", "HaHb", "bdec_frac_err", "logR23", "logNHa", "OIII/OII", "NII/OII", "OIII/SII", "NII/SII", "Hbeta_ratio", "Hdelta_eqw", "D4000", "vdisp", "A_v"];

var names = {"z":"Redshift", "mass":"Stellar Mass", "mass_err":"Mass Uncertainty", "SFR":"Star Formation Rate", "sSFR":"Specific Star Formation Rate", "Z_Mannucci":"Metallicity (M10)", "Z_Dopita":"Metallicity (D13)", "deltaZ":"Metallicity Difference (D13-M10)", "Z_R23":"Metallicity (R23)", "Z_NHa":"Metallicity (N/Halpha)", "q":"Ionization Parameter", "surf_bright":"Surface Brightness", "HaHb":"Balmer Decrement", "bdec_frac_err":"Balmer Decrement Fractional Error", "logR23":"R23", "logNHa":"N/Halpha", "OIII/OII":"OIII/OII", "NII/OII":"NII/OII", "OIII/SII":"OIII/SII", "NII/SII":"NII/SII", "Hbeta_ratio":"Hbeta Absorption/Emission", "Hdelta_eqw":"Hdelta Equivalent Width", "D4000":"D4000", "vdisp":"Velocity Dispersion", "A_v":"Extinction in V-band"};

var valshist1 = [];
var valshist2 = [];
var valshist3 = [];
var valshist4 = [];

var head = d3.select("body").append("h1").attr("class", "head").html("Galaxy Explorer");

var credits = d3.select("body").append("p").attr("class", "credits").html("Made by Nicole Atherly, Mahir Kothary, and Grace Telford");

var instructions = d3.select("body").append("p").attr("class", "instructions").html("An interactive tool for exploring correlations between galaxy properties derived from Sloan Digital Sky Survey spectra. Choose parameters to plot on the scatter plot and histograms. Select a region of interest in the scatter plot, then scroll down to see how the distributions for the full dataset and your selected sample compare.");

var maindiv = d3.select("body").append("div").attr("id", "maindiv");
maindiv.append("div").attr("class","mainselect").html('<b>Select Your Axis Variables:</b> <br/><select id="yvar",\
		onchange="updateScatterY(this.value);">\
		<option value="z" >Redshift</option>\
  		<option value="mass">Stellar Mass</option>\
  		<option value="mass_err">Mass Uncertainty</option>\
  		<option value="SFR">Star Formation Rate</option>\
  		<option value="sSFR">Specific Star Formation Rate</option>\
  		<option value="Z_Mannucci">Metallicity (M10)</option>\
  		<option value="Z_Dopita">Metallicity (D13)</option>\
  		<option value="deltaZ">Metallicity Difference (D13-M10)</option>\
  		<option value="Z_R23">Metallicity (R23)</option>\
  		<option value="Z_NHa">Metallicity (N/Halpha)</option>\
  		<option value="q" selected="selected">Ionization Parameter</option>\
		<option value="surf_bright">Surface Brightness</option>\
  		<option value="HaHb">Balmer Decrement</option>\
  		<option value="bdec_frac_err">Balmer Decrement Fractional Error</option>\
  		<option value="logR23">R23</option>\
  		<option value="logNHa">N/Halpha</option>\
  		<option value="OIII/OII">OIII/OII</option>\
  		<option value="NII/OII">NII/OII</option>\
  		<option value="OIII/SII">OIII/SII</option>\
  		<option value="NII/SII">NII/SII</option>\
  		<option value="Hbeta_ratio">Hbeta Absorption/Emission</option>\
  		<option value="Hdelta_eqw">Hdelta Equivalent Width</option>\
  		<option value="D4000">D4000</option>\
  		<option value="vdisp">Velocity Dispersion</option>\
  		<option value="A_v">Extinction in V-band</option>\
	    </select><br> <b> vs. </b> <br/> <select id="xvar",\
      		onchange="updateScatterX(this.value);">\
      		<option value="z" >Redshift</option>\
        	<option value="mass">Stellar Mass</option>\
        	<option value="mass_err">Mass Uncertainty</option>\
        	<option value="SFR">Star Formation Rate</option>\
        	<option value="sSFR" selected="selected">Specific Star Formation Rate</option>\
        	<option value="Z_Mannucci">Metallicity (M10)</option>\
        	<option value="Z_Dopita">Metallicity (D13)</option>\
        	<option value="deltaZ">Metallicity Difference (D13-M10)</option>\
        	<option value="Z_R23">Metallicity (R23)</option>\
        	<option value="Z_NHa">Metallicity (N/Halpha)</option>\
        	<option value="q">Ionization Parameter</option>\
      		<option value="surf_bright">Surface Brightness</option>\
        	<option value="HaHb">Balmer Decrement</option>\
        	<option value="bdec_frac_err">Balmer Decrement Fractional Error</option>\
        	<option value="logR23">R23</option>\
        	<option value="logNHa">N/Halpha</option>\
        	<option value="OIII/OII">OIII/OII</option>\
        	<option value="NII/OII">NII/OII</option>\
        	<option value="OIII/SII">OIII/SII</option>\
        	<option value="NII/SII">NII/SII</option>\
        	<option value="Hbeta_ratio">Hbeta Absorption/Emission</option>\
        	<option value="Hdelta_eqw">Hdelta Equivalent Width</option>\
        	<option value="D4000">D4000</option>\
        	<option value="vdisp">Velocity Dispersion</option>\
        	<option value="A_v">Extinction in V-band</option>\
      	    </select>');
var svg = maindiv.append('svg')
    .attr('class', 'chart')
    .attr('width', 2*width/3)
    .attr('height', height + 10).append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

// HISTOGRAMS

var histwidth = width/2 - margin.right - margin.left;

var formatCount = d3.format(",.0f");


// CREATE DIVS
var div1 = d3.select("body").append("div").attr("style", "display: inline-block;");
var div2 = d3.select("body").append("div").attr("style", "display: inline-block;");
var div3 = d3.select("body").append("div").attr("style", "display: inline-block;");
var div4 = d3.select("body").append("div").attr("style", "display: inline-block;");

// SELECT MENUS

div1.append("div").attr("style", "text-align: center;").html('<select id="histogram1var",\
		onchange="updateHist1(this.value);">\
		<option value="z" >Redshift</option>\
  		<option value="mass">Stellar Mass</option>\
  		<option value="mass_err">Mass Uncertainty</option>\
  		<option value="SFR">Star Formation Rate</option>\
  		<option value="sSFR">Specific Star Formation Rate</option>\
  		<option value="Z_Mannucci">Metallicity (M10)</option>\
  		<option value="Z_Dopita" selected="selected">Metallicity (D13)</option>\
  		<option value="deltaZ">Metallicity Difference (D13-M10)</option>\
  		<option value="Z_R23">Metallicity (R23)</option>\
  		<option value="Z_NHa">Metallicity (N/Halpha)</option>\
  		<option value="q">Ionization Parameter</option>\
		<option value="surf_bright">Surface Brightness</option>\
  		<option value="HaHb">Balmer Decrement</option>\
  		<option value="bdec_frac_err">Balmer Decrement Fractional Error</option>\
  		<option value="logR23">R23</option>\
  		<option value="logNHa">N/Halpha</option>\
  		<option value="OIII/OII">OIII/OII</option>\
  		<option value="NII/OII">NII/OII</option>\
  		<option value="OIII/SII">OIII/SII</option>\
  		<option value="NII/SII">NII/SII</option>\
  		<option value="Hbeta_ratio">Hbeta Absorption/Emission</option>\
  		<option value="Hdelta_eqw">Hdelta Equivalent Width</option>\
  		<option value="D4000">D4000</option>\
  		<option value="vdisp">Velocity Dispersion</option>\
  		<option value="A_v">Extinction in V-band</option>\
	    </select>');
div2.append("div").attr("style", "text-align: center;").html('<select id="histogram2var",\
		onchange="updateHist2(this.value);">\
		<option value="z">Redshift</option>\
  		<option value="mass">Stellar Mass</option>\
  		<option value="mass_err">Mass Uncertainty</option>\
  		<option value="SFR">Star Formation Rate</option>\
  		<option value="sSFR" selected="selected">Specific Star Formation Rate</option>\
  		<option value="Z_Mannucci">Metallicity (M10)</option>\
  		<option value="Z_Dopita">Metallicity (D13)</option>\
  		<option value="deltaZ">Metallicity Difference (D13-M10)</option>\
  		<option value="Z_R23">Metallicity (R23)</option>\
  		<option value="Z_NHa">Metallicity (N/Halpha)</option>\
  		<option value="q">Ionization Parameter</option>\
		<option value="surf_bright">Surface Brightness</option>\
  		<option value="HaHb">Balmer Decrement</option>\
  		<option value="bdec_frac_err">Balmer Decrement Fractional Error</option>\
  		<option value="logR23">R23</option>\
  		<option value="logNHa">N/Halpha</option>\
  		<option value="OIII/OII">OIII/OII</option>\
  		<option value="NII/OII">NII/OII</option>\
  		<option value="OIII/SII">OIII/SII</option>\
  		<option value="NII/SII">NII/SII</option>\
  		<option value="Hbeta_ratio">Hbeta Absorption/Emission</option>\
  		<option value="Hdelta_eqw">Hdelta Equivalent Width</option>\
  		<option value="D4000">D4000</option>\
  		<option value="vdisp">Velocity Dispersion</option>\
  		<option value="A_v">Extinction in V-band</option>\
	    </select>');
div3.append("div").attr("style", "text-align: center;").html('<select id="histogram3var",\
		onchange="updateHist3(this.value);">\
		<option value="z">Redshift</option>\
  		<option value="mass">Stellar Mass</option>\
  		<option value="mass_err">Mass Uncertainty</option>\
  		<option value="SFR">Star Formation Rate</option>\
  		<option value="sSFR" selected="selected">Specific Star Formation Rate</option>\
  		<option value="Z_Mannucci" selected="selected">Metallicity (M10)</option>\
  		<option value="Z_Dopita">Metallicity (D13)</option>\
  		<option value="deltaZ">Metallicity Difference (D13-M10)</option>\
  		<option value="Z_R23">Metallicity (R23)</option>\
  		<option value="Z_NHa">Metallicity (N/Halpha)</option>\
  		<option value="q">Ionization Parameter</option>\
		<option value="surf_bright">Surface Brightness</option>\
  		<option value="HaHb">Balmer Decrement</option>\
  		<option value="bdec_frac_err">Balmer Decrement Fractional Error</option>\
  		<option value="logR23">R23</option>\
  		<option value="logNHa">N/Halpha</option>\
  		<option value="OIII/OII">OIII/OII</option>\
  		<option value="NII/OII">NII/OII</option>\
  		<option value="OIII/SII">OIII/SII</option>\
  		<option value="NII/SII">NII/SII</option>\
  		<option value="Hbeta_ratio">Hbeta Absorption/Emission</option>\
  		<option value="Hdelta_eqw">Hdelta Equivalent Width</option>\
  		<option value="D4000">D4000</option>\
  		<option value="vdisp">Velocity Dispersion</option>\
  		<option value="A_v">Extinction in V-band</option>\
	    </select>');
div4.append("div").attr("style", "text-align: center;").html('<select id="histogram4var",\
	onchange="updateHist4(this.value);">\
	<option value="z">Redshift</option>\
		<option value="mass">Stellar Mass</option>\
		<option value="mass_err" selected="selected">Mass Uncertainty</option>\
		<option value="SFR">Star Formation Rate</option>\
		<option value="sSFR">Specific Star Formation Rate</option>\
		<option value="Z_Mannucci">Metallicity (M10)</option>\
		<option value="Z_Dopita">Metallicity (D13)</option>\
		<option value="deltaZ">Metallicity Difference (D13-M10)</option>\
		<option value="Z_R23">Metallicity (R23)</option>\
		<option value="Z_NHa">Metallicity (N/Halpha)</option>\
		<option value="q">Ionization Parameter</option>\
	<option value="surf_bright">Surface Brightness</option>\
		<option value="HaHb">Balmer Decrement</option>\
		<option value="bdec_frac_err">Balmer Decrement Fractional Error</option>\
		<option value="logR23">R23</option>\
		<option value="logNHa">N/Halpha</option>\
		<option value="OIII/OII">OIII/OII</option>\
		<option value="NII/OII">NII/OII</option>\
		<option value="OIII/SII">OIII/SII</option>\
		<option value="NII/SII">NII/SII</option>\
		<option value="Hbeta_ratio">Hbeta Absorption/Emission</option>\
		<option value="Hdelta_eqw">Hdelta Equivalent Width</option>\
		<option value="D4000">D4000</option>\
		<option value="vdisp">Velocity Dispersion</option>\
		<option value="A_v">Extinction in V-band</option>\
    </select>');

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

var hd1 = "Z_Dopita", hd2 = "sSFR"  , hd3 = "Z_Mannucci", hd4 = "mass_err";

function updateHist1(val) {
  hd1 = val;
  d3.csv("data/data_good_small.csv", function(error, data) {
    var valshist = [];
    data.forEach(function(d) {
        valshist.push(+d[hd1]);
    });
		valshist1 = valshist;
    d3.selectAll(".hist1").remove();
    
    var selhist = [];
    if (brush.empty()) {
      createhist1(histwidth, formatCount, valshist1, hd1);
    } else {
      // histogram data
      svg.selectAll(".selected").classed("selected", function(d) {
          selhist.push(+d[hd1]);
          return true;
      });
      createhist1(histwidth, formatCount, valshist1, hd1, selhist);
    }
  });
}

function updateHist2(val) {
  hd2 = val;
  d3.csv("data/data_good_small.csv", function(error, data) {
    var valshist = [];
    data.forEach(function(d) {
        valshist.push(+d[hd2]);
    });
		valshist2 = valshist;
    d3.selectAll(".hist2").remove();
    
    var selhist = [];
    if (brush.empty()) {
      createhist2(histwidth, formatCount, valshist2, hd2);
    } else {
      // histogram data
      svg.selectAll(".selected").classed("selected", function(d) {
          selhist.push(+d[hd2]);
          return true;
      });
      createhist2(histwidth, formatCount, valshist2, hd2, selhist);
    }
  });
}

function updateHist3(val) {
  hd3 = val;
  d3.csv("data/data_good_small.csv", function(error, data) {
    var valshist = [];
    data.forEach(function(d) {
        valshist.push(+d[hd3]);
    });
		valshist3 = valshist;
    d3.selectAll(".hist3").remove();

    var selhist = [];
    if (brush.empty()) {
      createhist3(histwidth, formatCount, valshist3, hd3);
    } else {
      // histogram data
      svg.selectAll(".selected").classed("selected", function(d) {
          selhist.push(+d[hd3]);
          return true;
      });
      createhist3(histwidth, formatCount, valshist3, hd3, selhist);
    }
  });
}


function updateHist4(val) {
  hd4 = val;
  d3.csv("data/data_good_small.csv", function(error, data) {
    var valshist = [];
    data.forEach(function(d) {
        valshist.push(+d[hd4]);
    });
		valshist4 = valshist;
    d3.selectAll(".hist4").remove();

    var selhist = [];
    if (brush.empty()) {
      createhist4(histwidth, formatCount, valshist4, hd4);
    } else {
      // histogram data
      svg.selectAll(".selected").classed("selected", function(d) {
          selhist.push(+d[hd4]);
          return true;
      });
      createhist4(histwidth, formatCount, valshist4, hd4, selhist);
    }
  });
}



function createhist1(histwidth, formatCount, valshist1, val, selhist) {
  var tickshist1 = 10;

lowcut = d3.mean(valshist1) - 3 * d3.deviation(valshist1)
highcut = d3.mean(valshist1) + 3 * d3.deviation(valshist1) 

if (lowcut > d3.min(valshist1)) {
    minimum = lowcut
} else { 
    minimum = d3.min(valshist1)
}

if (highcut < d3.max(valshist1)) {
    maximum = highcut
} else { 
    maximum = d3.max(valshist1)
}

  var x = d3.scale.linear()
      //.domain([Math.floor(d3.min(valshist1))-0.2, Math.ceil(d3.max(valshist1))+0.2])
      //.domain([d3.min(valshist1), d3.max(valshist1)])
      .domain([minimum, maximum])
      .range([0, histwidth]);

//tempScale = d3.scale.linear().domain([0, tickshist1]).range([d3.min(valshist1), d3.max(valshist1)]);
tempScale = d3.scale.linear().domain([0, tickshist1]).range([minimum, maximum]);

tickArray = d3.range(tickshist1+1).map(tempScale);

  // Generate a histogram using twenty uniformly-spaced bins.
  var bardata = d3.layout.histogram()
      //.bins(x.ticks(tickshist1))
	.bins(tickArray)
      (valshist1);


  var y = d3.scale.linear()
      .domain([0, d3.max(bardata, function(d) { return d.y; })])
      .range([height/2 - margin.top - margin.bottom, 0]);

// shift 

  var histx = d3.svg.axis()
      .scale(x)
      .tickValues(tickArray)
      .orient("bottom");

 var histy = d3.svg.axis()
          .scale(y)
          .orient("left");

  var bar = hist1.selectAll(".bar")
      .data(bardata)
    .enter().append("g")
      .attr("class", "hist1 bar")
      .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

  //var exactwidth = (((histwidth)/x.ticks(tickshist1).length) - 1)
  var exactwidth = (((histwidth)/tickArray.length) - 1)

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

if(selhist) {
	var seldata = d3.layout.histogram()
			//.bins(x.ticks(tickshist1))
			.bins(tickArray)
			(selhist);
	var selbar = hist1.selectAll(".bar2")
	    .data(seldata)
	  .enter().append("g")
	    .attr("class", "hist1 bar2 tester")
	    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });
			selbar.append("rect")
		      .attr("x", 1)
		      .attr("width", exactwidth)
		      .attr("height", function(d) { return height/2 - margin.top - margin.bottom - y(d.y); })
          .on("mouseover", function(d) {
            tooltip.transition()
               .duration(200)
               .style("opacity", .9);
            tooltip.html("<div class=\"tip\">" + "Count: " + d.length + "<br/>" + "Median: " + d3.median(d) + "</div>")
               .style("left", (d3.event.pageX + 10) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
          })
          .on("mouseout", function(d) {
            tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
          });


}

// Axis

  hist1.append("g")
      .attr("class", "x axis hist1")
      .attr("transform", "translate(0," + (height/2 - margin.top - margin.bottom) + ")")
      .call(histx)
      .append("text")
        .attr("class", "label hist1")
        .attr("dx", width/2-margin.left)
        .attr("dy", "3em")
        .style("text-anchor", "end")
	.text(names[val])

  hist1.append("g")
      .attr("class", "y axis hist1")
      .call(histy)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -70)
      .attr("dy", ".7em")
      .style("text-anchor", "end")
      .text("Number of Galaxies");


}

function createhist2(histwidth, formatCount, valshist2, val, selhist) {
  var tickshist2 = 10;

// clip outliers at 3 sigma

lowcut = d3.mean(valshist2) - 3 * d3.deviation(valshist2)
highcut = d3.mean(valshist2) + 3 * d3.deviation(valshist2) 

if (lowcut > d3.min(valshist2)) {
    minimum = lowcut
} else { 
    minimum = d3.min(valshist2)
}

if (highcut < d3.max(valshist2)) {
    maximum = highcut
} else { 
    maximum = d3.max(valshist2)
}

  var x2 = d3.scale.linear()
      //.domain([Math.floor(d3.min(valshist2))-0.2, Math.ceil(d3.max(valshist2))])
      //.domain([d3.min(valshist2), d3.max(valshist2)])
      .domain([minimum, maximum])
      .range([0, histwidth]);

//tempScale = d3.scale.linear().domain([0, tickshist2]).range([d3.min(valshist2), d3.max(valshist2)]);
tempScale = d3.scale.linear().domain([0, tickshist2]).range([minimum, maximum]);
tickArray = d3.range(tickshist2+1).map(tempScale);

  // Generate a histogram using twenty uniformly-spaced bins.
  var bardata2 = d3.layout.histogram()
      //.bins(x2.ticks(tickshist2))
	.bins(tickArray)
      (valshist2);

  var y2 = d3.scale.linear()
      .domain([0, d3.max(bardata2, function(d) { return d.y; })])
      .range([height/2 - margin.top - margin.bottom, 0]);

  var hist2x = d3.svg.axis()
      .scale(x2)
      .tickValues(tickArray)
      .orient("bottom");

  var hist2y = d3.svg.axis()
          .scale(y2)
          .orient("left");

  var bar2 = hist2.selectAll(".bar")
      .data(bardata2)
    .enter().append("g")
      .attr("class", "bar hist2")
      .attr("transform", function(d) { return "translate(" + x2(d.x) + "," + y2(d.y) + ")"; });


  //var exactwidth2 = (((histwidth)/x2.ticks(tickshist2).length) - 1)
  var exactwidth2 = (((histwidth)/tickArray.length) - 1)


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


if(selhist) {
  var seldata = d3.layout.histogram()
      //.bins(x2.ticks(tickshist2))
        .bins(tickArray)
      (selhist);
  var selbar = hist2.selectAll(".bar2")
      .data(seldata)
    .enter().append("g")
      .attr("class", "hist2 bar2 tester")
      .attr("transform", function(d) { return "translate(" + x2(d.x) + "," + y2(d.y) + ")"; });
      selbar.append("rect")
          .attr("x", 1)
          .attr("width", exactwidth2)
          .attr("height", function(d) { return height/2 - margin.top - margin.bottom - y2(d.y); })
          .on("mouseover", function(d) {
            tooltip.transition()
               .duration(200)
               .style("opacity", .9);
            tooltip.html("<div class=\"tip\">" + "Count: " + d.length + "<br/>" + "Median: " + d3.median(d) + "</div>")
               .style("left", (d3.event.pageX + 10) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
          })
          .on("mouseout", function(d) {
            tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
          });


}

        hist2.append("g")
            .attr("class", "x axis hist2")
            .attr("transform", "translate(0," + (height/2 - margin.top - margin.bottom) + ")")
            .call(hist2x)
            .append("text")
              .attr("class", "label hist2")
              .attr("dx", width/2-margin.left)
              .attr("dy", "3em")
              .style("text-anchor", "end")
    	      .text(names[val])

  hist2.append("g")
      .attr("class", "y axis hist2")
      .call(hist2y)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -70)
      .attr("dy", ".7em")
      .style("text-anchor", "end")
      .text("Number of Galaxies");
}

function createhist3(histwidth, formatCount, valshist3, val, selhist) {

  var tickshist3 = 10;

// clip outliers at 3 sigma

lowcut = d3.mean(valshist3) - 3 * d3.deviation(valshist3)
highcut = d3.mean(valshist3) + 3 * d3.deviation(valshist3) 

if (lowcut > d3.min(valshist3)) {
    minimum = lowcut
} else { 
    minimum = d3.min(valshist3)
}

if (highcut < d3.max(valshist3)) {
    maximum = highcut
} else { 
    maximum = d3.max(valshist3)
}


      var x3 = d3.scale.linear()
          //.domain([Math.floor(d3.min(valshist3))-0.2, Math.ceil(d3.max(valshist3))])
        //.domain([d3.min(valshist3), d3.max(valshist3)])
        .domain([minimum, maximum])
        .range([0, histwidth]);

//tempScale = d3.scale.linear().domain([0, tickshist3]).range([d3.min(valshist3), d3.max(valshist3)]);
tempScale = d3.scale.linear().domain([0, tickshist3]).range([minimum, maximum]);
tickArray = d3.range(tickshist3+1).map(tempScale);

      // Generate a histogram using twenty uniformly-spaced bins.
      var bardata3 = d3.layout.histogram()
          //.bins(x3.ticks(tickshist3))
	  .bins(tickArray)
          (valshist3);

      var y3 = d3.scale.linear()
          .domain([0, d3.max(bardata3, function(d) { return d.y; })])
          .range([height/2 - margin.top - margin.bottom, 0]);

      var hist3x = d3.svg.axis()
          .scale(x3)
          .tickValues(tickArray)
          .orient("bottom");

      var hist3y = d3.svg.axis()
              .scale(y3)
              .orient("left");

      var bar3 = hist3.selectAll(".bar")
          .data(bardata3)
        .enter().append("g")
          .attr("class", "bar hist3")
          .attr("transform", function(d) { return "translate(" + x3(d.x) + "," + y3(d.y) + ")"; });


      //var exactwidth3 = (((histwidth)/x3.ticks(tickshist3).length) - 1);
      var exactwidth3 = (((histwidth)/tickArray.length) - 1)

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

if(selhist) {
  var seldata = d3.layout.histogram()
      //.bins(x3.ticks(tickshist3))
        .bins(tickArray)
      (selhist);
  var selbar = hist3.selectAll(".bar2")
      .data(seldata)
    .enter().append("g")
      .attr("class", "hist3 bar2 tester")
      .attr("transform", function(d) { return "translate(" + x3(d.x) + "," + y3(d.y) + ")"; });
      selbar.append("rect")
          .attr("x", 1)
          .attr("width", exactwidth3)
          .attr("height", function(d) { return height/2 - margin.top - margin.bottom - y3(d.y); })
          .on("mouseover", function(d) {
            tooltip.transition()
               .duration(200)
               .style("opacity", .9);
            tooltip.html("<div class=\"tip\">" + "Count: " + d.length + "<br/>" + "Median: " + d3.median(d) + "</div>")
               .style("left", (d3.event.pageX + 10) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
          })
          .on("mouseout", function(d) {
            tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
          });


}

      hist3.append("g")
          .attr("class", " hist3 x axis")
          .attr("transform", "translate(0," + (height/2 - margin.top - margin.bottom) + ")")
          .call(hist3x)
          .append("text")
            .attr("class", "label")
            .attr("dx", width/2-margin.left)
            .attr("dy", "3em")
            .style("text-anchor", "end")
    	      .text(names[val])

  hist3.append("g")
      .attr("class", "y axis hist3")
      .call(hist3y)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -70)
      .attr("dy", ".7em")
      .style("text-anchor", "end")
      .text("Number of Galaxies");
}

function createhist4(histwidth, formatCount, valshist4, val, selhist){

  var tickshist4 = 10;

// clip outliers at 3 sigma

lowcut = d3.mean(valshist4) - 3 * d3.deviation(valshist4)
highcut = d3.mean(valshist4) + 3 * d3.deviation(valshist4) 

if (lowcut > d3.min(valshist4)) {
    minimum = lowcut
} else { 
    minimum = d3.min(valshist4)
}

if (highcut < d3.max(valshist4)) {
    maximum = highcut
} else { 
    maximum = d3.max(valshist4)
}

    var x4 = d3.scale.linear()
        //.domain([Math.floor(d3.min(valshist4))-0.2, Math.ceil(d3.max(valshist4))])
        //.domain([d3.min(valshist4), d3.max(valshist4)])
        .domain([minimum, maximum])
        .range([0, histwidth]);

//tempScale = d3.scale.linear().domain([0, tickshist4]).range([d3.min(valshist4), d3.max(valshist4)]);
tempScale = d3.scale.linear().domain([0, tickshist4]).range([minimum, maximum]);
tickArray = d3.range(tickshist4+1).map(tempScale);


    // Generate a histogram using twenty uniformly-spaced bins.
    var bardata4 = d3.layout.histogram()
        //.bins(x4.ticks(tickshist4))
	  .bins(tickArray)
        (valshist4);

    var y4 = d3.scale.linear()
        .domain([0, d3.max(bardata4, function(d) { return d.y; })])
        .range([height/2 - margin.top - margin.bottom, 0]);

    var hist4x = d3.svg.axis()
        .scale(x4)
        .tickValues(tickArray)
        .orient("bottom");

    var hist4y = d3.svg.axis()
            .scale(y4)
            .orient("left");

    var bar4 = hist4.selectAll(".bar")
        .data(bardata4)
      .enter().append("g")
        .attr("class", "bar hist4")
        .attr("transform", function(d) { return "translate(" + x4(d.x) + "," + y4(d.y) + ")"; });


    //var exactwidth4 = (((histwidth)/x4.ticks(tickshist4).length) - 1);
      var exactwidth4 = (((histwidth)/tickArray.length) - 1)

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


if(selhist) {
  var seldata = d3.layout.histogram()
      //.bins(x4.ticks(tickshist4))
        .bins(tickArray)
      (selhist);
  var selbar = hist4.selectAll(".bar2")
      .data(seldata)
    .enter().append("g")
      .attr("class", "hist4 bar2 tester")
      .attr("transform", function(d) { return "translate(" + x4(d.x) + "," + y4(d.y) + ")"; });
      selbar.append("rect")
          .attr("x", 1)
          .attr("width", exactwidth4)
          .attr("height", function(d) { return height/2 - margin.top - margin.bottom - y4(d.y); })
          .on("mouseover", function(d) {
            tooltip.transition()
               .duration(200)
               .style("opacity", .9);
            tooltip.html("<div class=\"tip\">" + "Count: " + d.length + "<br/>" + "Median: " + d3.median(d) + "</div>")
               .style("left", (d3.event.pageX + 10) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
          })
          .on("mouseout", function(d) {
            tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
          });


}

    hist4.append("g")
        .attr("class", "x axis hist4")
        .attr("transform", "translate(0," + (height/2 - margin.top - margin.bottom) + ")")
        .call(hist4x)
        .append("text")
          .attr("class", "label")
          .attr("dx", width/2-margin.left)
          .attr("dy", "3em")
          .style("text-anchor", "end")
    	      .text(names[val])

  hist4.append("g")
      .attr("class", "y axis hist4")
      .call(hist4y)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -70)
      .attr("dy", ".7em")
      .style("text-anchor", "end")
      .text("Number of Galaxies");

}

var xvar = "sSFR", yvar = "q";


//scatterplot
function updateScatterX(val) {
  xvar = val;

  d3.csv("data/data_good_small.csv", function(error, data) {
    d3.selectAll(".scatter").remove();
    createscatter(data, xvar, yvar);
  });

    // clear brush and redraw histograms
  if (!brush.empty()) {
    d3.selectAll(".hist1").remove();
    d3.selectAll(".hist2").remove();
    d3.selectAll(".hist3").remove();
    d3.selectAll(".hist4").remove();
    d3.selectAll(".brush").call(brush.clear());
    createhist1(histwidth, formatCount, valshist1, hd1);
    createhist2(histwidth, formatCount, valshist2, hd2);
    createhist3(histwidth, formatCount, valshist3, hd3);
    createhist4(histwidth, formatCount, valshist4, hd4);
  }
}

function updateScatterY(val) {
  yvar = val;

  d3.csv("data/data_good_small.csv", function(error, data) {
    d3.selectAll(".scatter").remove();
    createscatter(data, xvar, yvar);
  });

  // clear brush and redraw histograms
  if (!brush.empty()) {
    d3.selectAll(".hist1").remove();
    d3.selectAll(".hist2").remove();
    d3.selectAll(".hist3").remove();
    d3.selectAll(".hist4").remove();
    d3.selectAll(".brush").call(brush.clear());
    createhist1(histwidth, formatCount, valshist1, hd1);
    createhist2(histwidth, formatCount, valshist2, hd2);
    createhist3(histwidth, formatCount, valshist3, hd3);
    createhist4(histwidth, formatCount, valshist4, hd4);
  }
}


var yValue = function(d) { return +d[yvar];}, // data -> value
    xValue = function(d) { return +d[xvar];}; // data -> value

function createscatter(data, xvar, yvar) {

 var xScale = d3.scale.linear().range([0, 2*width/3 - margin.left - margin.right ]), // value -> display
     xMap = function(d) { return xScale(xValue(d));}, // data -> display
     xAxis = d3.svg.axis().scale(xScale).orient("bottom");

 // setup y

  var yScale = d3.scale.linear().range([height - margin.top - margin.bottom, 0]), // value -> display
     yMap = function(d) { return yScale(yValue(d));}, // data -> display
     yAxis = d3.svg.axis().scale(yScale).orient("left");

// clip outliers at 3 sigma

lowcutX = d3.mean(data, xValue) - 3 * d3.deviation(data, xValue)
highcutX = d3.mean(data, xValue) + 3 * d3.deviation(data, xValue) 

if (lowcutX > d3.min(data, xValue)) {
    minX = lowcutX
} else { 
    minX = d3.min(data, xValue)
}

if (highcutX < d3.max(data, xValue)) {
    maxX = highcutX
} else { 
    maxX = d3.max(data, xValue)
}


lowcutY = d3.mean(data, yValue) - 3 * d3.deviation(data, yValue)
highcutY = d3.mean(data, yValue) + 3 * d3.deviation(data, yValue) 

if (lowcutY > d3.min(data, yValue)) {
    minY = lowcutY
} else { 
    minY = d3.min(data, yValue)
}

if (highcutY < d3.max(data, yValue)) {
    maxY = highcutY
} else { 
    maxY = d3.max(data, yValue)
}

     //xScale.domain([d3.min(data, xValue)-0.2, d3.max(data, xValue)+0.2]);
     //yScale.domain([d3.min(data, yValue)-0.2, d3.max(data, yValue)+0.2]);

     xScale.domain([minX-0.2, maxX+0.2]);
     yScale.domain([minY-0.2, maxY+0.2]);


// need to remove points outside 3 sigma from the plot!!!


  svg.append("g")
      .attr("class", "x axis scatter")
      .attr('transform', 'translate(0, ' + (height - margin.top - margin.bottom) + ')')
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("dx", 2*width/3-margin.left)
      .attr("dy", "3em")
      .style("text-anchor", "end")
      .text(names[xvar]);

  // y-axis
  svg.append("g")
      .attr("class", "y axis scatter")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", -70)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(names[yvar]);

  // Brush and Linking
  brush = d3.svg.brush()
              .x(xScale)
              .y(yScale)
              .on("brushstart", brushstart)
              .on("brush", brushmove)
              .on("brushend", brushend);

  svg.append("g")
    .attr("class", "brush")
    .style("opacity", 0.5)
    .call(brush);

  svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot scatter")
        .attr("r", 3.5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", "#333")
        .style("opacity", function(d) {            // remove outliers from chart
            if (d[xvar] < minX || d[xvar] > maxX || d[yvar] < minY || d[yvar] > maxY) {return "0"} 
            else    { return "1" }       
        ;})   
        .on("mouseover", function(d) {
          d3.select(this).attr("r", 4 ).style("fill", "#4682b4");
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html("<div class=\"tip\">" +  yvar + ": " + d[yvar] + "<br/>" + xvar + ": "  + d[xvar] + "</div>")
               .style("left", (d3.event.pageX + 10) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
        if (d3.select(this).classed("selected")) {
          d3.select(this).attr("r", 3.5 ).style("fill", "#ffa500");
        }
        else {
          d3.select(this).attr("r", 3.5 ).style("fill", "#333");
        }
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });
}

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


// Brush and linking
var brushCell;
var brush;

function brushstart(p) {
  if (brushCell != this) {
    d3.select(brushCell).call(brush.clear());
    brushCell = this;
  }
}

function brushmove(p) {
  var e = brush.extent();


  // class dots in selected area and color appropriately
  svg.selectAll("circle").classed("selected", function(d) {
    var isSelected = e[0][0] < xValue(d) && xValue(d) < e[1][0]
            && e[0][1] < yValue(d) && yValue(d) < e[1][1];

    if (isSelected) {
      // change to orange
      d3.select(this).attr("r", 3.5 ).style("fill", "#ffa500");
    } else {
      // keep black
      d3.select(this).attr("r", 3.5 ).style("fill", "#333");
    }

    return isSelected;
  })

  // histogram bars
}

function brushend(p) {
  d3.selectAll(".hist1").remove();
  d3.selectAll(".hist2").remove();
  d3.selectAll(".hist3").remove();
  d3.selectAll(".hist4").remove();

	if (brush.empty()) {
		svg.selectAll(".selected").classed("selected", false);

    createhist1(histwidth, formatCount, valshist1, hd1);
    createhist2(histwidth, formatCount, valshist2, hd2);
    createhist3(histwidth, formatCount, valshist3, hd3);
    createhist4(histwidth, formatCount, valshist4, hd4);
		return true;
  }

  var selhist1 = [];
  var selhist2 = [];
  var selhist3 = [];
  var selhist4 = [];

	// histogram data
	svg.selectAll(".selected").classed("selected", function(d) {

 		selhist1.push(+d[hd1]);
		selhist2.push(+d[hd2]);
		selhist3.push(+d[hd3]);
		selhist4.push(+d[hd4]);

    return true;
  });
  createhist1(histwidth, formatCount, valshist1, hd1, selhist1);
  createhist2(histwidth, formatCount, valshist2, hd2, selhist2);
  createhist3(histwidth, formatCount, valshist3, hd3, selhist3);
  createhist4(histwidth, formatCount, valshist4, hd4, selhist4);

}

// Data

d3.csv("data/data_good_small.csv", function(error, data) {
  data.forEach(function(d) {
      valshist1.push(+d[hd1]);
      valshist2.push(+d[hd2]);
      valshist3.push(+d[hd3]);
      valshist4.push(+d[hd4]);
  });


createscatter(data, xvar, yvar);
createhist1(histwidth, formatCount, valshist1, hd1);
createhist2(histwidth, formatCount, valshist2, hd2);
createhist3(histwidth, formatCount, valshist3, hd3);
createhist4(histwidth, formatCount, valshist4, hd4);


});
