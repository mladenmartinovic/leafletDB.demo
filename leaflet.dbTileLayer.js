'use strict';
L.TileLayer.dbTileLayer = L.TileLayer.extend({
	initialize: function (url, options) {
		console.log("initialize")
		var $this=this
		L.TileLayer.prototype.initialize.call(this, url, options)
		
		$this.database = {};
		$this.database.db = null;
		$this.database.maxTile = 100;
		$this.memCashList=[[],[]]
		
	},
	databaseError : function(e, cb) {
		cb(undefined)
	},
	checkDB: function(cb){
		console.log("checkDB")
		var $this=this
		$this.indexedDB=window.indexedDB;
		if (!$this.indexedDB) {
			cb(false)
			console.log("indexedDB: Your browse doesn't support indexDB");
		}else {		
			console.log("indexedDB: Your browse SUPPORT indexDB");
			cb(true)
		}
	},
	openDB:function(version, cb){
		console.log("openDB")
		var $this=this
		var request=indexedDB.open("map", version)
		
		request.onupgradeneeded=function(e){
			var db=e.target.result;
			e.target.transaction.onerror=indexedDB.onerror;
			
			if (db.objectStoreNames.contains("Tile")){
				db.deleteObjectStore("Tile")
			}
			var store=db.createObjectStore("Tile",
				{keyPath:"url"});
				
			if (db.objectStoreNames.contains("TileMemCache")){
				db.deleteObjectStore("TileMemCache");
			}
			var store=db.createObjectStore("TileMemCache",
				{keyPath:"key"});	
		}
		request.onsuccess = function(e) {
			$this.database.db = e.target.result;
			cb(true)
		};
		request.onerror = $this.databaseError;
	},
	test : function(){
		
		var $this=this;
		
		$this.test.result=[]
		setInterval(function(){
			
			console.log("TEST", $this.memCashList[0].length)
			var dList0={}
			var dList1={}
			var p=[]
			var len=$this.test.result.length
			for (var i=0;i<len;i++){
				$this.test.result.pop()
			}
			for (var i=0;i<$this.memCashList[0].length;i++) {
				dList0[$this.memCashList[0][i]]=""
				$this.getTile($this.memCashList[0][i], function(data){
					if (data.image===null){
						var pp= p.length + " vs " + ($this.memCashList[0].length);
						$this.test.result.push({"NOT OK Test 1 - dbTile vs memCash (list0)": pp})
					} else {
						p.push("a")
						if (p.length==$this.memCashList[0].length) {
							var pp= p.length + " vs " + ($this.memCashList[0].length);
							$this.test.result.push({"OK Test 1 - dbTile vs memCash (list0)": pp})
						}
					}
				})
			}
			var pl=[]
			for (var i=0;i<$this.memCashList[1].length;i++) {
				dList1[$this.memCashList[1][i]]=""
				$this.getTile($this.memCashList[1][i], function(data){
					if (data.image===null){
						var pp= "OK " + pl.length + " vs " + ($this.memCashList[1].length);
						$this.test.result.push({"NOT OK Test 2 - dbTile vs memCash (list1)": pp})
					} else {
						pl.push("a")
						if (pl.length==$this.memCashList[1].length) {
							var pp= "OK " + pl.length + " vs " + ($this.memCashList[1].length);
							$this.test.result.push({"OK Test 2 - dbTile vs memCash (list1)": pp})
						}
					}
				})
			}
			if (Object.keys(dList0).length == $this.memCashList[0].length){
				$this.test.result.push({"OK - UNIQUE TEST LIST 0 TEST LENGTH": Object.keys(dList0).length + " vs " + $this.memCashList[0].length})
			} else {
				$this.test.result.push({"NOT OK - UNIQUE TEST LIST 0 TEST LENGTH": Object.keys(dList0).length + " vs " + $this.memCashList[0].length})
			}
			if (Object.keys(dList1).length == $this.memCashList[1].length){
				$this.test.result.push({"OK - UNIQUE TEST LIST 1 TEST LENGTH": Object.keys(dList1).length + " vs " + $this.memCashList[1].length})
			} else {
				$this.test.result.push({"NOT OK - UNIQUE TEST LIST 1 TEST LENGTH": Object.keys(dList1).length + " vs " + $this.memCashList[1].length})
			}
			
			var bothList=[];
			bothList.push.apply(bothList, $this.memCashList[0])
			bothList.push.apply(bothList, $this.memCashList[1])
			var dBothList={}
			for (var i=0;i<bothList.length;i++) {
				dBothList[bothList[i]]=""
			}
			if (Object.keys(dBothList).length == bothList.length){
				$this.test.result.push({"OK - UNIQUE TEST dBothList TEST LENGTH GOOD": Object.keys(dBothList).length + " vs " + bothList.length})
			} else {
				$this.test.result.push({"NOT OK - UNIQUE TEST dBothList TEST LENGTH GOOD": Object.keys(dBothList).length + " vs " + bothList.length})
			}
			$this.getTiles( function(data){
				if (data.length==bothList.length){
					$this.test.result.push({"OK - COMPARE db Tiles vs bothList": data.length + " vs " + bothList.length})
				} else {
					$this.test.result.push({"NOT OK - COMPARE db Tiles vs bothList": data.length + " vs " + bothList.length})
				}
			})
			
		},15000)
	},
	setTileMemCache:function(urlImage){
		console.log("setTileMemCache")
		var $this=this
		var db = $this.database.db;
		if (db===null){
			console.log("IndexDB is not opened yet!");
		}
		
		else {
			
			var List0=[]
			var List1=[]
			
			// little test
	
				
					var t=false;
					for (var i=0;i<$this.memCashList[0].length;i++){
						if ($this.memCashList[0][i]!=urlImage.url) {
							List0.push($this.memCashList[0][i])
						} else {
							t=true;
						}
					}
					List0.push(urlImage.url)
					for (var i=0;i<$this.memCashList[1].length;i++){
						if ($this.memCashList[1][i]!=urlImage.url) {
							List1.push($this.memCashList[1][i])
						} else {
							t=true;
						}
					}
					
					if (!t) {
						$this.setTile({url:urlImage.url, image:urlImage.image})	
					}
					var shiftVal;
					if (List0.length > $this.database.maxTile) {
						shiftVal=List0.shift();
						List1.push(shiftVal);
					}
					
					if (List1.length > $this.database.maxTile) {
						shiftVal=List1.shift()
						// remove map from database
						$this.delTile(shiftVal, function(data){
							console.log("DELETED", data)
							if (!data){
								setTimeout(function(){
									$this.delTile(shiftVal, function(data){
										console.log("DELETED AGAIN", data)
										if (!data) {
											console.log("HEBI GA")
										}
									})
								},Math.random()*1000 + 1000)
							}
						})
					}
	/*			}  else {
					List0=[]
					List0.push(urlImage.url)
					$this.setTile({url:urlImage.url, image:urlImage.image})	
					// add map to database
					List1=[]
				} */
				
				var trans = db.transaction(["TileMemCache"], "readwrite");
				var store = trans.objectStore("TileMemCache");
				var time = new Date().getTime();
				var listKeyTile=[List0, List1]
				
				$this.memCashList=listKeyTile
				var request = store.put({
					"key":1,
					"tileList":listKeyTile,
					"timeStamp":time
				});
				request.onerror = function(e) {
					console.log("ERROR setTile")
				};				

			

		}
	},
	getTileMemCache:function(callback) {
		console.log("getTileMemCache")
		var cb = callback;
		var $this=this
		var db = $this.database.db;
		if (db===null){
			console.log("IndexDB is not opened yet!");
			cb(null)
		}
		else {
			var trans=db.transaction(["TileMemCache"],"readwrite");
			var store=trans.objectStore("TileMemCache");		

			var request=store.get(1);

			request.onsuccess=function(e){
				if (e.target.result){
					cb(e.target.result.tileList)
				} else {	
					cb([[],[]])
				};
			};
			request.onerror=$this.databaseError;
		
		}
	},
	setTile:function(tile) {
		console.log("setTile")
		var $this=this
		var db = $this.database.db;
		if (db===null){
			console.log("IndexDB is not opened yet!");
		}
		else {
			var trans = db.transaction(["Tile"], "readwrite");
			var store = trans.objectStore("Tile");
			var time = new Date().getTime();
			var request = store.put({
				"url":tile.url,
				"image":tile.image,
				"timeStamp":time
			});
			request.onerror = function(e) {
				console.log("ERROR setTile")
			};
		}
	},

	getTile:function(url, callback) {
		console.log("getTile")
		var cb = callback;
		var $this=this
		var db = $this.database.db;
		if (db===null){
			console.log("IndexDB is not opened yet!");
			cb(null)
		}
		else {
			var trans=db.transaction(["Tile"],"readwrite");
			var store=trans.objectStore("Tile");		

			var request=store.get(url);
			
			request.onsuccess=function(e){
				if (e.target.result){
					cb(e.target.result)
				} else {	
					cb({url:url, image:null})
				};
			};
			request.onerror=$this.databaseError;
		}
	},
	getTiles:function(callback) {
		console.log("getTiles")
		var cb = callback;
		var $this=this
		var db = $this.database.db;
		if (db===null){
			console.log("IndexDB is not opened yet!");
			cb(null)
		}
		else {
			var trans=db.transaction(["Tile"],"readwrite");
			var store=trans.objectStore("Tile");		

			var request=store.openCursor();
			var tiles=[]
			request.onsuccess=function(e){
				var cursor=e.target.result;
				if (cursor) {
					tiles.push(cursor.value);
					cursor.continue();
				} else {
					cb(tiles)
				};
			};
			request.onerror=$this.databaseError;
		
		};
	},
	delTile:function(url, callback) {
		console.log("delTile")
		var cb = callback;
		var $this=this
		var db = $this.database.db;
		if (db===null){
			console.log("IndexDB is not opened yet!");
			cb(null)
		}
		else {
			var trans=db.transaction(["Tile"],"readwrite");
			var store=trans.objectStore("Tile");		

			var request=store.delete(url);
			
			request.onsuccess=function(e){
				cb(true);	
			};
			request.onerror=function(e){
				cb(false);	
			};
		
		};
	},
	_myLoadTile: function($this, tile, urlOut) {
		console.log("_myLoadTile")
		$this.getTile(urlOut, function(data){
			if (data.image == null || data.image == undefined){
				var xhr = new XMLHttpRequest();
				xhr.open('GET', data.url);
				xhr.responseType = 'blob';
				xhr.send();
				xhr.onreadystatechange = function(){
					if (this.readyState === 4 && this.status === 200){
						var dbData=this.response
									
									
						var localURL=(window.URL || window.webkitURL).createObjectURL(dbData)
						var image = new Image();
						image.onload = function() {
							var canvas = window.document.createElement('canvas');
							canvas.width = image.width;
							canvas.height = image.height;

							var context = canvas.getContext('2d');
							context.drawImage(image, 0, 0);

							var imageFile=canvas.toDataURL("image/jpeg",0.15);
							$this.setTileMemCache({url:data.url, image:imageFile});
						
						}
						image.src=localURL
							
							tile.src = image.src;

							$this.fire('tileloadstart', {
								tile: tile,
								url: tile.src
							})								
					} else {
						console.log("indexDB net NOT OK")
					};
				};
			} else {
				var image = new Image();
/* 				image.onload = function() {
					
				} */
//				image.src=data.image							
				tile.src = data.image

				$this.fire('tileloadstart', {
					tile: tile,
					url: tile.src
				});	
				$this.setTileMemCache({url:urlOut, image:tile.src})	
			}
		})		
	},
	_loadTile: function (tile, tilePoint) {
		console.log("_loadTile")
		var $this=this
		
		var version=11
		
		$this._adjustTilePoint(tilePoint);
		var urlOut=$this.getTileUrl(tilePoint);
		
		tile._layer  = $this;
		tile.onload  = $this._tileOnLoad;
		tile.onerror = $this._tileOnError;

		if ($this.database.db==null || $this.database.db==undefined) {
			$this.checkDB(function(data){
				if (data){
					$this.openDB(version, function(data){
						if (data){
							$this.getTileMemCache(function(data){
								$this.memCashList=data
								console.log("$this.memCashList", $this.memCashList);
								$this._myLoadTile($this, tile, urlOut)
							})
							
						}
					})
				}
			})	
		}  else {
			$this._myLoadTile($this, tile, urlOut)
			
		} 
	}
})
L.tileLayer.dbTileLayer = function (url, options) {
  return new L.TileLayer.dbTileLayer(url, options);
};
