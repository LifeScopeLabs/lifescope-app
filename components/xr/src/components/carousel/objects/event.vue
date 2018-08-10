<template>
	<a-entity class="object event feed" v-bind:id="event.id">
		<!-- details -->
		<a-entity class="details"
			:position="'0 ' + top + ' 0'">

			<!-- type -->
			<a-entity class="type" >
				<!-- type icon -->
				<a-ionicon :icon="getIoniconFromFA(stripFontAwesome(getEventTypeIcon(event.type)))"
					:size="size * iconSize"
					textAlign="right"
					:position="(-iconOffset) + ' 0 0'"></a-ionicon>

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
				:position="'0 ' + (-1 * lineSeparation) + ' 0'">
				 <!-- provider icon -->
				<a-ionicon :icon="getIoniconFromFA(stripFontAwesome(getProviderIcon(event.connection.name)))"
					:size="size * iconSize"
					:position="(-iconOffset) + ' 0 0'"></a-ionicon>
				<!-- provider text -->
				<a-entity
						:scale="textScale"
						:text="this.textString( event.connection.name )">
					</a-entity>
			</a-entity>

			<!-- datetime -->
			<a-entity v-if="event.datetime" class="date" 
				:position="'0 ' + (-2 * lineSeparation) + ' 0'">
				<!-- date -->
				<a-entity>
					<!-- date icon -->
					<a-ionicon :icon="getIoniconFromFA('fa-calendar')"
						:size="size * iconSize"
						:position="(-iconOffset) + ' 0 0'"></a-ionicon>
					<!-- date text -->
					<!-- TODO : Format datetime -->
					<a-entity
						:scale="textScale"
						:text="this.textString( this.dateShort(event.datetime))">
						</a-entity>
					</a-entity>


				<!-- time -->
				<a-entity :position="'0 ' + (-1 * lineSeparation) + ' 0'">
					<!-- time icon -->
					<a-ionicon :icon="getIoniconFromFA('fa-clock-o')"
						:size="size * iconSize"
						:position="(-iconOffset) + ' 0 0'"></a-ionicon>
					<!-- time text -->
					<!-- TODO : Format datetime -->
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
			<a-entity class="tagging"
				:position="'0 ' + (-4 * lineSeparation) + ' 0'">
				<a-entity class="tags">
					<a-entity v-for="tag in event.tags"
						:key="tag"
						scale="2 2 1"
						:text="tag">
					</a-entity>
				</a-entity>
			</a-entity>
		</a-entity>

		<!-- content -->
		<a-entity v-if="event.content && event.content.length > 0"
			class="content"
			:position="(1*layoutMargin/4) + ' 0 0'">
			<user-content v-for="content in event.content"
				:key="content.id"
				:content="content"
				:connection="event.connection"></user-content>
		</a-entity>

		<!-- contacts -->
		<a-entity v-if="(event.contacts && event.contacts.length > 0) ||
			(event.people && event.people.length > 0) ||
			(event.organizations && event.organizations.length > 0)" 
			class="interactions">
			<!-- Content interaction type -->
			<a-entity v-if="event.contact_interaction_type"
				:scale="textScale"
				:text="this.textString( event.content_interaction_type )"></a-entity>
				<!-- UserContact -->
			<a-entity class="objects">
				<user-contact v-for="contact in event.contacts"
					:key="contact.id"
					:contact="contact"
					:connection="event.connection"></user-contact>
			</a-entity>
			<!-- <div v-if="event.contacts > 3 || event.people > 3 || event.organizations > 3" class="expand">More</div> -->
		</a-entity>
	</a-entity>
</template>

<script>
import moment from 'moment';

import icons from '../../../../../../lib/util/icons';
import FAIonicon from '../../util/font-awesome-ionicons';

import UserContent from './content';
import UserContact from './contact';

console.log("from objects/contact.vue <script>")
export default {
	data () {
        return {
			size: 1,
			iconSize: 0.25,
			top: 1.5,
			lineSeparation: 0.25,
			layoutMargin: 3, // TODO : use layoutMargin from explorer
			columnWidth: 1,
			iconOffset: 0.5
        }
	},
	
	components: {
		UserContent
	},

	props: ['event', 'connection'],


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
			return icons('content', type);
		},
		getProviderIcon: function(provider) {
			return icons('provider', provider.name);
		},
		getEventTypeIcon: function(type) {
			console.log("getEventTypeIcon");
			console.log(icons('event', type));
			return icons('event', type);
		},
		stripFontAwesome(type) {
			//console.log(`stripFontAwesome(${type})`)
			var regex=/fa\-[a-zA-Z\-]+/i;
			return type.match(regex)[0];
		},
		getIoniconFromFA: function(icon) {
			console.log(`getIoniconFromFA(${icon})`);
			console.log(`FAIonicon[${icon}] == ${FAIonicon[icon]}`);
			return FAIonicon[icon];
		}
    },

    mounted () {
		// console.log(this.content.id)
		// console.log(`this.event.type: ${this.event.type}`);
		// console.log('event:');
		// console.log(this.event);
		console.log("event.datetime:");
		console.log( this.event.datetime );
    }
  }
</script>
