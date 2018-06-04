<template slot="menu">
	<aside id="menu" v-if="$store.state.menu.open" v-on-clickaway="clickaway">
		<section class="scroller">
			<div class="menu">
				<header>
					<div>Menu</div>
					<i id="close-menu" class="fa fa-times" v-on:click="$store.state.menu.open = false"></i>
				</header>

				<section>
					<div class="views">
						<div class="current" v-on:click="$store.state.mobileViewSelectorOpen = !$store.state.mobileViewSelectorOpen">
							<i class="fa" v-bind:class="{ 'fa-caret-up': $store.state.mobileViewSelectorOpen === true, 'fa-caret-down': $store.state.movileViewSelectorOpen !== true }"></i>
							<span class="drawer-label">View &ndash;</span>
							<span class="name">{{ $store.state.view }}</span>
						</div>
						<div class="drawer" v-bind:class="{ hidden: $store.state.mobileViewSelectorOpen !== true }">
							<a data-view="feed" v-bind:class="{ active: $store.state.view === 'feed' }" v-on:click="setView('feed')"><i class="fa fa-clone"></i><span>Feed</span></a>
							<a data-view="grid" v-bind:class="{ active: $store.state.view === 'grid' }" v-on:click="setView('grid')"><i class="fa fa-th"></i><span>Grid</span></a>
							<a data-view="list" v-bind:class="{ active: $store.state.view === 'list' }" v-on:click="setView('list')"><i class="fa fa-list"></i><span>List</span></a>
							<a data-view="xr" v-bind:class="{ active: $store.state.view === 'xr' }" v-on:click="setView('xr')"><i class="fa fa-cubes"></i><span>XR</span></a>
						</div>
					</div>

					<div class="sort">
						<div class="current" v-on:click="$store.state.mobileSortSelectorOpen = !$store.state.mobileSortSelectorOpen">
              <i class="fa" v-bind:class="{ 'fa-caret-up': $store.state.mobileSortSelectorOpen === true, 'fa-caret-down': $store.state.movileSortSelectorOpen !== true }"></i>
							<span class="drawer-label">Sort &ndash;</span>
							<span class="name">{{ $store.state.sortField[0].toUpperCase() + $store.state.sortField.slice(1) }}</span>
              <i class="fa" v-bind:class="{ 'fa-chevron-up': $store.state.sortOrder === 'asc', 'fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
						</div>
						<div class="fields drawer" v-bind:class="{ hidden: $store.state.mobileSortSelectorOpen !== true }">
              <div v-if="$store.state.facet === 'events'" class="sort">
                <a data-sort="connection_id_string" v-bind:class="{ active: $store.state.sortField === 'connection' }" v-on:click="setSort('connection')">
                  <i v-if="$store.state.sortField === 'connection'" class="sort-arrow fa" v-bind:class="{ 'fa-chevron-up' : $store.state.sortOrder === 'asc', 'fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
                  <span>Connection</span>
                </a>
                <a data-sort="type" v-bind:class="{ active: $store.state.sortField === 'type' }" v-on:click="setSort('type')">
                  <i v-if="$store.state.sortField === 'type'" class="sort-arrow fa" v-bind:class="{ 'fa-chevron-up' : $store.state.sortOrder === 'asc', 'fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
                  <span>Type</span>
                </a>
                <a data-sort="datetime" v-bind:class="{ active: $store.state.sortField === 'datetime' }" v-on:click="setSort('datetime')">
                  <i v-if="$store.state.sortField === 'datetime'" class="sort-arrow fa" v-bind:class="{ 'fa-chevron-up' : $store.state.sortOrder === 'asc', 'fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
                  <span>Time</span>
                </a>
              </div>

              <div v-if="$store.state.facet === 'contacts'" class="sort">
                <a data-sort="name" v-bind:class="{ active: $store.state.sortField === 'name' }" v-on:click="setSort('name')">
                  <i v-if="$store.state.sortField === 'name'" class="sort-arrow fa" v-bind:class="{ 'fa-chevron-up' : $store.state.sortOrder === 'asc', 'fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
                  <span>Name</span>
                </a>
                <a data-sort="connection_id_string" v-bind:class="{ active: $store.state.sortField === 'connection' }" v-on:click="setSort('connection')">
                  <i v-if="$store.state.sortField === 'connection'" class="sort-arrow fa" v-bind:class="{ 'fa-chevron-up' : $store.state.sortOrder === 'asc', 'fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
                  <span>Connection</span>
                </a>
                <a data-sort="handle" v-bind:class="{ active: $store.state.sortField === 'handle' }" v-on:click="setSort('handle')">
                  <i v-if="$store.state.sortField === 'handle'" class="sort-arrow fa" v-bind:class="{ 'fa-chevron-up' : $store.state.sortOrder === 'asc', 'fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
                  <span>Handle</span>
                </a>
              </div>

              <div v-if="$store.state.facet === 'content'" class="sort">
                <a data-sort="title" v-bind:class="{ active: $store.state.sortField === 'title' }" v-on:click="setSort('title')">
                  <i v-if="$store.state.sortField === 'title'" class="sort-arrow fa" v-bind:class="{ 'fa-chevron-up' : $store.state.sortOrder === 'asc', 'fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
                  <span>Title</span>
                </a>
                <a data-sort="connection_id_string" v-bind:class="{ active: $store.state.sortField === 'connection' }" v-on:click="setSort('connection')">
                  <i v-if="$store.state.sortField === 'connection'" class="sort-arrow fa" v-bind:class="{ 'fa-chevron-up' : $store.state.sortOrder === 'asc', 'fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
                  <span>Connection</span>
                </a>
                <a data-sort="type" v-bind:class="{ active: $store.state.sortField === 'type' }" v-on:click="setSort('type')">
                  <i v-if="$store.state.sortField === 'type'" class="sort-arrow fa" v-bind:class="{ 'fa-chevron-up' : $store.state.sortOrder === 'asc', 'fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
                  <span>Type</span>
                </a>
              </div>
            </div>
					</div>

					<div class="facets">
						<div class="current" v-on:click="$store.state.mobileFacetSelectorOpen = !$store.state.mobileFacetSelectorOpen">
              <i class="fa" v-bind:class="{ 'fa-caret-up': $store.state.mobileFacetSelectorOpen === true, 'fa-caret-down': $store.state.movileFacetSelectorOpen !== true }"></i>
							<span class="drawer-label">Facet &ndash;</span>
							<span class="name"></span>
							<div class="flex-grow">{{ $store.state.facet }}</div>
							<span class="count"></span>
						</div>
						<div class="drawer" v-bind:class="{ hidden: $store.state.mobileFacetSelectorOpen !== true }">
              <a v-bind:class="{ active: $store.state.facet === 'events' }" v-on:click="setFacet('events')">Events</a>
              <a v-bind:class="{ active: $store.state.facet === 'content' }" v-on:click="setFacet('content')">Content</a>
              <a v-bind:class="{ active: $store.state.facet === 'contacts' }" v-on:click="setFacet('contacts')">Contacts</a>
            </div>
					</div>

					<a class="live" href="/explore"><i class="fa fa-rocket blue"></i> Search LifeScope</a>
					<a class="providers" href="/providers"><i class="fa fa-plug"></i> Add Connections</a>
					<a class="settings" href="/settings"><i class="fa fa-cog"></i> Settings</a>
				</section>

				<footer>
					<div class="user-info">
						<a href="/logout"><i class="fa fa-sign-out"></i> Logout</a>
					</div>

					<div>
						<a href="https://www.bitscooplabs.com">&copy; 2017 BitScoop Labs, Inc.</a>
						<span class="spacer">|</span>
						<a href="https://www.bitscooplabs.com/privacy">Privacy</a>
						<span class="spacer">|</span>
						<a href="https://www.bitscooplabs.com/terms">Terms</a>
					</div>
				</footer>
			</div>
		</section>
	</aside>
</template>

<script>

	import { mixin as clickaway } from 'vue-clickaway';

	export default {
		mixins: [ clickaway ],
		methods: {
			clickaway: function() {
				this.$store.state.menu.open = false;
			},

      setView: function(view) {
			  this.$store.state.menu.open = false;
			  this.$root.$emit('set-view', view);
      },

      setSort: function(sort) {
			  this.$store.state.menu.open = false;
			  this.$root.$emit('set-sort', sort);
      },

      setFacet: function(facet) {
			  this.$store.state.menu.open = false;
        this.$root.$emit('set-facet', facet)
      }
		}
	}
</script>
