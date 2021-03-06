<template>
    <div v-if="person.hidden !== true"
         v-bind:id="person.id"
         class="object person"
    >
        <!-- person -->
        <div>
            <!-- avatar -->
            <div class="user-avatar">
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

            <!-- details -->
            <div class="details">
                <!-- name -->
                <div v-if="person.first_name || person.middle_name || person.last_name"
                     class="person-name"
                >
                    {{ concatNames(person) }}
                </div>

                <!-- contacts -->
                <div class="flexbox flex-column"
                     style="font-size: 0.9em;"
                >
                    <div v-for="contact in person.contacts"
                         v-bind:key="contact.id"
                    >
                        <div>{{ contact.handle }}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flexbox flex-row flex-space-between tag-hide">
            <div class="flexbox flex-column flex-start">
                <!-- Tag -->
                <div class="tag-button"
                     v-on:click="openActionModal(person, 'person')"
                >
                    <i class="fal fa-hashtag"></i>
                    <span> Tag</span>
                </div>

                <!-- tags -->
                <div class="tags">
                    <span v-for="tag in person.tags"
                          v-bind:key="tag"
                    >#{{ tag }}</span>
                </div>
            </div>

            <div class="hide-button"
                 v-on:click="hidePerson(person)"
            >
                <i class="fal fa-minus-hexagon"></i>
                Hide
            </div>
        </div>
    </div>

    <div v-else-if="person.hidden === true"
         class="person-hidden"
    >
        <div class="unhide-button"
             v-on:click="unhidePerson(person)"
        >
            <i class="fal fa-plus-hexagon"></i>
            Unhide Person
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';

	import actionModal from '../modals/action-modal.vue';
	import personHide from '../../apollo/mutations/person-hide.gql';
	import personUnhide from '../../apollo/mutations/person-unhide.gql';
	import icons from '../../lib/util/icons';
	import { defaultColor, defaultLetter } from '../../lib/util/default-icon';

	export default {
		filters: {
			safe: function(input) {
				return typeof input === 'string' ? input : input == null ? '' : input.toString()
			}
		},

		props: {
			connection: {
				type: Object,
				default: function() {
					return {};
				}
			},
			person: {
				type: Object,
				default: function() {
					return {};
				}
			}
		},

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
			},

			hidePerson: async function(person) {
				await this.$apollo.mutate({
					mutation: personHide,
					variables: {
						id: person.id
					}
				});

				let match = _.find(this.$store.state.objects.people, function(item) {
					return item.id === person.id;
				});

				match.hidden = true;
			},

			unhidePerson: async function(person) {
				await this.$apollo.mutate({
					mutation: personUnhide,
					variables: {
						id: person.id
					}
				});

				let match = _.find(this.$store.state.objects.people, function(item) {
					return item.id === person.id;
				});

				match.hidden = false;
			}
		}
	}
</script>
