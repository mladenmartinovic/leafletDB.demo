# test number 1

<br><b>Usage of file is simple:</b>
<br><em>at the begining of html:</em>
<br>  \<link rel="stylesheet" href="lib/leaflet/leaflet.css" /\>

<br><em> in the middle of html:  </em>
<br> \<div id="map" style="height:600px; cursor:crosshair"\>\</div\>


<br><em> at the end of html:</em>
<br>  \<script type="text/javascript" src="lib/leaflet/leaflet.js"\>\</script\>
<br>  \<script type="text/javascript" src="lib/leaflet/leaflet.dbTileLayer.js"\>\</script\> 

<br><em>Somewhere in code: </em>
<pre>
	var map = L.map('map').setView([someLat,someLng], someZoom);
<br>	var mapLayer=L.tileLayer.dbTileLayer('http://someServer/tile/{z}/{y}/{x}', {attribution: 'Some attribute',});		
<br>	mapLayer.addTo(map)
</pre>

<h3 style="color:red">Have a fun!</h3>
