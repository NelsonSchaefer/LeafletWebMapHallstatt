//JavaScript Document

//place a Map inside the div-container 'map'
var map = L.map('map', {
	fullscreenControl: true,
	center: [47.56, 13.65],
	zoom: 13,
	zoomControl: false,
});

//Zoom Home Plugin
var zoomHome = L.Control.zoomHome({homeCoordinates:[47.559, 13.6493],homeZoom: 16, zoomHomeTitle: "Zoom to Hallstatt"});
zoomHome.addTo(map);

//Basemaps
var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Mapdesign by Nelson Schäfer | Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Mapdesign by Nelson Schäfer | Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

var BasemapAT_basemap = L.tileLayer('https://maps{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.{format}', {
	maxZoom: 20,
	attribution: 'Mapdesign by Nelson Schäfer | Data source: <a href="https://www.basemap.at">basemap.at</a>',
	subdomains: ["", "1", "2", "3", "4"],
	format: 'png',
	bounds: [[46.35877, 8.782379], [49.037872, 17.189532]]
}).addTo(map);

//define two functions for when clicking on map features
function ClickOnFeatureSki(e) {
    map.fitBounds(e.target.getBounds());
	info.update(attractionsarray[13]);
	attractionsarray[13].openPopup();
}

function ClickOnFeatureFerry(e) {
	info.update(attractionsarray[10]);
	attractionsarray[10].openPopup();
}

//add skiarea polygon, changes color when hovering over it, executes function when cliked
var skiarea;
skiarea = L.geoJson(skiarea, {
    style: {
    color: "#e37c1b",
    weight: 0,
    opacity: 0.6,
	fillOpacity: 0.4,
},
    onEachFeature: function (feature, layer) {
        layer.on('click', ClickOnFeatureSki);
		layer.on('mouseover', function(){
			this.setStyle({
				'fillColor':'#b76315'
			});
		});
		layer.on('mouseout', function(){
			this.setStyle({
				'fillColor':'#e37c1b'
			});
		});
	}

});
skiarea.addTo(map);

//add ferry routes data, changes color when hovbering over it, executes function when cliked
var ferryroutes;
ferryroutes = L.geoJson(ferryroutes, {
    style: {
    color: "#737373",
    weight: 2.5,
	dashArray: "20 10",
	},
	    onEachFeature: function (feature, layer) {
        layer.on('click', ClickOnFeatureFerry);
		layer.on('mouseover', function(){
			this.setStyle({
				'color':'#a6a6a6'
			});
		});
		layer.on('mouseout', function(){
			this.setStyle({
				'color':'#737373'
			});
		});
	}
});
ferryroutes.addTo(map);	


//define which point from an input gets which marker
function getMarkerIcon(name) {
return  name == "Giant Ice Cave"    ? 'css/images/m1.png' :
        name == "Five Fingers"    	? 'css/images/m2.png' :
        name == "Boat Trip"  		? 'css/images/m3.png' :
        name == "Waldbachstrub Waterfall"  ? 'css/images/m4.png' :
		name == "Freesports Arena Dachstein Krippstein"       ? 'css/images/m5.png' :
        name == "Bathing Island"       		? 'css/images/m6.png' :
		name == "Salt Mines"       			? 'css/images/m7.png' :
		name == "World Heritage Skywalk"    ? 'css/images/m8.png' :
		name == "Underwater Diving Centre"  ? 'css/images/m9.png' :
		name == "Museum"       				? 'css/images/m10.png' :
		name == "Cruise Ferry Tours"       	? 'css/images/m11.png' :
		name == "Old Town and Market Square"       ? 'css/images/m12.png' :
		name == "Charnel Bone House"       	? 'css/images/m13.png' :
		name == "Classic Village view"      ? 'css/images/m14.png' :
											'css/images/marker-icon.png';
}

//define an array in which all point from the 'attractions'-dataset will be listed
var attractionsarray = [];

