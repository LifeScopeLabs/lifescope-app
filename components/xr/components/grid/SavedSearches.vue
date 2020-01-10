<template>
    <a-entity id="xr-saved-searches">
        <a-entity
            :text-cell="'text: Saved Searches; width: 1; height: ' + lineSep + '; fontsize: 3;'"
            clickable="clickevent: togglesavedsearch;"
            class="clickable"
            :geometry="'primitive: plane; width: 1; height: ' + lineSep + ';'"
            :material="'color: ' + headerBackgroundColor + '; side: double;'" >
        </a-entity>

        <a-entity v-if="displaySearches">
            <a-entity v-for="(search, index) in favorites" v-bind:key="'search-label-' + index"
                :id="'search-' + search.id"
                clickable="clickevent: changesearch;"
                class="clickable"
                :position="'0 ' + (-lineSep*(index+1)) + ' 0'"
                :text-cell="'text: ' + search.name + '; width: 1; height: ' + lineSep + '; fontsize: 3; ' +
                    'nobr: true;'"
                :geometry="'primitive: plane; width: 1; height: ' + lineSep + ';'"
                :material="'color: ' + backgroundColor + '; side: double;'">
            </a-entity>
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
        }
    },

    computed: {
        ...mapState(
            [
                'facet',
            ]
        ),
    },

    watch: {
    },

    mounted() {
        this.fetchFavoriteSearches();

        this.$el.addEventListener('togglesavedsearch', this.toggleSavedSearch);
        this.$el.addEventListener('changesearch', this.changeSearch);
    },

    beforeDestroy() {
        this.$el.removeEventListener('togglesavedsearch', this.toggleSavedSearch);
        this.$el.removeEventListener('changesearch', this.changeSearch);
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

    }
}
</script>