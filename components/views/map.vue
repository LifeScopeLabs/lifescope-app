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
  import icons from '../../lib/util/icons';

  let MapboxSpiderifier;
  let mapboxgl;

  export default {
    components: {
      Mapbox
    },

    methods: {
      initializeMap: function(map) {
        this.$store.state.map = map;
      },

      loadMap: function() {
        if (this.$store.state.view === 'map' && this.$store.state.objects.events.length > 0) {
          this.populateMap();
        }
      },

      getEventTypeIcon: function(type) {
        return icons('event', type)
      },

      populateMap: function() {
        let self = this;
        let map = this.$store.state.map;

        let features = [];
        let SPIDERFY_FROM_ZOOM = 20;
        let CLUSTER_RADIUS = 50;

        _.each(this.$store.state.objects.events, function(event, index) {
          let color = index % 3 === 0 ? '#6CC644' : index % 3 === 1 ? '#BD2C00' : '#6E5494';
          if (event.location != null) {
            features.push({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: event.location.geolocation
              },
              properties: {
                id: event.id,
                color: color
              }
            })
          }
        });

        let spiderifier = new MapboxSpiderifier(map, {
          customPin: true,
          markerWidth: 200,
          markerHeight: 200,
          onClick: function(e, spiderLeg) {
            let eventId = spiderLeg.feature.id;
          },
          animate: true,
          initializeLeg: initializeSpiderLeg
        });

        function initializeSpiderLeg(spiderLeg){
          console.log(spiderLeg);

          let pinElem = spiderLeg.elements.pin;
          let feature = spiderLeg.feature;
          let popup;

          let event = _.find(self.$store.state.objects.events, function(event) {
            return event.id === spiderLeg.feature.id;
          });

          pinElem.className = pinElem.className + ' fa-stack fa-lg';
          pinElem.innerHTML = '<i class="circle-icon fa fa-circle fa-stack-2x"></i>' + '<i class="type-icon ' + self.getEventTypeIcon(event.type) + ' fa-stack-1x"></i>';
          pinElem.style.color = feature.color;

          $(pinElem)
            .on('mouseenter', function(){
              popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
                offset: MapboxSpiderifier.popupOffsetForSpiderLeg(spiderLeg)
              });

              popup.setHTML(event.context + ' via ' + event.connection.provider.name + ' on ' + moment.utc(event.datetime).local().format('M/D/YY')).addTo(map);

              spiderLeg.mapboxMarker.setPopup(popup);
            })
            .on('mouseleave', function(){
              if(popup){
                popup.remove();
              }
            })
            .on('click', function() {
              console.log('Rendering modal');
              self.renderDetailsModal(event);
            });
        }

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
          spiderifier.unspiderfy();
        });

        map.on('click', 'clusters', function(e) {
          let features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });

          if (!features.length) {
            return;
          }

          let feature = features[0];

          let clusterId = features[0].properties.cluster_id;

          if (map.getZoom() < SPIDERFY_FROM_ZOOM) {
            map.getSource('events').getClusterExpansionZoom(clusterId, function(err, zoom) {
              if (err)
                return;

              map.easeTo({
                center: feature.geometry.coordinates,
                zoom: zoom
              });
            });
          }
          else {
            map.getSource('events').getClusterLeaves(clusterId, 100, 0, function(err, data){
              let markers = _.map(data, function(child){
                return child.properties;
              });

              spiderifier.spiderfy(feature.geometry.coordinates, markers);
            });
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
      },

      renderDetailsModal: function(event) {
        if (event) {
          console.log(event);
          console.log(this.$modal);
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
      let self = this;

      MapboxSpiderifier = require('mapboxgl-spiderifier');
      mapboxgl = require('mapbox-gl');

      this.$root.$on('search-finished', function(init) {
        if (init === true) {
          self.populateMap();
        }
      });
    }
  }
</script>
