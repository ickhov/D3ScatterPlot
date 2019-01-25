// Set the dimensions of the canvas / graph

var margin = {top: 10, right: 20, bottom: 50, left: 50},
    width = 800 - margin.left - margin.right,
    height = 470 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%d-%b-%y");

// set the ranges
var x = d3.scaleLog().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select(".center").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.tsv("data/gapminderDataFiveYear.tsv", function(error, data) {
    if (error) throw error;

    // format the data (i.e., process it such that strings are converted to their appropriate types)
    data.forEach(function(d) {
        d.year = +d.year;
        d.pop = +d.pop;
        d.lifeExp = +d.lifeExp;
        d.gdpPercap = +d.gdpPercap;
    });

    // Scale the range of the data
    data = data.filter(function(d) {return d.year == 1952 || d.year == 2007; });
    x.domain(d3.extent(data, function(d) { return d.gdpPercap; }));
    y.domain(d3.extent(data, function(d) { return d.lifeExp; }));

    // Add the valueline path.
    /*
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline);
        */

    // color and size of dot
    var color = d3.schemeCategory10;
    var size = d3.scaleLinear().domain(d3.extent(data, function(d) {return d.pop})).range([4, 10]);
    
    // Add the scatterplot
    svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", function(d) { return size(d.pop); })
        .attr("cx", function(d) { return x(d.gdpPercap); })
        .attr("cy", function(d) { return y(d.lifeExp); })
        .attr("fill", function(d) { 
            if (d.year == 1952)
                return color[0];
            return color[1];
        })
        .attr("opacity", 0.8);

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("font-family", "sans-serif")
        .call(d3.axisBottom(x).ticks(11, ".0s"));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Label for X Axis
    svg.append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .text("GDP per Capita");

    // Label for Y Axis
    svg.append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 15)
        .attr("text-anchor", "middle")
        .text("Life Expectancy");

    // Chart Title
    svg.append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .attr("text-decoration", "underline") 
        .attr("x", width / 2)
        .attr("y", margin.top)
        .attr("text-anchor", "middle")
        .text("GDP vs Life Expectancy (1952, 2007)");

    var years = [1952, 2007];

    // legend grouping
    var legend = svg.append("g")
                    .attr("transform", "translate(" + (width - margin.left) + ",20)");
    
    // legend for 1952
    legend.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", color[0]);

    legend.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .attr("font-size", "11px")
        .attr("font-family", "sans-serif")
        .text(years[0]);

    // legend for 2007
    legend.append("rect")
        .attr("x", 0)
        .attr("y", 20)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", color[1]);

    legend.append("text")
        .attr("x", 20)
        .attr("y", 32)
        .attr("font-size", "11px")
        .attr("font-family", "sans-serif")
        .text(years[1]);
});
