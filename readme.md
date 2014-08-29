# test number 1

Usage of file is simple:
html:
at the begining of html <link rel="stylesheet" href="lib/leaflet/leaflet.css" />
at the end of html: 	<script type="text/javascript" src="lib/leaflet/leaflet.js"></script>
						<script type="text/javascript" src="gitProject/leaflet.dbTileLayer.js"></script> 
in the middle of html  <div id="map" style="height:600px; cursor:crosshair"></div>

Somewhere in code: 
	var map = L.map('map').setView([44.77958,16.57865], 6);
	var mapLayer=L.tileLayer.dbTileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
		});
		
	mapLayer.addTo(map)

Have a fun!
