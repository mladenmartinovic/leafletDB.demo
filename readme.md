# test number 1

<br>Usage of file is simple:
<br><em>at the begining of html:</em>
<br>  \<link rel="stylesheet" href="lib/leaflet/leaflet.css" /\>

<br><em> at the end of html:</em>
<br>  \<script type="text/javascript" src="lib/leaflet/leaflet.js"></script\>
<br>  \<script type="text/javascript" src="gitProject/leaflet.dbTileLayer.js"></script\> 

<br><em> in the middle of html:  </em>
<br> \<div id="map" style="height:600px; cursor:crosshair"></div\>

<br><em>Somewhere in code: </em>
<pre>
	var map = L.map('map').setView([Some lat,Some lng], Some zoom);
<br>	var mapLayer=L.tileLayer.dbTileLayer('http://Some Server/tile/{z}/{y}/{x}', {attribution: 'Some attribute',});		
<br>	mapLayer.addTo(map)
</pre>

# Have a fun!