//add 'attractions' point layer
var attractions = L.geoJson(attractions, {
    pointToLayer: function (feature, latlng) {
		var markericon = L.icon({
		//icon of the marker depends on Name-column
		iconUrl: getMarkerIcon(feature.properties.Name),
		shadowUrl: 'css/images/shadow.png',
		shadowSize:   [50, 50],
		shadowAnchor: [15, 25],
		iconSize: [40, 40],
		iconAnchor: [15, 15],
		popupAnchor: [4, -10]
	});
		//the Name-column and Description-column is saved as an attribute for each marker
		var x = L.marker(latlng,{icon: markericon});
		x.name = feature.properties.Name;
		x.description = feature.properties.Description;
		//all markers get added to the array
		attractionsarray.push(x);
        return x;
		
    },
	onEachFeature: function(feature, marker) {
		marker.bindPopup('<b class="test">' +feature.properties.Name + '</b><br>');
	}
}).addTo(map);


//maptitle in map as control-box
var maptitle = L.control({position: 'topcenter'});

maptitle.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'maptitle');
    this.update();
    return this._div;
};

maptitle.update = function () {
    this._div.innerHTML = '<h1>Tourist Attractions around Lake Hallstatt</h1>';
};
maptitle.addTo(map);


//add list of attractions as a map-element
var legendlist = L.control({position: 'bottomleft'});

legendlist.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'legendlist');
    this.update();
    return this._div;
};

legendlist.update = function () {
    this._div.innerHTML =
	'<p><b>Zoom to Attractions:</b></p>' +
	'<p class = "a" id ="a1">1. Giant Ice Cave<br></p>' +
	'<p class = "a" id ="a2">2. Five Fingers<br></p>' +
	'<p class = "a" id ="a3">3. Boat Trip<br></p>' +
	'<p class = "a" id ="a4">4. Waldbachstrub Waterfall<br></p>' +
	'<p class = "a" id ="a5">5. Freesports Arena Dachstein Krippstein<br></p>' +
	'<p class = "a" id ="a6">6. Bathing Island<br></p>' +
	'<p class = "a" id ="a7">7. Salt Mines<br></p>' +
	'<p class = "a" id ="a8">8. World Heritage Skywalk<br></p>' +
	'<p class = "a" id ="a9">9. Underwater Diving Centre<br></p>' +
	'<p class = "a" id ="a10">10. Museum<br></p>' +
	'<p class = "a" id ="a11">11. Cruise Ferry Tours<br></p>' +
	'<p class = "a" id ="a12">12. Old Town and Market Square<br></p>' +
	'<p class = "a" id ="a13">13. Charnel Bone House<br></p>' +
	'<p class = "a" id ="a14">14. Classic Village View</p>';
};
legendlist.addTo(map);

//when clicking on an element in the list a function is called
document.getElementById("a1").addEventListener("click", flyToAttraction7);
document.getElementById("a2").addEventListener("click", flyToAttraction8);
document.getElementById("a3").addEventListener("click", flyToAttraction9);
document.getElementById("a4").addEventListener("click", flyToAttraction12);
document.getElementById("a5").addEventListener("click", flyToAttraction14);
document.getElementById("a6").addEventListener("click", flyToAttraction6);
document.getElementById("a7").addEventListener("click", flyToAttraction2);
document.getElementById("a8").addEventListener("click", flyToAttraction10);
document.getElementById("a9").addEventListener("click", flyToAttraction5);
document.getElementById("a10").addEventListener("click", flyToAttraction4);
document.getElementById("a11").addEventListener("click", flyToAttraction11);
document.getElementById("a12").addEventListener("click", flyToAttraction13);
document.getElementById("a13").addEventListener("click", flyToAttraction3);
document.getElementById("a14").addEventListener("click", flyToAttraction1);

