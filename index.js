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
    .padding(1.5);

var reDrawBar = function(typeName){
	var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

    var x = d3.scaleBand()
    .rangeRound([0, width], .1);

	var y = d3.scaleLinear()
    .range([height, 0]);

    d3.select("#chart").selectAll("svg").remove();

    var barsvg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
    return "Name:" + d.name + "<br><strong>Combat Power:</strong> <span style='color:red'>" + d.cp + "</span>" ;
  })

    barsvg.call(tip);
    d3.csv("pokemon_alopez247.csv", function(d){
    	if(d.Type_1 == typeName || d.Type_2 == typeName) return d;
    }, function(err, data){
    	if(err) throw err;

    	var newdata = []
    	data.forEach(function(d){
    		newdata.push({"name" : d.Name, "cp" : (+d.HP + +d.Attack + +d.Defense)});
    	});
    	newdata.sort(function(a, b){
    		return b.cp - a.cp;
    	})

    	x.domain(newdata.map(function(d){ return d.name;}));
    	y.domain([0, d3.max(newdata, function(d){ return d.cp;})]);


    	var yAxis = d3.axisLeft()
    				.scale(y)
    				.tickFormat(format);

    	barsvg.selectAll(".bar")
    	.data(newdata)
    	.enter()
    	.append("rect")
    	.attr("class", "bar")
        .attr("x", function(d) { return x(d.name); })
        .attr("width", x.bandwidth()*0.8)
        .attr("height", 0)
        .attr('stroke','black')
        .attr('stroke-width',0)
        .style("fill", pokecolor[typeName])
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .on('click', function(d){

        	console.log(d);
        })

        barsvg.append("g")
      	.attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");

        barsvg.selectAll(".bar").transition()
        .duration(1000)
        .attr("y", function(d) { return y(d.cp); })
        .attr("height", function(d) { return height - y(d.cp); })


    });
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
      .attr("id", function(d) { return d.data.type; })
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) { return pokecolor[d.data.type]})
      .attr('stroke','black')
      .attr('stroke-width',0)
      .on('mouseover',function(d) {
      	//console.log(d);
      	var rad = 1.1 * d.r;

        d3.select(this)
      	  .transition()
      	  .duration(1000)
      	  .attr("r", 1.1 * d.r )
      	  tooltip.text(d.data.type + ": " + format(d.data.count));
          tooltip.style("visibility", "visible");
      })
      .on('mouseout',function (d) {
        d3.select(this)
          .transition()
          .duration(1000)
          .attr("r", d.r)
    
        return tooltip.style("visibility", "hidden");
      })
      .on('mousemove', function(){ 
      	return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
      })
      .on('click', function(d){
      	reDrawBar(d.data.type);
      	
      })
      
  node.append("text")
      .attr("dy", ".3em")
      .attr("font-size","15px")
      .style("text-anchor", "middle")
      .text(function(d) {
      		//console.log(d);
            return d.data.type;
      });

  reDrawBar("Steel");

});



