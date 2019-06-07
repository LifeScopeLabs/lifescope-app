<template>
    <transition name="person"
                mode="out-in"
    >
        <!-- feed -->
        <div v-if="$store.state.view === 'feed'"
             v-bind:id="person.id"
             v-bind:key="1"
             class="object feed"
        >
            <div class="items">
                <user-person v-bind:key="person.id"
                             v-bind:person="person"
                >
                </user-person>
            </div>
        </div>

        <!-- grid -->
        <div v-else-if="$store.state.view === 'grid'"
             v-bind:id="person.id"
             v-bind:key="2"
             class="item grid"
             v-on:click="$emit('render-details', person, 'person')"
        >
            <div v-if="person.hidden === true"
                 class="person-hidden"
            >
                This Person is hidden
            </div>
            <div v-else
                 class="mobile-thumbnail"
            >
                <img v-if="person.avatar_url != null && person.avatar_url.length > 0"
                     v-bind:src="person.avatar_url"
                >
                <div v-else-if="person.avatar_url == null || person.avatar_url.length === 0"
                     class="default"
                     v-bind:style="{ 'background-color': defaultColor(person) }"
                >
                    {{ defaultLetter(person) }}
                </div>
            </div>

            <div v-if="person.hidden !== true"
                 class="title-bar"
            >
                <div class="title"
                     style="width: 100%"
                >
                    {{ concatNames(person) }}
                </div>
            </div>
        </div>

        <!-- list -->
        <div v-else-if="$store.state.view === 'list'"
             v-bind:id="person.id"
             v-bind:key="3"
             class="item list"
             v-on:click="$emit('render-details', person, 'person')"
        >
            <div>
                <span v-if="person.hidden === true">
                    This Person is hidden
                </span>
                <span v-else>{{ person.first_name | truncate(30) }}</span>
            </div>

            <div>
                <span v-if="person.hidden !== true">{{ person.middle_name | truncate(30) }}</span>
            </div>

            <div>
                <span v-if="person.hidden !== true">{{ person.last_name | truncate(30) }}</span>
            </div>
        </div>
    </transition>
</template>

<script>
	import _ from 'lodash';

	import actionModal from '../modals/action-modal.vue';
	import icons from '../../lib/util/icons';
	import safeFilter from '../filters/safe';
	import UserPerson from './person-child.vue';

	import { defaultColor, defaultLetter } from '../../lib/util/default-icon';

	export default {
		components: {

			UserPerson
		},

		filters: {
			safe: safeFilter
		},

		props: {
			'person': {
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
				return this.$props.person.avatar_url && this.$props.person.avatar_url.length > 0;
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

			concatNames: function(item) {
				let returned = '';

				if (item.first_name || item.middle_name || item.last_name) {
					if (item.first_name) {
						returned += item.first_name + ' ';
					}

					if (item.middle_name) {
						returned += item.middle_name + ' ';
					}

					if (item.last_name) {
						returned += item.last_name + ' ';
					}

					returned = _.trim(returned);
				}

				return returned;
			},

			defaultColor: function(person) {
				return defaultColor(person);
			},

			defaultLetter: function(person) {
				return defaultLetter(person);
			}
		}
	}
</script>
