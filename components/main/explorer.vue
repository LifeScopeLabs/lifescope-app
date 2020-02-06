<template>
    <transition appear
                name="page-load"
    >
        <main v-if="$store.state.view === 'xr'">
            <XRApp />
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
    /* global moment, $ */

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
	import XRApp from '../xr/XRApp.vue';

	import connectionMany from '../../apollo/queries/connection-many.gql';
	import providerHydratedMany from '../../apollo/queries/provider-hydrated-many.gql';
	import connectedOAuthProviderMany from '../../apollo/queries/connectedOauthProviderMany.gql';
	import personMany from '../../apollo/queries/person-many.gql';
	import sharedTagSelfPerson from '../../apollo/queries/shared-tag-self-person.gql';

	export default {
		components: {
			MapView,
			UserContact,
			UserContent,
			UserEvent,
			UserPerson,
			XRApp
		},

		data: function() {
			return {
				skipEventQuery: true,
				qid: null
			};
		},

		watch: {
			'$route': async function () {
				if( !this.$store.state.connectionsLoaded ||
					!this.$store.state.oauthProvidersLoaded ||
					!this.$store.state.providersLoaded ||
					!this.$store.state.peopleLoaded) {
					this.loadFacets();
				}

				this.updateSearch();
			}
		},

		mounted: async function() {
			let self = this;

			function calculateTooltipOffset(step) {
				let tooltipHeight = $(step.tooltip.element).height();

				step.updateStepOptions({
					tetherOptions: {
						targetOffset: tooltipHeight + 45 + 'px 0'
					}
				});

				step.hide();
				step.show();
			}

			this.$store.state.hide_advanced = this.$store.state.hide_filters = this.$store.state.hide_favorite_star = false;

			this.updateSearch();

			if (_.get(this.$store.state.user, 'tutorials.explorer') !== true) {
				let rendering = false;

				self.$nextTick(function() {
					let tour = self.$shepherd({
						useModalOverlay: true,
						defaultStepOptions: {
							arrow: false,
							cancelIcon: {
								enabled: true,
								label: 'Cancel'
							}
						}
					});

					tour.addSteps([
						{
							title: 'LifeScope Explorer',
							text: 'This is the LifeScope Explorer, where you can search and explore all of your data. See your history as a feed, grid, list, map, or interactive 3D space.',
							buttons: [
								{
									action: function() {
										return tour.cancel();
									},
									text: 'Cancel'
								},
								{
									action: function() {
										return tour.next();
									},
									text: 'Next'
								}
							]
						},
						{
							title: 'Run Search',
							text: 'Click the magnifying glass to run a search.',
							attachTo: {
								element: '#search-button',
								on: 'bottom'
							},
							buttons: [
								{
									action: function() {
										return tour.cancel();
									},
									text: 'Cancel'
								},
								{
									action: function() {
										return tour.back();
									},
									text: 'Previous'
								},
								{
									action: function() {
										return tour.next();
									},
									text: 'Next'
								}
							],
							tetherOptions: {
								attachment: 'bottom right',
								targetAttachment: 'top right'
							},
                            when: {
								show: function() {
									if (rendering === false) {
										rendering = true;

										calculateTooltipOffset(this);

										rendering = false;
									}
                                }
                            }
						},
						{
							title: 'Advanced Search',
							text: 'Click here to open the Advanced Search features. You can filter searches on People or Contacts (Who); the type of Content involved (What); the date and time it took place (When); the location it took place (Where); and what Providers/Connections the data came from (How). Note that Where filters must be drawn on the Map View.',
							attachTo: {
								element: '#advanced',
								on: 'bottom'
							},
							buttons: [
								{
									action: function() {
										return tour.cancel();
									},
									text: 'Cancel'
								},
								{
									action: function() {
										return tour.back();
									},
									text: 'Previous'
								},
								{
									action: function() {
										return tour.next();
									},
									text: 'Next'
								}
							],
							tetherOptions: {
								attachment: 'top left',
								targetAttachment: 'bottom left'
							},
							when: {
								show: function() {
									if (rendering === false) {
										rendering = true;

										calculateTooltipOffset(this);

										rendering = false;
									}
								}
							}
						},
						{
							title: 'Favorite a Search',
							text: 'Click the star to Favorite a search that you find useful, interesting, or just plain cool. It\'ll show up under the Favorites classification under the Searches tab on your <a href="https://app.lifescope.io">home page</a>.',
							attachTo: {
								element: '#search-favorited',
								on: 'bottom'
							},
							buttons: [
								{
									action: function() {
										return tour.cancel();
									},
									text: 'Cancel'
								},
								{
									action: function() {
										return tour.back();
									},
									text: 'Previous'
								},
								{
									action: function() {
										return tour.complete();
									},
									text: 'Done'
								}
							],
							tetherOptions: {
								attachment: 'bottom right',
								targetAttachment: 'top right'
							},
							when: {
								show: function() {
									if (rendering === false) {
										rendering = true;

										calculateTooltipOffset(this);

										rendering = false;
									}
								}
							}
						}
					]);

					tour.start();

					tour.on('cancel', async function() {
						let response = await self.$apollo.mutate({
							mutation: userTutorialComplete,
							variables: {
								tutorial: 'explorer'
							}
						});

						self.$store.state.user.tutorials = response.data.userTutorialComplete.tutorials;
					});

					tour.on('complete', async function() {
						let response = await self.$apollo.mutate({
							mutation: userTutorialComplete,
							variables: {
								tutorial: 'explorer'
							}
						});

						self.$store.state.user.tutorials = response.data.userTutorialComplete.tutorials;
					});
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
				let self = this;
				let target = e.target;

				let scrollBottom = target.scrollTop + target.clientHeight;

				let objects = this.$store.state.objects[this.$store.state.facet];

				if (scrollBottom > 0.9 * target.scrollHeight && this.$store.state.searching !== true) {
					let nextPageStartEvent = objects[self.$store.state.visibleObjectStartIndex + (2 * self.$store.state.pageSize)];
                    
					if (this.$store.state.view === 'feed' && nextPageStartEvent != null) {
                        for (let i = self.$store.state.visibleObjectStartIndex + (2 * self.$store.state.pageSize); i < self.$store.state.visibleObjectStartIndex + (3 * self.$store.state.pageSize); i++) {
                            if (objects[i] != null) {
                                objects[i].invisible = false;
                            }
                        }

                        if (objects.length > 2 * self.$store.state.pageSize) {
                            for (let i = self.$store.state.visibleObjectStartIndex; i < self.$store.state.visibleObjectStartIndex + self.$store.state.pageSize; i++) {
                                if (objects[i] != null) {
                                    objects[i].invisible = true;
                                }
                            }

                            self.$store.state.visibleObjectStartIndex += self.$store.state.pageSize;
                        }
                    }
					else {
						this.$root.$emit('perform-search', false);

						this.$root.$once('search-finished', function() {
							if (self.$store.state.view === 'feed' && objects.length > 2 * self.$store.state.pageSize) {
								for (let i = self.$store.state.visibleObjectStartIndex; i < self.$store.state.visibleObjectStartIndex + self.$store.state.pageSize; i++) {
									if (objects[i] != null) {
										objects[i].invisible = true;
									}
								}

								self.$store.state.visibleObjectStartIndex += self.$store.state.pageSize;
							}
						});
					}
				}

				if (target.scrollTop < 0.1 * target.scrollHeight && this.$store.state.searching !== true && this.$store.state.view === 'feed') {
					let items = $('#list').children();

					let firstVisible = _.find(items, function(child) {
						let top = child.offsetTop;
						let height = child.offsetHeight;

						return top + height > target.scrollTop;
                    });

					if (self.$store.state.visibleObjectStartIndex > 0) {
						for (let i = self.$store.state.visibleObjectStartIndex; i >= self.$store.state.visibleObjectStartIndex - self.$store.state.pageSize; i--) {
							if (objects[i] != null) {
                                objects[i].invisible = false;
							}
						}

                        for (let i = self.$store.state.visibleObjectStartIndex + (2 * self.$store.state.pageSize); i >= self.$store.state.visibleObjectStartIndex + self.$store.state.pageSize; i--) {
                            if (objects[i] != null) {
                                objects[i].invisible = true;
                            }
                        }

						self.$store.state.visibleObjectStartIndex -= self.$store.state.pageSize;

						self.$nextTick(function() {
							target.scrollTop = firstVisible.offsetTop - 200 > 0 ? firstVisible.offsetTop - 200 : 0;
						});
					}
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
			},

			updateSearch: async function() {
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
			},

			loadFacets: async function() {
				let self = this;

				if (process.client) {
					this.$store.state.connectionsLoaded = this.$apollo.query({
						query: connectionMany,
						fetchPolicy: 'no-cache'
					})
						.then(function(result) {
							self.$store.state.connectionMany = result.data.connectionMany;

							return Promise.resolve();
						});

					this.$store.state.providersLoaded = this.$apollo.query({
						query: providerHydratedMany,
						fetchPolicy: 'no-cache'
					})
						.then(function(result) {
							self.$store.state.providerHydratedMany = result.data.providerHydratedMany;

							return Promise.resolve();
						});

					this.$store.state.oauthProvidersLoaded = this.$apollo.query({
						query: connectedOAuthProviderMany,
						fetchPolicy: 'no-cache'
					})
						.then(function(result) {
							self.$store.state.connectedOAuthProviderMany = result.data.connectedOAuthProviderMany;

							return Promise.resolve();
						});

					this.$store.state.peopleLoaded = this.$apollo.query({
						query: personMany,
						variables: {
							filter: {
								self: false
							}
						},
						fetchPolicy: 'no-cache'
					})
						.then(function(result) {
							self.$store.state.searchPersonMany = result.data.personMany;

							return Promise.resolve();
						});

					if (this.$store.state.mode === 'shared') {
						let params = qs.parse(history.location.search, {
							ignoreQueryPrefix: true
						});

						let personResult = await this.$apollo.query({
							query: sharedTagSelfPerson,
							variables: {
								id: params.id,
								passcode: params.passcode
							},
							fetchPolicy: 'no-cache'
						});

						let person = personResult.data.sharedTagSelfPerson;

						self.$store.state.person.avatar_url = person.avatar_url;
						self.$store.state.person.first_name = person.first_name;
						self.$store.state.person.middle_name = person.middle_name;
						self.$store.state.person.last_name = person.last_name;
					}
				}
			}
		},
	}
</script>
