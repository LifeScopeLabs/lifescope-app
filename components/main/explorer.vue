<template>
    <transition appear
                name="page-load"
    >
        <main v-if="$store.state.view === 'xr'">
            <galleryContainer />
        </main>
        <main v-else-if="$store.state.view === 'map'">
            <MapView />
        </main>
        <main v-else
              v-on:scroll="handleScroll"
        >
            <!-- content section -->
            <section v-if="$store.state.user != undefined"
                     id="content"
            >
                <!-- container -->
                <!-- eslint-disable vue/html-indent -->
                <div v-if="$store.state.facet === 'contacts' && $store.state.objects.contacts.length > 0 ||
                           $store.state.facet === 'content' && $store.state.objects.content.length > 0 ||
                           $store.state.facet === 'events' && $store.state.objects.events.length > 0 ||
                           $store.state.facet === 'people' && $store.state.objects.people.length > 0"
                     class="container"
                >
                <!-- eslint-enable vue/html-indent -->
                    <div class="scroller">
                        <!-- facets -->
                        <transition-group v-if="$store.state.facet === 'contacts'"
                                          id="list"
                                          appear
                                          name="explorer-item"
                                          tag="div"
                                          v-bind:class="$store.state.view"
                        >
                            <user-contact v-for="contact in $store.state.objects.contacts"
                                          v-bind:key="contact.id"
                                          v-bind:contact="contact"
                                          v-bind:connection="contact.connection"
                                          v-on:render-details="renderDetailsModal"
                            >
                            </user-contact>
                        </transition-group>

                        <transition-group v-if="$store.state.facet === 'content'"
                                          id="list"
                                          appear
                                          name="explorer-item"
                                          tag="div"
                                          v-bind:class="$store.state.view"
                        >
                            <user-content v-for="content in $store.state.objects.content"
                                          v-bind:key="content.id"
                                          v-bind:content="content"
                                          v-bind:connection="content.connection"
                                          v-on:render-details="renderDetailsModal"
                            >
                            </user-content>
                        </transition-group>

                        <transition-group v-if="$store.state.facet === 'events'"
                                          id="list"
                                          appear
                                          name="explorer-item"
                                          tag="div"
                                          v-bind:class="$store.state.view"
                        >
                            <user-event v-for="event in $store.state.objects.events"
                                        v-bind:key="event.id"
                                        v-bind:event="event"
                                        v-on:render-details="renderDetailsModal"
                            >
                            </user-event>
                        </transition-group>

                        <transition-group v-if="$store.state.facet === 'people'"
                                          id="list"
                                          appear
                                          name="explorer-item"
                                          tag="div"
                                          v-bind:class="$store.state.view"
                        >
                            <user-person v-for="person in $store.state.objects.people"
                                         v-bind:key="person.id"
                                         v-bind:person="person"
                                         v-on:render-details="renderDetailsModal"
                            >
                            </user-person>
                        </transition-group>

                        <div v-if="($store.state.facet === 'contacts' && $store.state.objects.contacts.length > 0 || $store.state.facet === 'content' && $store.state.objects.content.length > 0 || $store.state.facet === 'events' && $store.state.objects.events.length > 0 || $store.state.facet === 'people' && $store.state.objects.events.length > 0) && $store.state.spinner === true"
                             id="more-waiting"
                        >
                            <img src="https://d233zlhvpze22y.cloudfront.net/1457056861/images/loading-icon-ring.svg" />
                            <div class="text blue"> Loading</div>
                        </div>

                        <modals-container />
                    </div>
                </div>

                <!-- Searching -->
                <!-- eslint-disable vue/html-indent -->
                <div v-if="($store.state.facet === 'contacts' && $store.state.objects.contacts.length === 0 ||
                            $store.state.facet === 'content' && $store.state.objects.content.length === 0 ||
                            $store.state.facet === 'events' && $store.state.objects.events.length === 0 ||
                            $store.state.facet === 'people' && $store.state.objects.people.length === 0) &&
                            $store.state.spinner === true"
                     id="waiting"
                >
                <!-- eslint-enable vue/html-indent -->
                    <div>
                        <img src="https://d233zlhvpze22y.cloudfront.net/1457056861/images/loading-icon-ring.svg" />
                        <div class="text blue">Searching</div>
                    </div>
                </div>

                <!-- shared error -->
                <div v-if="$store.state.searchError === true"
                     id="shared-error"
                >
                    <div class="prompt">
                        <div class="prompt-text">
                            <div v-if="$store.state.mode === 'shared'">
                                There was an error retrieving these shared results.
                            </div>
                            <div v-else>
                                There was a problem retrieving your search results. Please try again. If this problem
                                persists, please
                                <a href="http://bitscoop.com/support">contact support</a>
                                .
                            </div>
                        </div>
                    </div>
                </div>

                <!-- no resuts -->
                <!-- eslint-disable vue/html-indent -->
                <div v-if="($store.state.facet === 'contacts' && $store.state.objects.contacts.length === 0 ||
                            $store.state.facet === 'content' && $store.state.objects.content.length === 0 ||
                            $store.state.facet === 'events' && $store.state.objects.events.length === 0 ||
                            $store.state.facet === 'people' && $store.state.objects.people.length === 0) &&
                            $store.state.spinner === false &&
                            $store.state.searching === false &&
                            $store.state.searchError === false"
                     id="no-results"
                >
                <!-- eslint-enable vue/html-indent -->
                    <div class="prompt">
                        <div class="prompt-text">
                            <h2>No results found.</h2>
                            <div>Try adjusting your search</div>
                            <div>
                                or adding more
                                <a href="/providers">Connections</a>
                                .
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </transition>
</template>

