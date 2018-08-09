<template>
  <mapbox
    v-bind:access-token='$store.state.mapbox.accessToken'
    v-bind:map-options='$store.state.mapbox.options'
    v-on:map-init='initializeMap'
    v-on:map-load='loadMap'
  >

  </mapbox>
</template>

<script>
  import Mapbox from 'mapbox-gl-vue';

  import Details from '../modals/details.vue';

  let MapboxSpiderifier;

  export default {
    components: {
      Mapbox
    },

    methods: {
      initializeMap: function() {},

      loadMap: function(map) {
        if (this.$store.state.view === 'map') {
          let features = [];
          let SPIDERFY_FROM_ZOOM = 22;
          let CLUSTER_RADIUS = 50;

          _.each(this.$store.state.objects.events, function(event) {
            if (event.location != null) {
              console.log(event.location.geolocation);
              features.push({
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: event.location.geolocation
                },
                properties: {
                  icon: 'monument',
                  id: event.id
                }
              })
            }
          });

          let spiderifier = new MapboxSpiderifier(map, {
            customPin: true
          });

          map.addSource('events', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: features
            },
            maxzoom: 24,
            cluster: true,
            clusterRadius: CLUSTER_RADIUS,
            clusterMaxZoom: 24
          });

          map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'events',
            filter: ['has', 'point_count'],
            paint: {
              'circle-color': [
                'step',
                ['get', 'point_count'],
                '#51bbd6',
                100,
                '#f1f075',
                750,
                '#f28cb1'
              ],
              'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                100,
                30,
                750,
                40
              ]
            }
          });

          map.addLayer({
            id: 'events',
            type: 'symbol',
            source: 'events',
            layout: {
              'icon-image': 'marker-15'
            },
            'filter': ['all',['!has', 'point_count']]
          });

          map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'events',
            filter: ['has', 'point_count'],
            layout: {
              'text-field': '{point_count_abbreviated}',
              'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
              'text-size': 12
            }
          });

          map.on('click', function(e) {
            let features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
            let feature = features[0];

            spiderifier.unspiderfy();

            if (!features.length) {
              return;
            }

            console.log(feature);
            let clusterId = features[0].properties.cluster_id;

            map.getSource('events').getClusterExpansionZoom(clusterId, function(err, zoom) {
              if (err)
                return;

              console.log('Zooming');
              console.log(feature.geometry);

              map.easeTo({
                center: feature.geometry.coordinates,
                zoom: zoom
              });
            });

            if (map.getZoom() < SPIDERFY_FROM_ZOOM && feature.properties.cluster_id) {
              console.log('Spiderifying');
              console.log(feature.properties.cluster_id);
              // map.getSource('events').getClusterLeaves(features[0].properties.cluster_id, 1000, 0, function(data){
              //   console.log(data);
              //   let markers = _.map(data.children, function(child){
              //     return child.properties;
              //   });
			  //
               //  spiderifier.spiderfy(features[0].geometry.coordinates, markers);
              // });

              let pointsInCluster = features.filter(function(f){
                let pointPixels = map.project(f.geometry.coordinates);
                let pixelDistance = Math.sqrt(
                  Math.pow(e.point.x - pointPixels.x, 2) +
                  Math.pow(e.point.y - pointPixels.y, 2)
                );

                return Math.abs(pixelDistance) <= CLUSTER_RADIUS;
              });

              console.log('Points in cluster:');
              console.log(pointsInCluster);

              let markers = _.map(pointsInCluster, function(point) {
                return point.properties;
              });

              console.log(markers);

              spiderifier.spiderfy(features[0].geometry.coordinates, markers);
            }
          });

          map.on('mouseenter', 'clusters', function () {
            map.getCanvas().style.cursor = 'pointer';
          });

          map.on('mouseleave', 'clusters', function () {
            map.getCanvas().style.cursor = '';
          });

          map.on('zoomstart', function(){
            spiderifier.unspiderfy();
          });
        }
      },

      renderDetailsModal: function(id) {
        let event = _.find(this.$store.state.objects.events, function(event) {
          return event.id === id;
        });

        if (event) {
          this.$modal.show(Details, {
            type: 'event',
            item: event
          }, {
            height: 'auto',
            scrollable: true,
            width: 1080,
            maxWidth: 1080
          })
        }
      }
    },

    mounted: function() {
      MapboxSpiderifier = require('mapboxgl-spiderifier');
    }
  }
</script>
