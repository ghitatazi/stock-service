var scotchTodo = angular.module('myprojectApplication', []);

function mainController($scope, $http) {
	$scope.stocks = {}

	setInterval(function() {
		$http.get('/api/stocks?count=1')
		.success(function(data) {
			if (Object.keys($scope.stocks).length === 0) {
				$scope.stocks = data;
			} else {
				newData = $scope.stocks;
				newData.push(data[0]);
				$scope.stocks = newData;
			}
		})
		.error(function(data) {
			console.log("Error: " + data);
		})
	}, 1000);

	$scope.$watch(function() {
    	if (Object.keys($scope.stocks).length !== 0) {
    		draw($scope.stocks);
    	}
	});

    // D3.js
    
    draw = function(data) {
    	// Set the dimensions of the canvas / graph
		var margin = {top: 30, right: 20, bottom: 70, left: 100},
		    width = 1000 - margin.left - margin.right,
		    height = 300 - margin.top - margin.bottom;

		// Set the ranges of X and Y axes
		var x = d3.scale.linear().range([0, width]);
		var y = d3.scale.linear().range([height, 0]);

		// Define the axes and label positions
		var xAxis = d3.svg.axis().scale(x)
		    .orient("bottom").ticks(Math.min(data.length-1, 20));

		var yAxis = d3.svg.axis().scale(y)
		    .orient("left").ticks(10);

		// Define the line charts
		var line1 = d3.svg.line()	
		    .x(function(d) { return x(d.indexVal); })
		    .y(function(d) { return y(d.CAC40Val); });

		var line2 = d3.svg.line()	
		    .x(function(d) { return x(d.indexVal); })
		    .y(function(d) { return y(d.NASDAQ); });

		// Empty graph_container
		$("#graph_container").empty();

		// Add the svg canvas
		var svg = d3.select("#graph_container")
		    .append("svg")
		        .attr("width", width + margin.left + margin.right)
		        .attr("height", height + margin.top + margin.bottom)
		    .append("g")
		        .attr("transform", 
		              "translate(" + margin.left + "," + margin.top + ")");

		// Get the data
	    data.forEach(function(d) {
			d.indexVal = d.index;
			d.CAC40Val = d.stocks.CAC40;
			d.NASDAQ = d.stocks.NASDAQ;
	    });

	    // Scale the range of the data
	    x.domain(d3.extent(data, function(d) { return d.indexVal; }));
	    y.domain([0, d3.max(data, function(d) { return Math.max(d.CAC40Val, d.NASDAQ); })]);

	    legendSpace = width/2;

	    // CAC40 graph
	    // Add points
        svg.append("path")
            .attr("class", "line")
            .style("stroke", function() { return "#00BFFF"; })
            .attr("d", line1(data));
        // Add the Legend
        svg.append("text")
            .attr("x", (legendSpace/2))
            .attr("y", height + (margin.bottom/2)+ 5)
            .attr("class", "legend")
            .style("fill", function() { return "#00BFFF"; })
            .text("CAC40");

        /// CAC40 graph
	    // Add points
		svg.append("path")
	            .attr("class", "line")
	            .style("stroke", function() { return "#FF6347"; })
	            .attr("d", line2(data));

        // Add the Legend
        svg.append("text")
            .attr("x", (legendSpace/2)+legendSpace)
            .attr("y", height + (margin.bottom/2)+ 5)
            .attr("class", "legend")
            .style("fill", function() { return "#FF6347"; })
            .text("NASDAQ");

	    // Add the X Axis
	    svg.append("g")
	        .attr("class", "x axis")
	        .attr("transform", "translate(0," + height + ")")
	        .call(xAxis);

	    // Add the Y Axis
	    svg.append("g")
	        .attr("class", "y axis")
	        .call(yAxis);
    }
}
