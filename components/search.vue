<template slot="search">
  <div id="search-bar" class="input-group">
    <div v-if="!$store.state.hide_advanced" id="advanced" v-on:click="toggleFilterEditor">
      <i v-bind:class="$data.editorOpen ? 'fa-caret-up' : 'fa-caret-down'" class="fa"></i>
    </div>

    <div v-if="!$store.state.hide_advanced && $data.editorOpen" id="filter-controls">
      <div id="filter-editor">
        <div id="filter-buttons">
          <div class="control" data-type="who" v-on:click="createBlankFilter('who')">
            <i class="fa fa-user"></i>
          </div>

          <div class="control" data-type="what" v-on:click="createBlankFilter('what')">
            <i class="fa fa-picture-o"></i>
          </div>

          <div class="control" data-type="when" v-on:click="createBlankFilter('when')">
            <i class="fa fa-calendar"></i>
          </div>

          <div class="control" data-type="connector" v-on:click="createBlankFilter('connector')">
            <i class="fa fa-plug"></i>
          </div>

          <!--<div class="control" data-type="where" v-on:click="createBlankFilter('where')">-->
            <!--<i class="fa fa-globe"></i>-->
          <!--</div>-->
        </div>

        <div id="filter-values" v-bind:class="$data.activeFilter.type">
          <div id="filter-name" v-if="$data.activeFilter.type != null">
            <div class="text-box">
              <input type="text" name="name" v-model="activeFilter.name" placeholder="Name this filter"/>
            </div>
          </div>

          <form v-if="$data.activeFilter && $data.activeFilter.type === 'who'" class="who" v-on:submit.self.prevent="saveFilter">
            <div class="input-container">
              <label v-bind:class="{active: ['to', 'from', 'with'].includes($data.activeFilter.data.interaction) === false}" class="radio" for="who-type-1">
                <input id="who-type-1" type="radio" name="interaction" value="" v-model="activeFilter.data.interaction"/>
                <span>Any</span>
              </label>

              <label v-bind:class="{active: $data.activeFilter.data.interaction === 'to' }" class="radio" for="who-type-2">
                <input id="who-type-2" type="radio" name="interaction" value="to" v-model="activeFilter.data.interaction"/>
                <span>To</span>
              </label>

              <label v-bind:class="{active: $data.activeFilter.data.interaction === 'from' }" class="radio" for="who-type-3">
                <input id="who-type-3" type="radio" name="interaction" value="from" v-model="activeFilter.data.interaction"/>
                <span>From</span>
              </label>

              <label v-bind:class="{active: $data.activeFilter.data.interaction === 'with' }" class="radio" for="who-type-4">
                <input id="who-type-4" type="radio" name="interaction" value="with" v-model="activeFilter.data.interaction"/>
                <span>With</span>
              </label>
            </div>

            <div class="text-box">
              <input type="text" name="contact" placeholder="Contact Name" v-model="activeFilter.data.contact"/>
            </div>

            <div id="filter-done">
              <button v-if="$data.activeFilter.id" class="primary">Save Filter</button>
              <button v-else class="primary">Add Filter</button>
            </div>
          </form>

          <form v-if="$data.activeFilter && $data.activeFilter.type === 'what'" class="what" v-on:submit.self.prevent="saveFilter">
            <div class="input-container">
              <select v-model="activeFilter.data.type" name="type">
                <option value="" selected disabled></option>
                <option value="achievement">Achievement</option>
                <option value="audio">Audio</option>
                <option value="code">Code</option>
                <option value="file">File</option>
                <option value="game">Game</option>
                <option value="image">Image</option>
                <option value="receipt">Receipt</option>
                <option value="software">Software</option>
                <option value="text">Text</option>
                <option value="video">Video</option>
                <option value="web-page">Web Page</option>
              </select>
            </div>

            <div id="filter-done">
              <button v-if="$data.activeFilter.id" class="primary">Save Filter</button>
              <button v-else class="primary">Add Filter</button>
            </div>
          </form>

          <form v-if="$data.activeFilter && $data.activeFilter.type === 'when'" class="when" v-on:submit.self.prevent="saveFilter">
            <div class="input-container">
              <label v-bind:class="{active: $data.activeFilter.data.interaction === 'exact'}" class="radio" for="when-exact">
                <input id="when-exact" type="radio" name="interaction" value="exact" v-model="activeFilter.data.interaction" />
                Exact dates
              </label>

              <label v-bind:class="{active: $data.activeFilter.data.interaction === 'relative'}" class="radio" for="when-relative">
                <input id="when-relative" type="radio" name="interaction" value="relative" v-model="activeFilter.data.interaction" />
                Relative dates
              </label>
            </div>

            <div v-if="$data.activeFilter.data.interaction === 'exact'" class="exact-controls">
              <div>
                From:
              </div>


              <div class="input-group text-box" id="from">
                <date-picker v-model="activeFilter.data.from" v-bind:config="fromConfig" @dp-change="updateFrom"></date-picker>
              </div>

              <div>
                To:
              </div>

              <div class="input-group text-box" id="to">
                <date-picker v-model="activeFilter.data.to" v-bind:config="toConfig" @dp-change="updateTo"></date-picker>
              </div>
            </div>

            <div v-if="$data.activeFilter.data.interaction === 'relative'" class="relative-controls">
              <div class="input-container">
                <select v-model="activeFilter.data['since-exactly']" name="since-exactly">
                  <option value="since" selected>Since</option>
                  <option value="exactly">Exactly</option>
                </select>
              </div>

              <div class="text-box">
                <input v-model="activeFilter.data['relative-number']" type="number" name="relative-number" min="1">
              </div>

              <div class="input-container">
                <select v-model="activeFilter.data.units" name="units">
                  <option value="days" selected>Day(s) ago</option>
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
              <button v-if="$data.activeFilter.id" class="primary">Save Filter</button>
              <button v-else class="primary">Add Filter</button>
            </div>
          </form>

          <form v-if="$data.activeFilter && $data.activeFilter.type === 'connector'" class="connector" v-on:submit.self.prevent="saveFilter">
            <div class="input-container">
              <label v-bind:class="{ active: $data.activeFilter.data.type === 'provider' }" class="radio" for="provider" v-on:click="$data.activeFilter.data.connection = null">
                <input id="provider" type="radio" name="type" value="provider" v-model="activeFilter.data.type"/>
                Provider
              </label>
              <label v-bind:class="{ active: $data.activeFilter.data.type === 'connection' }" class="radio" for="connection" v-on:click="$data.activeFilter.data.provider = null">
                <input id="connection" type="radio" name="type" value="connection" v-model="activeFilter.data.type"/>
                Connection
              </label>
            </div>

            <div v-if="$data.activeFilter.data.type === 'provider'" class="provider">
              <div class="input-container">
                <select v-model="activeFilter.data.provider" name="provider">
                  <option value=""></option>
                  <option v-for="provider in orderBy($store.state.providerHydratedMany, 'name')" v-bind:value="provider.name | lowercase">{{ provider.name }}</option>
                </select>
              </div>
            </div>

            <div v-if="$data.activeFilter.data.type === 'connection'" class="connection">
              <div class="input-container">
                <select v-model="activeFilter.data.connection" name="connection">
                  <option value=""></option>
                  <option v-for="connection in $store.state.connectionMany" v-bind:value="connection.id">{{ connection.name }}</option>
                </select>
              </div>
            </div>

            <div id="filter-done">
              <button v-if="$data.activeFilter.id" class="primary">Save Filter</button>
              <button v-else class="primary">Add Filter</button>
            </div>
          </form>

          <!--<form v-if="$data.activeFilter && activeFilter.type === 'where'" class="where" v-on:submit.self.prevent="saveFilter">-->
            <!--<div>-->
              <!--Distance:-->
            <!--</div>-->

            <!--<div class="text-box">-->
              <!--<input type="text" name="distance"/>-->
            <!--</div>-->

            <!--<div>-->
              <!--Area:-->
            <!--</div>-->

            <!--<div class="input-container">-->
              <!--<label for="where-type-1"><input id="where-type-1" type="radio" name="geometry" value="inside" checked/>Inside</label>-->
              <!--<label for="where-type-2"><input id="where-type-2" type="radio" name="geometry" value="outside"/>Outside</label>-->
            <!--</div>-->

            <!--<div class="estimated">-->
              <!--<label>-->
                <!--<input type="checkbox" name="estimated"/>-->
                <!--<span>Return Estimated Results</span>-->
              <!--</label>-->
            <!--</div>-->

            <!--<div id="filter-done">-->
              <!--<button v-if="$data.activeFilter.id" class="primary">Save Filter</button>-->
              <!--<button v-else class="primary">Add Filter</button>-->
            <!--</div>-->
          <!--</form>-->
        </div>
      </div>

      <div id="filter-list" class="flex-grow">
        <div class="filter" v-for="filter in $store.state.searchBar.filters">
          <span v-if="filter && filter.name" v-on:click="loadFilter(filter)">{{ filter.name }}</span>
          <span v-else v-on:click="loadFilter(filter)">{{ filter.type | capitalize }}</span>
          <i class="fa fa-close" v-on:click="deleteFilter(filter)"></i>
        </div>
      </div>
    </div>

    <form id="query-form" method="POST" class="flex-grow" v-on:submit.self.prevent="checkAndSearch">
      <div id="search-box" class="text-box">
        <input id="search-query" type="search" name="search" v-model="$store.state.searchBar.query" placeholder="Enter query here" v-on:change="updateQuery"/>
      </div>
    </form>


    <div v-if="!$store.state.hide_filters" id="filters" v-bind:class="{ hidden: $data.editorOpen }">
      <div class="filter" v-for="filter in $store.state.searchBar.filters">
        <span v-if="filter && filter.name" v-on:click="openAndLoadFilter(filter)">{{ filter.name }}</span>
        <span v-else v-on:click="openAndLoadFilter(filter)">{{ filter.type | capitalize }}</span>
        <i class="fa fa-close" v-on:click="deleteFilter(filter)"></i>
      </div>
    </div>

    <div v-if="!$store.state.hide_filters && !$data.editorOpen && $data.overflowCount > 0" id="filter-overflow-count">+{{ $data.overflowCount }}</div>

    <div v-if="!$store.state.hide_favorite_star" id="search-favorited" v-bind:class="{filled: $store.state.currentSearch.favorited}" v-on:click="showFavoriteModal">
      <i class="fa"></i>
    </div>

    <div id="search-button" v-on:click="performSearch(true)">
      <i class="fa fa-search"></i>
    </div>

    <modals-container/>
  </div>
