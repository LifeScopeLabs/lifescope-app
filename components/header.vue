<template>
    <header v-if="$store.state.user != undefined && ($store.state.mode === 'app' || $store.state.mode === 'home')">
        <nav>
            <nuxt-link id="home"
                       to="/"
            >
                <img class="logo"
                     src="~/assets/images/icons/Logo.svg"
                />
            </nuxt-link>

            <search-bar ref="searchBar"></search-bar>

            <div class="shortcuts">
                <nuxt-link to="/explore">
                    <i class="fal fa-rocket"></i>
                </nuxt-link>
                <nuxt-link to="/providers">
                    <i class="fal glow fa-plug"></i>
                </nuxt-link>
                <nuxt-link to="/settings">
                    <i class="fal fa-cog"></i>
                </nuxt-link>
            </div>

            <div id="menu-button"
                 v-on:click.stop="openMenu"
            >
                <div class="fal fa-bars"></div>
            </div>
        </nav>

        <div v-if="$store.state.mode === 'app'"
             class="controls"
        >
            <div class="views">
                <a data-view="feed"
                   v-bind:class="{ active: $store.state.view === 'feed' }"
                   v-on:click="setView('feed')"
                >
                    <i class="far fa-clone"></i>
                    <span>Feed</span>
                </a>
                <a data-view="map"
                   v-bind:class="{ active: $store.state.view === 'map', disabled: $store.state.facet !== 'events' }"
                   v-on:click="setView('map')"
                >
                    <i class="far fa-map"></i>
                    <span>Map</span>
                </a>
                <a data-view="grid"
                   v-bind:class="{ active: $store.state.view === 'grid' }"
                   v-on:click="setView('grid')"
                >
                    <i class="fal fa-th"></i>
                    <span>Grid</span>
                </a>
                <a data-view="list"
                   v-bind:class="{ active: $store.state.view === 'list' }"
                   v-on:click="setView('list')"
                >
                    <i class="fal fa-list"></i>
                    <span>List</span>
                </a>
                <a data-view="xr"
                   v-bind:class="{ active: $store.state.view === 'xr' }"
                   v-on:click="setView('xr')"
                >
                    <i class="fal glow fa-cubes"></i>
                    <span>XR</span>
                </a>
            </div>

            <div v-if="$store.state.facet === 'events'"
                 class="sort"
            >
                <a data-sort="score"
                   v-bind:class="{ active: $store.state.sortField === 'score' }"
                   v-on:click="setSort('score')"
                >
                    <i v-if="$store.state.sortField === 'score'"
                       class="sort-arrow"
                       v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"
                    ></i>
                    <span>Relevance</span>
                </a>
                <a data-sort="connection_id_string"
                   v-bind:class="{ active: $store.state.sortField === 'connection' }"
                   v-on:click="setSort('connection')"
                >
                    <i v-if="$store.state.sortField === 'connection'"
                       class="sort-arrow"
                       v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"
                    ></i>
                    <span>Connection</span>
                </a>
                <a data-sort="type"
                   v-bind:class="{ active: $store.state.sortField === 'type' }"
                   v-on:click="setSort('type')"
                >
                    <i v-if="$store.state.sortField === 'type'"
                       class="sort-arrow"
                       v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"
                    ></i>
                    <span>Type</span>
                </a>
                <a data-sort="datetime"
                   v-bind:class="{ active: $store.state.sortField === 'datetime' }"
                   v-on:click="setSort('datetime')"
                >
                    <i v-if="$store.state.sortField === 'datetime'"
                       class="sort-arrow"
                       v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"
                    ></i>
                    <span>Time</span>
                </a>
            </div>

            <div v-if="$store.state.facet === 'contacts'"
                 class="sort"
            >
                <a data-sort="score"
                   v-bind:class="{ active: $store.state.sortField === 'score' }"
                   v-on:click="setSort('score')"
                >
                    <i v-if="$store.state.sortField === 'score'"
                       class="sort-arrow"
                       v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"
                    ></i>
                    <span>Relevance</span>
                </a>
                <a data-sort="name"
                   v-bind:class="{ active: $store.state.sortField === 'name' }"
                   v-on:click="setSort('name')"
                >
                    <i v-if="$store.state.sortField === 'name'"
                       class="sort-arrow"
                       v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"
                    ></i>
                    <span>Name</span>
                </a>
                <a data-sort="connection_id_string"
                   v-bind:class="{ active: $store.state.sortField === 'connection' }"
                   v-on:click="setSort('connection')"
                >
                    <i v-if="$store.state.sortField === 'connection'"
                       class="sort-arrow"
                       v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"
                    ></i>
                    <span>Connection</span>
                </a>
                <a data-sort="handle"
                   v-bind:class="{ active: $store.state.sortField === 'handle' }"
                   v-on:click="setSort('handle')"
                >
                    <i v-if="$store.state.sortField === 'handle'"
                       class="sort-arrow"
                       v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"
                    ></i>
                    <span>Handle</span>
                </a>
            </div>

            <div v-if="$store.state.facet === 'content'"
                 class="sort"
            >
                <a data-sort="score"
                   v-bind:class="{ active: $store.state.sortField === 'score' }"
                   v-on:click="setSort('score')"
                >
                    <i v-if="$store.state.sortField === 'score'"
                       class="sort-arrow"
                       v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"
                    ></i>
                    <span>Relevance</span>
                </a>
                <a data-sort="title"
                   v-bind:class="{ active: $store.state.sortField === 'title' }"
                   v-on:click="setSort('title')"
                >
                    <i v-if="$store.state.sortField === 'title'"
                       class="sort-arrow"
                       v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"
                    ></i>
                    <span>Title</span>
                </a>
                <a data-sort="connection_id_string"
                   v-bind:class="{ active: $store.state.sortField === 'connection' }"
                   v-on:click="setSort('connection')"
                >
                    <i v-if="$store.state.sortField === 'connection'"
                       class="sort-arrow"
                       v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"
                    ></i>
                    <span>Connection</span>
                </a>
                <a data-sort="type"
                   v-bind:class="{ active: $store.state.sortField === 'type' }"
                   v-on:click="setSort('type')"
                >
                    <i v-if="$store.state.sortField === 'type'"
                       class="sort-arrow"
                       v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"
                    ></i>
                    <span>Type</span>
                </a>
            </div>

            <div v-if="$store.state.facet === 'people'"
                 class="sort"
            >
                <a data-sort="score"
                   v-bind:class="{ active: $store.state.sortField === 'score' }"
                   v-on:click="setSort('score')"
                >
                    <i v-if="$store.state.sortField === 'score'"
                       class="sort-arrow"
                       v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"
                    ></i>
                    <span>Relevance</span>
                </a>
                <a data-sort="first_name"
                   v-bind:class="{ active: $store.state.sortField === 'first_name' }"
                   v-on:click="setSort('first_name')"
                >
                    <i v-if="$store.state.sortField === 'first_name'"
                       class="sort-arrow"
                       v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"
                    ></i>
                    <span>First</span>
                </a>
                <a data-sort="middle_name"
                   v-bind:class="{ active: $store.state.sortField === 'middle_name' }"
                   v-on:click="setSort('middle_name')"
                >
                    <i v-if="$store.state.sortField === 'middle_name'"
                       class="sort-arrow"
                       v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"
                    ></i>
                    <span>Middle</span>
                </a>
                <a data-sort="last_name"
                   v-bind:class="{ active: $store.state.sortField === 'last_name' }"
                   v-on:click="setSort('last_name')"
                >
                    <i v-if="$store.state.sortField === 'last_name'"
                       class="sort-arrow"
                       v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"
                    ></i>
                    <span>Last</span>
                </a>
            </div>

            <div class="facets">
                <div class="current">
                    <div class="facet-select-toggle"
                         v-on:click="$store.state.facetSelectOpen = !$store.state.facetSelectOpen"
                    >
                        <i v-bind:class="{ 'fal fa-chevron-down' : $store.state.facetSelectOpen === false, 'fal fa-chevron-up' : $store.state.facetSelectOpen === true }"></i>
                        <span v-if="$store.state.facet != null"
                              class="name"
                        >
                            {{ $store.state.facet[0].toUpperCase() + $store.state.facet.slice(1) }}
                        </span>
                    </div>
                    <div class="flex-grow"></div>
                    <span v-if="$store.state.facet === 'events'"
                          class="count"
                    >{{ $store.state.objects.events.length }}</span>
                    <span v-if="$store.state.facet === 'contacts'"
                          class="count"
                    >{{ $store.state.objects.contacts.length }}</span>
                    <span v-if="$store.state.facet === 'content'"
                          class="count"
                    >{{ $store.state.objects.content.length }}</span>
                    <span v-if="$store.state.facet === 'people'"
                          class="count"
                    >{{ $store.state.objects.people.length }}</span>
                </div>
                <div class="container"
                     v-bind:class="{ hidden: $store.state.facetSelectOpen === false }"
                >
                    <div class="drawer">
                        <a v-on:click="setFacet('events')">Events</a>
                        <a v-if="$store.state.view !== 'map'"
                           v-on:click="setFacet('content')"
                        >Content
                        </a>
                        <a v-if="$store.state.view !== 'map'"
                           v-on:click="setFacet('contacts')"
                        >Contacts
                        </a>
                        <a v-if="$store.state.view !== 'map'"
                           v-on:click="setFacet('people')"
                        >People
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="$store.state.show_native_notification === true"
             id="install-notification"
        >
            <div>LifeScope is available as a native app.</div>
            <div id="install-button">Install</div>
        </div>
    </header>

    <header v-else-if="$store.state.mode === 'shared'">
        <nav>
            <nuxt-link id="home"
                       to="/"
            >
                <img class="logo"
                     src="~/assets/images/icons/Logo.svg"
                />
            </nuxt-link>

            <search-bar ref="searchBar"></search-bar>

            <div id="menu-button"
                 v-on:click.stop="openMenu"
            >
                <div class="fal fa-bars"></div>
            </div>
        </nav>

        <div class="controls">
            <div class="views">
                <a data-view="feed"
                   v-bind:class="{ active: $store.state.view === 'feed' }"
                   v-on:click="setView('feed')"
                >
                    <i class="far fa-clone"></i>
                    <span>Feed</span>
                </a>
                <a data-view="map"
                   v-bind:class="{ active: $store.state.view === 'map' }"
                   v-on:click="setView('map')"
                >
                    <i class="fas fa-map"></i>
                    <span>Map</span>
                </a>
                <a data-view="grid"
                   v-bind:class="{ active: $store.state.view === 'grid' }"
                   v-on:click="setView('grid')"
                >
                    <i class="fal fa-th"></i>
                    <span>Grid</span>
                </a>
                <a data-view="list"
                   v-bind:class="{ active: $store.state.view === 'list' }"
                   v-on:click="setView('list')"
                >
                    <i class="fal fa-list"></i>
                    <span>List</span>
                </a>
                <a data-view="xr"
                   v-bind:class="{ active: $store.state.view === 'xr' }"
                   v-on:click="setView('xr')"
                >
                    <i class="fal glow fa-cubes"></i>
                    <span>XR</span>
                </a>
            </div>

            <div v-if="$store.state.facet === 'events'"
                 class="sort"
            >
                <a data-sort="connection_id_string"
                   v-bind:class="{ active: $store.state.sortField === 'connection' }"
                   v-on:click="setSort('connection')"
                >
                    <i v-if="$store.state.sortField === 'connection'"
                       class="sort-arrow"
                       v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"
                    ></i>
                    <span>Connection</span>
                </a>
                <a data-sort="type"
                   v-bind:class="{ active: $store.state.sortField === 'type' }"
                   v-on:click="setSort('type')"
                >
                    <i v-if="$store.state.sortField === 'type'"
                       class="sort-arrow"
                       v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"
                    ></i>
                    <span>Type</span>
                </a>
                <a data-sort="datetime"
                   v-bind:class="{ active: $store.state.sortField === 'datetime' }"
                   v-on:click="setSort('datetime')"
                >
                    <i v-if="$store.state.sortField === 'datetime'"
                       class="sort-arrow"
                       v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"
                    ></i>
                    <span>Time</span>
                </a>
            </div>

            <div v-if="$store.state.facet === 'contacts'"
                 class="sort"
            >
                <a data-sort="name"
                   v-bind:class="{ active: $store.state.sortField === 'name' }"
                   v-on:click="setSort('name')"
                >
                    <i v-if="$store.state.sortField === 'name'"
                       class="sort-arrow"
                       v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"
                    ></i>
                    <span>Name</span>
                </a>
                <a data-sort="connection_id_string"
                   v-bind:class="{ active: $store.state.sortField === 'connection' }"
                   v-on:click="setSort('connection')"
                >
                    <i v-if="$store.state.sortField === 'connection'"
                       class="sort-arrow"
                       v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"
                    ></i>
                    <span>Connection</span>
                </a>
                <a data-sort="handle"
                   v-bind:class="{ active: $store.state.sortField === 'handle' }"
                   v-on:click="setSort('handle')"
                >
                    <i v-if="$store.state.sortField === 'handle'"
                       class="sort-arrow"
                       v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"
                    ></i>
                    <span>Handle</span>
                </a>
            </div>

            <div v-if="$store.state.facet === 'content'"
                 class="sort"
            >
                <a data-sort="title"
                   v-bind:class="{ active: $store.state.sortField === 'title' }"
                   v-on:click="setSort('title')"
                >
                    <i v-if="$store.state.sortField === 'title'"
                       class="sort-arrow"
                       v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"
                    ></i>
                    <span>Title</span>
                </a>
                <a data-sort="connection_id_string"
                   v-bind:class="{ active: $store.state.sortField === 'connection' }"
                   v-on:click="setSort('connection')"
                >
                    <i v-if="$store.state.sortField === 'connection'"
                       class="sort-arrow"
                       v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"
                    ></i>
                    <span>Connection</span>
                </a>
                <a data-sort="type"
                   v-bind:class="{ active: $store.state.sortField === 'type' }"
                   v-on:click="setSort('type')"
                >
                    <i v-if="$store.state.sortField === 'type'"
                       class="sort-arrow"
                       v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"
                    ></i>
                    <span>Type</span>
                </a>
            </div>

            <div v-if="$store.state.facet === 'people'"
                 class="sort"
            >
                <a data-sort="name"
                   v-bind:class="{ active: $store.state.sortField === 'first_name' }"
                   v-on:click="setSort('first_name')"
                >
                    <i v-if="$store.state.sortField === 'first_name'"
                       class="sort-arrow"
                       v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"
                    ></i>
                    <span>First</span>
                </a>
                <a data-sort="middle_name"
                   v-bind:class="{ active: $store.state.sortField === 'middle_name' }"
                   v-on:click="setSort('middle_name')"
                >
                    <i v-if="$store.state.sortField === 'middle_name'"
                       class="sort-arrow"
                       v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"
                    ></i>
                    <span>Middle</span>
                </a>
                <a data-sort="last_name"
                   v-bind:class="{ active: $store.state.sortField === 'last_name' }"
                   v-on:click="setSort('last_name')"
                >
                    <i v-if="$store.state.sortField === 'last_name'"
                       class="sort-arrow"
                       v-bind:class="{ 'fal fa-chevron-up' : $store.state.sortOrder === 'asc', 'fal fa-chevron-down': $store.state.sortOrder === 'desc' }"
                    ></i>
                    <span>Last</span>
                </a>
            </div>

            <div class="facets">
                <div class="current">
                    <div class="facet-select-toggle"
                         v-on:click="$store.state.facetSelectOpen = !$store.state.facetSelectOpen"
                    >
                        <i v-bind:class="{ 'fal fa-chevron-down' : $store.state.facetSelectOpen === false, 'fal fa-chevron-up' : $store.state.facetSelectOpen === true }"></i>
                        <span v-if="$store.state.facet != null"
                              class="name"
                        >
                            {{ $store.state.facet[0].toUpperCase() + $store.state.facet.slice(1) }}
                        </span>
                    </div>
                    <div class="flex-grow"></div>
                    <span v-if="$store.state.facet === 'events'"
                          class="count"
                    >{{ $store.state.objects.events.length }}</span>
                    <span v-if="$store.state.facet === 'contacts'"
                          class="count"
                    >{{ $store.state.objects.contacts.length }}</span>
                    <span v-if="$store.state.facet === 'content'"
                          class="count"
                    >{{ $store.state.objects.content.length }}</span>
                    <span v-if="$store.state.facet === 'people'"
                          class="count"
                    >{{ $store.state.objects.people.length }}</span>
                </div>
                <div class="container"
                     v-bind:class="{ hidden: $store.state.facetSelectOpen === false }"
                >
                    <div class="drawer">
                        <a v-on:click="setFacet('events')">Events</a>
                        <a v-if="$store.state.view !== 'map'"
                           v-on:click="setFacet('content')"
                        >Content
                        </a>
                        <a v-if="$store.state.view !== 'map'"
                           v-on:click="setFacet('contacts')"
                        >Contacts
                        </a>
                        <a v-if="$store.state.view !== 'map'"
                           v-on:click="setFacet('people')"
                        >People
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <header v-else>
        <nav>
            <nuxt-link v-if="$store.state.user != undefined"
                       id="home"
                       to="/"
            >
                <img class="logo"
                     src="~/assets/images/icons/Logo.svg"
                />
            </nuxt-link>

            <nuxt-link v-if="$store.state.user == undefined"
                       id="base"
                       to="/"
            >
                <img class="logo"
                     src="~/assets/images/icons/Logo.svg"
                />
            </nuxt-link>

            <span class="flex-grow"></span>

            <div v-if="$store.state.user != undefined && $store.state.mode === 'provider'"
                 class="flexbox flex-x-center"
            >
                <button id="done"
                        class="primary"
                >
                    Done
                </button>
            </div>

            <div v-if="$store.state.user != undefined"
                 class="shortcuts"
            >
                <nuxt-link to="/explore">
                    <i class="fal fa-rocket"></i>
                </nuxt-link>
                <nuxt-link to="/providers">
                    <i class="fal glow fa-plug"></i>
                </nuxt-link>
                <nuxt-link to="/settings">
                    <i class="fal fa-cog"></i>
                </nuxt-link>
            </div>

            <div v-if="$store.state.user != undefined"
                 id="menu-button"
                 v-on:click.stop="openMenu"
            >
                <div class="fal fa-bars"></div>
            </div>

            <div v-if="$store.state.user == undefined && ($store.state.mode === 'provider' || $store.state.mode === 'login-provider' || $store.state.mode === 'signup-provider' || $store.state.mode === 'auth')"
                 class="flexbox"
            >
                <div class="login flexbox flex-x-center">
                    <div v-if="$store.state.mode === 'signup-provider'">Sign up by Connecting to any of the providers below.</div>
                    <div v-else-if="$store.state.mode === 'login-provider'">Log in by Connecting to any of the providers below.</div>
                    <div v-else>Sign up or Log in by Connecting to any of the providers below.</div>
                    <i class="fal fa-question-circle"
                       v-on:click="showLoginModal"
                    ></i>
                </div>
            </div>

            <span v-if="$store.state.user == undefined"
                  class="flex-grow"
            >
            </span>

            <div v-if="$store.state.mode === 'login-provider' || $store.state.mode === 'signup-provider'">
                <nuxt-link v-if="$store.state.user == undefined && $store.state.mode === 'login-provider'"
                           v-bind:to="{ name: 'login', query: { client: $route.query.client } }"
                >
                    <button class="back">Go back</button>
                </nuxt-link>

                <nuxt-link v-if="$store.state.user == undefined && $store.state.mode === 'signup-provider'"
                           v-bind:to="{ name: 'signup', query: { client: $route.query.client } }"
                >
                    <button class="back">Go back</button>
                </nuxt-link>
            </div>
        </nav>

        <div v-if="$store.state.mode === 'connections' || $store.state.mode === 'account' || $store.state.mode === 'locations' || $store.state.mode === 'people' || $store.state.mode === 'authorized-apps' || $store.state.mode === 'developer'"
             class="mobile-selector"
             v-on:click="$store.state.settingsSelectorOpen = !$store.state.settingsSelectorOpen"
        >
            <span class="placeholder-text">{{ $store.state.mode[0].toUpperCase() + $store.state.mode.slice(1) }}</span>
            <i v-bind:class="{ 'fal fa-caret-down': $store.state.settingsSelectorOpen === false, 'fal fa-caret-up': $store.state.settingsSelectorOpen === true }"></i>
        </div>

        <transition name="mobile-type-selector">
            <aside v-if="$store.state.settingsSelectorOpen === true && ($store.state.mode === 'connections' || $store.state.mode === 'account' || $store.state.mode === 'locations' || $store.state.mode === 'people' || $store.state.mode === 'authorized-apps' || $store.state.mode === 'developer')"
                   class="mobile-type-selector open"
            >
                <div class="scroller">
                    <div id="pages">
                        <nuxt-link to="/settings/account">Account</nuxt-link>
                        <nuxt-link to="/settings/people">People</nuxt-link>
                        <nuxt-link to="/settings/locations">Locations</nuxt-link>
                        <nuxt-link to="/settings/connections">Connections</nuxt-link>
                        <nuxt-link to="/settings/authorized-apps">Authorized Apps</nuxt-link>
                        <nuxt-link to="/settings/developer">Developer</nuxt-link>
                    </div>
                </div>
            </aside>
        </transition>
    </header>
