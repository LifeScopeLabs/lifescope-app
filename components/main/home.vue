<template>
  <main>
    <aside v-if="$store.state.user != undefined" id="profile">
      <a href="https://app.lifescope.io/settings/connections">
        <div class="avatar">
          <img class="me" v-if="$store.state.person.avatar_url != null && $store.state.person.avatar_url.length > 0" v-bind:src="$store.state.person.avatar_url" style="max-height: 100px; max-width: 100px;">
          <div class="default me" v-else-if="$store.state.person.avatar_url == null || $store.state.person.avatar_url.length === 0" v-bind:style="{ 'background-color': defaultColor($store.state.person) }">{{ defaultLetter($store.state.person) }}</div>
        </div>

        <span class="name">{{ concatNames($store.state.person) }}</span>
      </a>

      <div class="divider"></div>

      <div class="info">
        <div>
          <i class="fal fa-clock"></i>
          <span>Joined LifeScope {{ $store.getters.dateJoined }}</span>
        </div>
      </div>

      <div class="divider"></div>

      <div id="stats-container">
        <div class="scroller">
          <div class="stats">
            <a class="connections flexbox flex-space-between" href="/settings/connections">
              <div class="count" v-model="connectionCount">Connections</div><div class="count-val"> {{ connectionCount }}</div>
            </a>

            <a class="people clickable flexbox flex-space-between" v-on:click="selectTab('people')">
              <div class="count" v-model="personCount">People</div><div class="count-val"> {{ personCount }}</div>
            </a>

            <a class="events flexbox flex-space-between" href="/explore">
              <div class="count" v-model="eventCount">Events</div><div class="count-val"> {{ eventCount }}</div>
            </a>

            <a class="content flexbox flex-space-between" href="/explore?facet=content">
              <div class="count" v-model="contentCount">Content</div><div class="count-val"> {{ contentCount }}</div>
            </a>

            <a class="contacts flexbox flex-space-between" href="/explore?facet=contacts">
              <div class="count" v-model="contactCount">Contacts</div><div class="count-val"> {{ contactCount }}</div>
            </a>

            <a class="locations flexbox flex-space-between" href="/settings/locations">
              <div class="count" v-model="locationCount">Locations</div><div class="count-val"> {{ locationCount }}</div>
            </a>

            <div class="searches clickable flexbox flex-space-between" v-on:click="selectTab('searches', 'recent')">
              <div class="count" v-model="$store.state.searchCount">Searches</div><div class="count-val"> {{ $store.state.searchCount }}</div>
            </div>

            <div class="favorited clickable flexbox flex-space-between" v-on:click="selectTab('searches', 'favorited')">
              <div class="count" v-model="favoriteCount">Favorites</div><div class="count-val"> {{ favoriteCount }}</div>
            </div>

            <div class="clickable flexbox flex-space-between" v-on:click="selectTab('tags')">
              <div class="count" v-model="tagCount">Tags</div><div class="count-val"> {{ tagCount }}</div>
            </div>

            <div class="shared-tags clickable flexbox flex-space-between" v-on:click="selectTab('tags')">
              <div class="count" v-model="sharedTagCount">Shared Tags</div><div class="count-val"> {{ sharedTagCount }}</div>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <section v-if="$store.state.user != undefined" id="content">
      <div class="flexbox">
        <nav id="tabs">
          <div class="tab" name="people" v-bind:class="{selected: $store.state.home.tab === 'people'}" v-on:click="fetchData(true, 'people', 'first_name')">People</div>
          <div class="tab" name="favorited" v-bind:class="{selected: $store.state.home.tab === 'searches'}" v-on:click="fetchData(true, 'searches', 'favorited')">Searches</div>
          <div class="tab" name="tags" v-bind:class="{selected: $store.state.home.tab === 'tags'}" v-on:click="fetchData(true, 'tags', 'tag')">Tags</div>

          <div id="sort" class="flexbox flex-grow flex-end" v-if="$store.state.home.tab === 'people'">
            <div v-bind:class="{selected: $store.state.home.sort === 'first_name'}" v-on:click="fetchData(true, 'people', 'first_name')">First</div>
            <div v-bind:class="{selected: $store.state.home.sort === 'middle_name'}" v-on:click="fetchData(true, 'people', 'middle_name')">Middle</div>
            <div v-bind:class="{selected: $store.state.home.sort === 'last_name'}" v-on:click="fetchData(true, 'people', 'last_name')">Last</div>
          </div>

          <div id="sort" class="flexbox flex-grow flex-end" v-if="$store.state.home.tab === 'searches'">
            <div v-bind:class="{selected: $store.state.home.sort === 'favorited'}" v-on:click="fetchData(true, 'searches', 'favorited')">Favorited</div>
            <div v-bind:class="{selected: $store.state.home.sort === 'top'}" v-on:click="fetchData(true, 'searches', 'top')">Top</div>
            <div v-bind:class="{selected: $store.state.home.sort === 'recent'}" v-on:click="fetchData(true, 'searches', 'recent')">Recent</div>
          </div>

          <div id="sort" class="flexbox flex-grow flex-end" v-if="$store.state.home.tab === 'tags'">
            <div v-bind:class="{selected: $store.state.home.sort === 'tag'}" v-on:click="fetchData(true, 'tags', 'tag')">A-Z</div>
            <div v-bind:class="{selected: $store.state.home.sort === 'shared'}" v-on:click="fetchData(true, 'tags', 'shared')">Shared</div>
          </div>
        </nav>
      </div>

      <div id="search-container" v-on:scroll="handleScroll">
        <div class="scroller">
          <div id="searches">
            <a v-if="$store.state.home.tab === 'searches'" v-for="search in $store.state.searchMany" v-bind:href="constructLink(search)"
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

            <a v-if="$store.state.home.tab === 'tags'" v-for="tag in $store.state.tagMany" class="tag" v-on:click="searchForTag(tag.tag)">
              <div>
                <span class="name">#{{ tag.tag }}</span>

                <span class="spacer"></span>

                <!-- <span class="sharing">Share</span> -->

                <i class="share-status" v-bind:class="shareStatus(tag)"></i>
              </div>

              <div class="tag-share" v-on:click.stop.prevent="showSharingModal(tag)"></div>
            </a>

            <a v-if="$store.state.home.tab === 'people'" v-for="person in $store.state.personMany" class="person" v-on:click="searchForPerson(person)">
              <div>
                <div class="avatar">
                  <img v-if="person.avatar_url != null && person.avatar_url.length > 0" v-bind:src="person.avatar_url">
                  <div class="default" v-else-if="person.avatar_url == null || person.avatar_url.length === 0" v-bind:style="{ 'background-color': defaultColor(person) }">{{ defaultLetter(person) }}</div>
                </div>
                <span class="name">{{ concatNames(person) }}</span>
              </div>
            </a>

            <div id="more-people" class="flexbox flex-center" v-if="$store.state.home.tab === 'people'" v-on:click="redirectToPeople">
              <i class="fal fa-3x glow fa-plus"></i>
            </div>
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
  import personOne from '../../apollo/queries/person-one.gql';
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
        dataEnd: false,
        offset: 0,
        pageSize: 20
      };
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
        return search.favorited && search.icon ? search.icon : 'fal fa-circle';
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
      	window.location.href = '/settings/people/create';
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
      let self = this;

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
          query: personCount,
          variables: {
            filter: {
              self: false
            }
          }
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

      let personResult = await this.$apollo.query({
          query: personOne,
          variables: {
              self: true
          }
      });

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
      this.$store.state.home.tab = 'people';
      this.$store.state.home.sort = 'first_name';
      this.$store.state.hide_advanced = this.$store.state.hide_filters = this.$store.state.hide_favorite_star = false;

      await this.fetchData(true, this.$store.state.home.tab, this.$store.state.home.sort);

      this.$root.$on('set-home-sort', function(sort) {
          self.$store.state.home.sort = sort;

          self.selectTab(self.$store.state.home.tab, sort);
      });
    }
  }
</script>
