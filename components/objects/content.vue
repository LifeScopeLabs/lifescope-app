<template>
	<div v-if="$store.state.view === 'feed'" class="object feed" v-bind:id="content.id">
    <section class="content">
      <user-content v-bind:key="content.id" v-bind:content="content" v-bind:connection="content.connection"></user-content>
    </section>
	</div>

  <div v-else-if="$store.state.view === 'grid'" class="item grid" v-bind:id="content.id" v-on:click="$emit('render-details', content)">
    <div v-if="hasThumbnail() === true" class="mobile-thumbnail">
      <img v-bind:src="getGridThumbnail()" />
    </div>
    <i v-else v-bind:class="getContentTypeIcon(content.type)" class="type-icon large-grid-icon"></i>

    <div class="title-bar">
      <i v-bind:class="getContentTypeIcon(content.type)" class="bubble"></i>

      <div v-if="hasTitle" class="title">
        {{ getGridTitle() | safe }}
      </div>

      <i v-bind:class="getProviderIcon(content.connection.provider)" class="bubble"></i>
    </div>
  </div>

  <div v-else="if=$store.state.view === 'list'" class="item list" v-bind:id="content.id" v-on:click="$emit('render-details', content)">
    <div>
      <span>{{ content.title | truncate(30) }}</span>
    </div>

    <div class="icon-column">
      <i v-bind:class="getContentTypeIcon(content.type)"></i>
      <span class="mobile-hide">{{ contextOrType(event) | truncate(30) }}</span>
    </div>

    <div class="icon-column">
      <i v-bind:class="getProviderIcon(event.connection.provider)"></i>
      <span class="mobile-hide">{{ event.connection.provider.name }}</span>
    </div>

    <div v-if="event.contacts && event.contacts.length > 0" class="mobile-hide">
      <span>{{ getFirstContact(event) | truncate(30) }}</span>
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
	import UserContent from './content-child';

	export default {
		components: {
			UserContent
		},
		data: function() {
			return {}
		},
		props: [
			'content'
		],
		filters: {
      safe: safeFilter
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

      contextOrType: function(event) {
        return event.context ? event.context : event.type[0].toUpperCase() + event.type.slice(1);
      },

			getContentTypeIcon: function(type) {
				return icons('content', type)
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
        return this.$props.content.title != null;
      },

      getGridThumbnail: function() {
			  let firstMatch = _.find(this.$props.event.content, function(item) {
			    return item.embed_thumbnail != null;
        });

			  return firstMatch.embed_thumbnail;
      },

      getGridTitle: function() {
        let firstMatch = _.find(this.$props.event.content, function(item) {
          return item.title != null;
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
