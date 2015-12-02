function calc_rect_height(d){
  var base = 15;
  com_l = (Math.ceil(d.properties.completed.length/2));
  pend_l = (Math.ceil(d.properties.pending.length/2));
  prop_l = (Math.ceil(d.properties.proposed.length/2));
  return base + (com_l + pend_l + prop_l) * 12;
}
function pack_text(d, type){
  base = -8;
  com_l = (Math.ceil(d.properties.completed.length/2));
  pend_l = (Math.ceil(d.properties.pending.length/2));
  prop_l = (Math.ceil(d.properties.proposed.length/2));
  if (type == "prop"){
    return base + (com_l + pend_l + prop_l) * 12;
  }
  if (type == "pend"){
    return base + (com_l + pend_l) * 12;
  }
  if (type == "com"){
    return base + (com_l) * 12;
  }
}
var width = 960,
    height = 650;

  var projection = d3.geo.miller()
  .scale(153)
  .translate([width / 2, height / 2])
.rotate([160,0])
  .precision(.1);

var path = d3.geo.path()
  .projection(projection);

  var graticule = d3.geo.graticule();

  var svg = d3.select(".hydromap_container").append("svg")
  .attr("width", "100%")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 " + width + " " + height );

  svg.append("path")
.datum(graticule)
  .attr("class", "graticule")
  .attr("d", path);

  d3.json("data/world-110m.json", function(error, world) {
    svg.insert("path", ".graticule")
    .datum(topojson.feature(world, world.objects.land))
    .attr("class", "land")
    .attr("d", path);

  svg.insert("path", ".graticule")
    .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
    .attr("class", "boundary")
    .attr("d", path);
  });
d3.json("data/ushydro.json", function(collection) {
  var years = [];
  tracks = svg.selectAll()
  .data(collection.features).enter().append("g")
  .append("svg:a")
  .attr("xlink:href", function(d){return "http://cchdo.ucsd.edu/search?query=" + d.properties.title})
  .attr("target", "_blank");
tracks.append("svg:path")
  .attr("class", "hydro")
  .attr("d", path);
tracks.append("svg:rect")
  .attr("class", "info")
  .attr("x", function(d){ return projection(d.properties.box)[0]-40})
  .attr("y", function(d){ return projection(d.properties.box)[1]-20})
  .attr("width", "75px")
  .attr("height", function(d){ return calc_rect_height(d)});
tracks.append("svg:text")
  .attr("x", function(d){ return projection(d.properties.box)[0]})
  .attr("y", function(d){ return projection(d.properties.box)[1]-8})
  .attr("text-anchor", "middle")
  .attr("font-size", "13px")
  .text(function(d){return d.properties.title});
tracks.append("svg:text")
  .attr("x", function(d){ return projection(d.properties.box)[0]})
  .attr("y", function(d){ return projection(d.properties.box)[1]+ pack_text(d, 'com')})
  .attr("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("class", "completed")
  .text(function(d){return d.properties.completed});
tracks.append("svg:text")
  .attr("x", function(d){ return projection(d.properties.box)[0]})
  .attr("y", function(d){ return projection(d.properties.box)[1]+ pack_text(d, 'pend')})
  .attr("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("class", "pending")
  .text(function(d){return d.properties.pending});
tracks.append("svg:text")
  .attr("x", function(d){ return projection(d.properties.box)[0]})
  .attr("y", function(d){ return projection(d.properties.box)[1]+ pack_text(d, "prop")})
  .attr("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("class", "proposed")
  .text(function(d){return d.properties.proposed});
for (var c in collection.features){
  years = years.concat(collection.features[c].properties.completed);
  years = years.concat(collection.features[c].properties.pending);
  years = years.concat(collection.features[c].properties.proposed);
}
document.getElementById("hydromap_year_end").innerHTML = d3.max(years);
document.getElementById("hydromap_year_start").innerHTML = d3.min(years);
});

