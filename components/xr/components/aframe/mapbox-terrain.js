
if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
  }
  else {
    console.debug("Registering mapbox-terrain...");
}

AFRAME.registerComponent('mapbox-terrain', {
	schema: {
		latitude: {
			type: 'number',
			default: 0,
		},
		longitude: {
			type: 'number',
			default: 0,
		},
		'zoom-level': {	// http://wiki.openstreetmap.org/wiki/Zoom_levels
			type: 'number',
			default: 0,
		},
		type:  { // https://www.mapbox.com/api-documentation/#maps
			type: 'string',
			default: 'satellite',
		},
		shape:  { 
			oneOf: ['square', 'circle'],
			default: 'square',
		},
		rows: {
			type: 'number',
			default: 3
		},
		innerrow: {
			type: 'number',
			default: 0
		},
		highdpi: {
			type: 'boolean',
			default: true
		},
		heightmap: {
			type: 'boolean',
			default: false
		},
		heightmapscale: {
			type: 'number',
			default: 1
		},
		offsetx: {
			type: 'number',
			default: 0
		},
		offsety: {
			type: 'number',
			default: 0
		},
	},

	update: function() {
		if(this.el.object3DMap['mapmesh'] !== undefined) {
			this.el.removeObject3D('mapmesh');
		}
		this._createMapBox();
	},

	_createMapBox: function() {
		var self = this;
		// https://www.mapbox.com/studio/account/tokens/
		var access_token = CONFIG.mapbox.access_token;

		var mapLatitude = this.data.latitude;
		var mapLongitude = this.data.longitude;
		var mapZoomLevel = this.data['zoom-level'];
		var tileX = this._long2tile(mapLongitude, mapZoomLevel) + this.data.offsetx;
		var tileY = this._lat2tile(mapLatitude, mapZoomLevel) + this.data.offsety;

		var scale = 1;

		var tilesPerRow = self.data.shape == 'circle' ? 1 : this.data.rows;
		var innerRow = this.data.innerrow;
		var highDpi = this.data.highdpi;

		var leftX = (tilesPerRow % 2) ? parseInt((tilesPerRow-1)/2) : parseInt((tilesPerRow)/2);
		var rightX = (tilesPerRow % 2) ? parseInt((tilesPerRow-1)/2) : parseInt((tilesPerRow)/2 - 1);
		var innerLeftX = (innerRow % 2) ? parseInt((innerRow-1)/2) : parseInt((innerRow)/2);
		var innerRightX = (innerRow % 2) ? parseInt((innerRow-1)/2) : parseInt((innerRow)/2 - 1);

		var geo = self.data.shape == 'circle' ? self._buildCircularGeometry() : self._buildPlaneGeometry();

		for (var dx = -leftX; dx<=rightX; dx++) {
			for (var dy = -leftX; dy<=rightX; dy++) {
					if (dy >= -innerLeftX && dy <= innerRightX && dx >= -innerLeftX && dx <= innerRightX) {
					continue;
				}
				this._callbackClosureDebug(dx, dy, 0, function (dx, dy) {
					// console.log("_callbackClosureDebug callback");

					var texture = self._buildTerrainTexture(tileX+dx, tileY+dy, highDpi, function(image) {
						console.debug('texture loaded');
					});

					
					var mat = new THREE.MeshPhongMaterial({ map: texture });
					if (self.data.heightmap) {
						geo = self._buildElevationPlaneGeometry(tileX+dx, tileY+dy);
					}
					var mesh = new THREE.Mesh(geo, mat);
					mesh.translateX(dx);//, 0, dy);
					mesh.translateZ(dy);
					mesh.matrixAutoUpdate = false;
					mesh.updateMatrix();
					
					
					var group = self.el.getObject3D('mapmesh') || new THREE.Group();
					group.add(mesh);
					self.el.setObject3D('mapmesh', group);
				})();
			}
		}
	},

	_callbackClosureDebug: function(dx, dy, ctr, callback) {
		return function() {
			return callback(dx, dy, ctr);
		}
	},

	// http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#ECMAScript_.28JavaScript.2FActionScript.2C_etc..29
	_long2tile: function(lon,zoom) { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); },

	_lat2tile: function(lat,zoom) { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); },

	_buildTerrainTexture: function(tileX, tileY, highDpi, cb) {
		var dpi = highDpi ? '@2x' : '';
		var restURL = `https://api.mapbox.com/v4/mapbox.${this.data.type}/${this.data['zoom-level']}/${tileX}/${tileY}${dpi}.png?access_token=${CONFIG.mapbox.access_token}`;
		
		var texture = new THREE.TextureLoader()
		.load(
			restURL,
			cb
		)
		return texture;
	},

	_buildTerrainMesh: function(texture, geo) {
		var mat = new THREE.MeshPhongMaterial({ map: texture });
		var mesh = new THREE.Mesh(geo, mat);
		return mesh;
	},

	_buildPlaneGeometry: function(tileX, tileY){
		// console.log("_buildPlaneGeometry");
		var geometry	= new THREE.PlaneBufferGeometry( 1, 1, 512-1, 512-1 );
		geometry.rotateX(2 * Math.PI * -90 / 360);
		return geometry;
	},
	_buildCircularGeometry: function(tileX, tileY){
		// console.log("_buildCircularGeometry");
		var geometry	= new THREE.CircleBufferGeometry( 0.5, 100 );
		geometry.rotateX(2 * Math.PI * -90 / 360);
		return geometry;
	},

	_buildElevationPlane: function(tileX, tileY, highDpi, callback) {
		// console.log(`_buildElevationPlaneGeometry(${tileX}, ${tileY})`);
		// https://blog.mapbox.com/global-elevation-data-6689f1d0ba65
		var dpi = highDpi ? '@2x' : '';
		var restURL = `https://api.mapbox.com/v4/mapbox.terrain-rgb/${this.data['zoom-level']}/${tileX}/${tileY}${dpi}.pngraw?access_token=${CONFIG.mapbox.access_token}`;

		this._loadImage(restURL, function (image) {
			// console.log(`_loadImage(${restURL})`);
			callback(image);
		});
	},

	_loadImage: function(imageURL, onLoad) {
		var request = new XMLHttpRequest();
		request.addEventListener('load', function() {
			// console.log(`${imageURL} loaded`);
			var fileReader = new FileReader();
			fileReader.addEventListener('loadend', function(){
				// console.log(fileReader);
				var dataUrl = fileReader.result
				// console.log(`${imageURL} loaded`);
				var image = document.createElement('img')
				image.src = dataUrl
				image.addEventListener('load', function(){			
					// console.log(`${dataUrl} image loaded`);
					onLoad(image)
				}, {once: true})
			}, {once: true})
			fileReader.readAsDataURL(request.response);
		}, {once: true})
		request.open('GET', imageURL);
		request.responseType = 'blob';
		request.send();
	},

	_drawTile: function(tileX, tileY, dx, dy, meshOffset) {
		// console.log(`_drawTile(${tileX}, ${tileY}, ${dx}, ${dy}, ${meshOffset})`);
		// var geometry = this._buildElevationPlaneGeometry(tileX + dx, tileY + dy);
		var geometry = this._buildPlaneGeometry(tileX + dx, tileY + dy);

		geometry.rotateX(-Math.PI / 2);
		geometry.scale(4,4,4);
		geometry.translate(meshOffset*dx, 0, meshOffset*dy);
		return geometry;
	},

	_buildElevationPlaneGeometry: function(tileX, tileY){
		// console.log(`_buildElevationPlaneGeometry(${tileX}, ${tileY})`);
		// https://blog.mapbox.com/global-elevation-data-6689f1d0ba65
		var restURL = `https://api.mapbox.com/v4/mapbox.terrain-rgb/${this.data['zoom-level']}/${tileX}/${tileY}@2x.pngraw?access_token=${CONFIG.mapbox.access_token}`
		// debugger
		var geometry	= new THREE.PlaneBufferGeometry( 1, 1, 512-1, 512-1 );
		this._loadImage(restURL, function(image){
			
			var canvas = document.createElement('canvas')
			canvas.width = 512
			canvas.height = 512
			var context = canvas.getContext('2d')
			context.drawImage(image, 0, 0)
			var imageData = context.getImageData(0, 0, canvas.width, canvas.height)
			var elevationArray = imageData.data
			
			var positions = geometry.attributes.position.array
			for(var y = 0; y < canvas.height; y++ ){
				for(var x = 0; x < canvas.width; x++ ){
					var offset2 = (y*canvas.width + x)*4
					var height = -10000 + (elevationArray[offset2+0] *256*256 + elevationArray[offset2+1]*256 + elevationArray[offset2+2]) * 0.1

					height /= 10000
					height /= 3

					var offsetPosition = (y*canvas.width + x)*3;
					positions[offsetPosition+2] = height;
				}
			}
			geometry.attributes.position.needsUpdate = true;
			geometry.computeVertexNormals();
			geometry.rotateX(2 * Math.PI * -90 / 360);
		})

		return geometry
	}
})


AFRAME.registerPrimitive('a-mapbox-terrain', AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
	defaultComponents: {
		'mapbox-terrain': {},
	},
	mappings: {
		'latitude': 'mapbox-terrain.latitude',
		'longitude': 'mapbox-terrain.longitude',
		'zoom-level': 'mapbox-terrain.zoom-level',
		'rows': 'mapbox-terrain.rows',
		'innerrow': 'mapbox-terrain.innerrow',
		'highdpi': 'mapbox-terrain.highdpi',
		'heightmap': 'mapbox-terrain.heightmap',
		'heightmapscale': 'mapbox-terrain.heightmapscale',
		'offsetx': 'mapbox-terrain.offsetx',
		'offsety': 'mapbox-terrain.offsety',
		'type': 'mapbox-terrain.type',
		'shape': 'mapbox-terrain.shape',
	}
}))
