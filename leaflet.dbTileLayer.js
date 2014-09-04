'use strict';
var LZW={}
LZW = {
	compress : function(uncompressed){
		var i, dictionary={}, c, wc, w="", result=[], dictSize=256
		for (i=0;i<dictSize;i++){
			dictionary[String.fromCharCode(i)]=i;
		}
		
		for (i=0; i< uncompressed.length;i++){
			c=uncompressed.charAt(i)
			wc=w+c;
			if (dictionary.hasOwnProperty(wc)) {
				w=wc;
			} else {
				result.push(dictionary[w])
				dictionary[wc]=dictSize++;
				w=String(c)
			}
		}
		if (w !=="") {
			result.push(dictionary[w])
		}
		return result
	} ,
	decompress : function(compressed){
		var i, dictionary=[], w, result, k, entry="", dictSize=256;
		for (i=0;i<dictSize;i++){
			dictionary[i]=String.fromCharCode(i);
		}
		
		w=String.fromCharCode(compressed[0])
		result=w;
		for (i=1;i<compressed.length;i++){
			k=compressed[i]
			if (dictionary[k]) {
				entry=dictionary[k];
			} else {	
				if (k===dictSize) {
					entry=w + w.charAt(0)
				} else {

					return null;
				}
			}
			result += entry;
			dictionary[dictSize++]=w + entry.charAt(0);
			w=entry;
		}	
		return result;
	}
	
}
function ascForEach(array, fn, callback) {
	  array = array.slice(0);
	  function processOne() {
		var item = array.shift();
		fn(item, function(result) {
			if(array.length > 0) {
			  setTimeout(processOne, 5); 
			} else {
			  callback();
			}
		  });
	  }
	  if(array.length > 0) {
		setTimeout(processOne, 5); 
	  } else {
		callback(); 
	  }		
	}
