//console.log("test")

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var format = d3.format(",d");

var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("color", "white")
    .style("padding", "8px")
    .style("background-color", "rgba(0, 0, 0, 0.75)")
    .style("border-radius", "6px")
    .style("font", "12px sans-serif")
    .text("tooltip");

var pokecolor = {
	"Normal" : "#A8A77A",
	"Fire" :  "#EE8130",
	"Water" :  "#6390F0",
	"Electric" :  "#F7D02C",
	"Grass" :  "#7AC74C",
	"Ice" :  "#96D9D6",
	"Fighting" :  "#C22E28",
	"Poison" :  "#A33EA1",
	"Ground" :  "#E2BF65",
	"Flying" :  "#A98FF3",
	"Psychic" :  "#F95587",
	"Bug" :  "#A6B91A",
	"Rock" :  "#B6A136",
	"Ghost" :  "#735797",
	"Dragon" :  "#6F35FC",
	"Dark" :  "#705746",
	"Steel" :  "#B7B7CE",
	"Fairy" :  "#D685AD"
}

var pack = d3.pack()
    .size([width, height])
    .padding(0);


var setup = function(targetID, typeName){
	//Set size of svg element and chart
	var margin = {top: 0, right: 0, bottom: 0, left: 0},
		width = 600 - margin.left - margin.right,
		height = 1000 - margin.top - margin.bottom,
		categoryIndent = 4*15 + 5,
		defaultBarWidth = 2000;

	//Set up scales
	var x = d3.scaleLinear()
	  .domain([0,defaultBarWidth])
	  .range([0,width]);
	var y = d3.scaleBand()
	  .rangeRound([0, height], 0.1, 0);

	//Create SVG element
	d3.select(targetID).selectAll("svg").remove()
	var svg = d3.select(targetID).append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	//Package and export settings
	var settings = {
	  margin:margin, width:width, height:height, categoryIndent:categoryIndent,
	  svg:svg, x:x, y:y, typeName:typeName
	}
	return settings;
}

var redrawChart = function(settings, newdata) {

	//Import settings
	var margin=settings.margin, width=settings.width, height=settings.height, categoryIndent=settings.categoryIndent, 
	svg=settings.svg, x=settings.x, y=settings.y;


	//Reset domains
	y.domain(newdata.sort(function(a,b){
	  return b.value - a.value;
	})
	  .map(function(d) { return d.key; }));

	var barmax = d3.max(newdata, function(e) {
	  return e.value;
	});

	x.domain([0,barmax]);


	/////////
	//ENTER//
	/////////

	//Bind new data to chart rows 

	//Create chart row and move to below the bottom of the chart
	var chartRow = svg.selectAll("g.chartRow")
					  .data(newdata);
	
	var newRow = chartRow
	  .enter()
	  .append("g")
	  .attr("class", "chartRow")
	  .attr("transform", function(d){ return "translate(0," + y(d.key) + ")";});
	//Add rectangles
	newRow.insert("rect")
	  .attr("class","bar")
	  .attr("x", 0)
	  .attr("opacity",1)
	  .attr("height", y.bandwidth()*2)
	  .attr("width", function(d) { return x(d.value);});

	//Add value labels
	newRow.append("text")
	  .attr("class","label")
	  .attr("y", y.bandwidth()/2)
	  .attr("x",0)
	  .attr("opacity",1)
	  .attr("dy",".35em")
	  .attr("dx","0.5em")
	  .text(function(d){ return d.value;}); 
	
	//Add Headlines
	newRow.append("text")
	  .attr("class","category")
	  .attr("text-overflow","ellipsis")
	  .attr("y", y.bandwidth()/2)
	  .attr("x",categoryIndent)
	  .attr("opacity",1)
	  .attr("dy",".35em")
	  .attr("dx","0.5em")
	  .text(function(d){return d.key;});
	

	//Update bar widths
	//console.log(chartRow.select(".bar").transition().duration(300));
	// chartRow.select(".bar").transition()
	//   .duration(300)
	//   .attr("width", function(d) { console.log(d); return x(d.val);})
	//   .attr("opacity",1);

	// //Update data labels
	// //console.log(chartRow.select(".label").transition().duration(300).attr("opacity",1));
	// chartRow.select(".label").transition()
	//   .duration(300)
	//   .attr("opacity",1)
	//   .tween("text", function(d) { 
	//   	console.log(d);
	// 	var i = d3.interpolate(+this.textContent.replace(/\,/g,''), +d.value);
	// 	return function(t) {
	// 	  this.textContent = Math.round(i(t));
	// 	};
	//   });

	// //Fade in categories
	// chartRow.select(".category").transition()
	//   .duration(300)
	//   .attr("opacity",1);

	// //Fade out and remove exit elements
	// chartRow.exit().transition()
	//   .style("opacity","0")
	//   .attr("transform", "translate(0," + (height + margin.top + margin.bottom) + ")")
	//   .remove();

	// var delay = function(d, i) { return 200 + i * 30; };
	// chartRow.transition()
	// 	.delay(delay)
	// 	.duration(900)
	// 	.attr("transform", function(d){ console.log(y(d.key)); return "translate(0," + y(d.key) + ")"; });

};

var pullData = function(settings,callback){
	d3.csv("pokemon_alopez247.csv", function (err, data){
		//console.log(settings.typeName);
		var newdata = [];
		data.forEach(function(d){
			if(d.Type_1 == settings.typeName || d.Type_2 == settings.typeName) {
				var cp = +d.HP + +d.Attack + +d.Defense;
				newdata.push({"key": d.Name, "value" : +cp});
			}
		})
		//console.log(newdata)
		//newdata = formatData(newdata)
		callback(settings,newdata);

	})
}
//Sort data in descending order and take the top 10 values

var redraw = function(settings){
	pullData(settings,redrawChart)
}

d3.csv("types.csv", function(d) {
	d.count = +d.count;
	if(d.count) return d;
}, function(err, classes){
	if(err) throw err;

	var root = d3.hierarchy({ "children" : classes})
				.sum(function(d){
					if(d.count) return d.count; 
				});
	
	var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

    

	node = svg.selectAll(".node")
    .data(pack(root).leaves())
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    //console.log(node)
  node.append("circle")
      .attr("type", function(d) { return d.data.type; })
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d, i) { return pokecolor[d.data.type]})
      .attr('stroke','black')
      .attr('stroke-width',0)
      .on('mouseover',function(d) {
      	//console.log(d);
      	var rad = 1.1 * d.r;
        d3.select(this)
      	  .transition()
      	  .duration(1000)
      	  .attr("r", 1.1 * d.r );
      	  tooltip.text(d.data.type + ": " + format(d.data.count));
          tooltip.style("visibility", "visible");
      })
      .on('mouseout',function (d) {
        d3.select(this)
          .transition()
          .duration(1000)
          .attr("r", d.r);
        return tooltip.style("visibility", "hidden");
      })
      .on('mousemove', function(){ 
      	return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
      })
      .on('click', function(d){
      	var settings = setup('#chart', d.data.type);
      	redraw(settings)
      	
      })
      
  node.append("text")
      .attr("dy", ".3em")
      .attr("font-size","15px")
      .style("text-anchor", "middle")
      .text(function(d) {
      		//console.log(d);
            return d.data.type;
      });

});

