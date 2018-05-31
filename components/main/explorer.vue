<template>
  <main v-on:scroll="handleScroll">
    <section v-if="$store.state.user != undefined" id="content">
      <div v-if="$store.state.objects.events.length > 0" class="container">
        <div class="scroller">
          <div id="list" v-bind:class="$store.state.view" >
            <user-event v-for="event in $store.state.objects.events"v-bind:key="event.id" v-bind:event="event" v-on:render-details="renderDetailsModal"></user-event>
          </div>

          <modals-container/>
        </div>
      </div>

      <div v-if="$store.state.objects.events.length === 0 && $store.state.searching === true" id="waiting">
        <div>
          <img src="https://d233zlhvpze22y.cloudfront.net/1457056861/images/loading-icon-ring.svg" />
          <div class="text blue">Searching</div>
        </div>
      </div>

      <div v-if="$store.state.objects.events.length === 0 && $store.state.searching === false" id="no-results">
        <div class="prompt">
          <div class="prompt-text">
            <h2>No results found.</h2>
            <div>Try adjusting your search </div>
            <div>or adding more <a href="/providers">Connections</a>.</div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
  import History from 'history/createBrowserHistory';
  import _ from 'lodash';
  import lifescopeObjects from '../../lib/util/lifescope-objects';
  import moment from 'moment';
  import qs from 'qs';

  import eventCount from '../../apollo/queries/event-count.gql';
  import eventMany from '../../apollo/queries/event-many.gql';
  import eventSearch from '../../apollo/mutations/event-search.gql';
  import searchFind from '../../apollo/mutations/search-find.gql';
  import searchOne from '../../apollo/queries/search-one.gql';
  import searchUpsert from '../../apollo/mutations/search-upsert.gql';

  import Details from '../modals/details.vue';
  import UserEvent from '../objects/event.vue';

  import assembleFilters from '../../lib/util/assemble-filters';

  let history;

  if (process.browser) {
    history = History();
  }

  export default {
    data: function() {
      return {
        skipEventQuery: true,
        eventCount: null,
        eventMany: null,
        qid: null
      };
    },
    components: {
      UserEvent
    },
    methods: {
      searchIcon: function(search) {
        return search.favorited && search.icon ? search.icon : 'fa fa-circle-o';
      },

      searchColor: function(search) {
        return search.favorited && search.icon && search.icon_color ? search.icon_color : '#b6bbbf';
      },

      favoriteIcon: function(search) {
        return search.favorited ? 'favorite-edit fa fa-star subdue' : 'favorite-create fa fa-star-o subdue'
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
            }
          });

          this.$store.state.currentSearch = this.$store.state.searchBar = _.clone(result.data.searchOne);
        }
      },

      handleScroll: _.debounce(async function(e) {
        let target = e.target;

        let scrollBottom = target.scrollTop + target.clientHeight;

        if (scrollBottom > 0.9 * target.scrollHeight && this.$store.state.searching !== true) {
          this.$root.$emit('perform-search', false);
        }
      }, 500),

      renderDetailsModal: function(event) {
        if (this.$store.state.view === 'grid' || this.$store.state.view === 'list') {
          this.$modal.show(Details, {
            event: event
          }, {
            height: 'auto',
            scrollable: true,
            width: 1080,
            maxWidth: 1080
          })
        }
      }
    },

    apollo: {
      eventCount: {
        prefetch: true,
        query: eventCount,
        skip: function() {
          return this.skipEventQuery;
        }
      },
      eventMany: {
        prefetch: true,
        query: eventMany,
        skip: function() {
          return this.skipEventQuery;
        }
      }
    },

    mounted: async function() {
      this.$store.state.hide_advanced = this.$store.state.hide_filters = this.$store.state.hide_favorite_star = false;

      let params = qs.parse(window.location.search, {
        ignoreQueryPrefix: true
      });

      if (params.view) {
        this.$store.state.view = params.view;
      }
      else {
        this.$store.state.view = 'feed';
      }

      this.$store.state.offset = 0;
      this.$store.state.searchEnded = false;
      this.$store.state.pageSize = 100;

      if (params.qid) {
        this.$store.state.currentSearch.id = params.qid;
      }

      await this.loadSearch();

      this.$root.$emit('check-and-search');
    }
  }
</script>
