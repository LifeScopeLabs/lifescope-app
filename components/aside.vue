<template slot="aside">
    <aside v-if="$store.state.pageName === 'providers'"
           class="filters"
           data-intro-selector="provider-filters"
    >
        <div class="scroller">
            <div id="filters">
                <div v-bind:class="{ active: activeFilter === 'all' }"
                     class="filter"
                     data-filter="all"
                     v-on:click="setActiveFilter('all')"
                >
                    All
                </div>
                <div v-bind:class="{ active: activeFilter === 'collaboration' }"
                     class="filter"
                     data-filter=".collaboration"
                     v-on:click="setActiveFilter('collaboration')"
                >
                    Collaboration
                </div>
                <div v-bind:class="{ active: activeFilter === 'development' }"
                     class="filter"
                     data-filter=".development"
                     v-on:click="setActiveFilter('development')"
                >
                    Development
                </div>
                <div v-bind:class="{ active: activeFilter === 'finance' }"
                     class="filter"
                     data-filter=".finance"
                     v-on:click="setActiveFilter('finance')"
                >
                    Finance
                </div>
                <div v-bind:class="{ active: activeFilter === 'fitness' }"
                     class="filter"
                     data-filter=".fitness"
                     v-on:click="setActiveFilter('fitness')"
                >
                    Fitness
                </div>
                <div v-bind:class="{ active: activeFilter === 'gaming' }"
                     class="filter"
                     data-filter=".gaming"
                     v-on:click="setActiveFilter('gaming')"
                >
                    Gaming
                </div>
                <div v-bind:class="{ active: activeFilter === 'health' }"
                     class="filter"
                     data-filter=".health"
                     v-on:click="setActiveFilter('health')"
                >
                    Health
                </div>
                <div v-bind:class="{ active: activeFilter === 'media' }"
                     class="filter"
                     data-filter=".media"
                     v-on:click="setActiveFilter('media')"
                >
                    Media
                </div>
                <div v-bind:class="{ active: activeFilter === 'music' }"
                     class="filter"
                     data-filter=".music"
                     v-on:click="setActiveFilter('music')"
                >
                    Music
                </div>
                <div v-bind:class="{ active: activeFilter === 'productivity' }"
                     class="filter"
                     data-filter=".productivity"
                     v-on:click="setActiveFilter('productivity')"
                >
                    Productivity
                </div>
                <div v-bind:class="{ active: activeFilter === 'social' }"
                     class="filter"
                     data-filter=".social"
                     v-on:click="setActiveFilter('social')"
                >
                    Social
                </div>
                <div v-bind:class="{ active: activeFilter === 'transportation' }"
                     class="filter"
                     data-filter=".transportation"
                     v-on:click="setActiveFilter('transportation')"
                >
                    Transportation
                </div>
                <div v-bind:class="{ active: activeFilter === 'video' }"
                     class="filter"
                     data-filter=".video"
                     v-on:click="setActiveFilter('video')"
                >
                    Video
                </div>
            </div>
        </div>

        <div v-if="$store.state.pageName === 'providers'"
             class="mobile-selector"
             v-on:click="$data.settingsSelectorOpen = !$data.settingsSelectorOpen"
        >
            <span class="placeholder-text">{{ $data.activeFilter[0].toUpperCase() + $data.activeFilter.slice(1) }}</span>
            <i v-bind:class="{ 'fal fa-caret-down': $data.settingsSelectorOpen === false, 'fal fa-caret-up': $data.settingsSelectorOpen === true }"></i>
        </div>

        <aside v-if="$store.state.pageName === 'providers'"
               class="mobile-type-selector"
               v-bind:class="{ open: $data.settingsSelectorOpen === true }"
        >
            <div class="scroller">
                <div id="filters">
                    <div v-bind:class="{ active: activeFilter === 'all' }"
                         class="filter"
                         data-filter="all"
                         v-on:click="setActiveFilter('all')"
                    >
                        All
                    </div>
                    <div v-bind:class="{ active: activeFilter === 'collaboration' }"
                         class="filter"
                         data-filter=".collaboration"
                         v-on:click="setActiveFilter('collaboration')"
                    >
                        Collaboration
                    </div>
                    <div v-bind:class="{ active: activeFilter === 'development' }"
                         class="filter"
                         data-filter=".development"
                         v-on:click="setActiveFilter('development')"
                    >
                        Development
                    </div>
                    <div v-bind:class="{ active: activeFilter === 'finance' }"
                         class="filter"
                         data-filter=".finance"
                         v-on:click="setActiveFilter('finance')"
                    >
                        Finance
                    </div>
                    <div v-bind:class="{ active: activeFilter === 'fitness' }"
                         class="filter"
                         data-filter=".fitness"
                         v-on:click="setActiveFilter('fitness')"
                    >
                        Fitness
                    </div>
                    <div v-bind:class="{ active: activeFilter === 'gaming' }"
                         class="filter"
                         data-filter=".gaming"
                         v-on:click="setActiveFilter('gaming')"
                    >
                        Gaming
                    </div>
                    <div v-bind:class="{ active: activeFilter === 'health' }"
                         class="filter"
                         data-filter=".health"
                         v-on:click="setActiveFilter('health')"
                    >
                        Health
                    </div>
                    <div v-bind:class="{ active: activeFilter === 'media' }"
                         class="filter"
                         data-filter=".media"
                         v-on:click="setActiveFilter('media')"
                    >
                        Media
                    </div>
                    <div v-bind:class="{ active: activeFilter === 'music' }"
                         class="filter"
                         data-filter=".music"
                         v-on:click="setActiveFilter('music')"
                    >
                        Music
                    </div>
                    <div v-bind:class="{ active: activeFilter === 'productivity' }"
                         class="filter"
                         data-filter=".productivity"
                         v-on:click="setActiveFilter('productivity')"
                    >
                        Productivity
                    </div>
                    <div v-bind:class="{ active: activeFilter === 'social' }"
                         class="filter"
                         data-filter=".social"
                         v-on:click="setActiveFilter('social')"
                    >
                        Social
                    </div>
                    <div v-bind:class="{ active: activeFilter === 'transportation' }"
                         class="filter"
                         data-filter=".transportation"
                         v-on:click="setActiveFilter('transportation')"
                    >
                        Transportation
                    </div>
                    <div v-bind:class="{ active: activeFilter === 'video' }"
                         class="filter"
                         data-filter=".video"
                         v-on:click="setActiveFilter('video')"
                    >
                        Video
                    </div>
                </div>
            </div>
        </aside>
    </aside>
</template>

<script>
	export default {
		data: function() {
			return {
				activeFilter: 'all',
				settingsSelectorOpen: false
			}
		},
		methods: {
			setActiveFilter: function(filter) {
				this.$data.activeFilter = filter;
			}
		}
	}
</script>
