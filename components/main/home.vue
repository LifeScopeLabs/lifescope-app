<template>
  <main>
    <aside v-if="$store.state.user != undefined" id="profile">
      <div class="avatar">
        <a href="https://app.lifescope.io/settings/connections">
          <i class="fas fa-user"></i>
        </a>
      </div>

      <div class="divider"></div>

      <div class="info">
        <div>
          <i class="far fa-clock"></i>
          <span>Joined LifeScope {{ $store.getters.dateJoined }}</span>
        </div>
      </div>

      <div class="divider"></div>

      <div id="stats-container">
        <div class="scroller">
          <div class="stats">
            <a class="connections" href="/settings/connections">
              <div class="count" v-model="connectionCount">Connections: {{ connectionCount }}</div>
            </a>

            <a class="people clickable" v-on:click="selectTab('people')">
              <div class="count" v-model="personCount">People: {{ personCount }}</div>
            </a>

            <a class="events" href="/explore">
              <div class="count" v-model="eventCount">Events: {{ eventCount }}</div>
            </a>

            <a class="content" href="/explore?facet=content">
              <div class="count" v-model="contentCount">Content: {{ contentCount }}</div>
            </a>

            <a class="contacts" href="/explore?facet=contacts">
              <div class="count" v-model="contactCount">Contacts: {{ contactCount }}</div>
            </a>

            <a class="locations" href="/settings/locations">
              <div class="count" v-model="locationCount">Locations: {{ locationCount }}</div>
            </a>

            <div class="searches clickable" v-on:click="selectTab('recent')">
              <div class="count" v-model="$store.state.searchCount">Searches: {{ $store.state.searchCount }}</div>
            </div>

            <div class="favorites clickable" v-on:click="selectTab('favorites')">
              <div class="count" v-model="favoriteCount">Favorited Searches: {{ favoriteCount }}</div>
            </div>

            <div class="tags clickable" v-on:click="selectTab('tags')">
              <div class="count" v-model="tagCount">Tags: {{ tagCount }}</div>
            </div>

            <div class="shared-tags clickable" v-on:click="selectTab('tags')">
              <div class="count" v-model="sharedTagCount">Shared Tags: {{ sharedTagCount }}</div>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <section v-if="$store.state.user != undefined" id="content">
      <nav id="tabs">
        <div class="tab" name="people" v-bind:class="{selected: tab === 'people'}" v-on:click="fetchData(true, 'people')">People</div>
        <div class="tab" name="favorites" v-bind:class="{selected: tab === 'favorites'}" v-on:click="fetchData(true, 'favorites')">Favorites</div>
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

            <a v-if="type === 'tags'" v-for="tag in orderBy($store.state.tagMany, 'tag')" class="tag" v-on:click="searchForTag(tag.tag)">
              <div>
                <span class="name">#{{ tag.tag }}</span>

                <span class="spacer"></span>

                <span class="sharing">Share</span>

                <i class="share-status" v-bind:class="shareStatus(tag)"></i>
              </div>

              <div class="tag-share" v-on:click.stop.prevent="showSharingModal(tag)"></div>
            </a>

            <a v-if="type === 'people'" v-for="person in orderBy($store.state.personMany, 'first_name')" class="person" v-on:click="searchForPerson(person)">
              <div>
                <div class="avatar">
                  <img v-if="person.avatar_url != null && person.avatar_url.length > 0" v-bind:src="person.avatar_url">
                  <div class="default" v-else-if="person.avatar_url == null || person.avatar_url.length === 0" v-bind:style="{ 'background-color': defaultColor(person) }">{{ defaultLetter(person) }}</div>
                </div>
                <span class="name">{{ concatNames(person) }}</span>
              </div>
            </a>

            <a v-if="type === 'people' && $store.state.personMany.length === 0" v-on:click="redirectToPeople">No People yet; make some!</a>
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
  import contactCount from '../../apollo/queries/contact-count.gql';
  import contentCount from '../../apollo/queries/content-count.gql';
  import eventCount from '../../apollo/queries/event-count.gql';
  import locationCount from '../../apollo/queries/location-count.gql';
  import personCount from '../../apollo/queries/person-count.gql';
  import personMany from '../../apollo/queries/person-many.gql';
  import searchCount from '../../apollo/queries/search-count.gql';
  import searchMany from '../../apollo/queries/search-many.gql';
  import tagCount from '../../apollo/queries/tag-count.gql';
  import tagMany from '../../apollo/queries/tag-many.gql';

  import { defaultColor, defaultLetter } from '../../lib/util/default-icon';
  import favoriteModal from '../modals/favorite';
  import sharingModal from '../modals/tag-sharing';

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
        tab: 'people',
        sort: 'first_name',
        type: 'people',
        dataEnd: false,
        offset: 0,
        pageSize: 20
      };
    },

    methods: {
      fetchData: async function(init, tab) {
        this.$data.type = tab === 'tags' ? 'tags' : tab === 'people' ? 'people' : 'searches';
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

          if (tab === 'people') {
          	variables.sort = 'first_name';
          }

          if (tab === 'favorites') {
            variables.filter = {
              favorited: true
            };
          }

          let result = await this.$apollo.query({
            query: tab === 'tags' ? tagMany : tab === 'people' ? personMany : searchMany,
            variables: variables
          });

          let data = tab === 'tags' ? result.data.tagMany : tab === 'people' ? result.data.personMany : result.data.searchMany;

          let storeName = tab === 'tags' ? 'tagMany' : tab === 'people' ? 'personMany' : 'searchMany';

          this.$store.state[storeName] = init ? data : this.$store.state[storeName].concat(data);

          this.$data.dataEnd = data.length < this.$data.pageSize;
          this.$data.offset += this.$data.pageSize;
        }
      },

      searchIcon: function(search) {
        return search.favorited && search.icon ? search.icon : 'far fa-circle';
      },

      searchColor: function(search) {
        return search.favorited && search.icon && search.icon_color ? search.icon_color : '#b6bbbf';
      },

      favoriteIcon: function(search) {
        return search.favorited ? 'favorite-edit fas fa-star subdue' : 'favorite-create far fa-star subdue'
      },

      favoriteButton: function(search) {
        return search.favorited ? 'favorite-edit' : 'favorite-create'
      },

      shareStatus: function(tag) {
        return tag.share === 'public' ? 'fas fa-lock-open' : 'fas fa-lock';
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

      selectTab(tab) {
        this.tab = tab;
        this.fetchData(true, tab);
      },

      handleScroll: _.debounce(async function(e) {
        let target = e.target;

        let scrollBottom = target.scrollTop + target.clientHeight;

        if (scrollBottom > 0.9 * target.scrollHeight) {
          await this.fetchData(false, this.$data.tab);
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
      	window.location.href = '/settings/people';
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

    mounted: async function() {
      let connectionCountResult = await this.$apollo.query({
          query: connectionCount,
      });

      let eventCountResult = await this.$apollo.query({
          query: eventCount
      });

      let contentCountResult = await this.$apollo.query({
          query: contentCount
      });

      let contactCountResult = await this.$apollo.query({
          query: contactCount
      });

      let locationCountResult = await this.$apollo.query({
          query: locationCount
      });

      let personCountResult = await this.$apollo.query({
          query: personCount
      });

      let searchCountResult = await this.$apollo.query({
          query: searchCount
      });

      let favoriteCountResult = await this.$apollo.query({
          query: searchCount,
          variables: {
            favorited: true
          }
      });

      let tagCountResult = await this.$apollo.query({
          query: tagCount
      });

      let sharedTagCountResult = await this.$apollo.query({
          query: tagCount,
          variables: {
            share: 'public'
          }
      });

      this.$data.connectionCount = connectionCountResult.data.connectionCount;
      this.$data.eventCount = eventCountResult.data.eventCount;
      this.$data.contactCount = contactCountResult.data.contactCount;
      this.$data.contentCount = contentCountResult.data.contentCount;
      this.$data.locationCount = locationCountResult.data.locationCount;
      this.$data.favoriteCount = favoriteCountResult.data.searchCount;
      this.$data.personCount = personCountResult.data.personCount;
      this.$data.tagCount = tagCountResult.data.tagCount;
      this.$data.sharedTagCount = sharedTagCountResult.data.tagCount;
      this.$store.state.searchCount = searchCountResult.data.searchCount;

      this.$data.offset = 0;
      this.$data.tab = 'people';
      this.$data.type = 'people';
      this.$store.state.hide_advanced = this.$store.state.hide_filters = this.$store.state.hide_favorite_star = false;

      await this.fetchData(true, this.$data.tab);
    }
  }
</script>
