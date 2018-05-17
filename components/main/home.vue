<template>
  <main>
    <aside v-if="$store.state.user != undefined" id="profile">
      <div class="avatar">
        <a href="https://app.lifescope.io/settings/connections">
          <i class="fa fa-user"></i>
        </a>
      </div>

      <div class="divider"></div>

      <div class="info">
        <div>
          <i class="fa fa-clock-o"></i>
          <span>Joined {{ $store.getters.dateJoined }}</span>
        </div>
      </div>

      <div class="divider"></div>

      <div class="stats">
        <a class="connections" href="/settings/connections">
          <div class="count" v-model="connectionCount">{{ connectionCount }}</div>
          <div class="label">Connections</div>
        </a>

        <a class="events" href="/explore">
          <div class="count" v-model="eventCount">{{ eventCount }}</div>
          <div class="label">Events</div>
        </a>

        <a class="searches" href="/explore">
          <div class="count" v-model="$store.state.searchCount">{{ $store.state.searchCount }}</div>
          <div class="label">Searches</div>
        </a>
      </div>
    </aside>

    <section v-if="$store.state.user != undefined" id="content">
      <nav id="tabs">
        <div class="tab" v-bind:class="{selected: tab === 'favorites'}" name="favorites" v-on:click="fetchData(true, 'favorites')">Favorites</div>
        <div class="tab" name="recent" v-bind:class="{selected: tab === 'recent'}" v-on:click="fetchData(true, 'recent')">Recent</div>
        <div class="tab" name="top" v-bind:class="{selected: tab === 'top'}" v-on:click="fetchData(true, 'top')">Top</div>
        <div class="tab" name="tags" v-bind:class="{selected: tab === 'tags'}" v-on:click="fetchData(true, 'tags')">Tags</div>
      </nav>

      <div id="search-container" v-on:scroll="handleScroll">
        <div class="scroller">
          <div id="searches">
            <a v-if="type === 'searches'" v-for="search in $store.state.searchMany" v-bind:href="constructLink(search)"
               class="saved-search"
               v-bind:data-id="search.id"
               v-bind:data-favorited="search.favorited"
               v-bind:data-icon-color="search.iconColor"
               v-bind:data-icon="search.icon"
               v-bind:data-name="search.name">

              <div class="info">
                <i v-bind:class="searchIcon(search)" v-bind:style="{ color: searchColor(search) }"></i>
                <span class="name">{{ search.name }}</span>

                <span class="spacer"></span>

                <span class="last-run">{{ lastRunRelative(search) }}</span>

                <i v-bind:class="favoriteIcon(search)"></i>
              </div>

              <div v-if="search.query || (search.filters && search.filters.length > 0)" class="search">
                <div v-if="search.query" class="query">&quot;{{ search.query }}&quot;</div>

                <div v-if="search.filters && search.filters.length > 0" class="filters">
                  <div v-for="filter in search.filters" class="filter">{{ filter.name || filter.type }}
                  </div>

                  <div class="filter-overflow-count"></div>
                </div>
              </div>

              <div v-bind:class="favoriteButton(search)" v-on:click.stop.prevent="showFavoriteModal(search)"></div>
            </a>

            <div v-if="type === 'tags'" v-for="tag in $store.state.tagMany" class="tag">#{{ tag.tag }}</div>
          </div>
        </div>
      </div>

      <modals-container/>
    </section>
  </main>
</template>

<script>
  import _ from 'lodash';
  import moment from 'moment';

  import connectionCount from '../../apollo/queries/connection-count.gql';
  import eventCount from '../../apollo/queries/event-count.gql';
  import searchCount from '../../apollo/queries/search-count.gql';
  import searchMany from '../../apollo/queries/search-many.gql';
  import tagMany from '../../apollo/queries/tag-many.gql';

  import UserEvent from '../objects/event.vue';
  import favoriteModal from '../modals/favorite';

  export default {
    data: function() {
      return {
        connectionCount: null,
        eventCount: null,
        searchCount: null,
        searches: null,
        tab: 'favorites',
        sort: 'favorites',
        type: 'searches',
        dataEnd: false,
        offset: 0,
        pageSize: 20
      };
    },
    components: {
      UserEvent
    },
    methods: {
      fetchData: async function(init, tab) {
        this.$data.type = tab === 'tags' ? 'tags' : 'searches';
        this.$data.tab = tab;

        if (init === true) {
          this.$data.offset = 0;
          this.$data.dataEnd = false;
        }

        if (this.$data.dataEnd !== true) {
          let variables = {
            limit: this.$data.pageSize,
            skip: this.$data.offset
          };

          if (tab !== 'tags') {
            variables.sort = this.$data.tab;
          }

          if (tab === 'favorites') {
            variables.filter = {
              favorited: true
            };
          }

          let result = await this.$apollo.query({
            query: tab === 'tags' ? tagMany : searchMany,
            variables: variables
          });

          let data = tab === 'tags' ? result.data.tagMany : result.data.searchMany;

          let storeName = tab === 'tags' ? 'tagMany' : 'searchMany';

          this.$store.state[storeName] = init ? data : this.$store.state[storeName].concat(data);

          this.$data.dataEnd = data.length < this.$data.pageSize;
          this.$data.offset += this.$data.pageSize;
        }
      },

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

      searchUnfavorited(search) {
        let matched = _.find(this.$data.searchMany, function(item) {
          return item.id === search.id
        });

        matched.favorited = false;
      },

      searchDeleted(search) {
        this.$data.searchMany = _.remove(this.$data.searchMany, function(item) {
          return item.id === search.id;
        });
      },

      searchSaved(search) {
        let matched = _.find(this.$data.searchMany, function(item) {
          return item.id === search.id
        });

        matched.icon = this.$store.state.tempSearch.icon;
        matched.icon_color = this.$store.state.tempSearch.icon_color;
        matched.name = this.$store.state.tempSearch.name;
        matched.favorited = true;
      },

      handleScroll: _.debounce(async function(e) {
        let target = e.target;

        let scrollBottom = target.scrollTop + target.clientHeight;

        if (scrollBottom > 0.9 * target.scrollHeight) {
          await this.fetchData(false, this.$data.tab);
        }
      }, 500),
    },
    apollo: {
      connectionCount: {
        prefetch: true,
        query: connectionCount,
      },

      eventCount: {
        prefetch: true,
        query: eventCount
      },

      searchCount: {
        prefetch: true,
        query: searchCount,
        result: function({ data }) {
          this.$store.state.searchCount = data.searchCount;
        }
      }
    },
    mounted: async function() {
      this.$data.offset = 0;
      this.$data.tab = 'favorites';
      this.$data.type = 'searches';
      this.$store.state.hide_advanced = this.$store.state.hide_filters = this.$store.state.hide_favorite_star = true;

      await this.fetchData(true, this.$data.tab);
    }
  }
</script>