</template>

<script>
  import History from 'history/createBrowserHistory';
  import _ from 'lodash';
  import qs from 'qs';

  import contactSearch from '../apollo/mutations/contact-search.gql';
  import connectionMany from '../apollo/queries/connection-many.gql';
  import contentSearch from '../apollo/mutations/content-search.gql';
  import eventSearch from '../apollo/mutations/event-search.gql';
  import providerHydratedMany from '../apollo/queries/provider-hydrated-many.gql';
  import searchFind from '../apollo/mutations/search-find.gql';
  import searchUpsert from '../apollo/mutations/search-upsert.gql';

  import favoriteModal from './modals/favorite';

  import assembleFilters from '../lib/util/assemble-filters';
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
  };

  export default {
    data: function () {
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

    methods: {
      showFavoriteModal: function() {
        this.$store.state.tempSearch = _.clone(this.$store.state.currentSearch);

        this.$modal.show(favoriteModal, {}, {
          height: 'auto',
          scrollable: true
        });
      },

      updateQuery: function() {
        this.$store.state.currentSearch.query = this.$store.state.searchBar.query;

        this.checkNewSearch();
      },

      createBlankFilter: function (type) {
        this.$data.activeFilter.id = null;
        this.$data.activeFilter.name = null;
        this.$data.activeFilter.type = type;

        switch (type) {
          case 'who':
            this.$data.activeFilter.data = {
              interaction: '',
              contact: ''
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

      clearActiveFilter: function () {
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
      },

      openAndLoadFilter(filter) {
        this.toggleFilterEditor();
        this.loadFilter(filter);
      },

      toggleFilterEditor: function() {
        this.clearActiveFilter();
        this.$data.editorOpen = !this.$data.editorOpen;

        if (!this.$data.editorOpen) {
          this.compactOverflowFilters();
        }
      },

      closeFilterEditor: function() {
        this.clearActiveFilter();
        this.$data.editorOpen = false;
        this.compactOverflowFilters();
      },

      saveFilter: async function () {
        let filter = this.$data.activeFilter;

        if (filter.id == null) {
          let savedFilter = filter;

          savedFilter.id = uuid();

          this.$store.state.searchBar.filters.push(savedFilter);
        }
        else {
          let existingFilter = _.find(this.$store.state.searchBar.filters, function (item) {
            return filter.id === item.id;
          });

          if (existingFilter) {
            existingFilter.name = filter.name;
            existingFilter.data = filter.data;
          }
        }

        this.clearActiveFilter();

        await this.checkNewSearch();
      },

      deleteFilter(filter) {
        this.$store.state.searchBar.filters = _.filter(this.$store.state.searchBar.filters, function(item) {
          return filter.id !== item.id;
        });

        this.compactOverflowFilters();

        this.checkNewSearch()
      },

      checkNewSearch: async function (){
        let filters = _.map(this.$store.state.searchBar.filters, function(filter) {
          return _.omit(filter, ['__typename', 'id', '_id']);
        });

        let query = this.$store.state.searchBar.query;

        let result = await this.$apollo.mutate({
          mutation: searchFind,
          variables: {
            filters: JSON.stringify(filters),
            query: query
          }
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
      },

      updateFrom: function(e) {
        this.$data.toConfig.minDate = e.date;
      },

      updateTo: function(e) {
        this.$data.fromConfig.maxDate = e.date;
      },

      performSearch: async function(init) {
        let self = this;
        this.closeFilterEditor();
        this.$store.state.facetSelectOpen = false;

        if (this.$store.state.searching === true || this.$store.state.searchEnded === true) {
          return;
        }

        if (init) {
          this.$store.state.objects.events = [];
          this.$store.state.objects.contacts = [];
          this.$store.state.objects.content = [];
          this.$store.state.offset = 0;
        }

        this.$store.state.spinner = true;
        this.$store.state.searching = true;
        this.$store.state.searchEnded = false;
        this.$store.state.pageSize = 100;

        let filters = _.map(this.$store.state.currentSearch.filters, function(filter) {
          return _.omit(filter, ['__typename', 'id']);
        });

        let upserted = await this.$apollo.mutate({
          mutation: searchUpsert,
          variables: {
            filters: JSON.stringify(filters),
            query: this.$store.state.currentSearch.query
          }
        });

        this.$store.state.currentSearch = upserted.data.searchUpsert;

        if (process.browser) {
          let params = qs.parse(history.location.search, {
            ignoreQueryPrefix: true
          });

          params.view = this.$store.state.view;
          params.facet = this.$store.state.facet;
          params.qid = this.$store.state.currentSearch.id;

          history.push({
            pathname: history.location.pathname,
            search: qs.stringify(params, {
              addQueryPrefix: true
            })
          });

          if (process.browser && history.location.pathname !== '/explore') {
            history.replace({
              pathname: 'explore',
              search: history.location.search
            });

            window.location.reload();
          }
        }

        let variables = {
          offset: this.$store.state.offset,
          limit: this.$store.state.pageSize,
          filters: JSON.stringify(assembleFilters(this)),
          sortField: this.$store.state.sortField,
          sortOrder: this.$store.state.sortOrder
        };

        if (this.$store.state.currentSearch.query != null) {
          variables.q = this.$store.state.currentSearch.query.replace(/#[A-Za-z0-9-]+/g, '');
        }

        let facet = this.$store.state.facet;
        let mapping = Object.keys(gqlMappings).indexOf(facet) > -1 ? gqlMappings[facet] : eventSearch;

        let result = await this.$apollo.mutate({
          mutation: mapping,
          variables: variables
        });

        if (facet === 'events') {
          _.each(result.data.eventSearch, function(event) {
            event.hydratedConnection = _.find(self.$store.state.connectionMany, function (connection) {
              return connection.id === event.connection_id_string;
            });

            let obj = new lifescopeObjects.Event(event);

            self.$store.state.objects.events.push(obj);

            _.each(obj.content, function (content) {
              let match = _.find(self.$store.state.objects.content, function (item) {
                return content.id === item.id;
              });

              if (!match) {
                self.$store.state.objects.content.push(content);
              }
            });

            _.each(obj.contacts, function (contact) {
              let match = _.find(self.$store.state.objects.contacts, function (item) {
                return contact.id === item.id;
              });

              if (!match) {
                self.$store.state.objects.contacts.push(contact);
              }
            });
          });
        }
        else if (facet === 'content') {
          _.each(result.data.contentSearch, function(content) {
            content.hydratedConnection = _.find(self.$store.state.connectionMany, function (connection) {
              return connection.id === content.connection_id_string;
            });

            let obj = new lifescopeObjects.Content(content);

            self.$store.state.objects.content.push(obj);
          });
        }
        else if (facet === 'contacts') {
          _.each(result.data.contactSearch, function(contact) {
            contact.hydratedConnection = _.find(self.$store.state.connectionMany, function (connection) {
              return connection.id === contact.connection_id_string;
            });

            let obj = new lifescopeObjects.Contact(contact);

            self.$store.state.objects.contacts.push(obj);
          });
        }

        this.$store.state.offset += this.$store.state.pageSize;
        this.$store.state.searchEnded = this.$store.state.objects[facet].length < this.$store.state.pageSize;
        this.$store.state.searching = false;
        this.$store.state.spinner = false;

        console.log(this.$store.state.objects[facet].length);
        console.log(this.$store.state.pageSize);
        console.log(this.$store.state.searchEnded);
      },

      compactOverflowFilters: function() {
        this.$nextTick(function () {
          let hideIndex, maxWidth, width, $filters;

          if (this.$data.editorOpen) {
            return;
          }

          maxWidth = MAX_FILTER_WIDTH_FRACTION * $('#search-bar').width();
          width = 0;
          $filters = $('#search-bar > #filters > .filter');

          $filters.removeClass('hidden');

          $filters.each(function (i, d) {
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
        })
      },

      checkAndSearch: async function() {
        await Promise.all([
          this.$store.state.connectionsLoaded,
          this.$store.state.providersLoaded
        ]);

        await this.checkNewSearch();

        await this.performSearch(true);
      }
    },

    created: async function() {
      let self = this;

      this.$store.state.connectionsLoaded = this.$apollo.query({
        query: connectionMany
      })
        .then(function(result) {
          self.$store.state.connectionMany = result.data.connectionMany;

          return Promise.resolve();
        });

      this.$store.state.providersLoaded = this.$apollo.query({
        query: providerHydratedMany
      })
        .then(function(result) {
          self.$store.state.providerHydratedMany = result.data.providerHydratedMany;

          return Promise.resolve();
        });
    },

    mounted: async function() {
      let self = this;

      this.$root.$on('check-and-search', async function() {
        await self.checkAndSearch();
      });

      this.$root.$on('perform-search', async function(init) {
        await self.performSearch(init);
      })
    }
  }
</script>

