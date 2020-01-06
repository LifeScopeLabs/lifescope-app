
AFRAME.registerSystem('globe-points', {
    schema: {}, 

    init: function () {
        this.assetId = 0;
    },


    geoObjectToUrl : function (obj) {
        var url = 'data:text/json;charset=utf8,' + encodeURIComponent(JSON.stringify(obj));
        return(url)
    },

    coordinatesArray : function(points) {
        var lat = 0;
        var coordinates = points.map((x, index) => {
            if (index % 2 == 0) {
                lat = x;
                return null;
            }
            return [lat, x];
        });
        coordinates = coordinates.filter(x => x != null);
        return coordinates;
    },

    latlongToGeojsonPoints : function (coordinates) {
        var gj = {"type": "FeatureCollection",
                "features": []}
        var nextID = 0;
        for (var coord of coordinates) {
            var feature = {
                "type": "Feature",
                "properties": {"name": 'point-' + nextID++},
                "geometry": {
                "type": "Point",
                "coordinates": [
                    coord[0],
                    coord[1]
                ]
                }
            }
            gj.features.push(feature)
        }
        return(gj);
    },

    createAsset(url, id=-1) {
        var assetID = id == -1 ? this.assetID++ : id;

        var aAssets = document.getElementsByTagName('a-assets')[0];
        var geoItem = aAssets.querySelector("#geojson-" + assetID);
        if (geoItem) {
            geoItem.setAttribute('src', url);
            return assetID;
        }
        geoItem = document.createElement("a-asset-item");
        geoItem.setAttribute('id', 'geojson-' + assetID);
        geoItem.setAttribute('src', url);

        aAssets.appendChild(geoItem)
        return assetID;
    }
});
  

AFRAME.registerComponent('globe-points', {

    schema: {
        id: { type: 'string', default: '' },

        radius: { type: 'number', default: 1 },
        pointscale: { type: 'number', default: 0.01 },

        color:  { default: '#F0A' },

        points: { type: 'array', default: [] },
    },

    init() {
        if (this.data.points.length % 2 != 0) {
            throw new Error("points array must have even length");
        }
        
    },

    update(oldData) {
        const data = this.data;

        if (AFRAME.utils.deepEqual(oldData, data)) {
            return;
        }

        while (this.el.hasChildNodes()) {
            this.el.removeChild(this.el.lastChild);
        }

        var coordinates = this.system.coordinatesArray(this.data.points);
        var json = this.system.latlongToGeojsonPoints(coordinates);
        var url = this.system.geoObjectToUrl(json);
        var assetID = this.system.createAsset(url);
        var geoEl = this.createGeoEntity(assetID);
        this.el.appendChild(geoEl);
    },

    createGeoEntity(assetID) {
        var geoEl = document.createElement('a-entity');
        geoEl.setAttribute('geometry', {
            primitive: 'sphere',
            radius: this.data.radius
        });
        geoEl.setAttribute('material', {
            color: this.data.color
        });
        geoEl.setAttribute('geojson', {
            src: '#geojson-' + assetID,
            featureKey: 'name',
            pointScale: this.data.pointscale
        });
        return geoEl;
    }

});

AFRAME.registerPrimitive('a-globe-points', {
	defaultComponents: {
		'globe-points': {},
	},
	mappings: {
        'id': 'globe-points.id',
        'radius': 'globe-points.radius',
        'pointscale': 'globe-points.pointscale',
        'color': 'globe-points.color',
        'points': 'globe-points.points',
	}
});