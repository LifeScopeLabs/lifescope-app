<template>
    <div v-if="type === 'event'"
         v-bind:id="item.id"
         class="object event modaled flex-column"
    >
        <div class="flexbox flex-end close-container">
            <i class="close-button fal fa-2x fa-times-circle"
               v-on:click="$emit('close')"
            ></i>
        </div>
        <div v-if="item.hidden !== true"
             class="items"
        >
            <aside class="details">
                <div class="type">
                    <i v-bind:class="getEventTypeIcon(item.type)"></i>

                    <span v-if="item.context">
                        {{ item.context }}
                    </span>
                    <span v-else>
                        {{ item.type }}
                    </span>
                </div>

                <div class="provider">
                    <i v-bind:class="getProviderIcon(item.connection.provider)"></i>
                    <span> {{ item.connection.name | truncate(30) }}</span>
                </div>

                <div v-if="item.datetime"
                     class="date"
                >
                    <div>
                        <div>
                            <i class="fal fa-calendar-alt"></i>
                            <span> {{ item.datetime | dateShort }}</span>
                        </div>


                        <div v-if="!item.datetime"
                             class="estimation"
                        >
                            <span>Estimated</span>
                        </div>

                        <div v-else>
                            <i class="fal fa-clock"></i>
                            <span> {{ item.datetime | dateTime }}</span>
                        </div>
                    </div>
                </div>

                <div class="flexbox flex-row flex-space-between tag-hide">
                    <div class="flexbox flex-column flex-start">
                        <div class="tag-button"
                             v-on:click="openActionModal(event, 'event')"
                        >
                            <i class="fal fa-hashtag"></i>
                            <span> Tag</span>
                        </div>

                        <div class="tags">
                            <span v-for="tag in tags"
                                  v-bind:key="tag"
                            >
                                #{{ tag }}
                            </span>
                        </div>
                    </div>

                    <div class="hide-button"
                         v-on:click="hideEvent(item)"
                    >
                        <i class="fal fa-minus-hexagon"></i>
                        Hide
                    </div>
                </div>
            </aside>

            <section v-if="item.content && item.content.length > 0"
                     class="content"
            >
                <user-content v-for="content in item.content"
                              v-bind:key="content.id"
                              v-bind:content="content"
                              v-bind:connection="item.connection"
                ></user-content>
            </section>

            <aside v-if="(item.contacts && item.contacts.length > 0) || (item.people && item.people.length > 0) || (item.organizations && item.organizations.length > 0)"
                   class="interactions"
            >
                <div v-if="item.contact_interaction_type"> {{ item.content_interaction_type }}</div>
                <div class="objects">
                    <user-contact v-for="contact in item.contacts"
                                  v-bind:key="contact.id"
                                  v-bind:contact="contact"
                                  v-bind:connection="item.connection"
                    ></user-contact>
                </div>
                <!--<div v-if="item.contacts > 3 || item.people > 3 || item.organizations > 3" class="expand">More</div>-->
            </aside>
        </div>

        <div v-else-if="item.hidden === true"
             class="event-hidden"
        >
            <div class="unhide-button"
                 v-on:click="unhideEvent(item)"
            >
                <i class="fal fa-plus-hexagon"></i>
                Unhide Event
            </div>
        </div>
    </div>
    <div v-else-if="type === 'content'"
         v-bind:id="item.id"
         class="object content modaled flex-column"
    >
        <div class="flexbox flex-end close-container">
            <i class="close-button fal fa-2x fa-times-circle"
               v-on:click="$emit('close')"
            ></i>
        </div>
        <section class="content">
            <user-content v-bind:key="item.id"
                          v-bind:content="item"
                          v-bind:connection="item.connection"
            ></user-content>
        </section>
    </div>
    <div v-else-if="type === 'contact'"
         v-bind:id="item.id"
         class="object contact modaled flex-column"
    >
        <div class="flexbox flex-end close-container">
            <i class="close-button fal fa-2x fa-times-circle"
               v-on:click="$emit('close')"
            ></i>
        </div>
        <div class="objects">
            <user-contact v-bind:key="item.id"
                          v-bind:contact="item"
                          v-bind:connection="item.connection"
            ></user-contact>
        </div>
    </div>
    <div v-else-if="type === 'person'"
         v-bind:id="item.id"
         class="object person modaled flex-column"
    >
        <div class="flexbox flex-end close-container">
            <i class="close-button fal fa-2x fa-times-circle"
               v-on:click="$emit('close')"
            ></i>
        </div>
        <div class="objects">
            <user-person v-bind:key="item.id"
                         v-bind:person="item"
            ></user-person>
        </div>
    </div>
</template>

<script>
    /* global moment */

	import _ from 'lodash';

	import actionModal from '../modals/action-modal.vue';
	import icons from '../../lib/util/icons';
	import safeFilter from '../filters/safe';
	import eventHide from '../../apollo/mutations/event-hide.gql';
	import eventUnhide from '../../apollo/mutations/event-unhide.gql';
	import UserContact from '../objects/contact-child.vue';
	import UserContent from '../objects/content-child.vue';
	import UserPerson from '../objects/person-child.vue';

	export default {
		components: {
			UserContact,
			UserContent,
			UserPerson
		},

		filters: {
			safe: safeFilter,

			dateShort: function(date) {
				return moment.utc(date).format('YYYY/MM/DD');
			},

			dateTime: function(date) {
				return moment.utc(date).format('hh:mm A')
			}
		},

		props: {
			'item': {
				type: Object,
				default: function() {
					return {};
				}
			},
			'type': {
				type: String,
				default: function() {
					return 'event';
				}
			}
		},

		data: function() {
			return {
				tags: function() {
					let tags = [];

					if (this.item.tagMasks) {
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
			getEventTypeIcon: function(type) {
				return icons('event', type)
			},

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

			hideEvent: async function(event) {
				await this.$apollo.mutate({
					mutation: eventHide,
					variables: {
						id: event.id
					}
				});

				let cloned = _.cloneDeep(this.$store.state.objects.events);

				_.each(cloned, function(clonedEvent) {
					if (clonedEvent.id === event.id) {
						clonedEvent.hidden = true;
					}
				});

				this.$store.state.objects.events = cloned;
				this.$props.item.hidden = true;
			},

			unhideEvent: async function(event) {
				await this.$apollo.mutate({
					mutation: eventUnhide,
					variables: {
						id: event.id
					}
				});

				let cloned = _.cloneDeep(this.$store.state.objects.events);

				_.each(cloned, function(clonedEvent) {
					if (clonedEvent.id === event.id) {
						clonedEvent.hidden = false;
					}
				});

				this.$store.state.objects.events = cloned;
				this.$props.item.hidden = false;
			}
		}
	}
</script>
