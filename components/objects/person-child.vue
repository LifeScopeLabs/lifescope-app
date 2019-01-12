<template>
	<div class="object person" v-bind:id="person.id">
		<!-- contact -->
		<div>
			<!-- avatar -->
			<div class="user-avatar">
				<img v-if="person.avatar_url != null && person.avatar_url.length > 0" v-bind:src="person.avatar_url">
				<div class="default" v-else-if="person.avatar_url == null || person.avatar_url.length === 0" v-bind:style="{ 'background-color': defaultColor(person) }">{{ defaultLetter(person) }}</div>
			</div>

			<!-- details -->
			<div class="details flexbox flex-grow">
				<div class="flexbox flex-column">
					<!-- name -->
					<div v-if="person.first_name || person.middle_name || person.last_name" style="margin-bottom: 0.5em;">{{ concatNames(person) }}</div>
					<!-- contacts -->

					<div class="flexbox flex-column" style="font-size: 0.9em;">
						<div v-for="contact in person.contacts">
							<div>{{ contact.handle }}</div>
						</div>
					</div>
				</div>

				<!-- Tag -->
				<aside class="action-bar" v-on:click="openActionModal(person, 'person')">
					<span>Tag</span><i class="fas fa-hashtag"></i>
					<!--<span>Share</span><i class="fas fa-share"></i>-->
				</aside>
			</div>
		</div>

		<!-- tags -->
		<div>
			<div class="tagging">
				<div class="tags">
					<span v-for="tag in person.tags" v-bind:key="tag">#{{ tag }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import actionModal from '../modals/action-modal';
	import icons from '../../lib/util/icons';
	import { defaultColor, defaultLetter } from '../../lib/util/default-icon';

	export default {
		data: function() {
			return {
				tags: function() {
					let tags = [];

					if (this.tagMasks && this.tagMasks != null) {
						_.forEach(this.tagMasks.source, function(tag) {
							if (tags.indexOf(tag) === -1) {
								tags.push(tag);
							}
						});

						_.forEach(this.tagMasks.added, function(tag) {
							if (tags.indexOf(tag) === -1) {
								tags.push(tag);
							}
						});

						_.forEach(this.tagMasks.removed, function(tag) {
							let index = tags.indexOf(tag);

							if (index > -1) {
								tags.splice(index, 1);
							}
						});
					}

					return tags;
				}
			}
		},
		filters: {
			safe: function(input) {
				return typeof input === 'string' ? input : input == null ? '' : input.toString()
			}
		},
		methods: {
			getProviderIcon: function(provider) {
				return icons('provider', provider.name);
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
		},
		props: [
			'connection',
			'person'
		]
	}
</script>
