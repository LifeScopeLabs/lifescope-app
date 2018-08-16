<template>
  <div>
    <mapbox
      v-bind:access-token='$store.state.mapbox.accessToken'
      v-bind:map-options='$store.state.mapbox.options'
      v-on:map-init='initializeMap'
      v-on:map-load='loadMap'
    >

    </mapbox>

    <div v-if="$store.state.searching === true" class="map-corner flexbox">
      <i class="fa fa-spinner fa-spin" style="margin-right: 0.2em"></i>
      <div>Loading more results</div>
    </div>

    <div v-if="$store.state.searchEnded === false && $store.state.searching !== true" class="map-corner clickable" v-on:click="$root.$emit('perform-search', false)">Get more results</div>

    <modals-container/>
  </div>
</template>

<script>
  import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

  import Mapbox from 'mapbox-gl-vue';
  import Draw from '@mapbox/mapbox-gl-draw';

  import Details from '../modals/details.vue';
  import icons from '../../lib/util/icons';
  import uuid from '../../lib/util/uuid';

  let MapboxSpiderifier;
  let mapboxgl;
  let mapboxDraw = new Draw({
    displayControlsDefault: false,
    controls: {
      polygon: true,
      trash: true
    }
  });

  export default {
    components: {
      Mapbox
    },

    methods: {
      initializeMap: function(map) {
        map.addControl(mapboxDraw, 'top-left');

        this.$store.state.map = map;

        console.log(mapboxDraw);
      },

      loadMap: function() {
        if (this.$store.state.view === 'map' && this.$store.state.objects.events.length > 0) {
          this.populateMap();
        }
      },

      getEventTypeIcon: function(type) {
        return icons('event', type)
      },

      populateMap: function(init) {
        let self = this;
        let map = this.$store.state.map;

        let SPIDERFY_FROM_ZOOM = 20;
        let CLUSTER_RADIUS = 50;

        let features = [];
        let markers = [];

        if (map.getLayer('events') != null) {
          map.removeLayer('events');
        }

        if (map.getLayer('clusters') != null) {
          map.removeLayer('clusters');
        }

        if (map.getLayer('cluster-count') != null) {
          map.removeLayer('cluster-count');
        }

        if (map.getSource('events') != null) {
          map.removeSource('events');
        }

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
            .on('mouseenter', function() {
              popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
                offset: MapboxSpiderifier.popupOffsetForSpiderLeg(spiderLeg)
              });

              popup.setHTML(event.context + ' via ' + event.connection.provider.name + ' on ' + moment.utc(event.datetime).local().format('M/D/YY')).addTo(map);

              spiderLeg.mapboxMarker.setPopup(popup);
            })
            .on('mouseleave', function() {
              if (popup) {
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

        if (init) {
          map.on('click', function(e) {
            spiderifier.unspiderfy();
          });

          map.on('click', 'clusters', function(e) {
            let features = map.queryRenderedFeatures(e.point, {
              layers: ['clusters']
            });

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
              map.getSource('events').getClusterLeaves(clusterId, 100, 0, function(err, data) {
                let markers = _.map(data, function(child) {
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

            let symbols = map.queryRenderedFeatures(e.point, {
              layers: ['events']
            });

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
                .on('mouseenter', function() {
                  popup = new mapboxgl.Popup({
                    closeButton: false,
                    closeOnClick: false,
                    offset: 20
                  });

                  popup.setHTML(event.context + ' via ' + event.connection.provider.name + ' on ' + moment.utc(event.datetime).local().format('M/D/YY')).addTo(map);

                  marker.setPopup(popup);
                })
                .on('mouseleave', function() {
                  if (popup) {
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

          map.on('zoomstart', function() {
            spiderifier.unspiderfy();
          });

          map.on('draw.create', function(e) {
            let feature = e.features[0];

            if (feature) {
              self.$root.$emit('polygon-created', feature);
            }
          });

          map.on('draw.delete', function(e) {
            console.log(e);

            self.$root.$emit('polygon-deleted', e.features);
          });

          map.on('draw.selectionchange', function(e) {
            console.log(e);

            let features = e.features;

            if (features && features.length > 0) {
              let selectFeature = features[features.length - 1];

              self.$root.$emit('polygon-selected', selectFeature)
            }
          });

          map.on('draw.update', function(e) {
            self.$root.$emit('polygon-updated', e.features);
          });
        }
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
        self.populateMap(init);
      });

      this.$root.$on('deselect-mapbox', function() {
        mapboxDraw.changeMode('simple_select')
      });

      this.$root.$on('remove-unattached-polygons', function() {
        let filterPolygonIds = {};

        _.each(self.$store.state.searchBar.filters, function(filter) {
          if (filter.type === 'where') {
            filterPolygonIds[filter.data.object_id] = true;
          }
        });

        let polygons = mapboxDraw.getAll();

        let toDelete = [];

        _.each(polygons.features, function(polygon) {
          if (filterPolygonIds[polygon.id] == null) {
            toDelete.push(polygon.id);
          }
        });

        mapboxDraw.delete(toDelete);
      });

      this.$root.$on('redraw-polygons', function() {
        console.log('Redrawing Polygons');
        mapboxDraw.deleteAll();

        let whereFilters = _.filter(self.$store.state.searchBar.filters, function(filter) {
          return filter.type === 'where';
        });

        _.each(whereFilters, function(filter) {
          let newPolygonId = uuid();
          let polygonCoordinates = filter.data.coordinates;

          if (polygonCoordinates[0] !== polygonCoordinates[polygonCoordinates.length - 1]) {
            polygonCoordinates.push(polygonCoordinates[0]);
          }

          mapboxDraw.add({
            id: newPolygonId,
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [polygonCoordinates]
            }
          });

          filter.data.object_id = newPolygonId;
        });
      });

      this.$root.$on('select-polygon', function(filter) {
        if (filter.type === 'where' && filter.data && filter.data.object_id != null) {
          mapboxDraw.changeMode('simple_select', {
            featureIds: [filter.data.object_id]
          });
        }
      });
    }
  }
</script>
