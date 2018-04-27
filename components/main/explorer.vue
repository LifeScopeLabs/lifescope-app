<template>
  <main>
    <section v-if="$store.state.user != undefined" id="content">
      <div v-if="view === 'feed'" class="feed container">
        <div class="scroller">
          <div id="events">
            <user-event v-for="event in eventSearch" v-bind:key="event.id" v-bind:event="event"></user-event>
          </div>
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
  import UserEvent from '../objects/event.vue';

  export default {
    data: function() {
      return {
        view: 'feed',
        skipEventQuery: true,
        currentSearch: {
          id: null,
          count: null,
          query: null,
          filters: [],
          favorited: null,
          icon: null,
          icon_color: null,
          name: null
        },
        eventCount: null,
        eventMany: null,
        eventSearch: null,
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
        if (this.$data.currentSearch.id == null) {
          let result = await this.$apollo.mutate({
            mutation: searchFind,
            variables: {
              filters: JSON.stringify(this.$data.currentSearch.filters),
              query: this.$data.currentSearch.query
            }
          });

          if (result && result.id) {
            this.$data.currentSearch = result;
          }
        }
        else {
          this.$data.currentSearch = await this.$apollo.query({
            query: searchOne,
            variables: {
              id: this.$data.currentSearch.id
            }
          });
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
        this.$data.view = params.view;
      }

      if (params.qid) {
        this.$data.currentSearch.id = params.qid;
      }

      await this.loadSearch();

      let upserted = await this.$apollo.mutate({
        mutation: searchUpsert,
        variables: {
          filters: JSON.stringify(this.$data.currentSearch.filters),
          query: this.$data.currentSearch.query,
        }
      });

      this.$data.currentSearch = upserted.data.searchUpsert;

      let eventResult = await this.$apollo.mutate({
        mutation: eventSearch,
        variables: {
          q: this.$data.currentSearch.query,
          offset: 0,
          limit: 10,
          filters: JSON.stringify(this.$data.currentSearch.filters)
        }
      });

      console.log(eventResult);
    }
  }
</script>