//list of functions, sets the mapview to a specific marker, updates the content of the decription-box
function flyToAttraction1() {map.flyTo(attractionsarray[0].getLatLng(),17);info.update(attractionsarray[0]);}
function flyToAttraction2() {map.flyTo(attractionsarray[1].getLatLng(),16);info.update(attractionsarray[1]);}
function flyToAttraction3() {map.flyTo(attractionsarray[2].getLatLng(),17);info.update(attractionsarray[2]);}
function flyToAttraction4() {map.flyTo(attractionsarray[3].getLatLng(),17);info.update(attractionsarray[3]);}
function flyToAttraction5() {map.flyTo(attractionsarray[4].getLatLng(),17);info.update(attractionsarray[4]);}
function flyToAttraction6() {map.flyTo(attractionsarray[5].getLatLng(),16);info.update(attractionsarray[5]);}
function flyToAttraction7() {map.flyTo(attractionsarray[6].getLatLng(),15);info.update(attractionsarray[6]);}
function flyToAttraction8() {map.flyTo(attractionsarray[7].getLatLng(),15);info.update(attractionsarray[7]);}
function flyToAttraction9() {map.flyTo(attractionsarray[8].getLatLng(),15);info.update(attractionsarray[8]);}
function flyToAttraction10() {map.flyTo(attractionsarray[9].getLatLng(),15);info.update(attractionsarray[9]);}
function flyToAttraction11() {map.flyTo(attractionsarray[10].getLatLng(),17);info.update(attractionsarray[10]);}
function flyToAttraction12() {map.flyTo(attractionsarray[11].getLatLng(),15);info.update(attractionsarray[11]);}
function flyToAttraction13() {map.flyTo(attractionsarray[12].getLatLng(),17);info.update(attractionsarray[12]);}
function flyToAttraction14() {map.flyTo(attractionsarray[13].getLatLng(),14);info.update(attractionsarray[13]);}

//add mouseover function when hovering over an element in the list
document.getElementById("a1").addEventListener("mouseover", mouseoverfunction1);
document.getElementById("a2").addEventListener("mouseover", mouseoverfunction2);
document.getElementById("a3").addEventListener("mouseover", mouseoverfunction3);
document.getElementById("a4").addEventListener("mouseover", mouseoverfunction4);
document.getElementById("a5").addEventListener("mouseover", mouseoverfunction5);
document.getElementById("a6").addEventListener("mouseover", mouseoverfunction6);
document.getElementById("a7").addEventListener("mouseover", mouseoverfunction7);
document.getElementById("a8").addEventListener("mouseover", mouseoverfunction8);
document.getElementById("a9").addEventListener("mouseover", mouseoverfunction9);
document.getElementById("a10").addEventListener("mouseover", mouseoverfunction10);
document.getElementById("a11").addEventListener("mouseover", mouseoverfunction11);
document.getElementById("a12").addEventListener("mouseover", mouseoverfunction12);
document.getElementById("a13").addEventListener("mouseover", mouseoverfunction13);
document.getElementById("a14").addEventListener("mouseover", mouseoverfunction14);

//list of functions, changes color of the element in the list
function mouseoverfunction1() {
  document.getElementById("a1").style.color = '#A80000';
  document.getElementById("a1").style.cursor = 'pointer';
}
function mouseoverfunction2() {
  document.getElementById("a2").style.color = '#A80000';
  document.getElementById("a2").style.cursor = 'pointer';
}
function mouseoverfunction3() {
  document.getElementById("a3").style.color = '#A80000';
  document.getElementById("a3").style.cursor = 'pointer';
}
function mouseoverfunction4() {
  document.getElementById("a4").style.color = '#A80000';
  document.getElementById("a4").style.cursor = 'pointer';
}
function mouseoverfunction5() {
  document.getElementById("a5").style.color = '#A80000';
  document.getElementById("a5").style.cursor = 'pointer';
}
function mouseoverfunction6() {
  document.getElementById("a6").style.color = '#A80000';
  document.getElementById("a6").style.cursor = 'pointer';
}
function mouseoverfunction7() {
  document.getElementById("a7").style.color = '#A80000';
  document.getElementById("a7").style.cursor = 'pointer';
}
function mouseoverfunction8() {
  document.getElementById("a8").style.color = '#A80000';
  document.getElementById("a8").style.cursor = 'pointer';
}
function mouseoverfunction9() {
  document.getElementById("a9").style.color = '#A80000';
  document.getElementById("a9").style.cursor = 'pointer';
}
function mouseoverfunction10() {
  document.getElementById("a10").style.color = '#A80000';
  document.getElementById("a10").style.cursor = 'pointer';
}
function mouseoverfunction11() {
  document.getElementById("a11").style.color = '#A80000';
  document.getElementById("a11").style.cursor = 'pointer';
}
function mouseoverfunction12() {
  document.getElementById("a12").style.color = '#A80000';
  document.getElementById("a12").style.cursor = 'pointer';
}
function mouseoverfunction13() {
  document.getElementById("a13").style.color = '#A80000';
  document.getElementById("a13").style.cursor = 'pointer';
}
function mouseoverfunction14() {
  document.getElementById("a14").style.color = '#A80000';
  document.getElementById("a14").style.cursor = 'pointer';
}

