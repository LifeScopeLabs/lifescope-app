<template>
	<a-entity class="object event feed" v-bind:id="event.id">
		<!-- details -->
		<a-entity class="details">

			<!-- type -->
			<a-entity class="type" position="0 2 0">
				<!-- <i v-bind:class="getEventTypeIcon(event.type)"></i> -->
				<a-ionicon :icon="getIoniconFromFA(stripFontAwesome(getEventTypeIcon(event.type)))"></a-ionicon>

				<a-entity v-if="event.context" 
					scale="2 2 1"
                  	:text="this.textString( event.context )"
					position="0 -0.5 0">
				</a-entity>
				<a-entity v-else
					scale="2 2 1"
                  	:text="this.textString( event.type )"
					position="0 -0.5 0">
				</a-entity>
			</a-entity>

			<!-- provider -->
			<a-entity class="provider" position="0 1 0">
				<!-- <i v-bind:class="getProviderIcon(event.connection.provider)"></i>
				 -->
				<a-ionicon :icon="getIoniconFromFA(stripFontAwesome(getProviderIcon(event.connection.name)))"></a-ionicon>
			</a-entity>

			<!-- date -->
			<a-entity v-if="event.datetime" class="date" position="0 0.5 0">
					<a-entity>
						<a-ionicon :icon="getIoniconFromFA('fa-calendar')"></a-ionicon>
						<a-entity position="0 -0.5 0"
							scale="2 2 1"
							:text="this.textString( event.datetime )">
						</a-entity>
					</a-entity>


					<!-- <a-entity v-if="!event.datetime" class="estimation">
						<i class="fa fa-flask"></i> <span>Estimated</span>
					</a-entity> -->

					<!-- <a-entity v-else>
						<i class="fa fa-clock-o"></i> <span>{{ event.datetime | dateTime }}</span>
					</a-entity> -->
			</a-entity>

			<!-- tags -->
			<a-entity class="tagging"
			position="0 -0.25 0">
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
		<!-- <section v-if="event.content && event.content.length > 0" class="content">
			<user-content v-for="content in event.content" v-bind:key="content.id" v-bind:content="content" v-bind:connection="event.connection"></user-content>
		</section> -->

		<!-- <aside v-if="(event.contacts && event.contacts.length > 0) || (event.people && event.people.length > 0) || (event.organizations && event.organizations.length > 0)" class="interactions">
			<div v-if="event.contact_interaction_type">{{ event.content_interaction_type }}</div>
			<div class="objects">
				<user-contact v-for="contact in event.contacts" v-bind:key="contact.id" v-bind:contact="contact" v-bind:connection="event.connection"></user-contact>
			</div>
			<div v-if="event.contacts > 3 || event.people > 3 || event.organizations > 3" class="expand">More</div>-->
	</a-entity>
</template>

<script>
import icons from '../../../../../../lib/util/icons';
import FAIonicon from '../../util/font-awesome-ionicons';

console.log("from objects/contact.vue <script>")
export default {
	props: ['event', 'connection'],

	computed: {
        imageMaterial: function() {
            return 'src: #image-' + this.content.id + '; side: double'
        }
    },

    methods: {
        textString: function(value) {
            return 'width: 1.5; color: white; value: ' + value
		},
		getContentTypeIcon: function(type) {
			return icons('content', type);
		},
		getProviderIcon: function(provider) {
				return icons('provider', provider.name);
		},
		getEventTypeIcon: function(type) {
				return icons('event', type)
		},
		stripFontAwesome(type) {
			//console.log(`stripFontAwesome(${type})`)
			var regex=/fa\-[a-zA-Z\-]+/i;
			return type.match(regex)[0];
		},
		getIoniconFromFA: function(icon) {
			//console.log(`getIoniconFromFA(${icon})`)
			//console.log(`FAIonicon[${icon}] == ${FAIonicon[icon]}`)
			return FAIonicon[icon];
		}
    },

    mounted () {
        //console.log(this.content.id)
    }
  }
</script>
