<template>
	<header v-if="$store.state.user != undefined && ($store.state.mode === 'app' || $store.state.mode === 'home')">
		<nav>
			<a id="home" href="/"><img class="logo" src="~/assets/images/logo.png" /></a>
			<search-bar ref="searchBar"></search-bar>

			<div class="shortcuts">
				<a href="/explore"><i class="fa fa-rocket"></i></a>
				<a href="/providers"><i class="fa fa-plug"></i></a>
				<a href="/settings"><i class="fa fa-cog"></i></a>
			</div>

			<div id="menu-button" v-on:click.stop="openMenu">
				<div class="fa fa-bars"></div>
			</div>
		</nav>

		<div v-if="$store.state.mode === 'app'" class="controls">
			<div class="views">
				<a data-view="feed" v-bind:class="{ active: $store.state.view === 'feed' }" v-on:click="setView('feed')"><i class="fa fa-clone"></i> <span>Feed</span></a>
				<a data-view="grid" v-bind:class="{ active: $store.state.view === 'grid' }" v-on:click="setView('grid')"><i class="fa fa-th"></i> <span>Grid</span></a>
				<a data-view="list" v-bind:class="{ active: $store.state.view === 'list' }" v-on:click="setView('list')"><i class="fa fa-list"></i> <span>List</span></a>
				<a data-view="xr" v-bind:class="{ active: $store.state.view === 'xr' }" v-on:click="setView('xr')"><i class="fa fa-cubes"></i> <span>XR</span></a>
			</div>

			<div v-if="$store.state.facet === 'events'" class="sort">
          <a data-sort="connection_id_string" v-bind:class="{ active: $store.state.sortField === 'connection' }" v-on:click="setSort('connection')">
            <i v-if="$store.state.sortField === 'connection'" class="sort-arrow" v-bind:class="{ 'fa fa-chevron-up' : $store.state.sortOrder === 'asc', 'fa fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
            <span>Connection</span>
          </a>
          <a data-sort="type" v-bind:class="{ active: $store.state.sortField === 'type' }" v-on:click="setSort('type')">
            <i v-if="$store.state.sortField === 'type'" class="sort-arrow" v-bind:class="{ 'fa fa-chevron-up' : $store.state.sortOrder === 'asc', 'fa fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
            <span>Type</span>
          </a>
          <a data-sort="datetime" v-bind:class="{ active: $store.state.sortField === 'datetime' }" v-on:click="setSort('datetime')">
            <i v-if="$store.state.sortField === 'datetime'" class="sort-arrow" v-bind:class="{ 'fa fa-chevron-up' : $store.state.sortOrder === 'asc', 'fa fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
            <span>Time</span>
          </a>
			</div>

      <div v-if="$store.state.facet === 'contacts'" class="sort">
        <a data-sort="name" v-bind:class="{ active: $store.state.sortField === 'name' }" v-on:click="setSort('name')">
          <i v-if="$store.state.sortField === 'name'" class="sort-arrow" v-bind:class="{ 'fa fa-chevron-up' : $store.state.sortOrder === 'asc', 'fa fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
          <span>Name</span>
        </a>
        <a data-sort="connection_id_string" v-bind:class="{ active: $store.state.sortField === 'connection' }" v-on:click="setSort('connection')">
          <i v-if="$store.state.sortField === 'connection'" class="sort-arrow" v-bind:class="{ 'fa fa-chevron-up' : $store.state.sortOrder === 'asc', 'fa fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
          <span>Connection</span>
        </a>
        <a data-sort="handle" v-bind:class="{ active: $store.state.sortField === 'handle' }" v-on:click="setSort('handle')">
          <i v-if="$store.state.sortField === 'handle'" class="sort-arrow" v-bind:class="{ 'fa fa-chevron-up' : $store.state.sortOrder === 'asc', 'fa fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
          <span>Handle</span>
        </a>
      </div>

      <div v-if="$store.state.facet === 'content'" class="sort">
        <a data-sort="title" v-bind:class="{ active: $store.state.sortField === 'title' }" v-on:click="setSort('title')">
          <i v-if="$store.state.sortField === 'title'" class="sort-arrow" v-bind:class="{ 'fa fa-chevron-up' : $store.state.sortOrder === 'asc', 'fa fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
          <span>Title</span>
        </a>
        <a data-sort="connection_id_string" v-bind:class="{ active: $store.state.sortField === 'connection' }" v-on:click="setSort('connection')">
          <i v-if="$store.state.sortField === 'connection'" class="sort-arrow" v-bind:class="{ 'fa fa-chevron-up' : $store.state.sortOrder === 'asc', 'fa fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
          <span>Connection</span>
        </a>
        <a data-sort="type" v-bind:class="{ active: $store.state.sortField === 'type' }" v-on:click="setSort('type')">
          <i v-if="$store.state.sortField === 'type'" class="sort-arrow" v-bind:class="{ 'fa fa-chevron-up' : $store.state.sortOrder === 'asc', 'fa fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
          <span>Type</span>
        </a>
      </div>

			<div class="facets">
				<div class="current">
          <div class="facet-select-toggle" v-on:click="$store.state.facetSelectOpen = !$store.state.facetSelectOpen">
            <i v-bind:class="{ 'fa fa-chevron-down' : $store.state.facetSelectOpen === false, 'fa fa-chevron-up' : $store.state.facetSelectOpen === true }"></i>
            <span v-if="$store.state.facet != null" class="name">{{ $store.state.facet[0].toUpperCase() + $store.state.facet.slice(1)}}</span>
          </div>
					<div class="flex-grow"></div>
					<span v-if="$store.state.facet === 'events'" class="count">{{ $store.state.objects.events.length }}</span>
          <span v-if="$store.state.facet === 'contacts'" class="count">{{ $store.state.objects.contacts.length }}</span>
          <span v-if="$store.state.facet === 'content'" class="count">{{ $store.state.objects.content.length }}</span>
				</div>
				<div class="container" v-bind:class="{ hidden: $store.state.facetSelectOpen === false }">
					<div class="drawer">
            <a v-on:click="setFacet('events')">Events</a>
            <a v-on:click="setFacet('content')">Content</a>
            <a v-on:click="setFacet('contacts')">Contacts</a>
          </div>
				</div>
			</div>
		</div>
	</header>

  <header v-else-if="$store.state.mode === 'shared'">
    <nav>
      <a id="home" href="/"><img class="logo" src="~/assets/images/logo.png" /></a>
      <search-bar ref="searchBar"></search-bar>

      <span class="flex-grow"></span>

      <div id="menu-button" v-on:click.stop="openMenu">
        <div class="fa fa-bars"></div>
      </div>
    </nav>

    <div class="controls">
      <div class="views">
        <a data-view="feed" v-bind:class="{ active: $store.state.view === 'feed' }" v-on:click="setView('feed')"><i class="fa fa-clone"></i> <span>Feed</span></a>
        <a data-view="grid" v-bind:class="{ active: $store.state.view === 'grid' }" v-on:click="setView('grid')"><i class="fa fa-th"></i> <span>Grid</span></a>
        <a data-view="list" v-bind:class="{ active: $store.state.view === 'list' }" v-on:click="setView('list')"><i class="fa fa-list"></i> <span>List</span></a>
        <a data-view="xr" v-bind:class="{ active: $store.state.view === 'xr' }" v-on:click="setView('xr')"><i class="fa fa-cubes"></i> <span>XR</span></a>
      </div>

      <div v-if="$store.state.facet === 'events'" class="sort">
        <a data-sort="connection_id_string" v-bind:class="{ active: $store.state.sortField === 'connection' }" v-on:click="setSort('connection')">
          <i v-if="$store.state.sortField === 'connection'" class="sort-arrow" v-bind:class="{ 'fa fa-chevron-up' : $store.state.sortOrder === 'asc', 'fa fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
          <span>Connection</span>
        </a>
        <a data-sort="type" v-bind:class="{ active: $store.state.sortField === 'type' }" v-on:click="setSort('type')">
          <i v-if="$store.state.sortField === 'type'" class="sort-arrow" v-bind:class="{ 'fa fa-chevron-up' : $store.state.sortOrder === 'asc', 'fa fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
          <span>Type</span>
        </a>
        <a data-sort="datetime" v-bind:class="{ active: $store.state.sortField === 'datetime' }" v-on:click="setSort('datetime')">
          <i v-if="$store.state.sortField === 'datetime'" class="sort-arrow" v-bind:class="{ 'fa fa-chevron-up' : $store.state.sortOrder === 'asc', 'fa fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
          <span>Time</span>
        </a>
      </div>

      <div v-if="$store.state.facet === 'contacts'" class="sort">
        <a data-sort="name" v-bind:class="{ active: $store.state.sortField === 'name' }" v-on:click="setSort('name')">
          <i v-if="$store.state.sortField === 'name'" class="sort-arrow" v-bind:class="{ 'fa fa-chevron-up' : $store.state.sortOrder === 'asc', 'fa fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
          <span>Name</span>
        </a>
        <a data-sort="connection_id_string" v-bind:class="{ active: $store.state.sortField === 'connection' }" v-on:click="setSort('connection')">
          <i v-if="$store.state.sortField === 'connection'" class="sort-arrow" v-bind:class="{ 'fa fa-chevron-up' : $store.state.sortOrder === 'asc', 'fa fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
          <span>Connection</span>
        </a>
        <a data-sort="handle" v-bind:class="{ active: $store.state.sortField === 'handle' }" v-on:click="setSort('handle')">
          <i v-if="$store.state.sortField === 'handle'" class="sort-arrow" v-bind:class="{ 'fa fa-chevron-up' : $store.state.sortOrder === 'asc', 'fa fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
          <span>Handle</span>
        </a>
      </div>

      <div v-if="$store.state.facet === 'content'" class="sort">
        <a data-sort="title" v-bind:class="{ active: $store.state.sortField === 'title' }" v-on:click="setSort('title')">
          <i v-if="$store.state.sortField === 'title'" class="sort-arrow" v-bind:class="{ 'fa fa-chevron-up' : $store.state.sortOrder === 'asc', 'fa fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
          <span>Title</span>
        </a>
        <a data-sort="connection_id_string" v-bind:class="{ active: $store.state.sortField === 'connection' }" v-on:click="setSort('connection')">
          <i v-if="$store.state.sortField === 'connection'" class="sort-arrow" v-bind:class="{ 'fa fa-chevron-up' : $store.state.sortOrder === 'asc', 'fa fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
          <span>Connection</span>
        </a>
        <a data-sort="type" v-bind:class="{ active: $store.state.sortField === 'type' }" v-on:click="setSort('type')">
          <i v-if="$store.state.sortField === 'type'" class="sort-arrow" v-bind:class="{ 'fa fa-chevron-up' : $store.state.sortOrder === 'asc', 'fa fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
          <span>Type</span>
        </a>
      </div>

      <div class="facets">
        <div class="current">
          <div class="facet-select-toggle" v-on:click="$store.state.facetSelectOpen = !$store.state.facetSelectOpen">
            <i v-bind:class="{ 'fa fa-chevron-down' : $store.state.facetSelectOpen === false, 'fa fa-chevron-up' : $store.state.facetSelectOpen === true }"></i>
            <span v-if="$store.state.facet != null" class="name">{{ $store.state.facet[0].toUpperCase() + $store.state.facet.slice(1)}}</span>
          </div>
          <div class="flex-grow"></div>
          <span v-if="$store.state.facet === 'events'" class="count">{{ $store.state.objects.events.length }}</span>
          <span v-if="$store.state.facet === 'contacts'" class="count">{{ $store.state.objects.contacts.length }}</span>
          <span v-if="$store.state.facet === 'content'" class="count">{{ $store.state.objects.content.length }}</span>
        </div>
        <div class="container" v-bind:class="{ hidden: $store.state.facetSelectOpen === false }">
          <div class="drawer">
            <a v-on:click="setFacet('events')">Events</a>
            <a v-on:click="setFacet('content')">Content</a>
            <a v-on:click="setFacet('contacts')">Contacts</a>
          </div>
        </div>
      </div>
    </div>
  </header>

	<header v-else>
		<nav>
			<a v-if="$store.state.user != undefined" id="home" href="/"><img class="logo" src="~/assets/images/logo.png" /></a>

			<span v-if="$store.state.user != undefined" class="flex-grow"></span>

			<div v-if="$store.state.user != undefined && $store.state.mode === 'provider'" class="flexbox flex-x-center">
				<button id="done" class="primary">Done</button>
			</div>

      <div v-if="$store.state.user != undefined" class="shortcuts">
        <a href="/explore"><i class="fa fa-rocket"></i></a>
        <a href="/providers"><i class="fa fa-plug"></i></a>
        <a href="/settings"><i class="fa fa-cog"></i></a>
      </div>

			<div v-if="$store.state.user != undefined" id="menu-button" v-on:click.stop="openMenu">
				<div class="fa fa-bars"></div>
			</div>

			<div v-if="$store.state.user == undefined && ($store.state.mode === 'provider' || $store.state.mode === 'home')">
				<span class="flex-grow"></span>

				<div class="login flexbox flex-x-center">
					<div>Sign up or Log in by Connecting to any of the providers below.</div>
					<i class="fa fa-question-circle" v-on:click="showLoginModal"></i>
				</div>

				<span class="flex-grow"></span>
			</div>
		</nav>

    <div v-if="$store.state.mode === 'connections' || $store.state.mode === 'account'" class="mobile-selector" v-on:click="$store.state.settingsSelectorOpen = !$store.state.settingsSelectorOpen">
      <span class="placeholder-text">{{ $store.state.mode[0].toUpperCase() + $store.state.mode.slice(1) }}</span>
      <i v-bind:class="{ 'fa fa-caret-down': $store.state.settingsSelectorOpen === false, 'fa fa-caret-up': $store.state.settingsSelectorOpen === true }"></i>
    </div>

    <aside v-if="$store.state.mode === 'connections' || $store.state.mode === 'account'" class="mobile-type-selector" v-bind:class="{ open: $store.state.settingsSelectorOpen === true }">
      <div class="scroller">
        <div id="pages">
          <a href="/settings/account">Account</a>
          <a href="/settings/connections">Connections</a>
        </div>
      </div>
    </aside>
	</header>
