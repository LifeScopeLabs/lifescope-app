<template>
  <!-- feed -->
	<div v-if="$store.state.view === 'feed'"
      class="object feed"
      v-bind:id="contact.id">
    <user-contact v-bind:key="contact.id"
        v-bind:contact="contact"
        v-bind:connection="contact.connection"></user-contact>
	</div>

  <!-- grid -->
  <div v-else-if="$store.state.view === 'grid'" class="item grid" v-bind:id="contact.id" v-on:click="$emit('render-details', contact, 'contact')">
    <div v-if="hasAvatar() === true" class="mobile-thumbnail">
      <img v-bind:src="contact.avatar_url" />
    </div>
    <i v-else class="type-icon large-grid-icon fa fa-user"></i>

    <div class="title-bar">
      <i class="bubble hidden"></i>

      <div v-if="contact.name && contact.name.length > 0" class="title">
        {{ contact.name }}
      </div>
      <div v-else class="title">
        {{ contact.handle }}
      </div>

      <i v-bind:class="getProviderIcon(contact.connection.provider)" class="bubble"></i>
    </div>
  </div>

  <!-- list -->
  <div v-else="if=$store.state.view === 'list'" class="item list" v-bind:id="contact.id" v-on:click="$emit('render-details', contact, 'contact')">
    <div>
      <span>{{ contact.name | truncate(30) }}</span>
    </div>

    <div class="icon-column">
      <i v-bind:class="getProviderIcon(contact.connection.provider)"></i>
      <span class="mobile-hide">{{ contact.connection.provider.name }}</span>
    </div>

    <div>
      <span>{{ contact.handle }}</span>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';

  import actionModal from '../modals/action-modal';
	import icons from '../../lib/util/icons';
	import safeFilter from '../filters/safe';
	import UserContact from './contact-child';

	export default {
		components: {
			UserContact
		},
		data: function() {
			return {}
		},
		props: [
			'contact'
		],
		filters: {
      safe: safeFilter
		},
		methods: {
			getProviderIcon: function(provider) {
				return icons('provider', provider.name);
			},

      hasAvatar: function() {
			  return this.$props.contact.avatar_url && this.$props.contact.avatar_url.length > 0;
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