//add mouseout function, restores original color of the text
document.getElementById("a1").addEventListener("mouseout", mouseoutfunction1);
document.getElementById("a2").addEventListener("mouseout", mouseoutfunction2);
document.getElementById("a3").addEventListener("mouseout", mouseoutfunction3);
document.getElementById("a4").addEventListener("mouseout", mouseoutfunction4);
document.getElementById("a5").addEventListener("mouseout", mouseoutfunction5);
document.getElementById("a6").addEventListener("mouseout", mouseoutfunction6);
document.getElementById("a7").addEventListener("mouseout", mouseoutfunction7);
document.getElementById("a8").addEventListener("mouseout", mouseoutfunction8);
document.getElementById("a9").addEventListener("mouseout", mouseoutfunction9);
document.getElementById("a10").addEventListener("mouseout", mouseoutfunction10);
document.getElementById("a11").addEventListener("mouseout", mouseoutfunction11);
document.getElementById("a12").addEventListener("mouseout", mouseoutfunction12);
document.getElementById("a13").addEventListener("mouseout", mouseoutfunction13);
document.getElementById("a14").addEventListener("mouseout", mouseoutfunction14);

//list of functions, changes color of the element in the list
function mouseoutfunction1() {
  document.getElementById("a1").style.color = 'black';
  document.getElementById("a1").style.cursor = 'default';
}
function mouseoutfunction2() {
  document.getElementById("a2").style.color = 'black';
  document.getElementById("a2").style.cursor = 'default';
}
function mouseoutfunction3() {
  document.getElementById("a3").style.color = 'black';
  document.getElementById("a3").style.cursor = 'default';
}
function mouseoutfunction4() {
  document.getElementById("a4").style.color = 'black';
  document.getElementById("a4").style.cursor = 'default';
}
function mouseoutfunction5() {
  document.getElementById("a5").style.color = 'black';
  document.getElementById("a5").style.cursor = 'default';
}
function mouseoutfunction6() {
  document.getElementById("a6").style.color = 'black';
  document.getElementById("a6").style.cursor = 'default';
}
function mouseoutfunction7() {
  document.getElementById("a7").style.color = 'black';
  document.getElementById("a7").style.cursor = 'default';
}
function mouseoutfunction8() {
  document.getElementById("a8").style.color = 'black';
  document.getElementById("a8").style.cursor = 'default';
}
function mouseoutfunction9() {
  document.getElementById("a9").style.color = 'black';
  document.getElementById("a9").style.cursor = 'default';
}
function mouseoutfunction10() {
  document.getElementById("a10").style.color = 'black';
  document.getElementById("a10").style.cursor = 'default';
}
function mouseoutfunction11() {
  document.getElementById("a11").style.color = 'black';
  document.getElementById("a11").style.cursor = 'default';
}
function mouseoutfunction12() {
  document.getElementById("a12").style.color = 'black';
  document.getElementById("a12").style.cursor = 'default';
}
function mouseoutfunction13() {
  document.getElementById("a13").style.color = 'black';
  document.getElementById("a13").style.cursor = 'default';
}
function mouseoutfunction14() {
  document.getElementById("a14").style.color = 'black';
  document.getElementById("a14").style.cursor = 'default';
}

/////////////////
//adds decription-box to the map
var info = L.control({position: 'bottomleft'});

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

// method to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML =   (props ? '<b>' + props.name + '</b></br>'  + props.description  
        : 'Click on an attraction in the list');
};
info.addTo(map);
//////////////////

//lists legend control features
var features = {	
	"Dachstein Krippstein Ski area": skiarea,
	"Ferry routes": ferryroutes,
}
// layer control for basemaps
var basemaps = {
	"Satellite image": Esri_WorldImagery,
	"OpenTopoMap": OpenTopoMap,
	"BasemapAT": BasemapAT_basemap,
}
L.control.layers(basemaps,features).addTo(map);


//Marker cluster plugin, all markers in 'markersgroup' get clustered
var markersgroup = L.markerClusterGroup(
{maxClusterRadius: 20,
removeOutsideVisibleBounds: false}
);
//all markers get added to the 'markersgroup' layer
var i;
for (i = 0; i < attractionsarray.length; i++){
	markersgroup.addLayer(attractionsarray[i]);
}
map.addLayer(markersgroup);





