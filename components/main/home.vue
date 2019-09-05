<template>
    <main>
        <transition appear
                    name="page-load"
        >
            <aside v-if="$store.state.user != undefined"
                   id="profile"
            >
                <nuxt-link to="/settings/connections">
                    <div class="avatar">
                        <transition name="opacity"
                                    mode="out-in"
                        >
                            <img v-if="$store.state.person.avatar_url != null && $store.state.person.avatar_url.length > 0"
                                 class="me"
                                 v-bind:src="$store.state.person.avatar_url"
                                 style="max-height: 100px; max-width: 100px;"
                            >
                            <div v-else-if="$store.state.person.avatar_url == null || $store.state.person.avatar_url.length === 0"
                                 class="default me"
                                 v-bind:style="{ 'background-color': defaultColor($store.state.person) }"
                            >
                                {{ defaultLetter($store.state.person) }}
                            </div>
                        </transition>
                    </div>

                    <span class="name">{{ concatNames($store.state.person) }}</span>
                </nuxt-link>

                <div class="divider"></div>

                <transition appear
                            name="page-load"
                >
                    <div class="info">
                        <div>
                            <i class="fal fa-clock"></i>
                            <span>Joined LifeScope {{ $store.getters.dateJoined }}</span>
                        </div>
                    </div>
                </transition>

                <div class="divider"></div>

                <div id="stats-container">
                    <div class="scroller">
                        <div class="stats">
                            <nuxt-link class="connections flexbox flex-space-between"
                                       to="/settings/connections"
                            >
                                <div class="count">Connections</div>
                                <div class="count-val"> {{ connectionCount }}</div>
                            </nuxt-link>

                            <a class="people clickable flexbox flex-space-between"
                               v-on:click="selectTab('people')"
                            >
                                <div class="count">People</div>
                                <div class="count-val"> {{ personCount }}</div>
                            </a>

                            <nuxt-link class="events flexbox flex-space-between"
                                       to="/explore"
                            >
                                <div class="count">Events</div>
                                <div class="count-val"> {{ eventCount }}</div>
                            </nuxt-link>

                            <nuxt-link class="content flexbox flex-space-between"
                                       to="/explore?facet=content"
                            >
                                <div class="count">Content</div>
                                <div class="count-val"> {{ contentCount }}</div>
                            </nuxt-link>

                            <nuxt-link class="contacts flexbox flex-space-between"
                                       to="/explore?facet=contacts"
                            >
                                <div class="count">Contacts</div>
                                <div class="count-val"> {{ contactCount }}</div>
                            </nuxt-link>

                            <nuxt-link class="locations flexbox flex-space-between"
                                       to="/settings/locations"
                            >
                                <div class="count">Locations</div>
                                <div class="count-val"> {{ locationCount }}</div>
                            </nuxt-link>

                            <div class="searches clickable flexbox flex-space-between"
                                 v-on:click="selectTab('searches', 'recent')"
                            >
                                <div class="count">Searches</div>
                                <div class="count-val"> {{ $store.state.searchCount }}</div>
                            </div>

                            <div class="favorited clickable flexbox flex-space-between"
                                 v-on:click="selectTab('searches', 'favorited')"
                            >
                                <div class="count">Favorites</div>
                                <div class="count-val"> {{ favoriteCount }}</div>
                            </div>

                            <div class="clickable flexbox flex-space-between"
                                 v-on:click="selectTab('tags')"
                            >
                                <div class="count">Tags</div>
                                <div class="count-val"> {{ tagCount }}</div>
                            </div>

                            <div class="shared-tags clickable flexbox flex-space-between"
                                 v-on:click="selectTab('tags')"
                            >
                                <div class="count">Shared Tags</div>
                                <div class="count-val"> {{ sharedTagCount }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </transition>

        <transition appear
                    name="page-load"
        >
            <section v-if="$store.state.user != undefined"
                     id="content"
            >
                <div class="flexbox">
                    <transition appear
                                name="page-load"
                    >
                        <nav id="tabs">
                            <div class="tab"
                                 name="people"
                                 data-intro-selector="people-tab"
                                 v-bind:class="{selected: $store.state.home.tab === 'people'}"
                                 v-on:click="fetchData(true, 'people', 'first_name')"
                            >
                                People
                            </div>
                            <div class="tab"
                                 name="favorited"
                                 data-intro-selector="searches-tab"
                                 v-bind:class="{selected: $store.state.home.tab === 'searches'}"
                                 v-on:click="fetchData(true, 'searches', 'favorited')"
                            >
                                Searches
                            </div>
                            <div class="tab"
                                 name="tags"
                                 data-intro-selector="tags-tab"
                                 v-bind:class="{selected: $store.state.home.tab === 'tags'}"
                                 v-on:click="fetchData(true, 'tags', 'tag')"
                            >
                                Tags
                            </div>

                            <transition name="opacity">
                                <div v-if="$store.state.home.tab === 'people'"
                                     id="sort"
                                     class="flexbox flex-grow flex-end"
                                >
                                    <div v-bind:class="{selected: $store.state.home.sort === 'first_name'}"
                                         v-on:click="fetchData(true, 'people', 'first_name')"
                                    >
                                        First
                                    </div>
                                    <div v-bind:class="{selected: $store.state.home.sort === 'middle_name'}"
                                         v-on:click="fetchData(true, 'people', 'middle_name')"
                                    >
                                        Middle
                                    </div>
                                    <div v-bind:class="{selected: $store.state.home.sort === 'last_name'}"
                                         v-on:click="fetchData(true, 'people', 'last_name')"
                                    >
                                        Last
                                    </div>
                                </div>
                            </transition>

                            <transition name="opacity">
                                <div v-if="$store.state.home.tab === 'searches'"
                                     id="sort"
                                     class="flexbox flex-grow flex-end"
                                >
                                    <div v-bind:class="{selected: $store.state.home.sort === 'favorited'}"
                                         v-on:click="fetchData(true, 'searches', 'favorited')"
                                    >
                                        Favorited
                                    </div>
                                    <div v-bind:class="{selected: $store.state.home.sort === 'top'}"
                                         v-on:click="fetchData(true, 'searches', 'top')"
                                    >
                                        Top
                                    </div>
                                    <div v-bind:class="{selected: $store.state.home.sort === 'recent'}"
                                         v-on:click="fetchData(true, 'searches', 'recent')"
                                    >
                                        Recent
                                    </div>
                                </div>
                            </transition>

                            <transition name="opacity">
                                <div v-if="$store.state.home.tab === 'tags'"
                                     id="sort"
                                     class="flexbox flex-grow flex-end"
                                >
                                    <div v-bind:class="{selected: $store.state.home.sort === 'tag'}"
                                         v-on:click="fetchData(true, 'tags', 'tag')"
                                    >
                                        A-Z
                                    </div>
                                    <div v-bind:class="{selected: $store.state.home.sort === 'shared'}"
                                         v-on:click="fetchData(true, 'tags', 'shared')"
                                    >
                                        Shared
                                    </div>
                                </div>
                            </transition>
                        </nav>
                    </transition>
                </div>

                <div id="search-container"
                     v-on:scroll="handleScroll"
                >
                    <div class="scroller">
                        <div id="searches">
                            <transition-group v-if="$store.state.home.tab === 'searches'"
                                              appear
                                              name="search-item"
                                              tag="p"
                            >
                                <nuxt-link v-for="search in $store.state.searchMany"
                                           v-bind:key="search.id"
                                           v-bind:to="constructLink(search)"
                                           class="saved-search"
                                           v-bind:data-id="search.id"
                                           v-bind:data-favorited="search.favorited"
                                           v-bind:data-icon-color="search.iconColor"
                                           v-bind:data-icon="search.icon"
                                           v-bind:data-name="search.name"
                                >
                                    <div class="info">
                                        <i v-bind:class="searchIcon(search)"
                                           v-bind:style="{ color: searchColor(search) }"
                                        ></i>
                                        <span class="name">{{ search.name }}</span>

                                        <span class="spacer"></span>

                                        <span class="last-run">{{ lastRunRelative(search) }}</span>

                                        <i v-bind:class="favoriteIcon(search)"></i>
                                    </div>

                                    <div v-if="search.query || (search.filters && search.filters.length > 0)"
                                         class="search"
                                    >
                                        <div v-if="search.query"
                                             class="query"
                                        >
                                            &quot;{{ search.query }}&quot;
                                        </div>

                                        <div v-if="search.filters && search.filters.length > 0"
                                             class="filters"
                                        >
                                            <!-- eslint-disable-next-line vue/require-v-for-key -->
                                            <div v-for="filter in search.filters"
                                                 class="filter"
                                            >
                                                {{ filter.name || filter.type }}
                                            </div>

                                            <div class="filter-overflow-count"></div>
                                        </div>
                                    </div>

                                    <div v-bind:class="favoriteButton(search)"
                                         v-on:click.stop.prevent="showFavoriteModal(search)"
                                    ></div>
                                </nuxt-link>
                            </transition-group>

                            <transition-group v-if="$store.state.home.tab === 'tags'"
                                              appear
                                              name="search-item"
                                              tag="p"
                            >
                                <a v-for="tag in $store.state.tagMany"
                                   v-bind:key="tag.id"
                                   class="tag"
                                   v-on:click="searchForTag(tag.tag)"
                                >
                                    <div>
                                        <span class="name">#{{ tag.tag }}</span>

                                        <span class="spacer"></span>

                                        <!-- <span class="sharing">Share</span> -->

                                        <i class="share-status"
                                           v-bind:class="shareStatus(tag)"
                                        ></i>
                                    </div>

                                    <div class="tag-share"
                                         v-on:click.stop.prevent="showSharingModal(tag)"
                                    ></div>
                                </a>
                            </transition-group>

                            <transition-group v-if="$store.state.home.tab === 'people'"
                                              appear
                                              name="search-item"
                                              tag="p"
                            >
                                <a v-for="person in $store.state.personMany"
                                   v-bind:key="person.id"
                                   class="person"
                                   v-on:click="searchForPerson(person)"
                                >
                                    <div>
                                        <div class="avatar">
                                            <img v-if="person.avatar_url != null && person.avatar_url.length > 0"
                                                 v-bind:src="person.avatar_url"
                                            >
                                            <div v-else-if="person.avatar_url == null || person.avatar_url.length === 0"
                                                 class="default"
                                                 v-bind:style="{ 'background-color': defaultColor(person) }"
                                            >{{
                                                defaultLetter(person) }}
                                            </div>
                                        </div>
                                        <span class="name">{{ concatNames(person) }}</span>
                                    </div>
                                </a>
                            </transition-group>

                            <transition name="opacity">
                                <div v-if="$store.state.home.tab === 'people'"
                                     id="more-people"
                                     class="flexbox flex-center"
                                     v-on:click="redirectToPeople"
                                >
                                    <i class="fal fa-3x glow fa-plus"></i>
                                </div>
                            </transition>
                        </div>
                    </div>
                </div>

                <modals-container />
            </section>
        </transition>
    </main>
</template>

<script>
    /* global moment */

	import _ from 'lodash';

	import personMany from '../../apollo/queries/person-many.gql';
	import personOne from '../../apollo/queries/person-one.gql';
	import searchMany from '../../apollo/queries/search-many.gql';
	import tagMany from '../../apollo/queries/tag-many.gql';
	import userCounts from '../../apollo/queries/user-counts.gql';
	import userTutorialComplete from '../../apollo/mutations/user-tutorial-complete.gql';

	import { defaultColor, defaultLetter } from '../../lib/util/default-icon';
	import favoriteModal from '../modals/favorite.vue';
	import sharingModal from '../modals/tag-sharing.vue';

	export default {
		data: function() {
			return {
				connectionCount: null,
				contactCount: null,
				contentCount: null,
				eventCount: null,
				favoriteCount: null,
				locationCount: null,
				personCount: null,
				searchCount: null,
				searches: null,
				tagCount: null,
				sharedTagCount: null,
				dataEnd: false,
				offset: 0,
				pageSize: 20
			};
		},

		mounted: async function() {
			let self = this;

			let userCountPromise = this.$apollo.query({
                query: userCounts,
                fetchPolicy: 'no-cache'
            });

			let personPromise = this.$apollo.query({
				query: personOne,
				variables: {
					self: true
				},
				fetchPolicy: 'no-cache'
			});

			let personResult = await personPromise;

			let person = personResult.data.personOne;

			self.$store.state.person.id = person.id;
			self.$store.state.person.avatar_url = person.avatar_url;
			self.$store.state.person.first_name = person.first_name;
			self.$store.state.person.middle_name = person.middle_name;
			self.$store.state.person.last_name = person.last_name;
			self.$store.state.person.contact_id_strings = person.contact_id_strings;
			self.$store.state.person.hydratedContacts = person.hydratedContacts;
			self.$store.state.person.available_avatars = _.compact(_.map(person.hydratedContacts, function(contact) {
				return contact.avatar_url;
			}));

			self.$store.state.person.avatar_index = _.indexOf(self.$store.state.person.available_avatars, self.$store.state.person.avatar_url);

			let userCountResult = await userCountPromise;

			this.$data.connectionCount = userCountResult.data.userCounts.connectionCount;
			this.$data.eventCount = userCountResult.data.userCounts.eventCount;
			this.$data.contactCount = userCountResult.data.userCounts.contactCount;
			this.$data.contentCount = userCountResult.data.userCounts.contentCount;
			this.$data.locationCount = userCountResult.data.userCounts.locationCount;
			this.$data.favoriteCount = userCountResult.data.userCounts.favoriteSearchCount;
			this.$data.personCount = userCountResult.data.userCounts.peopleCount;
			this.$data.tagCount = userCountResult.data.userCounts.tagCount;
			this.$data.sharedTagCount = userCountResult.data.userCounts.sharedTagCount;
			this.$store.state.searchCount = userCountResult.data.userCounts.searchCount;

			this.$data.offset = 0;
			this.$store.state.home.tab = 'people';
			this.$store.state.home.sort = 'first_name';
			this.$store.state.hide_advanced = this.$store.state.hide_filters = this.$store.state.hide_favorite_star = false;

			await this.fetchData(true, this.$store.state.home.tab, this.$store.state.home.sort);

			this.$root.$on('set-home-sort', function(sort) {
				self.$store.state.home.sort = sort;

				self.selectTab(self.$store.state.home.tab, sort);
			});

			if (_.get(self.$store.state.user, 'tutorials.home') !== true) {
                self.$intro()
                    .setOptions({
                        steps: [
                            {
                                intro: 'This is your home page, which lets you quickly re-run your top searches as well as share tagged searches with others.'
                            },
                            {
                                intro: 'This tab lets you quickly make searches on People, which you can make in <a href="https://app.lifescope.io/settings/people">one of the Settings pages</a>. People are collections of Contacts, i.e. accounts from various Providers.',
                                element: document.querySelector('[data-intro-selector="people-tab"]')
                            },
                            {
                                intro: 'From this tab, you can see and easily re-run your favorite LifeScope searches.',
                                element: document.querySelector('[data-intro-selector="searches-tab"]')
                            },
                            {
                                intro: 'This tab shows you all of the things you\'ve tagged in LifeScope. You can make everything tagged with a specific tag publicly available so that you can share your curated stories with others.',
                                element: document.querySelector('[data-intro-selector="tags-tab"]')
                            }
                        ]
                    })
                    .start()
                    .oncomplete(function() {
                        self.$apollo.mutate({
                            mutation: userTutorialComplete,
                            variables: {
                                tutorial: 'home'
                            }
                        });
                    });
			}
		},

		methods: {
			fetchData: async function(init, tab, sort) {
				this.$store.state.home.tab = tab === 'tags' ? 'tags' : tab === 'people' ? 'people' : 'searches';

				if (init === true) {
					this.$data.offset = 0;
					this.$data.dataEnd = false;
				}

				if (this.$data.dataEnd !== true) {
					let variables = {
						limit: this.$data.pageSize,
						skip: this.$data.offset
					};

					if (tab === 'people') {
						this.$store.state.home.sort = variables.sort = sort;

						variables.filter = {
							self: false
						}
					}

					if (tab === 'searches') {
						this.$store.state.home.sort = sort;

						if (sort === 'favorited') {
							variables.filter = {
								favorited: true
							};

							variables.sort = 'favorites';
						}
						else if (sort === 'top') {
							variables.sort = 'top';
						}
						else if (sort === 'recent') {
							variables.sort = 'recent';
						}
					}

					if (tab === 'tags') {
						this.$store.state.home.sort = sort;

						variables.sort = 'tag';

						if (sort === 'shared') {
							variables.filter = {
								share: true
							};
						}
					}

					let result = await this.$apollo.query({
						query: tab === 'tags' ? tagMany : tab === 'people' ? personMany : searchMany,
						variables: variables,
						fetchPolicy: 'no-cache'
					});

					let data = tab === 'tags' ? result.data.tagMany : tab === 'people' ? result.data.personMany : result.data.searchMany;

					let storeName = tab === 'tags' ? 'tagMany' : tab === 'people' ? 'personMany' : 'searchMany';

					this.$store.state[storeName] = init ? data : this.$store.state[storeName].concat(data);

					this.$data.dataEnd = data.length < this.$data.pageSize;
					this.$data.offset += this.$data.pageSize;
				}
			},

			searchIcon: function(search) {
				return search.favorited && search.icon ? search.icon : 'fal fa-circle';
			},

			searchColor: function(search) {
				return search.favorited && search.icon && search.icon_color ? search.icon_color : '#b6bbbf';
			},

			favoriteIcon: function(search) {
				return search.favorited ? 'favorite-edit fas fa-star subdue' : 'favorite-create fal fa-star subdue'
			},

			favoriteButton: function(search) {
				return search.favorited ? 'favorite-edit' : 'favorite-create'
			},

			shareStatus: function(tag) {
				return tag.share === 'public' ? 'fal fa-lock-open' : 'fal fa-lock';
			},

			lastRunRelative: function(search) {
				return moment(new Date(search.last_run)).fromNow();
			},

			constructLink: function(search) {
				return '/explore?qid=' + search.id;
			},

			showFavoriteModal: function(search) {
				let id = search.id;

				this.$store.state.currentSearch = _.clone(_.find(this.$store.state.searchMany, function(item) {
					return item.id === id;
				}));

				this.$store.state.tempSearch = _.clone(this.$store.state.currentSearch);

				this.$modal.show(favoriteModal, {}, {
					height: 'auto',
					scrollable: true
				}, {
					'search-unfavorited': this.searchUnfavorited,
					'search-deleted': this.searchDeleted,
					'search-saved': this.searchSaved
				});
			},

			showSharingModal: function(tag) {
				this.$modal.show(sharingModal, {
					tag: tag
				}, {
					height: 'auto',
					scrollable: true
				});
			},

			searchUnfavorited(search) {
				let matched = _.find(this.$data.searchMany, function(item) {
					return item.id === search.id
				});

				matched.favorited = false;
				this.$data.favoriteCount--;
			},

			searchDeleted(search) {
				this.$data.searchMany = _.remove(this.$data.searchMany, function(item) {
					return item.id === search.id;
				});

				this.$data.searchCount--;

				if (search.favorited) {
					this.$data.favoriteCount--;
				}
			},

			searchSaved(search) {
				let matched = _.find(this.$data.searchMany, function(item) {
					return item.id === search.id
				});

				matched.icon = this.$store.state.tempSearch.icon;
				matched.icon_color = this.$store.state.tempSearch.icon_color;
				matched.name = this.$store.state.tempSearch.name;
				matched.favorited = true;

				this.$data.favoriteCount++;
			},

			selectTab(tab, sort) {
				this.$store.state.home.tab = tab;

				this.fetchData(true, tab, sort);
			},

			handleScroll: _.debounce(async function(e) {
				let target = e.target;

				let scrollBottom = target.scrollTop + target.clientHeight;

				if (scrollBottom > 0.9 * target.scrollHeight) {
					await this.fetchData(false, this.$store.state.home.tab, this.$store.state.home.sort);
				}
			}, 500),

			searchForTag: function(tag) {
				this.$store.state.searchBar.query = '#' + tag;
				this.$root.$emit('check-and-search', true);
			},

			searchForPerson: function(person) {
				this.$store.state.searchBar.filters = [{
					type: 'who',
					data: {
						type: 'person_id',
						person_id: person.id
					}
				}];

				this.$root.$emit('check-and-search', true);
			},

			redirectToPeople: function() {
				this.$router.push('/settings/person/create');
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
	}
</script>
