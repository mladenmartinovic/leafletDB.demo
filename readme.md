<h3> dbTileLayer.js</h3> 
<em>verson 0.6</em> 
<pre>
My solution of offline map using leaflet.js and indexedDB. 
IndexedDB consists of three tables, Tile, MemCache and TimeCache. 
Tile:
Table Tile consist of JPEG images converted with canvas with compression of 0.15, 
which means <b> original tile of cca 50kB convert to cca 6 kB.</b> Quality of images you can
see on test, I think its good.
In the future, the best way is to already have compresed tiles on server and take it
 as is.
<b>LZW compresion is useless for images.</b>

MemCache:
200 tiles was forseen with logic of MemCache. MemCache is table with the url of individual 
maps. The whole logic revolves around MemCache. 
Tiles which came to 201 place is deleted, but it can be extended as you wish. I make litle 
mistake with two array ( first idea is to have time / no time limit but in meantime I make 
third table - TimeCache )
Logic of MemCache is FILO: tiles that were used last are on the first place, the oldest on a 
last place or delete. 
MemCache is name of table and has nothing to do with Memcached.

TimeCache:
If we put time limit of map it permanent save half to the point of time. After this point it 
could be erase, if come on last place. Other word, it save permanent first 100 tiles, after 
save but not permanent. It works on this way because I need that on this way. 

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
	var options={
			attribution: 'Bla bla',
			dateTo:new Date("12/1/2014"), 
			dbName:"map" // without it is url
			compress:0.16  // without it is 0.15
		}
	var mapLayer=L.tileLayer.dbTileLayer('http://someServer/tile/{z}/{y}/{x}', options);	
<br>	mapLayer.addTo(map)
...
To change options of layer:
	var options={
			attribution: 'Bla bla',
			dateTo:new Date("1/1/2015"), 
			dbName:"map", // without it is url
			compress:0.16  // without it is 0.15
		}
	mapLayer.setOptions(options)
</pre>
...
To remove layer:
map.removeLayer(mapLayer);
(it is untested)

<a href="http://plnkr.co/edit/3yk2ysbVGNtsgluPsVPQ?p=preview"  target="dbTileLayer">Test example</a>

<h4>Have a fun!</h4>
