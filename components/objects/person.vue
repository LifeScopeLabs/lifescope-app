<template>
	<!-- feed -->
	<div v-if="$store.state.view === 'feed'"
		 class="object feed"
		 v-bind:id="person.id">
		<div class="items">
			<user-person v-bind:key="person.id"
						 v-bind:person="person">
			</user-person>
		</div>
	</div>

	<!-- grid -->
	<div v-else-if="$store.state.view === 'grid'" class="item grid" v-bind:id="person.id"
		 v-on:click="$emit('render-details', person, 'person')">
		<div class="mobile-thumbnail">
			<img v-if="person.avatar_url != null && person.avatar_url.length > 0" v-bind:src="person.avatar_url">
			<div class="default" v-else-if="person.avatar_url == null || person.avatar_url.length === 0"
				 v-bind:style="{ 'background-color': defaultColor(person) }">{{ defaultLetter(person) }}
			</div>
		</div>

		<div class="title-bar">
			<div class="title" style="width: 100%">{{ concatNames(person) }}</div>
		</div>
	</div>

	<!-- list -->
	<div v-else="if=$store.state.view === 'list'" class="item list" v-bind:id="person.id"
		 v-on:click="$emit('render-details', person, 'person')">
		<div>
			<span>{{ person.first_name | truncate(30) }}</span>
		</div>

		<div>
			<span>{{ person.middle_name | truncate(30) }}</span>
		</div>

		<div>
			<span>{{ person.last_name | truncate(30) }}</span>
		</div>
	</div>
</template>

<script>
	import actionModal from '../modals/action-modal';
	import icons from '../../lib/util/icons';
	import safeFilter from '../filters/safe';
	import UserPerson from './person-child';

	import { defaultColor, defaultLetter } from '../../lib/util/default-icon';

	export default {
		components: {
			UserPerson
		},
		data: function() {
			return {}
		},
		props: [
			'person'
		],
		filters: {
			safe: safeFilter
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