<script>
    /* global moment */

	import _ from 'lodash';
	import qs from 'qs';

	import searchFind from '../../apollo/mutations/search-find.gql';
	import searchOne from '../../apollo/queries/search-one.gql';
	import userTutorialComplete from '../../apollo/mutations/user-tutorial-complete.gql';

	import Details from '../modals/details.vue';
	import UserContact from '../objects/contact.vue';
	import UserContent from '../objects/content.vue';
	import UserEvent from '../objects/event.vue';
	import UserPerson from '../objects/person.vue';

	import MapView from '../views/map.vue';
	import galleryContainer from '../xr/gallery-container.vue'

	export default {
		components: {
			MapView,
			UserContact,
			UserContent,
			UserEvent,
			UserPerson,
			galleryContainer
		},

		data: function() {
			return {
				skipEventQuery: true,
				qid: null
			};
		},

		mounted: async function() {
			let self = this;

			this.$store.state.hide_advanced = this.$store.state.hide_filters = this.$store.state.hide_favorite_star = false;

			let params = qs.parse(window.location.search, {
				ignoreQueryPrefix: true
			});

			this.$store.state.view = params.view ? params.view : 'feed';
			this.$store.state.facet = params.facet ? params.facet : 'events';
			this.$store.state.currentSearch.id = params.qid ? params.qid : null;

			switch (this.$store.state.facet) {
				case 'events':
					this.$store.state.sortField = 'datetime';
					this.$store.state.sortOrder = 'desc';

					break;

				case 'content':
					this.$store.state.sortField = 'type';
					this.$store.state.sortOrder = 'asc';

					break;

				case 'contacts':
					this.$store.state.sortField = 'connection';
					this.$store.state.sortOrder = 'asc';

					break;

				case 'people':
					this.$store.state.sortField = 'first_name';
					this.$store.state.sortOrder = 'asc';
			}

			this.$store.state.offset = 0;
			this.$store.state.searchEnded = false;
			this.$store.state.pageSize = 100;

			params.facet = this.$store.state.facet;
			params.view = this.$store.state.view;

			if (this.$store.state.mode === 'app') {
				await this.loadSearch();

				this.$root.$emit('check-and-search');
			}
			else if (this.$store.state.mode === 'shared') {
				this.$root.$emit('perform-search', true);
			}

			if (_.get(this.$store.state.user, 'tutorials.explorer') !== true) {
				this.$intro()
					.setOptions({
						steps: [
							{
								intro: 'This is the Explorer, where you can search and explore all of your data in LifeScope.'
							},
							{
								intro: 'Click the magnifying glass to run a search.',
                                element: document.querySelector('[data-intro-selector="search-execute"')
							},
							{
								intro: 'Click here to open the Advanced Search features. You can filter searches on People or Contacts (Who); the type of Content involved (What); the date and time it took place (When) the location it took place (Where); and what Providers/Connections the data came from (How). Note that Where filters must be drawn on the Map View.',
								element: document.querySelector('[data-intro-selector="advanced-search"')
							},
                            {
                                intro: 'Click the star to Favorite a search that you find useful, interesting, or just plain cool. It\'ll show up under the Favorites classification under the Searches tab on your <a href="https://app.lifescope.io">home page</a>.',
                                element: document.querySelector('[data-intro-selector="favorite-star"')
                            }
						]
					})
					.start()
					.onskip(async function() {
						let response = await self.$apollo.mutate({
							mutation: userTutorialComplete,
							variables: {
								tutorial: 'explorer'
							}
						});

						self.$store.state.user.tutorials = response.data.userTutorialComplete.tutorials;
					})
					.oncomplete(async function() {
						let response = await self.$apollo.mutate({
							mutation: userTutorialComplete,
							variables: {
								tutorial: 'explorer'
							}
						});

						self.$store.state.user.tutorials = response.data.userTutorialComplete.tutorials;
					});
			}
		},

		methods: {
			searchIcon: function(search) {
				return search.favorited && search.icon ? search.icon : 'far fa-circle';
			},

			searchColor: function(search) {
				return search.favorited && search.icon && search.icon_color ? search.icon_color : '#b6bbbf';
			},

			favoriteIcon: function(search) {
				return search.favorited ? 'favorite-edit fal fa-star subdue' : 'favorite-create fal fa-star subdue'
			},

			favoriteButton: function(search) {
				return search.favorited ? 'favorite-edit' : 'favorite-create'
			},

			lastRunRelative: function(search) {
				return moment(new Date(search.last_run)).fromNow();
			},

			parseParams: function(string) {
				let returned = {};
				let params = string.split('&');

				_.each(params, function(param) {
					let split = param.split('=');

					returned[split[0]] = split[1];
				});

				return returned
			},

			loadSearch: async function() {
				if (this.$store.state.currentSearch.id == null) {
					let result = await this.$apollo.mutate({
						mutation: searchFind,
						variables: {
							filters: JSON.stringify(this.$store.state.currentSearch.filters),
							query: this.$store.state.currentSearch.query
						}
					});

					if (result && result.id) {
						this.$store.state.currentSearch = this.$store.state.searchBar = _.clone(result);
					}
				}
				else {
					let result = await this.$apollo.query({
						query: searchOne,
						variables: {
							id: this.$store.state.currentSearch.id
						},
						fetchPolicy: 'no-cache'
					});

					if (result.data.searchOne == null) {
						let result = await this.$apollo.mutate({
							mutation: searchFind
						});

						this.$store.state.currentSearch = this.$store.state.searchBar = _.clone(result);
					}
					else {
						this.$store.state.currentSearch = this.$store.state.searchBar = _.clone(result.data.searchOne);
					}
				}
			},

			handleScroll: _.debounce(async function(e) {
				let target = e.target;

				let scrollBottom = target.scrollTop + target.clientHeight;

				if (scrollBottom > 0.9 * target.scrollHeight && this.$store.state.searching !== true) {
					this.$root.$emit('perform-search', false);
				}
			}, 500),

			renderDetailsModal: function(item, type) {
				if (this.$store.state.view === 'grid' || this.$store.state.view === 'list') {
					this.$modal.show(Details, {
						type: type,
						item: item
					}, {
						height: 'auto',
						scrollable: true,
						width: 1080,
						maxWidth: 1080
					})
				}
			}
		},
	}
</script>