</template>

<script>
    /* global $ */
	import { createBrowserHistory as History } from 'history';
	import qs from 'qs';


	import SearchBar from './search.vue';
	import loginHelpModal from '../components/modals/login-help.vue';

	let history;

	if (process.browser) {
		history = History();
	}

	export default {
		components: {
			SearchBar: SearchBar
		},

		mounted: async function() {
			let deferredPrompt;
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

			window.addEventListener('beforeinstallprompt', function(e) {
				e.preventDefault();

				deferredPrompt = e;

				self.$store.state.show_native_notification = true;
			});

			$(document).on('click', '#install-button', function() {
				self.$store.state.show_native_notification = false;

				deferredPrompt.prompt();

				deferredPrompt.userChoice
					.then(function() {
						deferredPrompt = null;
					});
			});
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
				if (view === 'map' && this.$store.state.facet !== 'events') {
					return;
				}

				if (this.$store.state.view === 'map') {
					this.$store.state.visibleObjectStartIndex = 0;

					for (let i = 200; i < this.$store.state.objects.events.length; i++) {
						this.$store.state.objects.events[i].invisible = true;
                    }
                }

				this.$store.state.view = view;

				if (view === 'map' && this.$store.state.objects.events.length < this.$store.state.mapPageSize) {
					this.$root.$emit('perform-search', false);
				}

				this.$nextTick(function() {
                    $('main').scrollTop(0);
				});

				if (process.browser) {
					let params = qs.parse(history.location.search, {
						ignoreQueryPrefix: true
					});

					params.view = this.$store.state.view;
					params.facet = this.$store.state.facet;

					history.push({
						pathname: window.location.pathname,
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
				this.$store.state.visibleObjectStartIndex = 0;

				switch (facet) {
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

						break;

					case 'people':
						this.$store.state.sortField = 'first_name';
						this.$store.state.sortOrder = 'asc';

						break;
				}

				if (process.browser) {
					let params = qs.parse(history.location.search, {
						ignoreQueryPrefix: true
					});

					params.view = this.$store.state.view;
					params.facet = this.$store.state.facet;

					history.push({
						pathname: window.location.pathname,
						search: qs.stringify(params, {
							addQueryPrefix: true
						})
					});
				}

				this.$root.$emit('perform-search', true);
			}
		},
	}
</script>
