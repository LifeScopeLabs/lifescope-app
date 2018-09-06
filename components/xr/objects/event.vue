<template>
	<a-entity class="object event" v-bind:id="event.id" >
		
		<!-- background -->
		<a-entity 
				:id="'background-' + event.id"
				:geometry="'primitive: plane; width:' + carouselDim.backgroundWidth + '; height: ' + carouselDim.backgroundHeight"
				material="color: #3B3B3B; side: double; transparent: true; opacity: 0.4;"
				:position="(-carouselDim.backgroundWidth/4) + ' 0 -1'"
				:rotation="(-carouselDim.displayDegrees) + ' 0 0'">
		</a-entity>

		<!-- details -->
		<!--  +  (-horizontalToSlanted(3*carouselDim.lineSeparation, carouselDim.displayDegrees) - 1) -->
		<a-entity class="details"
			:position="'0 ' + verticleToSlanted(6*carouselDim.lineSeparation, carouselDim.displayDegrees) + ' -1.35'"
			:rotation="(-carouselDim.displayDegrees) + ' 0 0'">
			<!-- type -->
			<a-entity class="type" >
				<!-- type icon -->
				<a-ionicon :icon="getIoniconFromFA(stripFontAwesome(getEventTypeIcon(event.type)))"
					:size="size * iconSize"
					textAlign="right"
					:position="(-carouselDim.iconOffset) + ' 0 0'"></a-ionicon>

				<!-- type/context text -->
				<a-entity v-if="event.context" 
					:scale="textScale"
                  	:text="this.textString( event.context )"
					:position="'0 0 0'">
					</a-entity>
				<a-entity v-else
					:scale="textScale"
                  	:text="this.textString( event.type )">
					</a-entity>
				</a-entity>

			<!-- provider -->
			<a-entity class="provider" 
				:position="'0 ' + (-1 * carouselDim.lineSeparation) + ' 0'">
				 <!-- provider icon -->
				<a-ionicon :icon="getIoniconFromFA(stripFontAwesome(getProviderIcon(event.connection.name)))"
					:size="size * iconSize"
					:position="(-carouselDim.iconOffset) + ' 0 0'"></a-ionicon>
				<!-- provider text -->
				<a-entity
						:scale="textScale"
						:text="this.textString( event.connection.name )">
					</a-entity>
			</a-entity>

			<!-- datetime -->
			<a-entity v-if="event.datetime" class="date" 
				:position="'0 ' + (-2 * carouselDim.lineSeparation) + ' 0'">
				<!-- date -->
				<a-entity>
					<!-- date icon -->
					<a-ionicon :icon="getIoniconFromFA('fa-calendar')"
						:size="size * iconSize"
						:position="(-carouselDim.iconOffset) + ' 0 0'"></a-ionicon>
					<!-- date text -->
					<a-entity
						:scale="textScale"
						:text="this.textString( this.dateShort(event.datetime))">
						</a-entity>
					</a-entity>


				<!-- time -->
				<a-entity :position="'0 ' + (-1 * carouselDim.lineSeparation) + ' 0'">
					<!-- time icon -->
					<a-ionicon :icon="getIoniconFromFA('fa-clock-o')"
						:size="size * iconSize"
						:position="(-carouselDim.iconOffset) + ' 0 0'"></a-ionicon>
					<!-- time text -->
					<a-entity
						:scale="textScale"
						:text="this.textString( this.dateTime(event.datetime) )">
						</a-entity>
						<!-- <a-entity v-else>
							<i class="fa fa-clock-o"></i> <span>{{ event.datetime | dateTime }}</span>
						</a-entity> -->
					</a-entity>
				</a-entity>

			<!-- tags -->
			<!-- <a-entity class="tagging"
				:position="'0 ' + (-4 * carouselDim.lineSeparation) + ' 0'">
				<a-entity class="tags">
					<a-entity v-for="tag in event.tags"
						:key="tag"
						scale="2 2 1"
						:text="tag">
					</a-entity>
				</a-entity>
			</a-entity> -->
		</a-entity>


		<!-- <a-entity 
				:scale="textScale"
				:text="this.textString( '________________________________' )"
				:position="'0 ' + verticleToSlanted( 1 * carouselDim.lineSeparation, carouselDim.displayDegrees) + ' -1.1'"
				:rotation="(-carouselDim.displayDegrees) + ' 0 0'"></a-entity> -->

		<!-- content -->
		<a-entity v-if="event.content && event.content.length > 0"
			class="content"
			:position="'0 ' + verticleToSlanted(1 * carouselDim.lineSeparation, carouselDim.displayDegrees) + ' -1.0'"
			:rotation="(-carouselDim.displayDegrees) + ' 0 0'">
			<user-content v-for="content in event.content"
				:key="content.id"
				:content="content"
				:connection="event.connection"
                :carouselDim="carouselDim"></user-content>
		</a-entity>

		 <!-- <a-entity 
		 		:scale="textScale"
		 		:text="this.textString( '________________________________' )"
		 		:position="'0 ' + verticleToSlanted(- 3 * carouselDim.lineSeparation, carouselDim.displayDegrees) + ' -0.75'"
				:rotation="(-carouselDim.displayDegrees) + ' 0 0'"></a-entity> -->
		<!-- contacts -->
		<a-entity v-if="(event.contacts && event.contacts.length > 0) ||
			(event.people && event.people.length > 0) ||
			(event.organizations && event.organizations.length > 0)" 
			class="interactions"
			:position="'0 ' + verticleToSlanted( - 3 * carouselDim.lineSeparation, carouselDim.displayDegrees) + ' -0.75'"
			:rotation="(-carouselDim.displayDegrees) + ' 0 0'">
			<!-- Content interaction type -->
			<!-- <a-entity v-if="event.contact_interaction_type"
				:scale="textScale"
				:text="this.textString( event.content_interaction_type )"></a-entity> -->
				<!-- UserContact -->
			<a-entity class="objects">
				<user-contact v-for="contact in event.contacts"
					:key="contact.id"
					:contact="contact"
					:connection="event.connection"
                	:carouselDim="carouselDim"></user-contact>
			</a-entity>
			<!-- <div v-if="event.contacts > 3 || event.people > 3 || event.organizations > 3" class="expand">More</div> -->
		</a-entity>
	</a-entity>
