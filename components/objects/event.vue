<template>
	<!-- feed -->
	<div v-if="$store.state.view === 'feed'" class="object event feed" v-bind:id="event.id">
		<div v-if="event.hidden !== true" class="items">
			<!-- details -->
			<aside class="details">
				<!-- type -->
				<div class="type">
					<!-- type icon -->
					<i v-bind:class="getEventTypeIcon(event.type)"></i>

					<!-- type/context text -->
					<span v-if="event.context">
						{{ event.context }}	
				  </span>
					<span v-else>
						{{ event.type }}
				  </span>
				</div>

				<!-- provider -->
				<div class="provider">
					<!-- provider icon -->
					<i v-bind:class="getProviderIcon(event.connection.provider)"></i>
					<!-- provider text -->
					<span> {{ event.connection.name | truncate(30) }}</span>
				</div>

				<!-- datetime -->
				<div v-if="event.datetime" class="date">
					<div>
						<!-- date -->
						<div>
							<i class="far fa-calendar-alt"></i>
							<span> {{ event.datetime | dateShort }}</span>
						</div>

						<!-- estimated -->
						<!-- ??? won't this never show? we alread checked that event.datetime exists -->
						<div v-if="!event.datetime" class="estimation">
							<span> Estimated</span>
						</div>
						<!-- time -->
						<div v-else>
							<i class="far fa-clock"></i>
							<span> {{ event.datetime | dateTime }}</span>
						</div>
					</div>
				</div>

			<div class="flexbox flex-row flex-space-between tag-hide">
				<div class="flexbox flex-column flex-start">
					<!-- Tag -->
					<div class="tag-button" v-on:click="openActionModal(event, 'event')">
						<i class="fal fa-hashtag"></i><span> Tag</span>
					</div>

					<!-- tags -->
					<div class="tags">
						<span v-for="tag in event.tags" v-bind:key="tag">#{{ tag }}</span>
					</div>
				</div>

				<div class=hide-button v-on:click="hideEvent(event)"><i class="fal fa-minus-hexagon"></i> Hide</div>
			</div>
			
			</aside>

			<!-- content -->
			<section v-if="event.content && event.content.length > 0" class="content">
				<user-content v-for="content in event.content"
							  v-bind:key="content.id"
							  v-bind:content="content"
							  v-bind:connection="event.connection"></user-content>
			</section>

			<!-- interactions -->
			<aside v-if="(event.contacts && event.contacts.length > 0) ||
            (event.people && event.people.length > 0) ||
            (event.organizations && event.organizations.length > 0)"
				   class="interactions">
				<div v-if="event.contact_interaction_type">
					{{ event.content_interaction_type }}
				</div>
				<!-- contact -->
				<div class="objects">
					<user-person v-for="contact in personableContacts(event.contacts)"
								 v-bind:key="contact.person.id"
								 v-bind:person="contact.person"
								 v-bind:connection="event.connection"></user-person>

					<user-contact v-for="contact in personlessContacts(event.contacts)"
								  v-bind:key="contact.id"
								  v-bind:contact="contact"
								  v-bind:connection="event.connection"></user-contact>
				</div>
				<!--<div v-if="event.contacts > 3 || event.people > 3 || event.organizations > 3" class="expand">More</div>-->
			</aside>
		</div>

		<div class="event-hidden" v-else-if="event.hidden === true">
			<div class="unhide-button" v-on:click="unhideEvent(event)"> <i class="fal fa-plus-hexagon"></i> Unhide Event</div>
		</div>
	</div>

	<!-- grid -->
	<div v-else-if="$store.state.view === 'grid'" class="item grid" v-bind:id="event.id"
		 v-on:click="$emit('render-details', event, 'event')">
		<div v-if="event.hidden === true" class="event-hidden">
			<div class="unhide-button" v-on:click="unhideEvent(event)"> <i class="fal fa-plus-hexagon"></i> Unhide Event </div>
		</div>
		<div v-else-if="hasThumbnail() === true" class="mobile-thumbnail">
			<img v-bind:src="getGridThumbnail()"/>
		</div>
		<i v-else v-bind:class="getEventTypeIcon(event.type)" class="type-icon large-grid-icon"></i>

		<div v-if="event.hidden !== true" class="title-bar">
			<i v-bind:class="getEventTypeIcon(event.type)" class="bubble"></i>

			<div v-if="hasTitle() === true" class="title">
				{{ getGridTitle() | safe }}
			</div>
			<div v-else class="title">
				{{ contextOrType(event) }}
			</div>

			<i v-bind:class="getProviderIcon(event.connection.provider)" class="bubble"></i>
		</div>
	</div>

	<!-- list -->
	<div v-else-if="$store.state.view === 'list'" class="item list" v-bind:id="event.id"
		 v-on:click="$emit('render-details', event, 'event')">
		<div>
			<span v-if="event.hidden === true">
				<div class="unhide-button" v-on:click="unhideEvent(event)"> <i class="fal fa-plus-hexagon"></i> Unhide Event </div>
			</span>
			<span v-else-if="event.content && event.content.length > 0">{{ getFirstTitle(event) | truncate(30) }}</span>
		</div>

		<div class="icon-column">
			<i v-if="event.hidden !== true" v-bind:class="getEventTypeIcon(event.type)"></i>
			<span v-if="event.hidden !== true" class="mobile-hide">{{ contextOrType(event) | truncate(30) }}</span>
		</div>

		<div class="icon-column">
			<i v-if="event.hidden !== true" v-bind:class="getProviderIcon(event.connection.provider)"></i>
			<span v-if="event.hidden !== true" class="mobile-hide">{{ event.connection.provider.name }}</span>
		</div>

		<div class="mobile-hide">
			<span v-if="event.hidden !== true && event.contacts && event.contacts.length > 0">{{ getFirstContact(event) | truncate(30) }}</span>
		</div>

		<div v-if="event.datetime">
			<span v-if="event.hidden !== true">{{ event.datetime | dateTiny }}</span>
		</div>
	</div>