</template>

<script>
  import History from 'history/createBrowserHistory';
  import qs from 'qs';


	import SearchBar from './search.vue';
	import loginHelpModal from '../components/modals/login-help';

  let history;

  if (process.browser) {
    history = History();
  }

	export default {
		components: {
			SearchBar: SearchBar
		},

		methods: {
			openMenu: function() {
				this.$store.state.menu.open = true;
			},
			showLoginModal: function() {
				this.$modal.show(loginHelpModal, {}, {
					height: 'auto',
					scrollable: true
				});
			},

      setView: function(view) {
			  this.$store.state.view = view;

        if (process.browser) {
          let params = qs.parse(history.location.search, {
            ignoreQueryPrefix: true
          });

          params.view = this.$store.state.view;
          params.facet = this.$store.state.facet;

          history.push({
            pathname: history.location.pathname,
            search: qs.stringify(params, {
              addQueryPrefix: true
            })
          });
        }
      },

      setSort: function(sort) {
			  if (this.$store.state.sortField === sort) {
			    this.$store.state.sortOrder = this.$store.state.sortOrder === 'asc' ? 'desc' : 'asc';
        }
        else {
          this.$store.state.sortField = sort;

			    if (sort === 'datetime') {
			      this.$store.state.sortOrder = 'desc';
          }
          else {
			      this.$store.state.sortOrder = 'asc';
          }
        }

        this.$refs.searchBar.performSearch(true);
      },

      setFacet: function(facet) {
			  this.$store.state.facetSelectOpen = false;
			  this.$store.state.facet = facet;
			  this.$store.state.searching = false;

			  switch(facet) {
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
        }

        if (process.browser) {
          let params = qs.parse(history.location.search, {
            ignoreQueryPrefix: true
          });

          params.view = this.$store.state.view;
          params.facet = this.$store.state.facet;

          history.push({
            pathname: history.location.pathname,
            search: qs.stringify(params, {
              addQueryPrefix: true
            })
          });
        }

			  this.$root.$emit('perform-search', true);
      }
		},

    mounted: async function() {
      let self = this;

      this.$root.$on('set-view', function(view) {
        self.setView(view);
      });

      this.$root.$on('set-sort', function(sort) {
        self.setSort(sort);
      });

      this.$root.$on('set-facet', function(facet) {
        self.setFacet(facet);
      });
    }
	}
</script>