</template>

<script>
import Math from 'math';

import moment from 'moment';

import icons from '../../../lib/util/icons';
import FAIonicon from '../../../lib/aframe/font-awesome-ionicons';

import UserContent from './content-child';
import UserContact from './contact-child';

console.log("from objects/event.vue <script>")
export default {
	data () {
        return {
			size: 1,
			iconSize: 0.25
        }
	},
	
	components: {
		UserContent,
		UserContact
	},

	props: ['event', 'connection', 'carouselDim'],


	computed: {
        imageMaterial: function() {
            return 'src: #image-' + this.content.id + '; side: double'
		},
		textScale: function() {
			return (0.5*this.size) + ' ' + (0.5*this.size) + ' ' + (0.25*this.size);
		}
    },

    methods: {
        textString: function(value) {
            return 'width: 1.5; color: white; value: ' + value
		},

		// Datetime
		dateShort: function(date) {
			// console.log(`dateShort(${date})`);
			return moment.utc(date).local().format('YYYY/MM/DD');
		},

		dateTiny: function(date) {
			return moment.utc(date).local().format('M/D/YY');
		},

		dateTime: function(date) {
			return moment.utc(date).local().format('hh:mm A');
		},

		// Icons
		getContentTypeIcon: function(type) {
			return icons('event', type);
		},
		getProviderIcon: function(provider) {
			return icons('provider', provider.name);
		},
		getEventTypeIcon: function(type) {
			//console.log("getEventTypeIcon");
			//console.log(icons('event', type));
			return icons('event', type);
		},
		stripFontAwesome(type) {
			//console.log(`stripFontAwesome(${type})`)
			var regex=/fa\-[a-zA-Z\-]+/i;
			return type.match(regex)[0];
		},
		getIoniconFromFA: function(icon) {
			//console.log(`getIoniconFromFA(${icon})`);
			//console.log(`FAIonicon[${icon}] == ${FAIonicon[icon]}`);
			return FAIonicon[icon];
		},

		// Layout
		verticleToSlanted: function(len, degrees) {
			// console.log("verticleToSlanted")
			function toRadians (angle) {
				// console.log(`${angle} degrees is ${angle * (Math.PI / 180)} radians`)
				return angle * (Math.PI / 180);
			}
			// console.log(`Math.sin(toRadians(${degrees}): ${Math.sin(toRadians(degrees))}`)
			return len * Math.sin(toRadians(degrees));
		},

		horizontalToSlanted: function(len, degrees) {
			// console.log("horizontalToSlanted");
			function toRadians (angle) {
				// console.log(`${angle} degrees is ${angle * (Math.PI / 180)} radians`);
				return angle * (Math.PI / 180);
			}
			// console.log(`Math.cos(toRadians(${degrees}): ${Math.cos(toRadians(degrees))}`)
			return len * Math.cos(toRadians(degrees));
		},

		// TODO : truncate text

		createMapbox(lat, long) {
			var mapboxFloor = document.getElementById('mapbox-floor');
			mapboxFloor.outerHTML = "";
			var newMapboxFloor = document.createElement('a-mapbox-terrain');
			newMapboxFloor.setAttribute('id', "mapbox-floor");
			newMapboxFloor.setAttribute('latitude', lat);
			newMapboxFloor.setAttribute('longitude', long);
			newMapboxFloor.setAttribute('position', "0 0.05 -10");//{x: 0, y: 0, z:-10 });
			newMapboxFloor.setAttribute('zoom-level', 11);

			var mapboxWorld = document.getElementById('mapbox-world');
			mapboxWorld.outerHTML = "";
			var newMapboxWorld = document.createElement('a-mapbox-terrain');
			newMapboxWorld.setAttribute('id', "mapbox-world");
			newMapboxWorld.setAttribute('latitude', lat);
			newMapboxWorld.setAttribute('longitude', long);
			newMapboxWorld.setAttribute('position', "0 -4 0");//{x: 0, y: -4, z:0 });
			newMapboxWorld.setAttribute('zoom-level', 11);
			newMapboxWorld.setAttribute('scale', "45 5 45");

			var gallery = document.getElementsByClassName('gallery')[0];
			gallery.appendChild(newMapboxFloor);
			gallery.appendChild(newMapboxWorld);
		},

		hasGeoData:  function()  {
			//console.log("hasGeoData called");
			var event = this.$props.event;
			var bool;
			if (typeof event.location != 'undefined' & event.location != null) {
				bool = true;
			} else {
				bool = false;
			}
			return bool;
		},

		getCoords: function() {
            //console.log("getCoords called");
            var event = this.$props.event;
            var coords = [];
            
			if (typeof event.hydratedLocation != 'undefined') {
				// console.log('event.hydratedLocation.geolocation');
				coords = event.hydratedLocation.geolocation;
			}
			else if (typeof event.location != 'undefined' & event.location != null) {
				// console.log('event.location');
				// console.log(event.location);
				// console.log(event.location.geolocation);
				coords = event.location.geolocation;
			}
            
            return coords;
        },

		// returns true if event should be clickable;
		clickable: function() {
			var truth = false;
			truth = this.hasGeoData(); // | this.otherReason
			return truth;
		},

		makeClickable: function() {
			//console.log('makeClickable');
			if (this.clickable()) {
				//console.log('making clickable');
				var bg = document.getElementById('background-' + this.event.id);

				bg.className += ' clickable';
			}
		}
    },

    mounted () {
		// console.log(this.content.id)
		// console.log(`this.event.type: ${this.event.type}`);
		// console.log('event:');
		// console.log(this.event);
		// console.log(this.event.source);

		var self = this;

		self.makeClickable();

		if (self.clickable()) {
			//console.log('background-' + this.event.id);
			var bg = document.getElementById('background-' + this.event.id);
			bg.addEventListener('click', function(event) {
				console.log('click');

				var coords = self.getCoords();
				var lat = coords[1];//38.904722;
				var long = coords[0];//-77.016389;
				self.createMapbox(lat, long);
				
			})
		}
		
    }
  }
</script>
