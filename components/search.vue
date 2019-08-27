<template slot="search">
    <div v-if="$store.state.mode !== 'shared'"
         id="search-bar"
         class="input-group"
    >
        <div v-if="!$store.state.hide_advanced"
             id="advanced"
             data-intro-selector="advanced-search"
             v-on:click="toggleFilterEditor"
        >
            <i v-bind:class="$data.editorOpen ? 'fal glow fa-caret-up' : 'fal glow fa-caret-down'"></i>
        </div>

        <transition name="filter-controls">
            <div v-if="!$store.state.hide_advanced && $data.editorOpen"
                 id="filter-controls"
            >
                <div id="filter-editor">
                    <div id="filter-buttons">
                        <div class="control"
                             data-type="who"
                             v-bind:class="{ active: $data.activeFilter.type === 'who' }"
                             v-on:click="createBlankFilter('who')"
                        >
                            <i class="fal fa-user"></i>
                        </div>

                        <div class="control"
                             data-type="what"
                             v-bind:class="{ active: $data.activeFilter.type === 'what' }"
                             v-on:click="createBlankFilter('what')"
                        >
                            <i class="fal fa-image"></i>
                        </div>

                        <div class="control"
                             data-type="when"
                             v-bind:class="{ active: $data.activeFilter.type === 'when' }"
                             v-on:click="createBlankFilter('when')"
                        >
                            <i class="fal fa-calendar-alt"></i>
                        </div>

                        <div class="control"
                             data-type="connector"
                             v-bind:class="{ active: $data.activeFilter.type === 'connector' }"
                             v-on:click="createBlankFilter('connector')"
                        >
                            <i class="fal fa-plug"></i>
                        </div>

                        <div class="control"
                             data-type="where"
                             v-bind:class="{ disabled: $store.state.view !== 'map', active: $data.activeFilter.type === 'where' }"
                        >
                            <i class="fal fa-globe"></i>
                        </div>
                    </div>

                    <div id="filter-values"
                         v-bind:class="$data.activeFilter.type"
                    >
                        <div v-if="$data.activeFilter.type != null"
                             id="filter-name"
                        >
                            <div class="text-box">
                                <input v-model="activeFilter.name"
                                       type="text"
                                       name="name"
                                       placeholder="Name this filter"
                                />
                            </div>
                        </div>

                        <form v-if="$data.activeFilter && $data.activeFilter.type === 'who'"
                              class="who"
                              v-on:submit.self.prevent="saveFilter"
                        >
                            <div class="input-container interaction-type">
                                <label v-bind:class="{active: ['to', 'from', 'with'].includes($data.activeFilter.data.interaction) === false}"
                                       class="radio"
                                       for="who-type-1"
                                >
                                    <input id="who-type-1"
                                           v-model="activeFilter.data.interaction"
                                           type="radio"
                                           name="interaction"
                                           value=""
                                    />
                                    <span>Any</span>
                                </label>

                                <label v-bind:class="{active: $data.activeFilter.data.interaction === 'to' }"
                                       class="radio"
                                       for="who-type-2"
                                >
                                    <input id="who-type-2"
                                           v-model="activeFilter.data.interaction"
                                           type="radio"
                                           name="interaction"
                                           value="to"
                                    />
                                    <span>To</span>
                                </label>

                                <label v-bind:class="{active: $data.activeFilter.data.interaction === 'from' }"
                                       class="radio"
                                       for="who-type-3"
                                >
                                    <input id="who-type-3"
                                           v-model="activeFilter.data.interaction"
                                           type="radio"
                                           name="interaction"
                                           value="from"
                                    />
                                    <span>From</span>
                                </label>

                                <label v-bind:class="{active: $data.activeFilter.data.interaction === 'with' }"
                                       class="radio"
                                       for="who-type-4"
                                >
                                    <input id="who-type-4"
                                           v-model="activeFilter.data.interaction"
                                           type="radio"
                                           name="interaction"
                                           value="with"
                                    />
                                    <span>With</span>
                                </label>
                            </div>

                            <div class="input-container who-type">
                                <label v-bind:class="{ active: $data.activeFilter.data.type === 'person_id' }"
                                       class="radio"
                                       for="person-id"
                                       v-on:click="$data.activeFilter.data.text = ''"
                                >
                                    <input id="person-id"
                                           v-model="activeFilter.data.type"
                                           type="radio"
                                           name="type"
                                           value="person_id"
                                    />
                                    Person
                                </label>
                                <label v-bind:class="{ active: $data.activeFilter.data.type === 'text' }"
                                       class="radio"
                                       for="who-text"
                                       v-on:click="$data.activeFilter.data.person_id = ''"
                                >
                                    <input id="who-text"
                                           v-model="activeFilter.data.type"
                                           type="radio"
                                           name="type"
                                           value="text"
                                    />
                                    Text search
                                </label>
                            </div>

                            <div v-if="$data.activeFilter.data.type === 'text'"
                                 class="text-box"
                            >
                                <input v-model="activeFilter.data.text"
                                       type="text"
                                       name="contact"
                                       placeholder="Contact or Person Name"
                                />
                            </div>

                            <div v-if="$data.activeFilter.data.type === 'person_id'"
                                 class="person"
                            >
                                <div class="input-container">
                                    <select v-model="activeFilter.data.person_id"
                                            name="person"
                                    >
                                        <option value=""></option>
                                        <option v-for="person in $store.state.searchPersonMany"
                                                v-bind:key="person.id"
                                                v-bind:value="person.id"
                                        >
                                            {{ person.first_name }} {{ person.middle_name }} {{ person.last_name }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div id="filter-done">
                                <button v-if="$data.activeFilter.id"
                                        class="primary"
                                >
                                    Save Filter
                                </button>
                                <button v-else
                                        class="primary"
                                >
                                    Add Filter
                                </button>
                            </div>
                        </form>

                        <form v-if="$data.activeFilter && $data.activeFilter.type === 'what'"
                              class="what"
                              v-on:submit.self.prevent="saveFilter"
                        >
                            <div class="input-container">
                                <select v-model="activeFilter.data.type"
                                        name="type"
                                >
                                    <option value=""
                                            selected
                                            disabled
                                    ></option>
                                    <option value="achievement">Achievement</option>
                                    <option value="audio">Audio</option>
                                    <option value="code">Code</option>
                                    <option value="file">File</option>
                                    <option value="game">Game</option>
                                    <option value="image">Image</option>
                                    <option value="invite">Invite</option>
                                    <option value="receipt">Receipt</option>
                                    <option value="software">Software</option>
                                    <option value="text">Text</option>
                                    <option value="video">Video</option>
                                    <option value="web-page">Web Page</option>
                                </select>
                            </div>

                            <div id="filter-done">
                                <button v-if="$data.activeFilter.id"
                                        class="primary"
                                >
                                    Save Filter
                                </button>
                                <button v-else
                                        class="primary"
                                >
                                    Add Filter
                                </button>
                            </div>
                        </form>

                        <form v-if="$data.activeFilter && $data.activeFilter.type === 'when'"
                              class="when"
                              v-on:submit.self.prevent="saveFilter"
                        >
                            <div class="input-container">
                                <label v-bind:class="{active: $data.activeFilter.data.interaction === 'exact'}"
                                       class="radio"
                                       for="when-exact"
                                >
                                    <input id="when-exact"
                                           v-model="activeFilter.data.interaction"
                                           type="radio"
                                           name="interaction"
                                           value="exact"
                                    />
                                    Exact dates
                                </label>

                                <label v-bind:class="{active: $data.activeFilter.data.interaction === 'relative'}"
                                       class="radio"
                                       for="when-relative"
                                >
                                    <input id="when-relative"
                                           v-model="activeFilter.data.interaction"
                                           type="radio"
                                           name="interaction"
                                           value="relative"
                                    />
                                    Relative dates
                                </label>
                            </div>

                            <div v-if="$data.activeFilter.data.interaction === 'exact'"
                                 class="exact-controls"
                            >
                                <div>
                                    From:
                                </div>

                                <div id="from"
                                     class="input-group text-box"
                                >
                                    <date-picker v-model="activeFilter.data.from"
                                                 v-bind:config="fromConfig"
                                                 v-on:dp-change="updateFrom"
                                    ></date-picker>
                                </div>

                                <div>
                                    To:
                                </div>

                                <div id="to"
                                     class="input-group text-box"
                                >
                                    <date-picker v-model="activeFilter.data.to"
                                                 v-bind:config="toConfig"
                                                 v-on:dp-change="updateTo"
                                    ></date-picker>
                                </div>
                            </div>

                            <div v-if="$data.activeFilter.data.interaction === 'relative'"
                                 class="relative-controls"
                            >
                                <div class="input-container">
                                    <select v-model="activeFilter.data['since-exactly']"
                                            name="since-exactly"
                                    >
                                        <option value="since"
                                                selected
                                        >
                                            Since
                                        </option>
                                        <option value="exactly">Exactly</option>
                                    </select>
                                </div>

                                <div class="text-box">
                                    <input v-model="activeFilter.data['relative-number']"
                                           type="number"
                                           name="relative-number"
                                           min="1"
                                    >
                                </div>

                                <div class="input-container">
                                    <select v-model="activeFilter.data.units"
                                            name="units"
                                    >
                                        <option value="days"
                                                selected
                                        >
                                            Day(s) ago
                                        </option>
                                        <option value="weeks">Week(s) ago</option>
                                        <option value="months">Month(s) ago</option>
                                        <option value="years">Year(s) ago</option>
                                    </select>
                                </div>
                            </div>

                            <!--<div class="estimated">-->
                            <!--<label>-->
                            <!--<input type="checkbox" name="estimated"/>-->
                            <!--<span>Return Estimated Results</span>-->
                            <!--</label>-->
                            <!--</div>-->

                            <div id="filter-done">
                                <button v-if="$data.activeFilter.id"
                                        class="primary"
                                >
                                    Save Filter
                                </button>
                                <button v-else
                                        class="primary"
                                >
                                    Add Filter
                                </button>
                            </div>
                        </form>

                        <form v-if="$data.activeFilter && $data.activeFilter.type === 'connector'"
                              class="connector"
                              v-on:submit.self.prevent="saveFilter"
                        >
                            <div class="input-container">
                                <label v-bind:class="{ active: $data.activeFilter.data.type === 'provider' }"
                                       class="radio"
                                       for="provider"
                                       v-on:click="$data.activeFilter.data.connection = null"
                                >
                                    <input id="provider"
                                           v-model="activeFilter.data.type"
                                           type="radio"
                                           name="type"
                                           value="provider"
                                    />
                                    Provider
                                </label>
                                <label v-bind:class="{ active: $data.activeFilter.data.type === 'connection' }"
                                       class="radio"
                                       for="connection"
                                       v-on:click="$data.activeFilter.data.provider = null"
                                >
                                    <input id="connection"
                                           v-model="activeFilter.data.type"
                                           type="radio"
                                           name="type"
                                           value="connection"
                                    />
                                    Connection
                                </label>
                            </div>

                            <div v-if="$data.activeFilter.data.type === 'provider'"
                                 class="provider"
                            >
                                <div class="input-container">
                                    <select v-model="activeFilter.data.provider"
                                            name="provider"
                                    >
                                        <option value=""></option>
                                        <option v-for="provider in orderBy(combinedProviders, 'name')"
                                                v-bind:key="provider.id"
                                                v-bind:value="provider.id | lowercase"
                                        >
                                            {{ provider.name }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div v-if="$data.activeFilter.data.type === 'connection'"
                                 class="connection"
                            >
                                <div class="input-container">
                                    <select v-model="activeFilter.data.connection"
                                            name="connection"
                                    >
                                        <option value=""></option>
                                        <option v-for="connection in $store.state.connectionMany"
                                                v-bind:key="connection.id"
                                                v-bind:value="connection.id"
                                        >
                                            {{ connection.name }} ({{ connection.provider.name }})
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div id="filter-done">
                                <button v-if="$data.activeFilter.id"
                                        class="primary"
                                >
                                    Save Filter
                                </button>
                                <button v-else
                                        class="primary"
                                >
                                    Add Filter
                                </button>
                            </div>
                        </form>

                        <form v-if="$data.activeFilter && activeFilter.type === 'where'"
                              class="where"
                              v-on:submit.self.prevent="saveFilter"
                        >
                            <div class="input-container">
                                <label v-bind:class="{active: $data.activeFilter.data.where_type === 'inside' }"
                                       class="radio"
                                       for="where-type-inside"
                                >
                                    <input id="where-type-inside"
                                           v-model="activeFilter.data.where_type"
                                           type="radio"
                                           name="inside-outside"
                                           value="inside"
                                    />
                                    <span>Inside</span>
                                </label>

                                <label v-bind:class="{active: $data.activeFilter.data.where_type === 'outside' }"
                                       class="radio"
                                       for="where-type-outside"
                                >
                                    <input id="where-type-outside"
                                           v-model="activeFilter.data.where_type"
                                           type="radio"
                                           name="inside-outside"
                                           value="outside"
                                    />
                                    <span>Outside</span>
                                </label>
                            </div>

                            <div class="estimated">
                                <label>
                                    <input v-model="activeFilter.data.estimated"
                                           type="checkbox"
                                           name="estimated"
                                    />
                                    <span>Estimated Results</span>
                                </label>
                            </div>

                            <div id="filter-done">
                                <button v-if="$data.activeFilter.id"
                                        class="primary"
                                >
                                    Save Filter
                                </button>
                                <button v-else
                                        class="primary"
                                >
                                    Add Filter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div id="filter-list"
                     class="flex-grow"
                >
                    <!-- eslint-disable-next-line vue/require-v-for-key -->
                    <div v-for="filter in $store.state.searchBar.filters"
                         class="filter"
                    >
                        <span v-if="filter && filter.name"
                              v-on:click="loadFilter(filter)"
                        >
                            {{ filter.name }}
                        </span>
                        <span v-else
                              v-on:click="loadFilter(filter)"
                        >
                            {{ filter.type | capitalize }}
                        </span>
                        <i class="fal fa-times"
                           v-on:click="deleteFilter(filter)"
                        ></i>
                    </div>
                </div>
            </div>
        </transition>

        <form id="query-form"
              method="POST"
              class="flex-grow"
              v-on:submit.self.prevent="checkAndSearch"
        >
            <div id="search-box"
                 class="text-box"
            >
                <input id="search-query"
                       v-model="$store.state.searchBar.query"
                       type="search"
                       name="search"
                       placeholder="Search You"
                       v-on:change="updateQuery"
                />
            </div>
        </form>

        <div v-if="!$store.state.hide_filters"
             id="filters"
             v-bind:class="{ hidden: $data.editorOpen }"
        >
            <!-- eslint-disable-next-line vue/require-v-for-key -->
            <div v-for="filter in $store.state.searchBar.filters"
                 class="filter"
            >
                <span v-if="filter && filter.name"
                      v-on:click="openAndLoadFilter(filter)"
                >
                    {{ filter.name }}
                </span>
                <span v-else
                      v-on:click="openAndLoadFilter(filter)"
                >
                    {{ filter.type | capitalize }}
                </span>
                <i class="fal fa-times"
                   v-on:click="deleteFilter(filter)"
                ></i>
            </div>
        </div>

        <div v-if="!$store.state.hide_filters && !$data.editorOpen && $data.overflowCount > 0"
             id="filter-overflow-count"
             v-on:click="toggleFilterEditor"
        >
            +{{ $data.overflowCount }}
        </div>

        <div v-if="!$store.state.hide_favorite_star"
             id="search-favorited"
             data-intro-selector="favorite-star"
             v-bind:class="{filled: $store.state.currentSearch.favorited}"
             v-on:click="showFavoriteModal"
        >
            <i v-bind:class="{ 'fas fa-star': $store.state.currentSearch.favorited === true, 'fal fa-star': $store.state.currentSearch.favorited !== true }"></i>
        </div>

        <div id="search-button"
             data-intro-selector="search-execute"
             v-on:click="performSearch(true)"
        >
            <i class="fal fa-search"></i>
        </div>

        <modals-container />
    </div>
    <div v-else
         id="shared-search"
    >
        <div class="avatar">
            <img v-if="$store.state.person && $store.state.person.avatar_url != null && $store.state.person.avatar_url.length > 0"
                 v-bind:src="$store.state.person.avatar_url"
                 style="max-height: 100px; max-width: 100px;"
            >
            <div v-else-if="$store.state.person && $store.state.person.avatar_url == null || $store.state.person.avatar_url.length === 0"
                 class="default"
                 v-bind:style="{ 'background-color': defaultColor($store.state.person) }"
            >
                {{ defaultLetter($store.state.person) }}
            </div>
        </div>

        <span v-if="$store.state.person.first_name != null || $store.state.middle_name != null || $store.state.last_name != null"
              class="name"
        >
            {{ concatNames($store.state.person) }}
        </span>
    </div>
</template>

<script>
    /* global $ */

	import { createBrowserHistory as History } from 'history';
	import _ from 'lodash';
	import qs from 'qs';

	import connectedOAuthProviderMany from '../apollo/queries/connectedOauthProviderMany.gql';
	import contactSearch from '../apollo/mutations/contact-search.gql';
	import connectionMany from '../apollo/queries/connection-many.gql';
	import contentSearch from '../apollo/mutations/content-search.gql';
	import eventSearch from '../apollo/mutations/event-search.gql';
	import locationManyById from '../apollo/queries/location-many-by-id.gql';
	import personMany from '../apollo/queries/person-many.gql';
	import personSearch from '../apollo/mutations/person-search.gql';
	import providerHydratedMany from '../apollo/queries/provider-hydrated-many.gql';
	import searchFind from '../apollo/mutations/search-find.gql';
	import searchUpsert from '../apollo/mutations/search-upsert.gql';
	import sharedTagContactSearch from '../apollo/mutations/shared-tag-contact-search.gql';
	import sharedTagContentSearch from '../apollo/mutations/shared-tag-content-search.gql';
	import sharedTagEventSearch from '../apollo/mutations/shared-tag-event-search.gql';
	import sharedTagPersonSearch from '../apollo/mutations/shared-tag-person-search.gql';
	import sharedTagSelfPerson from '../apollo/queries/shared-tag-self-person.gql';

	import favoriteModal from './modals/favorite.vue';

	import assembleFilters from '../lib/util/assemble-filters';
	import { defaultColor, defaultLetter } from '../lib/util/default-icon';
	import uuid from '../lib/util/uuid';

	// import lifescopeObjects from 'lifescope-objects';
	import lifescopeObjects from '../lib/util/lifescope-objects';


	let history;

	if (process.browser) {
		history = History();
	}

	const MAX_FILTER_WIDTH_FRACTION = 0.3;

	const gqlMappings = {
		contacts: contactSearch,
		content: contentSearch,
		events: eventSearch,
		people: personSearch,
	};

	const gqlSharedTagMappings = {
		contacts: sharedTagContactSearch,
		content: sharedTagContentSearch,
		events: sharedTagEventSearch,
		people: sharedTagPersonSearch,
	};

	export default {
		data: function() {
			return {
				activeFilter: {
					id: null,
					name: null,
					type: null,
					data: {}
				},
				editorOpen: false,
				overflowCount: 0,
				fromConfig: {
					format: 'MM/DD/YYYY hh:mm A',
					useCurrent: false,
					showClear: true,
					showClose: true,
					maxDate: false
				},
				toConfig: {
					format: 'MM/DD/YYYY hh:mm A',
					useCurrent: false,
					showClear: true,
					showClose: true,
					minDate: false
				}
			}
		},

		computed: {
            combinedProviders: function() {
                return [].concat(this.$store.state.providerHydratedMany, this.$store.state.connectedOAuthProviderMany);
            }
		},

		created: async function() {
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
		},

		mounted: async function() {
			let self = this;

			this.$root.$on('check-and-search', async function() {
				await self.checkAndSearch();
			});

			this.$root.$on('perform-search', async function(init) {
				await self.performSearch(init);
			});

			this.$root.$on('polygon-created', async function(feature) {
				let coordinates = feature.geometry.coordinates[0];

				let filter = {
					id: null,
					name: null,
					type: 'where',
					data: {
						estimated: true,
						coordinates: coordinates,
						where_type: 'inside',
						object_id: feature.id
					}
				};

				await self.openAndLoadFilter(filter);
			});

			this.$root.$on('polygon-deleted', async function(features) {
				_.each(features, async function(feature) {
					let filter = _.find(self.$store.state.searchBar.filters, function(filter) {
						return filter.data.object_id === feature.id
					});

					if (filter) {
						self.deleteFilter({
							id: filter.id
						});
					}
				});
			});

			this.$root.$on('polygon-updated', async function(features) {
				_.each(features, async function(feature) {
					let filter = _.find(self.$store.state.searchBar.filters, function(filter) {
						return filter.data.object_id === feature.id
					});

					if (filter == null) {
						filter = self.$data.activeFilter;
					}

					let coordinates = feature.geometry.coordinates[0];

					filter.data.coordinates = coordinates.slice(0, (coordinates.length - 1));

				});

				self.checkNewSearch();
			});

			this.$root.$on('polygon-selected', async function(feature) {
				let filter = _.find(self.$store.state.searchBar.filters, function(filter) {
					return filter.data.object_id === feature.id
				});

				if (filter) {
					self.openAndLoadFilter(filter);
				}
			});
		},

		methods: {
			showFavoriteModal: function() {
				let temp = _.clone(this.$store.state.currentSearch);

				this.$store.state.tempSearch.id = temp.id;
				this.$store.state.tempSearch.count = temp.count;
				this.$store.state.tempSearch.query = temp.query;
				this.$store.state.tempSearch.filters = temp.filters;
				this.$store.state.tempSearch.favorited = temp.favorited;
				this.$store.state.tempSearch.icon = temp.icon;
				this.$store.state.tempSearch.icon_color = temp.icon_color;
				this.$store.state.tempSearch.name = temp.name;

				this.$modal.show(favoriteModal, {}, {
					height: 'auto',
					scrollable: true
				});
			},

			updateQuery: function() {
				this.$store.state.currentSearch.query = this.$store.state.searchBar.query;

				this.checkNewSearch();
			},

			createBlankFilter: function(type) {
				this.$root.$emit('remove-unattached-polygons');
				this.$root.$emit('deselect-polygons');

				this.$data.activeFilter.id = null;
				this.$data.activeFilter.name = null;
				this.$data.activeFilter.type = type;

				switch (type) {
					case 'who':
						this.$data.activeFilter.data = {
							interaction: '',
							text: '',
							type: 'person_id',
							person_id: ''
						};

						break;

					case 'what':
						this.$data.activeFilter.data = {
							type: ''
						};

						break;

					case 'when':
						this.$data.activeFilter.data = {
							interaction: 'exact',
							from: '',
							to: '',
							'since-exactly': 'since',
							'relative-number': '',
							'units': 'days'
						};

						break;

					case 'connector':
						this.$data.activeFilter.data = {
							type: 'provider',
							provider: ''
						};

						break;
				}
			},

			clearActiveFilter: function() {
				this.$data.activeFilter = {
					id: null,
					name: null,
					type: null,
					data: {}
				}
			},

			loadFilter(filter) {
				this.$data.activeFilter.id = filter.id;
				this.$data.activeFilter.name = filter.name;
				this.$data.activeFilter.type = filter.type;
				this.$data.activeFilter.data = _.clone(filter.data);

				if (filter.type === 'where') {
					this.$root.$emit('select-polygon', filter);
				}
				else {
					this.$root.$emit('deselect-polygons');
				}
			},

			openAndLoadFilter(filter) {
				this.openFilterEditor();
				this.loadFilter(filter);
			},

			toggleFilterEditor: function() {
				this.clearActiveFilter();
				this.$data.editorOpen = !this.$data.editorOpen;

				if (!this.$data.editorOpen) {
					this.$root.$emit('remove-unattached-polygons');
					this.compactOverflowFilters();
				}
			},

			openFilterEditor: function() {
				this.clearActiveFilter();
				this.$data.editorOpen = true;
			},

			closeFilterEditor: function() {
				this.clearActiveFilter();
				this.$data.editorOpen = false;
				this.compactOverflowFilters();
			},

			saveFilter: async function() {
				let filter = this.$data.activeFilter;

				if (filter.id == null) {
					let savedFilter = filter;

					savedFilter.id = uuid();

					this.$store.state.searchBar.filters.push(savedFilter);
				}
				else {
					let existingFilter = _.find(this.$store.state.searchBar.filters, function(item) {
						return filter.id === item.id;
					});

					if (existingFilter) {
						existingFilter.name = filter.name;
						existingFilter.data = filter.data;

						await this.$apollo.mutate({
							mutation: searchUpsert,
							variables: {
								filters: JSON.stringify(this.$store.state.searchBar.filters),
								query: this.$store.state.currentSearch.query
							}
						});
					}
				}

				if (this.$data.activeFilter.type === 'where') {
					this.$root.$emit('deselect-mapbox');
				}

				this.clearActiveFilter();

				await this.checkNewSearch();
			},

			deleteFilter(filter) {
				this.$store.state.searchBar.filters = _.filter(this.$store.state.searchBar.filters, function(item) {
					return filter.id !== item.id;
				});

				if (this.$data.activeFilter.id === filter.id) {
					this.clearActiveFilter();
				}

				this.compactOverflowFilters();

				this.checkNewSearch()
			},

			checkNewSearch: async function() {
				let filters = _.map(this.$store.state.searchBar.filters, function(filter) {
					return _.omit(filter, ['__typename', 'id', '_id', 'data.object_id']);
				});

				let query = this.$store.state.searchBar.query;

				let result = await this.$apollo.mutate({
					mutation: searchFind,
					variables: {
						filters: JSON.stringify(filters),
						query: query
					},
					fetchPolicy: 'no-cache'
				});

				let data = result.data.searchFind;

				if (data && data.id) {
					this.$store.state.currentSearch = data;
					this.$store.state.searchBar.filters = data.filters;
					this.$store.state.searchBar.query = data.query;

					_.each(this.$store.state.searchBar.filters, function(filter) {
						filter.id = uuid();
					});

					if (process.browser) {
						let params = qs.parse(history.location.search, {
							ignoreQueryPrefix: true
						});

						params.view = this.$store.state.view;
						params.facet = this.$store.state.facet;
						params.qid = data.id;

						history.push({
							pathname: history.location.pathname,
							search: qs.stringify(params, {
								addQueryPrefix: true
							})
						});
					}
				}
				else {
					this.$store.state.currentSearch = {
						query: query,
						filters: filters
					};

					if (process.browser) {
						let params = qs.parse(history.location.search, {
							ignoreQueryPrefix: true
						});

						params.view = this.$store.state.view;
						params.facet = this.$store.state.facet;
						delete params.qid;

						history.push({
							pathname: history.location.pathname,
							search: qs.stringify(params, {
								addQueryPrefix: true
							})
						});
					}
				}

				this.$store.state.redrawPolygons = true;
				this.$root.$emit('redraw-polygons');
			},

			updateFrom: function(e) {
				this.$data.toConfig.minDate = e.date;
			},

			updateTo: function(e) {
				this.$data.fromConfig.maxDate = e.date;
			},

			performSearch: async function(init) {
				let params;
				let self = this;

				let sharedSearch = this.$store.state.mode === 'shared';

				this.closeFilterEditor();
				this.$store.state.facetSelectOpen = false;

				if (this.$store.state.searching === true) {
					return;
				}

				if (init) {
					this.$store.state.objects.events = [];
					this.$store.state.objects.contacts = [];
					this.$store.state.objects.content = [];
					this.$store.state.objects.people = [];
					this.$store.state.searchEnded = false;
					this.$store.state.offset = 0;
				}

				if (this.$store.state.searchEnded === true) {
					return;
				}

				this.$store.state.spinner = true;
				this.$store.state.searching = true;
				this.$store.state.searchEnded = false;
				this.$store.state.searchError = false;
				this.$store.state.pageSize = 100;

				if (sharedSearch !== true) {
					let filters = _.map(this.$store.state.currentSearch.filters, function(filter) {
						return _.omit(filter, ['__typename', 'id', '_id', 'data.object_id']);
					});

					let upserted = await this.$apollo.mutate({
						mutation: searchUpsert,
						variables: {
							filters: JSON.stringify(filters),
							query: this.$store.state.currentSearch.query
						}
					});

					this.$store.state.currentSearch = upserted.data.searchUpsert;
				}

				if (process.browser) {
					params = qs.parse(history.location.search, {
						ignoreQueryPrefix: true
					});

					params.view = this.$store.state.view;
					params.facet = this.$store.state.facet;

					if (sharedSearch !== true) {
						params.qid = this.$store.state.currentSearch.id;
					}

					history.push({
						pathname: history.location.pathname,
						search: qs.stringify(params, {
							addQueryPrefix: true
						})
					});

					if (sharedSearch !== true) {
						if (process.browser && this.$route.path !== '/explore') {
							history.replace({
								pathname: 'explore',
								search: history.location.search
							});

							this.$router.push('/explore' + history.location.search);

							return;
						}
					}
				}

				let variables = {
					offset: this.$store.state.offset,
					limit: this.$store.state.pageSize,
					sortField: this.$store.state.sortField,
					sortOrder: this.$store.state.sortOrder
				};

				if (sharedSearch === true) {
					variables.id = params.id;
					variables.passcode = params.passcode;
				}
				else {
					variables.filters = JSON.stringify(assembleFilters(this));

					if (this.$store.state.currentSearch.query != null) {
						variables.q = this.$store.state.currentSearch.query.replace(/#[A-Za-z0-9-]+/g, '');
					}
				}

				let facet = this.$store.state.facet;
				let mapping = Object.keys(gqlMappings).indexOf(facet) > -1 ? gqlMappings[facet] : eventSearch;
				let sharedMapping = Object.keys(gqlSharedTagMappings)
					.indexOf(facet) > -1 ? gqlSharedTagMappings[facet] : sharedTagEventSearch;

				let result;

				let error = false;

				if (sharedSearch === true) {
					try {
						result = await this.$apollo.mutate({
							mutation: sharedMapping,
							variables: variables,
							fetchPolicy: 'no-cache'
						});

						//Trying to populate Locations as part of the Event search is very slow for reasons I haven't been able to determine.
						//It's a lot faster to do a separate request for the Locations and attach them as appropriate.
						if (facet === 'events') {
							let ids = [];

							let data = sharedSearch === true ? result.data.sharedTagEventSearch : result.data.eventSearch;

							_.each(data, function(event) {
								if (event.location_id_string != null) {
									ids.push(event.location_id_string)
								}
							});

							let locations = await this.$apollo.query({
								query: locationManyById,
								variables: {
									ids: ids
								},
								fetchPolicy: 'no-cache'
							});

							_.each(locations.data.locationFindManyById, function(location) {
								let eventMatch = _.find(data, function(event) {
									return event.location_id_string === location.id;
								});

								if (eventMatch != null) {
									eventMatch.hydratedLocation = location;
								}
							});
						}
					}
					catch (err) {
						error = true;
					}
				}
				else {
					try {
						result = await this.$apollo.mutate({
							mutation: mapping,
							variables: variables,
							fetchPolicy: 'no-cache'
						});

						//Trying to populate Locations as part of the Event search is very slow for reasons I haven't been able to determine.
						//It's a lot faster to do a separate request for the Locations and attach them as appropriate.
						if (facet === 'events') {
							let ids = [];

							let data = sharedSearch === true ? result.data.sharedTagEventSearch : result.data.eventSearch;

							_.each(data, function(event) {
								if (event.location_id_string != null) {
									ids.push(event.location_id_string)
								}
							});

							let locations = await this.$apollo.query({
								query: locationManyById,
								variables: {
									ids: ids
								},
								fetchPolicy: 'no-cache'
							});

							_.each(locations.data.locationFindManyById, function(location) {
								let eventMatch = _.find(data, function(event) {
									return event.location_id_string === location.id;
								});

								if (eventMatch != null) {
									eventMatch.hydratedLocation = location;
								}
							});
						}
					}
					catch (err) {
						error = true;
					}
				}

				if (error) {
					this.$store.state.searchEnded = true;
					this.$store.state.searchError = true;
					this.$store.state.searching = false;
					this.$store.state.spinner = false;
				}
				else {
					let data;

					if (facet === 'events') {
						data = sharedSearch === true ? result.data.sharedTagEventSearch : result.data.eventSearch;

						_.each(data, function(event) {
							event.hydratedConnection = _.find(self.$store.state.connectionMany, function(connection) {
								return connection.id === event.connection_id_string;
							});

							let obj = new lifescopeObjects.Event(event);

							self.$store.state.objects.events.push(obj);

							_.each(obj.content, function(content) {
								let match = _.find(self.$store.state.objects.content, function(item) {
									return content.id === item.id;
								});

								if (!match) {
									self.$store.state.objects.content.push(content);
								}
								else {
									let index = _.findIndex(obj.content, function(item) {
										return item.id === content.id;
									});

									obj.content[index] = match;
								}
							});

							_.each(obj.contacts, function(contact) {
								let match = _.find(self.$store.state.objects.contacts, function(item) {
									return contact.id === item.id;
								});

								if (contact.person) {
									let personMatch = _.find(self.$store.state.objects.people, function(item) {
										return contact.person.id === item.id;
									});

									if (!personMatch) {
										self.$store.state.objects.people.push(contact.person);
									}
									else {
										contact.person = personMatch;
									}
								}

								if (!match) {
									self.$store.state.objects.contacts.push(contact);
								}
								else {
									let index = _.findIndex(obj.contacts, function(item) {
										return item.id === contact.id;
									});

									obj.contacts[index] = match;
								}
							});
						});
					}
					else if (facet === 'content') {
						data = sharedSearch === true ? result.data.sharedTagContentSearch : result.data.contentSearch;

						_.each(data, function(content) {
							content.hydratedConnection = _.find(self.$store.state.connectionMany, function(connection) {
								return connection.id === content.connection_id_string;
							});

							let obj = new lifescopeObjects.Content(content);

							self.$store.state.objects.content.push(obj);
						});
					}
					else if (facet === 'contacts') {
						data = sharedSearch === true ? result.data.sharedTagContactSearch : result.data.contactSearch;

						_.each(data, function(contact) {
							contact.hydratedConnection = _.find(self.$store.state.connectionMany, function(connection) {
								return connection.id === contact.connection_id_string;
							});

							let obj = new lifescopeObjects.Contact(contact);

							self.$store.state.objects.contacts.push(obj);

							if (obj.person) {
								self.$store.state.objects.people.push(obj.person);
							}
						});
					}
					else if (facet === 'people') {
						data = sharedSearch === true ? result.data.sharedTagPersonSearch : result.data.personSearch;

						_.each(data, function(person) {
							let obj = new lifescopeObjects.Person(person);

							self.$store.state.objects.people.push(obj);
						});
					}

					this.$store.state.offset += this.$store.state.pageSize;
					this.$store.state.searchEnded = data.length < this.$store.state.pageSize;
					this.$store.state.searching = false;
					this.$store.state.spinner = false;

					this.$root.$emit('search-finished');
				}
			},

			compactOverflowFilters: function() {
				this.$nextTick(function() {
					$('#filters').addClass('calculating');
					let hideIndex, maxWidth, width, $filters, $filterContainer;

					if (this.$data.editorOpen) {
						return;
					}

					maxWidth = MAX_FILTER_WIDTH_FRACTION * $('#search-bar').width();
					width = 0;

					$filterContainer = $('#search-bar > #filters');
					$filters = $('#search-bar > #filters > .filter');

					$filters.removeClass('hidden');

					$filters.each(function(i, d) {
						let elemWidth = $(d).removeClass('hidden').width();

						if (elemWidth + width > maxWidth) {
							hideIndex = i;

							return false;
						}

						width += elemWidth;
					});

					if (typeof hideIndex !== 'undefined') {
						this.$data.overflowCount = $filters.length - hideIndex;

						$filters.slice(hideIndex).addClass('hidden');
					}
					else {
						this.$data.overflowCount = 0;
					}

					$filterContainer.removeClass('calculating');
				})
			},

			checkAndSearch: async function() {
				$('#filters').addClass('calculating');

				await Promise.all([
					this.$store.state.connectionsLoaded,
					this.$store.state.oauthProvidersLoaded,
					this.$store.state.providersLoaded,
					this.$store.state.peopleLoaded,
				]);

				await this.checkNewSearch();

				await this.performSearch(true);
			},

			defaultColor: function(person) {
				return defaultColor(person);
			},

			defaultLetter: function(person) {
				return defaultLetter(person);
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
		},
	}
</script>

