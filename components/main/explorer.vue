<template>
  <main v-on:scroll="handleScroll">
    <section v-if="$store.state.user != undefined" id="content">
      <div v-if="view === 'feed'" class="feed container">
        <div class="scroller">
          <div id="list" v-bind:class="$store.state.view" >
            <user-event v-for="event in $store.state.eventSearch"v-bind:key="event.id" v-bind:event="event" v-bind:view="$data.view" v-on:render-grid-details="renderGridDetailsModal"></user-event>
          </div>

          <modals-container/>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
  import _ from 'lodash';
  import moment from 'moment';

  import eventCount from '../../apollo/queries/event-count.gql';
  import eventMany from '../../apollo/queries/event-many.gql';
  import eventSearch from '../../apollo/mutations/event-search.gql';
  import searchFind from '../../apollo/mutations/search-find.gql';
  import searchOne from '../../apollo/queries/search-one.gql';
  import searchUpsert from '../../apollo/mutations/search-upsert.gql';

  import GridDetails from '../modals/grid-details.vue';
  import UserEvent from '../objects/event.vue';

  import assembleFilters from '../../lib/util/assemble-filters';

  export default {
    data: function() {
      return {
        view: 'feed',
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
            this.$store.state.currentSearch = result;
          }
        }
        else {
          this.$store.state.currentSearch = await this.$apollo.query({
            query: searchOne,
            variables: {
              id: this.$store.state.currentSearch.id
            }
          });
        }
      },

      handleScroll: _.debounce(async function(e) {
        let target = e.target;

        let scrollBottom = target.scrollTop + target.clientHeight;

        if (scrollBottom > 0.9 * target.scrollHeight) {
          await this.searchData(false);
        }
      }, 500),

      searchData: async function(init) {
        if (init === true) {
          this.$store.state.offset = 0;
        }

        if (this.$store.state.searchEnded !== true) {
          let variables = {
            offset: this.$store.state.offset,
            limit: this.$store.state.pageSize,
            filters: JSON.stringify(assembleFilters(this))
          };

          if (this.$store.state.currentSearch.query != null) {
            variables.q = this.$store.state.currentSearch.query.replace(/#[A-Za-z0-9-]+/g, '');
          }

          let eventResult = await this.$apollo.mutate({
            mutation: eventSearch,
            variables: variables
          });

          this.$store.state.offset += this.$store.state.pageSize;
          this.$store.state.eventSearch = init ? eventResult.data.eventSearch : this.$store.state.eventSearch.concat(eventResult.data.eventSearch);
          this.$store.state.searchEnded = eventResult.data.eventSearch.length < this.$store.state.pageSize;
        }
      },

      renderGridDetailsModal: function(event) {
        if (this.$store.state.view === 'grid') {
          this.$modal.show(GridDetails, {
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
      let params = this.parseParams(window.location.search.slice(1));

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

      let upserted = await this.$apollo.mutate({
        mutation: searchUpsert,
        variables: {
          filters: JSON.stringify(this.$store.state.currentSearch.filters),
          query: this.$store.state.currentSearch.query,
        }
      });

      this.$store.state.currentSearch = upserted.data.searchUpsert;

      this.searchData(true);
    }
  }
</script>