function fixTile($this, List0, List1, maxTile) {
	var shiftVal;
	if (List0.length > maxTile) {
		shiftVal=List0.shift();
		List1.push(shiftVal);
	}
	
	if (List1.length > maxTile) {
		shiftVal=List1.shift()
		var forDel=shiftVal
		// remove map from database
		if ($this.timeCacheDict[shiftVal] != null && $this.timeCacheDict[shiftVal] != undefined){
			var cntTile=0;
			while (true) {
				// check of value is on save
				List0.push(shiftVal);
				shiftVal==List0.shift();
				List1.push(shiftVal);
				shiftVal==List1.shift();
				if ($this.timeCacheDict[shiftVal] == null || $this.timeCacheDict[shiftVal] == undefined){
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
					return [List0, List1]
				}
				if (i>maxTile) {
					// za svaki sucaj
					console.log("this have to be imposibile")
					$this.delTile(forDel, function(data){
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
					return [List0, List1]
				}
				cntTile+=1
			}	
		} else {
			
			$this.delTile(forDel, function(data){
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
	}
	return [List0, List1]
	
}
L.TileLayer.dbTileLayer = L.TileLayer.extend({
	initialize: function (url, options) {
		L.TileLayer.prototype.initialize.call(this, url, options)
		var $this=this
		$this.option=$this.options  
		
		$this.timeCacheDict={}
		$this.database = {};
		$this.database.db = null;
		$this.database.maxTile = 50;
		$this.database.maxNoOfFixDate = 50;
		
		$this.memCashList=[[],[]]
		
	},
	databaseError : function(e, cb) {
		cb(undefined)
	},
	checkDB: function(cb){
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
		var $this=this
		
		if ($this.option.dbName === null || $this.option.dbName === undefined) {
			$this.option.dbName=window.location.host + "//map"
			if ($this.option.dbName === "//map" || $this.option.dbName === "//map") {
				$this.option.dbName="map"
			}
		}
		var request=indexedDB.open($this.options.dbName, version)
		request.onupgradeneeded=function(e){
			var db=e.target.result;
			e.target.transaction.onerror=indexedDB.onerror;
			
			if (db.objectStoreNames.contains("Tile")){
				db.deleteObjectStore("Tile")
			}
			var store=db.createObjectStore("Tile",
				{keyPath:"url"});
				
			if (db.objectStoreNames.contains("MemCache")){
				db.deleteObjectStore("MemCache");
			}
			var store=db.createObjectStore("MemCache",
				{keyPath:"key"});	
			
			if (db.objectStoreNames.contains("TimeCache")){
				db.deleteObjectStore("TimeCache");
			}
			var store=db.createObjectStore("TimeCache",
				{keyPath:"key"});
		}
		request.onsuccess = function(e) {
			$this.database.db = e.target.result;
			cb(true)
		};
		request.onerror = $this.databaseError;
	},
	setTile_setMemCache_setTimeCacheDict:function(urlImage){
		var $this=this
		var db = $this.database.db;
		if (db===null){
			console.log("IndexDB is not opened yet!");
		} else {
			
			var List0=[]
			var List1=[]
			
			var t=false;
			for (var i=0;i<$this.memCashList[0].length;i++){
				if ($this.memCashList[0][i] != urlImage.url) {
					List0.push($this.memCashList[0][i]);
				} else {
					t=true;
				}
			}
			List0.push(urlImage.url)
			
			for (var i=0;i<$this.memCashList[1].length;i++){
				if ($this.memCashList[1][i] != urlImage.url) {
					List1.push($this.memCashList[1][i])
				} else {
					t=true;
				}
			}
			if (!t) {
				$this.setTile({url:urlImage.url, image:urlImage.image})	
			}
			if ($this.option.dateTo != null) {
				if ( $this.option.dateTo > new Date().getTime() ){
					if ($this.timeCacheDict[urlImage.url]==null || $this.timeCacheDict[urlImage.url]==undefined){
						$this.timeCacheDict[urlImage.url]=$this.option.dateTo.getTime();
						
					} else {
						if ($this.option.dateTo.getTime()>$this.timeCacheDict[urlImage.url]) {
							$this.timeCacheDict[urlImage.url]=$this.option.dateTo.getTime();
						}
					}
					for (var key in $this.timeCacheDict){
						if ($this.timeCacheDict[key] < new Date().getTime()){
							delete $this.timeCacheDict[key]
						}
					}
					if (Object.keys($this.timeCacheDict).length<$this.database.maxNoOfFixDate){
						$this.setTimeCash($this.timeCacheDict)
					}
				}	
			}
			

			
			
			var listKeyTile=fixTile($this, List0, List1, $this.database.maxTile)
			
			
			$this.memCashList=listKeyTile
			$this.setMemCache(listKeyTile);
			
		}
	},
	setTimeCash: function(timeCacheDict){	
		var $this=this
		var db = $this.database.db;
		var trans = db.transaction(["TimeCache"], "readwrite");
		var store = trans.objectStore("TimeCache");
		var time = new Date().getTime();
		
		var request = store.put({
			"key":0,
			"timeDict":timeCacheDict
		});
		request.onerror = function(e) {
			console.log("ERROR setTile")
		};				
	},
	getTimeCash:function(callback) {
		var cb = callback;
		var $this=this
		var db = $this.database.db;
		if (db===null){
			console.log("IndexDB is not opened yet!");
			cb(null)
		}
		else {
			var trans=db.transaction(["TimeCache"],"readwrite");
			var store=trans.objectStore("TimeCache");		

			var request=store.get(0);

			request.onsuccess=function(e){
				if (e.target.result){
					cb(e.target.result.timeDict)
				} else {	
					cb({})
				};
			};
			request.onerror=$this.databaseError;
		}
	},
	
	setMemCache	: function(listKeyTile){
		var $this=this
		var db = $this.database.db;
		var trans = db.transaction(["MemCache"], "readwrite");
		var store = trans.objectStore("MemCache");
		var time = new Date().getTime();
		
		var request = store.put({
			"key":0,
			"tileList":listKeyTile
		});
		request.onerror = function(e) {
			console.log("ERROR setTile")
		};				
	},
	getMemCache:function(callback) {
		var cb = callback;
		var $this=this
		var db = $this.database.db;
		if (db===null){
			console.log("IndexDB is not opened yet!");
			cb(null)
		}
		else {
			var trans=db.transaction(["MemCache"],"readwrite");
			var store=trans.objectStore("MemCache");		

			var request=store.get(0);

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
		var cb = callback;
		var $this=this
		var db = $this.database.db;
		if (db===null){
			console.log("IndexDB is not opened yet!");
		} else {
			var trans=db.transaction(["Tile"],"readwrite");
			var store=trans.objectStore("Tile");		
			console.log("delTile", url);
			var request=store.delete(url);
			
			request.onsuccess=function(e){
				cb(true);	
			};
			request.onerror=function(e){
				cb(false);	
			};
		};
	},
	delTimeCash:function(){
		var $this=this;
		var db = $this.database.db;
		if (db.objectStoreNames.contains("TimeCache")){
			var trans=db.transaction(["TimeCache"],"readwrite");
			var store=trans.objectStore("TimeCache");		
			
			var cursorRequest=store.openCursor();
			cursorRequest.onsuccess=function(e){
				var cursor=e.target.result;
				if(cursor===null || cursor === undefined){
					console.log("TimeCache Deleted")
					$this.timeCacheDict={}
				}
				else {
					cursor.delete();
					cursor.continue();
				}
			};
		}
	},
	resetDB:function(){
		var $this=this;
		var db = $this.database.db;
		
		if (db.objectStoreNames.contains("Tile")){
			var trans=db.transaction(["Tile"],"readwrite");
			var store=trans.objectStore("Tile");		
			
			var cursorRequest=store.openCursor();
			cursorRequest.onsuccess=function(e){
				var cursor=e.target.result;
				if(cursor===null || cursor === undefined){
					console.log("Tile Deleted")
				}
				else {
					cursor.delete();
					cursor.continue();
				}
			};
		}
		
		if (db.objectStoreNames.contains("MemCache")){
			var trans=db.transaction(["MemCache"],"readwrite");
			var store=trans.objectStore("MemCache");		
			
			var cursorRequest=store.openCursor();
			cursorRequest.onsuccess=function(e){
				var cursor=e.target.result;
				if(cursor===null || cursor === undefined){
					console.log("MemCache Deleted")
					$this.memCashList=[[],[]]
				}
				else {
					cursor.delete();
					cursor.continue();
				}
			};
		}
		
		if (db.objectStoreNames.contains("TimeCache")){
			var trans=db.transaction(["TimeCache"],"readwrite");
			var store=trans.objectStore("TimeCache");		
			
			var cursorRequest=store.openCursor();
			cursorRequest.onsuccess=function(e){
				var cursor=e.target.result;
				if(cursor===null || cursor === undefined){
					console.log("TimeCache Deleted")
					$this.timeCacheDict={}
				}
				else {
					cursor.delete();
					cursor.continue();
				}
			};
		}
		
	},
	_myLoadTile: function($this, tile, urlOut) {
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
							$this.setTile_setMemCache_setTimeCacheDict({url:data.url, image:imageFile});
						
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
				$this.setTile_setMemCache_setTimeCacheDict({url:urlOut, image:tile.src})	
			}
		})		
	},
	_loadTile: function (tile, tilePoint) {
		var $this=this
		var version=67
		
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
							$this.getMemCache(function(data){
								$this.memCashList=data
								$this.getTimeCash(function(data){
									$this.timeCacheDict=data;
									$this._myLoadTile($this, tile, urlOut)
								})
							})
						}
					})
				}
			})
		}  else {
			$this._myLoadTile($this, tile, urlOut)
			
		} 
	},
	test : function(){
		
		var $this=this;
		$this.test.result=[]
		setInterval(function(){
			var dList0={}
			var dList1={}
			var p=[]
			var len=$this.test.result.length
			for (var i=0;i<len;i++){
				$this.test.result.pop()
			}
			
			if ( $this.memCashList[0].length>0 ) {
				$this.getTile($this.memCashList[0][parseInt(Math.random()*$this.memCashList[0].length-1)], function(data){
					var Uncompress=data.image.length*6
					var cpr=LZW.compress(data.image)
					var Compress=cpr.length * 54
					$this.test.result.push({"Why people use LZW for images??? JPEG / LZW JPEG":  Uncompress/ Compress})
				})
			}
			
			var acsVar0=[]
			ascForEach($this.memCashList[0], function(el, callBack){
				$this.getTile(el, function(data){
					if (data.image===null){
						acsVar0.push(el)
					} 
					callBack(acsVar0)
				})
			}, function(){
				if (acsVar0.length==0){
					$this.test.result.push({"OK getTile vs memCash (list0)":acsVar0.length})
				} else {
					$this.test.result.push({"NOT OK getTile vs memCash (list0)":acsVar0.length})
				}
			});
			var acsVar1=[]
			ascForEach($this.memCashList[1], function(el, callBack){
				$this.getTile(el, function(data){
					if (data.image===null){
						acsVar1.push(el)
					} 
					callBack(acsVar1)
				})
			}, function(){
				if (acsVar1.length==0){
					$this.test.result.push({"OK getTile vs memCash (list0)":acsVar1.length})
				} else {
					$this.test.result.push({"NOT OK getTile vs memCash (list0)":acsVar1.length})
				}
			});
			
			
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
					$this.test.result.push({"OK - COMPARE Images in DB vs bothList": data.length + " vs " + bothList.length})
				} else {
					$this.test.result.push({"NOT OK - COMPARE Images in DB vs bothList": data.length + " vs " + bothList.length})
				}
			})
			
		},15000)
	}
})
L.tileLayer.dbTileLayer = function (url, options) {
  return new L.TileLayer.dbTileLayer(url, options);
};
