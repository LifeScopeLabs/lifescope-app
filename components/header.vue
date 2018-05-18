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

			<div class="sort">
          <a data-sort="connection_id_string" v-bind:class="{ active: $store.state.sortField === 'connection' }" v-on:click="changeSort('connection')">
            <i v-if="$store.state.sortField === 'connection'" class="sort-arrow fa" v-bind:class="{ 'fa-chevron-up' : $store.state.sortOrder === 'asc', 'fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
            <span>Connection</span>
          </a>
          <a data-sort="type" v-bind:class="{ active: $store.state.sortField === 'type' }" v-on:click="changeSort('type')">
            <i v-if="$store.state.sortField === 'type'" class="sort-arrow fa" v-bind:class="{ 'fa-chevron-up' : $store.state.sortOrder === 'asc', 'fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
            <span>Type</span>
          </a>
          <a data-sort="datetime" v-bind:class="{ active: $store.state.sortField === 'datetime' }" v-on:click="changeSort('datetime')">
            <i v-if="$store.state.sortField === 'datetime'" class="sort-arrow fa" v-bind:class="{ 'fa-chevron-up' : $store.state.sortOrder === 'asc', 'fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
            <span>Time</span>
          </a>
			</div>

			<div class="facets">
				<div class="current">
					<!--<i class="fa fa-caret-down"></i>-->
					<span class="name">Events</span>
					<div class="flex-grow"></div>
					<span class="count">{{ $store.state.objects.events.length }}</span>
				</div>
				<div class="container hidden">
					<div class="drawer"></div>
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

          history.push({
            pathname: history.location.pathname,
            search: qs.stringify(params, {
              addQueryPrefix: true
            })
          });
        }
      },

      changeSort: function(sort) {
			  this.$store.state.sortField = sort;

			  if (this.$store.state.sortField === sort) {
			    this.$store.state.sortOrder = this.$store.state.sortOrder === 'asc' ? 'desc' : 'asc';
        }
        else {
			    if (sort === 'datetime') {
			      this.$store.state.sortOrder = 'desc';
          }
          else {
			      this.$store.state.sortOrder = 'asc';
          }
        }

        this.$refs.searchBar.performSearch(true);
      }
		}
	}
</script>
