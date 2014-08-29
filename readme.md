# test number 1

Usage of file is simple:
html:
at the begining of html:<br>
\<link rel="stylesheet" href="lib/leaflet/leaflet.css" /\>
at the end of html:<br> 	\<script type="text/javascript" src="lib/leaflet/leaflet.js"></script\>
						\<script type="text/javascript" src="gitProject/leaflet.dbTileLayer.js"></script\> 
in the middle of html:<br>   \<div id="map" style="height:600px; cursor:crosshair"></div\>

<br>Somewhere in code: 
<br>	var map = L.map('map').setView([Some lat,Some lng], Some zoom);
<br>	var mapLayer=L.tileLayer.dbTileLayer('http://Some Server/tile/{z}/{y}/{x}', {
<br>		attribution: 'Some attribute',
<br>		});
		
<br>	mapLayer.addTo(map)

Have a fun!
