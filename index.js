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
    .padding(10);

d3.csv("types.csv", function(d) {
	d.count = +d.count;
	if(d.count) return d;
}, function(err, classes){
	if(err) throw err;

	//console.log(classes);
	var root = d3.hierarchy({ "children" : classes})
				.sum(function(d){
					if(d.count) return d.count; 
				});
	//console.log(root);
	var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

	var node = svg.selectAll(".node")
    .data(pack(root).leaves())
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    //console.log(node);


  node.append("circle")
      .attr("type", function(d) { return d.data.type; })
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d, i) { return pokecolor[d.data.type]})
      .attr('stroke','black')
      .attr('stroke-width',0)
      .on('mouseover',function(d) {
      	console.log(d);
      	var rad = 1.1 * d.r;
        d3.select(this)
      	  .transition()
      	  .duration(1000)
      	  .attr("r", function(d) {return 1.1 * d.r} );
      	tooltip.text(d.data.type + ": " + format(d.data.count));
              tooltip.style("visibility", "visible");
      })
      .on('mouseout',function () {
        d3.select(this)
          .transition()
          .duration(1000)
          .attr("r", function(d) {return d.r});
        return tooltip.style("visibility", "hidden");
      })
      .on('mousemove', function(){ 
      	return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
      })
      



  node.append("text")
      .attr("dy", ".3em")
      .attr("font-size","15px")
      .style("text-anchor", "middle")
      .text(function(d) {
      		console.log(d);
            return d.data.type;
      });
});