</template>

<script>
	import moment from 'moment';

	import actionModal from '../modals/action-modal';
	import icons from '../../lib/util/icons';
	import safeFilter from '../filters/safe';
	import eventHide from '../../apollo/mutations/event-hide.gql';
	import eventUnhide from '../../apollo/mutations/event-unhide.gql';
	import UserContact from './contact-child';
	import UserContent from './content-child';
	import UserPerson from './person-child';

	export default {
		components: {
			UserContact,
			UserContent,
			UserPerson
		},
		data: function() {
			return {}
		},
		props: [
			'event'
		],
		filters: {
			safe: safeFilter,

			dateShort: function(date) {
				return moment.utc(date).local().format('YYYY/MM/DD');
			},

			dateTiny: function(date) {
				return moment.utc(date).local().format('M/D/YY');
			},

			dateTime: function(date) {
				return moment.utc(date).local().format('hh:mm A');
			}
		},
		methods: {
			getFirstTitle: function(event) {
				let returned = '';

				_.each(event.content, function(item) {
					if (item.title) {
						returned = item.title;

						return false;
					}
				});

				return returned;
			},

			getFirstContact: function(event) {
				let returned = '';

				_.each(event.contacts, function(item) {
					if (item.handle || item.name) {
						returned = item.handle || item.name;
					}

					return false;
				});

				return returned;
			},

			contextOrType: function(event) {
				let typeUppercase = event.type[0].toUpperCase() + event.type.slice(1);

				return event.context ? event.context + ' (' + typeUppercase + ')' : typeUppercase;
			},

			getEventTypeIcon: function(type) {
				return icons('event', type)
			},

			getProviderIcon: function(provider) {
				return icons('provider', provider.name);
			},

			hasThumbnail: function() {
				let hasThumbnail = false;

				_.each(this.$props.event.content, function(item) {
					if (item.embed_thumbnail && item.embed_thumbnail.length > 0) {
						hasThumbnail = true;
					}
				});

				return hasThumbnail;
			},

			hasTitle: function() {
				let hasTitle = false;

				_.each(this.$props.event.content, function(item) {
					if (item.title != null && item.title.length > 0) {
						hasTitle = true;
					}
				});

				return hasTitle;
			},

			getGridThumbnail: function() {
				let firstMatch = _.find(this.$props.event.content, function(item) {
					return item.embed_thumbnail != null && item.embed_thumbnail.length > 0;
				});

				return firstMatch.embed_thumbnail;
			},

			getGridTitle: function() {
				let firstMatch = _.find(this.$props.event.content, function(item) {
					return item.title != null && item.title.length > 0;
				});

				return firstMatch.title.length > 30 ? firstMatch.title.slice(0, 30) + '...' : firstMatch.title;
			},

			openActionModal: function(item, type) {
				this.$modal.show(actionModal, {
					shareable: false,
					item: item,
					taggable: true,
					type: type
				}, {
					height: 'auto',
					scrollable: true
				});
			},

			personlessContacts: function(contacts) {
				return _.filter(contacts, function(contact) {
					return Object.keys(contact.person).length === 0;
				});
			},

			personableContacts: function(contacts) {
				let people = _.filter(contacts, function(contact) {
					return Object.keys(contact.person).length > 0;
				});

				return people;
			},

			hideEvent: async function(event) {
				await this.$apollo.mutate({
					mutation: eventHide,
					variables: {
						id: event.id
					}
				});

				let match = _.find(this.$store.state.objects.events, function(item) {
					return item.id === event.id;
				});

				match.hidden = true;
			},

			unhideEvent: async function(event) {
				await this.$apollo.mutate({
					mutation: eventUnhide,
					variables: {
						id: event.id
					}
				});

				let match = _.find(this.$store.state.objects.events, function(item) {
					return item.id === event.id;
				});

				match.hidden = false;
			}
		}
	}
</script>
