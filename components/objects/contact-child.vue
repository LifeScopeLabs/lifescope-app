<template>
	<div v-if="contact.hidden !== true" class="object contact" v-bind:id="contact.id">
		<!-- contact -->
		<div>
			<!-- avatar -->
			<div class="user-avatar">
				<!-- avatar image -->
				<img v-if="contact.avatar_url" class="avatar" v-bind:src="contact.avatar_url"/>
				<!-- else avatar icon -->
				<i v-else class="fal fa-user"></i>
			</div>

			<!-- details -->
			<div class="details flexbox flex-grow">
				<div class="flexbox flex-column">
					<!-- name -->
					<div v-if="contact.name">{{ contact.name }}</div>
					<!-- handle -->
					<div v-if="contact.handle">{{ contact.handle }}</div>
				</div>

				<!-- Tag -->
				<aside class="action-bar" v-on:click="openActionModal(contact, 'contact')">
					<span>Tag</span><i class="fal fa-hashtag"></i>
					<!--<span>Share</span><i class="fal fa-share"></i>-->
				</aside>
			</div>
		</div>

		<!-- tags -->
		<div class="tagging">
			<div class="tags">
				<span v-for="tag in contact.tags" v-bind:key="tag">#{{ tag }}</span>
			</div>
		</div>

		<div class=hide-button v-on:click="hideContact(contact)">Hide this Contact</div>
	</div>

	<div class="contact-hidden" v-else-if="contact.hidden === true">
		This Contact is hidden.
		<div class="unhide-button" v-on:click="unhideContact(contact)">Unhide this Contact</div>
	</div>
</template>

<script>
	import actionModal from '../modals/action-modal';
	import contactHide from '../../apollo/mutations/contact-hide.gql';
	import contactUnhide from '../../apollo/mutations/contact-unhide.gql';
	import icons from '../../lib/util/icons';

	export default {
		data: function() {
			return {
				tags: function() {
					let tags = [];

					if (this.tagMasks) {
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

			hideContact: async function(contact) {
				await this.$apollo.mutate({
					mutation: contactHide,
					variables: {
						id: contact.id
					}
				});

				let match = _.find(this.$store.state.objects.contacts, function(item) {
					return item.id === contact.id;
				});

				match.hidden = true;
			},

			unhideContact: async function(contact) {
				await this.$apollo.mutate({
					mutation: contactUnhide,
					variables: {
						id: contact.id
					}
				});

				let match = _.find(this.$store.state.objects.contacts, function(item) {
					return item.id === contact.id;
				});

				match.hidden = false;
			}
		},
		props: [
			'connection',
			'contact'
		]
	}
</script>
