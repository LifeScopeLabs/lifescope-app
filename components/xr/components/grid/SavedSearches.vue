<template>
    <a-entity id="xr-saved-searches">
        <a-entity
            :text-cell="'text: Saved Searches; width: 1; height: ' + lineSep + '; fontsize: 3;'"
            clickable="clickevent: togglesavedsearch;"
            class="clickable"
            :geometry="'primitive: plane; width: 1; height: ' + lineSep + ';'"
            :material="'color: ' + headerBackgroundColor + '; side: double;'"
            highlight="type: text; color: 0xFFFFFF;">
        </a-entity>

        <a-entity v-if="displaySearches">
            <a-flex-container
                class="xr-search-favorites"
                width=1
                :height="lineSep*11"
                flex-direction="column"
                :position="'0 ' + (-lineSep*13/2) + '0'"
                >
                <a-entity v-for="(search, index) in currentFavorites" v-bind:key="'search-label-' + index"
                    :id="'search-' + search.id"
                    clickable="clickevent: changesearch;"
                    class="clickable"
                    :text-cell="'text: ' + search.name + '; width: 1; height: ' + lineSep + '; fontsize: 3; ' +
                        'nobr: true;'"
                    :geometry="'primitive: plane; width: 1; height: ' + lineSep + ';'"
                    :material="'color: ' + backgroundColor + '; side: double;'"
                    highlight="type: text; color: 0xFFFFFF;"
                    flex-item="dimtype: attr; dimattr: text-cell;" >
                </a-entity>
                <a-flex-container
                    width=1
                    :height="lineSep"
                    flex-direction="row"
                    :position="'0 ' + (-lineSep*13/2) + '0'"
                    >
                    <a-entity
                        class="clickable"
                        clickable="clickevent: pageleft-favorites;"
                        :text-cell="'text: <; width: 0.33; height: ' + lineSep +
                            '; fontsize: 3; ' + 'nobr: true;'"
                        :geometry="'primitive: plane; width: 0.33; height: ' + lineSep + ';'"
                        :material="'color: ' + backgroundColor + '; side: double;'"
                        flex-item="dimtype: attr; dimattr: text-cell;"
                        :highlight="'type: text; color: 0xFFFFFF; disabled: ' + (page == 0)"
                        >
                    </a-entity>
                    <a-entity
                        :text-cell="'text: ' + paginatorText + '; width: 0.34; height: ' + lineSep +
                            '; fontsize: 3; ' + 'nobr: true;'"
                        :geometry="'primitive: plane; width: 0.34; height: ' + lineSep + ';'"
                        :material="'color: ' + backgroundColor + '; side: double;'"
                        flex-item="dimtype: attr; dimattr: text-cell;">
                    </a-entity>
                    <a-entity
                        class="clickable"
                        clickable="clickevent: pageright-favorites;"
                        :text-cell="'text: >; width: 0.33; height: ' + lineSep +
                            '; fontsize: 3; ' + 'nobr: true;'"
                        :geometry="'primitive: plane; width: 0.33; height: ' + lineSep + ';'"
                        :material="'color: ' + backgroundColor + '; side: double;'"
                        flex-item="dimtype: attr; dimattr: text-cell;"
                        :highlight="'type: text; color: 0xFFFFFF; disabled: ' + (!canPageRight)"
                        >
                    </a-entity>
                </a-flex-container>
            </a-flex-container>
        </a-entity>
    </a-entity>
</template>

<script>
import { mapState } from 'vuex';

import searchMany from '../../../../apollo/queries/search-many.gql';


export default {

    components: {
    },

    data () {
        return {
            favorites: [],
            opacity: 0.7,
            width: 0.1,
            lineSep: .1,
            textScale: 4,
            backgroundColor: '#22252a',
            headerBackgroundColor: '#29434E',
            displaySearches: false,
            page: 0,
            itemsPerPage: 10,
        }
    },

    computed: {
        ...mapState(
            [
                'facet',
            ]
        ),

        currentFavorites() {
            return this.favorites.slice(this.page * this.itemsPerPage,
                    (this.page+1) * this.itemsPerPage);
        },

        numberOfFavorites() {
            return this.favorites.length;
        },

        paginatorText() {
            var numberOfPages = Math.ceil(this.numberOfFavorites / this.itemsPerPage);
            return (this.page+1) + '/' + numberOfPages;
        },

        canPageRight() {
            if (this.itemsPerPage >= this.numberOfFavorites) {
                return false;
            }
            var result = (this.page+1)*this.itemsPerPage <= this.numberOfFavorites;
            return result;
        },
    },

    watch: {
        currentFavorites: function (newVal, oldVal) {
            var flexContainer = document.querySelector('.xr-search-favorites');
            if (!!flexContainer) {
                var scene = AFRAME.scenes[0];
                var behavior = {
                    el: scene,
                    get tick() {
                        return function() {
                            console.log('flex behavior')
                            flexContainer.setAttribute('flex-container', {'needsupdate': true});
                            scene.removeBehavior(this);
                        }
                    }
                }
                scene.addBehavior(behavior);
            }
        },
    },

    mounted() {
        this.fetchFavoriteSearches();

        this.$el.addEventListener('togglesavedsearch', this.toggleSavedSearch);
        this.$el.addEventListener('changesearch', this.changeSearch);
        this.$el.addEventListener('pageleft-favorites', this.pageLeft);
        this.$el.addEventListener('pageright-favorites', this.pageRight);
    },

    beforeDestroy() {
        this.$el.removeEventListener('togglesavedsearch', this.toggleSavedSearch);
        this.$el.removeEventListener('changesearch', this.changeSearch);
        this.$el.removeEventListener('pageleft-favorites', this.pageLeft);
        this.$el.removeEventListener('pageright-favorites', this.pageRight);
    },

    methods: {
        fetchFavoriteSearches: async function() {
            let result = await this.$apollo.query({
						query: searchMany,
						fetchPolicy: 'no-cache'
                    });
            var searches = result.data.searchMany;
            this.favorites = searches.filter( search => {return search.favorited;} );
        },

        toggleSavedSearch() {
            this.displaySearches = !this.displaySearches;
        },

        changeSearch(evt) {
            var searchid = evt.originalTarget.id.match(/(search-)(.+)$/)[2]
            this.$router.push({
                path: 'explore',
                query: {
                    view: 'xr',
                    facet: this.facet,
                    qid: searchid
                }
            });
        },

        constructLink: function(search) {
            return '/explore?qid=' + search.id;
        },

        pageLeft() {
            if (this.page > 0) {
                this.page -= 1;
            }
        },

        pageRight() {
            if (this.canPageRight) {
                this.page += 1;
            }
        },

    }
}
</script>