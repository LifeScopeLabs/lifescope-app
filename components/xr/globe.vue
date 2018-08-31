<template>
    <a-entity id="globe-container" 
            :position="position">
      <a-animation attribute="rotation"
                 easing="linear" 
                 dur="150000"
                 fill="forwards"
                 to="0 360 0"
                 repeat="indefinite"></a-animation>
    </a-entity>
    
</template>

<script>
// :position="position"

// TODO : parameterize animation values
console.log("from globe.vue <script>");
export default {
    props: {
      'position': {default: '0 1.5 -10'},
      'geoCoordinates': {default: () => [[0,1], [300,-20], [0, -20], [-300, 5], [0,1]]}
      },


    methods: {
        geoCoords: function() {
            // console.log("geoCoords called");
            var events = this.$store.state.objects.events;
            //console.log(events);
            var coords = [];
            for (var event of events) {
                //console.log(event.id);
                if (typeof event.hydratedLocation != 'undefined') {
                    //console.log('event.hydratedLocation.geolocation');
                    coords.push(event.hydratedLocation.geolocation);
                }
                else if (typeof event.location != 'undefined' & event.location != null) {
                    // console.log('event.location');
                    // console.log(event.location);
                    // console.log(event.location.geolocation);
                    coords.push(event.location.geolocation);
                }
            }
            return coords;
        },

        injectGeojson : function (src) {
            // inject a-entity of a globe with geojson from src
            var sceneEl = document.querySelector('a-scene');

            sceneEl.addEventListener('loaded', function () {
                // add GeoJson.  
                var aContainer = document.querySelector('#globe-container')
                aContainer.innerHTML = '<a-entity id="globe" geometry="primitive: sphere; radius: 1;" material="color: #F0A;" geojson="src: #' + src + '; featureKey: name;"></a-entity>'; // 
            });
        },

      loadGeoAsset : function (geoAsset) {
        // loads geojson data into assets on the fly
        //console.log("loadGeoAsset")

        var sceneEl = document.querySelector('a-scene');
        var geosrc = this.geoObjectToUrl(geoAsset)
        //console.log(sceneEl);
        //console.log(geosrc)

        sceneEl.addEventListener('loaded', function () {
          console.log("loadGeoAsset loaded");
          
          // add GeoJson asset  
          var aAssets = document.getElementsByTagName('a-assets')[0];
          var geoItem = document.createElement("a-asset-item");
          //console.log(aAssets);
          geoItem.setAttribute('id', 'geojson-fly')
          geoItem.setAttribute('src', geosrc)

          //console.log(geoItem)
          aAssets.appendChild(geoItem)
          //console.log(aAssets)
        });
      },

        latlongToGeojsonPoints : function (coordinates) {
            // creates a geojson FeatureCollection of Points
            // from an array of lat/long values
            //console.log("latlongToGeojsonPoint")
            var gj = {"type": "FeatureCollection",
                    "features": []}
            var nextID = 0;
            for (var coord of coordinates) {
                var feature = {
                    "type": "Feature",
                    // must give name property for featureKey or point will not be shown
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
            // console.log("geojson:");
            // console.log(gj)
            return(gj)
        },


        geoObjectToUrl : function (geo) {
            // converts a geojson object into a url
            // console.log("geoObjectToUrl")
            //console.log(geo)
            var url = 'data:text/json;charset=utf8,' + encodeURIComponent(JSON.stringify(geo));
            //console.log(url)
            return(url)
        }

    },
    
    mounted () {
        // console.log("globe mounted");
        // console.log(this.geoCoords());
        this.loadGeoAsset(this.latlongToGeojsonPoints(this.geoCoords()))
        this.injectGeojson('geojson-fly');
    }
}
</script>