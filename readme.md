<h3> dbTileLayer.js</h3> 
<em>verson 0.1</em> 

<pre>
My solution of offline map using leaflet.js and indexedDB. 
IndexedDB consists of two tables, Tile and TileMemCache. 
Table Tile consist of png images converted from canvas, 200 tiles was forseen width logic of TileMemCache. 
Tiles which came to 201 place is deleted, but it can be extended. Logic is (FILO): 
tiles that were used last are on the first place, the oldest on a last place or delete. 
Its good for now but not finished yet.
TileMemCache is table width the url of individual maps. 
The whole logic revolves around TileMemCache. 
TileMemCache is name of table and has nothing to do with memcached.

File has been tested on Chrome and FireFox and works. It will be better soon.
</pre>
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
<br>	var mapLayer=L.tileLayer.dbTileLayer('http://someServer/tile/{z}/{y}/{x}', {attribution: 'someAttribute',});		
<br>	mapLayer.addTo(map)
</pre>
<a href="http://run.plnkr.co/ZjXslOYWbelGmIAB/"  target="dbTileLayer">Test example</a>

<h4>Have a fun!</h4>
