<template>
    <a-entity id="globe-container" >
        <a-sphere 
                id="Earth" class="boundry"
                :rotation="'0 0 0'"
                :radius="radius"
                material="src:#earth; roughness: 1; transparent: true; opacity: 0.9;">
        </a-sphere>

        <a-globe-points v-if="$store.state.facet=='events'"
            :points="geoCoords"
            :radius="radius">
        </a-globe-points>

    </a-entity>
</template>

<script>
export default {
    props: {
      'radius': {
            type: Number,
            default: 1
        },
    },

    computed:{
        geoCoords: function() {
            var coords = [];
            switch (this.$store.state.facet) {
                case 'events':
                    var events = this.$store.state.objects.events;
                    for (var event of events) {
                        if (typeof event.hydratedLocation != 'undefined') {
                            coords.push(event.hydratedLocation.geolocation);
                        }
                        else if (typeof event.location != 'undefined' & event.location != null) {
                            coords.push(event.location.geolocation);
                        }
                    }
                    break;
                default:
                    console.debug('only the events facet has location data');
                    break;
            }
            return coords;
        },
    },

}
</script>