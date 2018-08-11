<template>
  <div>
    <mapbox
      v-bind:access-token='$store.state.mapbox.accessToken'
      v-bind:map-options='$store.state.mapbox.options'
      v-on:map-init='initializeMap'
      v-on:map-load='loadMap'
    >

    </mapbox>

    <modals-container/>
  </div>
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
        let markers = [];
        let self = this;
        let map = this.$store.state.map;

        let features = [];
        let SPIDERFY_FROM_ZOOM = 20;
        let CLUSTER_RADIUS = 50;

        _.each(this.$store.state.objects.events, function(event, index) {
          if (event.location != null) {
            let color = index % 3 === 0 ? '#6CC644' : index % 3 === 1 ? '#BD2C00' : '#6E5494';

            features.push({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: event.location.geolocation
              },
              properties: {
                event: event,
                color: color
              }
            })
          }
        });

        let spiderifier = new MapboxSpiderifier(map, {
          customPin: true,
          spiralFootSeparation: 500,
          circleFootSeparation: 500,
          animate: true,
          animationSpeed: 200,
          initializeLeg: initializeSpiderLeg
        });

        function initializeSpiderLeg(spiderLeg) {
          let pinElem = spiderLeg.elements.pin;
          let feature = spiderLeg.feature;
          let popup;

          let event = feature.event;

          pinElem.className = pinElem.className + ' map-marker fa-stack fa-lg';
          pinElem.innerHTML = '<i class="fill-circle fa fa-circle fa-stack-1x"></i>' + '<i class="circle-icon fa fa-map-marker fa-stack-3x"></i>' + '<i class="type-icon ' + self.getEventTypeIcon(event.type) + ' fa-stack-1x"></i>';
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
            .on('click', function(e) {
              e.stopPropagation();

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
          filter: ['all',['!has', 'point_count']]
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

        map.on('mouseenter', 'clusters', function() {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'clusters', function() {
          map.getCanvas().style.cursor = '';
        });

        map.on('render', function(e) {
          _.each(markers, function(marker) {
            marker.remove();
          });

          let symbols = map.queryRenderedFeatures(e.point, { layers: ['events']});

          _.each(symbols, function(symbol) {
            let popup;
            let event = JSON.parse(symbol.properties.event);
            let pinElem = document.createElement('div');
            let coordinates = symbol.geometry.coordinates;

            pinElem.className = 'map-marker fa-stack fa-lg';
            pinElem.innerHTML = '<i class="fill-circle fa fa-circle fa-stack-1x"></i>' + '<i class="circle-icon fa fa-map-marker fa-stack-3x"></i>' + '<i class="type-icon ' + self.getEventTypeIcon(event.type) + ' fa-stack-1x"></i>';
            pinElem.style.color = symbol.properties.color;

            let marker = new mapboxgl.Marker(pinElem)
              .setLngLat(coordinates)
              .addTo(map);

            $(pinElem)
              .on('mouseenter', function(){
                popup = new mapboxgl.Popup({
                  closeButton: false,
                  closeOnClick: false,
                  offset: 20
                });

                popup.setHTML(event.context + ' via ' + event.connection.provider.name + ' on ' + moment.utc(event.datetime).local().format('M/D/YY')).addTo(map);

                marker.setPopup(popup);
              })
              .on('mouseleave', function(){
                if(popup){
                  popup.remove();
                }
              })
              .on('click', function(e) {
                e.stopPropagation();

                self.renderDetailsModal(event);
              });

            markers.push(marker);
          });
        });

        map.on('zoomstart', function(){
          spiderifier.unspiderfy();
        });
      },

      renderDetailsModal: function(event) {
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
