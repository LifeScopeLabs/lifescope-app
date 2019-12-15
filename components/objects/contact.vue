<template>
    <transition name="contact"
                mode="out-in"
    >
        <!-- feed -->
        <div v-if="$store.state.view === 'feed'"
             v-bind:id="contact.id"
             v-bind:key="1"
             v-bind:class="{ hidden: contact.invisible === true }"
             class="object feed"
        >
            <div class="items">
                <user-contact v-bind:key="contact.id"
                              v-bind:contact="contact"
                              v-bind:connection="contact.connection"
                >
                </user-contact>
            </div>
        </div>

        <!-- grid -->
        <div v-else-if="$store.state.view === 'grid'"
             v-bind:id="contact.id"
             v-bind:key="2"
             class="item grid"
             v-on:click="$emit('render-details', contact, 'contact')"
        >
            <div v-if="contact.hidden === true"
                 class="contact-hidden"
            >
                This Contact is hidden
            </div>
            <div v-if="hasAvatar() === true"
                 class="mobile-thumbnail"
            >
                <img v-bind:src="contact.avatar_url" />
            </div>
            <i v-else
               class="type-icon large-grid-icon fal fa-user"
            ></i>

            <div v-if="contact.hidden !== true"
                 class="title-bar"
            >
                <i class="bubble hidden"></i>

                <div v-if="contact.name && contact.name.length > 0"
                     class="title"
                >
                    {{ contact.name }}
                </div>
                <div v-else
                     class="title"
                >
                    {{ contact.handle }}
                </div>

                <i v-bind:class="getProviderIcon(contact.connection.provider)"
                   class="bubble"
                ></i>
            </div>
        </div>

        <!-- list -->
        <div v-else-if="$store.state.view === 'list'"
             v-bind:id="contact.id"
             v-bind:key="3"
             class="item list"
             v-on:click="$emit('render-details', contact, 'contact')"
        >
            <div>
                <span v-if="contact.hidden === true">
                    This Contact is hidden
                </span>
                <span v-else>{{ contact.name | truncate(30) }}</span>
            </div>

            <div class="icon-column">
                <i v-if="contact.hidden !== true"
                   v-bind:class="getProviderIcon(contact.connection.provider)"
                ></i>
                <span v-if="contact.hidden !== true"
                      class="mobile-hide"
                >
                    {{ contact.connection.provider.name }}
                </span>
            </div>

            <div>
                <span v-if="contact.hidden !== true">{{ contact.handle }}</span>
            </div>
        </div>
    </transition>
</template>

<script>
	import actionModal from '../modals/action-modal.vue';
	import icons from '../../lib/util/icons';
	import safeFilter from '../filters/safe';
	import UserContact from './contact-child.vue';

	export default {
		components: {
			UserContact
		},

		filters: {
			safe: safeFilter
		},

		props: {
			contact: {
				type: Object,
				default: function() {
					return {};
				}
			}
		},

		data: function() {
			return {}
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
