<template>
	<div v-if="$store.state.view === 'feed'" class="object event feed" v-bind:id="event.id">
		<aside class="details">
			<div class="type">
				<i v-bind:class="getEventTypeIcon(event.type)"></i>

				<span v-if="event.context">
					{{ event.context }}
				</span>
				<span v-else>
					{{ event.type }}
				</span>

				<aside class="action-bar" v-on:click="openActionModal(event, 'event')">
					<span>Tag</span><i class="fa fa-hashtag"></i>
				</aside>
			</div>

			<div class="provider">
				<i v-bind:class="getProviderIcon(event.connection.provider)"></i>
				<span>{{ event.connection.name | truncate(30) }}</span>
			</div>

			<div v-if="event.datetime" class="date">
				<div>
					<div>
						<i class="fa fa-calendar"></i> <span>{{ event.datetime | dateShort }}</span>
					</div>


					<div v-if="!event.datetime" class="estimation">
						<i class="fa fa-flask"></i> <span>Estimated</span>
					</div>

					<div v-else>
						<i class="fa fa-clock-o"></i> <span>{{ event.datetime | dateTime }}</span>
					</div>
				</div>
			</div>

			<div class="tagging">
				<div class="tags">
					<span v-for="tag in event.tags">#{{ tag }}</span>
				</div>
			</div>
		</aside>

		<section v-if="event.content && event.content.length > 0" class="content">
			<user-content v-for="content in event.content" v-bind:key="content.id" v-bind:content="content" v-bind:connection="event.connection"></user-content>
		</section>

		<aside v-if="(event.contacts && event.contacts.length > 0) || (event.people && event.people.length > 0) || (event.organizations && event.organizations.length > 0)" class="interactions">
			<div v-if="event.contact_interaction_type">{{ event.content_interaction_type }}</div>
			<div class="objects">
				<user-contact v-for="contact in event.contacts" v-bind:key="contact.id" v-bind:contact="contact" v-bind:connection="event.connection"></user-contact>
			</div>
			<!--<div v-if="event.contacts > 3 || event.people > 3 || event.organizations > 3" class="expand">More</div>-->
		</aside>
	</div>

  <div v-else-if="$store.state.view === 'grid'" class="item grid" v-bind:id="event.id" v-on:click="$emit('render-details', event, 'event')">
    <div v-if="hasThumbnail() === true" class="mobile-thumbnail">
      <img v-bind:src="getGridThumbnail()" />
    </div>
    <i v-else v-bind:class="getEventTypeIcon(event.type)" class="type-icon large-grid-icon"></i>

    <div class="title-bar">
      <i v-bind:class="getEventTypeIcon(event.type)" class="bubble"></i>

      <div v-if="hasTitle() === true" class="title">
        {{ getGridTitle() | safe }}
      </div>
      <div v-else>
        {{ contextOrType(event) }}
      </div>
      <!--<div v-else-if="event.datetime">-->
        <!--<div class="title">-->
          <!--<div>-->
            <!--<i class="fa fa-calendar"></i> <span>{{ event.datetime | dateShort }}</span>-->
          <!--</div>-->

          <!--<div>-->
            <!--<i class="fa fa-clock-o"></i> <span>{{ event.datetime | dateTime }}</span>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->

      <i v-bind:class="getProviderIcon(event.connection.provider)" class="bubble"></i>
    </div>
  </div>

  <div v-else="if=$store.state.view === 'list'" class="item list" v-bind:id="event.id" v-on:click="$emit('render-details', event, 'event')">
    <div>
      <span v-if="event.content && event.content.length > 0">{{ getFirstTitle(event) | truncate(30) }}</span>
    </div>

    <div class="icon-column">
      <i v-bind:class="getEventTypeIcon(event.type)"></i>
      <span class="mobile-hide">{{ contextOrType(event) | truncate(30) }}</span>
    </div>

    <div class="icon-column">
      <i v-bind:class="getProviderIcon(event.connection.provider)"></i>
      <span class="mobile-hide">{{ event.connection.provider.name }}</span>
    </div>

    <div class="mobile-hide">
      <span v-if="event.contacts && event.contacts.length > 0">{{ getFirstContact(event) | truncate(30) }}</span>
    </div>

    <div v-if="event.datetime">
      <span>{{ event.datetime | dateTiny }}</span>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';

  import actionModal from '../modals/action-modal';
	import icons from '../../lib/util/icons';
	import safeFilter from '../filters/safe';
	import UserContact from './contact-child';
	import UserContent from './content-child';

	export default {
		components: {
			UserContact,
			UserContent
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
      }
		}
	}
</script>
