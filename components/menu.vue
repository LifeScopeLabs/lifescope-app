<template slot="menu">
	<transition name="menu">
		<aside id="menu" v-if="$store.state.menu.open" v-on-clickaway="clickaway">
			<section class="scroller">
				<div class="menu">
					<header>
						<div>Menu</div>
						<i id="close-menu" class="fal fa-times" v-on:click="$store.state.menu.open = false"></i>
					</header>

					<section>
						<div class="views">
							<div class="current"
								 v-on:click="$store.state.mobileViewSelectorOpen = !$store.state.mobileViewSelectorOpen">
								<i v-bind:class="{ 'fal fa-caret-up': $store.state.mobileViewSelectorOpen === true, 'fal fa-caret-down': $store.state.mobileViewSelectorOpen !== true }"></i>
								<span class="drawer-label">View &ndash;</span>
								<span class="name">{{ $store.state.view }}</span>
							</div>
							<transition name="menu-drop">
								<div class="drawer" v-if="$store.state.mobileViewSelectorOpen === true">
									<a data-view="feed" v-bind:class="{ active: $store.state.view === 'feed' }"
									   v-on:click="setView('feed')"><i class="far fa-clone"></i><span>Feed</span></a>
									<a data-view="map"
									   v-bind:class="{ active: $store.state.view === 'map', disabled: $store.state.facet !== 'events' }"
									   v-on:click="setView('map')"><i class="fas fa-map"></i><span>Map</span></a>
									<a data-view="grid" v-bind:class="{ active: $store.state.view === 'grid' }"
									   v-on:click="setView('grid')"><i class="fal fa-th"></i><span>Grid</span></a>
									<a data-view="list" v-bind:class="{ active: $store.state.view === 'list' }"
									   v-on:click="setView('list')"><i class="fal fa-list"></i><span>List</span></a>
									<a data-view="xr" v-bind:class="{ active: $store.state.view === 'xr' }"
									   v-on:click="setView('xr')"><i class="fal glow fa-cubes"></i><span>XR</span></a>
								</div>
							</transition>
						</div>

						<div class="home-sort" v-if="$store.state.mode === 'home'">
							<div class="current"
								 v-on:click="$store.state.mobileSortSelectorOpen = !$store.state.mobileSortSelectorOpen">
								<i v-bind:class="{ 'fal fa-caret-up': $store.state.mobileSortSelectorOpen === true, 'fal fa-caret-down': $store.state.mobileSortSelectorOpen !== true }"></i>
								<span class="drawer-label">Sort &ndash;</span>
								<span class="name">{{ displaySort() }}</span>
							</div>
							<transition name="menu-drop">
								<div class="fields drawer"
									 v-if="$store.state.mobileSortSelectorOpen === true">
									<div v-if="$store.state.home.tab === 'searches'">
										<a data-sort="favorited"
										   v-bind:class="{ active: $store.state.home.sort === 'favorited' }"
										   v-on:click="setHomeSort('favorited')">
											<span>Favorited</span>
										</a>
										<a data-sort="top" v-bind:class="{ active: $store.state.home.sort === 'top' }"
										   v-on:click="setHomeSort('top')">
											<span>Top</span>
										</a>
										<a data-sort="recent" v-bind:class="{ active: $store.state.home.sort === 'recent' }"
										   v-on:click="setHomeSort('recent')">
											<span>Recent</span>
										</a>
									</div>
									<div v-if="$store.state.home.tab === 'people'">
										<a data-sort="first_name"
										   v-bind:class="{ active: $store.state.home.sort === 'first_name' }"
										   v-on:click="setHomeSort('first_name')">
											<span>First</span>
										</a>
										<a data-sort="middle_name" v-bind:class="{ active: $store.state.home.sort === 'middle_name' }"
										   v-on:click="setHomeSort('middle_name')">
											<span>Middle</span>
										</a>
										<a data-sort="last_name" v-bind:class="{ active: $store.state.home.sort === 'last_name' }"
										   v-on:click="setHomeSort('last_name')">
											<span>Last</span>
										</a>
									</div>
									<div v-if="$store.state.home.tab === 'tags'">
										<a data-sort="tag"
										   v-bind:class="{ active: $store.state.home.sort === 'tag' }"
										   v-on:click="setHomeSort('tag')">
											<span>A-Z</span>
										</a>
										<a data-sort="shared" v-bind:class="{ active: $store.state.home.sort === 'shared' }"
										   v-on:click="setHomeSort('shared')">
											<span>Shared</span>
										</a>
									</div>
								</div>
							</transition>
						</div>

						<div class="sort">
							<div class="current"
								 v-on:click="$store.state.mobileSortSelectorOpen = !$store.state.mobileSortSelectorOpen">
								<i v-bind:class="{ 'fal fa-caret-up': $store.state.mobileSortSelectorOpen === true, 'fal fa-caret-down': $store.state.mobileSortSelectorOpen !== true }"></i>
								<span class="drawer-label">Sort &ndash;</span>
								<span class="name">{{ $store.state.sortField[0].toUpperCase() + $store.state.sortField.slice(1) }}</span>
								<i v-bind:class="{ 'fal fa-chevron-up': $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
							</div>
							<transition name="menu-drop">
								<div class="fields drawer"
									 v-if="$store.state.mobileSortSelectorOpen === true">
									<div v-if="$store.state.facet === 'events'" class="sort">
										<a data-sort="connection_id_string"
										   v-bind:class="{ active: $store.state.sortField === 'connection' }"
										   v-on:click="setSort('connection')">
											<i v-if="$store.state.sortField === 'connection'" class="sort-arrow"
											   v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
											<span>Connection</span>
										</a>
										<a data-sort="type" v-bind:class="{ active: $store.state.sortField === 'type' }"
										   v-on:click="setSort('type')">
											<i v-if="$store.state.sortField === 'type'" class="sort-arrow"
											   v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
											<span>Type</span>
										</a>
										<a data-sort="datetime" v-bind:class="{ active: $store.state.sortField === 'datetime' }"
										   v-on:click="setSort('datetime')">
											<i v-if="$store.state.sortField === 'datetime'" class="sort-arrow"
											   v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
											<span>Time</span>
										</a>
									</div>

									<div v-if="$store.state.facet === 'contacts'" class="sort">
										<a data-sort="name" v-bind:class="{ active: $store.state.sortField === 'name' }"
										   v-on:click="setSort('name')">
											<i v-if="$store.state.sortField === 'name'" class="sort-arrow"
											   v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
											<span>Name</span>
										</a>
										<a data-sort="connection_id_string"
										   v-bind:class="{ active: $store.state.sortField === 'connection' }"
										   v-on:click="setSort('connection')">
											<i v-if="$store.state.sortField === 'connection'" class="sort-arrow"
											   v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
											<span>Connection</span>
										</a>
										<a data-sort="handle" v-bind:class="{ active: $store.state.sortField === 'handle' }"
										   v-on:click="setSort('handle')">
											<i v-if="$store.state.sortField === 'handle'" class="sort-arrow"
											   v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
											<span>Handle</span>
										</a>
									</div>

									<div v-if="$store.state.facet === 'content'" class="sort">
										<a data-sort="title" v-bind:class="{ active: $store.state.sortField === 'title' }"
										   v-on:click="setSort('title')">
											<i v-if="$store.state.sortField === 'title'" class="sort-arrow"
											   v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
											<span>Title</span>
										</a>
										<a data-sort="connection_id_string"
										   v-bind:class="{ active: $store.state.sortField === 'connection' }"
										   v-on:click="setSort('connection')">
											<i v-if="$store.state.sortField === 'connection'" class="sort-arrow"
											   v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
											<span>Connection</span>
										</a>
										<a data-sort="type" v-bind:class="{ active: $store.state.sortField === 'type' }"
										   v-on:click="setSort('type')">
											<i v-if="$store.state.sortField === 'type'" class="sort-arrow"
											   v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
											<span>Type</span>
										</a>
									</div>

									<div v-if="$store.state.facet === 'people'" class="sort">
										<a data-sort="first_name" v-bind:class="{ active: $store.state.sortField === 'first_name' }"
										   v-on:click="setSort('first_name')">
											<i v-if="$store.state.sortField === 'first_name'" class="sort-arrow"
											   v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
											<span>First Name</span>
										</a>
										<a data-sort="middle_name"
										   v-bind:class="{ active: $store.state.sortField === 'middle_name' }"
										   v-on:click="setSort('middle_name')">
											<i v-if="$store.state.sortField === 'middle_name'" class="sort-arrow"
											   v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
											<span>Middle Name</span>
										</a>
										<a data-sort="last_name" v-bind:class="{ active: $store.state.sortField === 'last_name' }"
										   v-on:click="setSort('last_name')">
											<i v-if="$store.state.sortField === 'last_name'" class="sort-arrow"
											   v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"></i>
											<span>Last Name</span>
										</a>
									</div>
								</div>
							</transition>
						</div>

						<div class="facets">
							<div class="current"
								 v-on:click="$store.state.mobileFacetSelectorOpen = !$store.state.mobileFacetSelectorOpen">
								<i v-bind:class="{ 'fal fa-caret-up': $store.state.mobileFacetSelectorOpen === true, 'fal fa-caret-down': $store.state.mobileFacetSelectorOpen !== true }"></i>
								<span class="drawer-label">Facet &ndash;</span>
								<span class="name"></span>
								<div class="flex-grow">{{ $store.state.facet }}</div>
								<span class="count"></span>
							</div>
							<transition name="menu-drop">
								<div class="drawer" v-if="$store.state.mobileFacetSelectorOpen === true">
									<a v-bind:class="{ active: $store.state.facet === 'events' }"
									   v-on:click="setFacet('events')">Events</a>
									<a v-if="$store.state.view !== 'map'"
									   v-bind:class="{ active: $store.state.facet === 'content' }"
									   v-on:click="setFacet('content')">Content</a>
									<a v-if="$store.state.view !== 'map'"
									   v-bind:class="{ active: $store.state.facet === 'contacts' }"
									   v-on:click="setFacet('contacts')">Contacts</a>
									<a v-if="$store.state.view !== 'map'"
									   v-bind:class="{ active: $store.state.facet === 'people' }"
									   v-on:click="setFacet('people')">People</a>
								</div>
							</transition>
						</div>

						<nuxt-link v-if="$store.state.mode !== 'shared'" class="live"
						   v-bind:class="{ active: $store.state.pageName === 'explorer' }" to="/explore"><i
								class="fal fa-rocket blue"></i> Search</nuxt-link>
						<nuxt-link v-if="$store.state.mode !== 'shared'" class="providers"
						   v-bind:class="{ active: $store.state.pageName === 'providers' }" to="/providers"><i
								class="fal fa-plug"></i> Add Connections</nuxt-link>
						<nuxt-link v-if="$store.state.mode !== 'shared'" class="settings"
						   v-bind:class="{ active: isSettingsPage() === true }" to="/settings"><i class="fal fa-cog"></i>
							Settings</nuxt-link>
						<a class="learn" href="https://lifescope.io/learn" target="_blank"><i class="fal fa-book"></i> Learn</a>
						<a class="support" href="http://bitscoop.com/support"><i class="fal fa-question-circle"></i> Support</a>
					</section>

					<footer>
						<div v-if="$store.state.mode !== 'shared'" class="user-info">
							<a href="/logout"><i class="fal fa-sign-out-alt"></i> Logout</a>
						</div>

						<div>
							<a href="https://www.bitscooplabs.com">&copy; 2014-{{ new Date().getFullYear() }} BitScoop Labs, Inc.</a>
							<span class="spacer">|</span>
							<a href="https://www.bitscooplabs.com/privacy">Privacy</a>
							<span class="spacer">|</span>
							<a href="https://www.bitscooplabs.com/terms">Terms</a>
						</div>
					</footer>
				</div>
			</section>
		</aside>
	</transition>
</template>

<script>
	import {mixin as clickaway} from 'vue-clickaway';

	let displayDict = {
		favorited: 'Favorited',
		top: 'Top',
		recent: 'Recent',
		first_name: 'First',
		middle_name: 'Middle',
		last_name: 'Last',
		tag: 'A-Z',
		shared: 'Shared'
	};

	export default {
		mixins: [clickaway],
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

			setHomeSort: function(sort) {
				this.$store.state.mobileSortSelectorOpen = false;
				this.$store.state.menu.open = false;
				this.$root.$emit('set-home-sort', sort);
			},

			setFacet: function(facet) {
				this.$store.state.menu.open = false;
				this.$root.$emit('set-facet', facet)
			},

			isSettingsPage: function() {
				return /settings/.test(this.$store.state.pageName)
			},

			displaySort: function() {
				return displayDict[this.$store.state.home.sort];
			}
		}
	}
</script>
