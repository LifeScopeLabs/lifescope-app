<template>
  <!-- feed -->
	<div v-if="$store.state.view === 'feed'" class="object feed" v-bind:id="content.id">
    <div class="items">
      <section class="content">
        <user-content v-bind:key="content.id"
            v-bind:content="content"
            v-bind:connection="content.connection">
        </user-content>
      </section>
    </div>
	</div>

  <!-- grid -->
  <div v-else-if="$store.state.view === 'grid'"
      class="item grid"
      v-bind:id="content.id"
      v-on:click="$emit('render-details', content, 'content')">

    <div v-if="content.hidden === true" class="content-hidden">
      Content Hidden
    </div>
    <div v-else-if="hasThumbnail() === true" class="mobile-thumbnail">
      <img v-bind:src="getGridThumbnail()" />
    </div>
    <i v-else
        v-bind:class="getContentTypeIcon(content.type)"
        class="type-icon large-grid-icon"></i>

    <div v-if="content.hidden !== true" class="title-bar">
      <i v-bind:class="getContentTypeIcon(content.type)" class="bubble"></i>

      <div v-if="hasTitle" class="title">
        {{ getGridTitle() | safe }}
      </div>
      <div v-else>
        {{ content.type }}
      </div>

      <i v-bind:class="getProviderIcon(content.connection.provider)" class="bubble"></i>
    </div>
  </div>

  <!-- list -->
  <div v-else-if="$store.state.view === 'list'"
      class="item list"
      v-bind:id="content.id"
      v-on:click="$emit('render-details', content, 'content')">
    <div>
      <span v-if="content.hidden === true">
        Content Hidden
      </span>
      <span v-else>{{ content.title | truncate(30) }}</span>
    </div>

    <div class="icon-column">
      <i v-if="content.hidden !== true" v-bind:class="getProviderIcon(content.connection.provider)"></i>
      <span v-if="content.hidden !== true" class="mobile-hide">{{ content.connection.provider.name }}</span>
    </div>

    <div class="icon-column">
      <i v-if="content.hidden !== true" v-bind:class="getContentTypeIcon(content.type)"></i>
      <span v-if="content.hidden !== true" class="mobile-hide">{{ prettifyType(content.type) }}</span>
    </div>

    <div>
      <span v-if="content.hidden !== true" >{{ content.mimetype }}</span>
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
			getContentTypeIcon: function(type) {
				return icons('content', type)
			},

			getProviderIcon: function(provider) {
				return icons('provider', provider.name);
			},

      hasThumbnail: function() {
			  return this.$props.content.embed_thumbnail && this.$props.content.embed_thumbnail.length > 0;
      },

      hasTitle: function() {
        return this.$props.content.title != null;
      },

      getGridThumbnail: function() {
			  return this.$props.content.embed_thumbnail;
      },

      getGridTitle: function() {
        return this.$props.content.title.length > 30 ? this.$props.content.title.slice(0, 30) + '...' : this.$props.content.title;
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

      prettifyType(type) {
		    return type[0].toUpperCase() + type.slice(1, 30);
      }
		}
	}
</script>
