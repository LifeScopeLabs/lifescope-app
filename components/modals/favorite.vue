<template>
  <div id="favorite">
    <div class="content padded">
      <h3 class="align-center">Favorite Your Search</h3>

      <div class="data">
        <i v-bind:class="$store.state.tempSearch.icon" v-bind:style="{'color': $store.state.tempSearch.icon_color}"></i>
        <div class="text-box flex-grow">
          <input type="text" name="search-name" v-model="$store.state.tempSearch.name" placeholder="Name the current search" />
        </div>
      </div>

      <div class="selectors">
        <div class="label">Icon</div>
        <icon-picker></icon-picker>
        <div class="label">Color</div>
        <color-picker></color-picker>
      </div>

      <div class="buttons">
        <div>
          <button v-if="$store.state.tempSearch.id != null" class="danger" v-on:click="deleteSearch">
            <span>Delete</span>
          </button>

          <button v-if="$store.state.tempSearch.favorited === true" v-on:click="unfavorite">
            <span>Unfavorite</span>
          </button>
        </div>

        <div>
          <button v-on:click="$emit('close')">
            <span>Cancel</span>
          </button>
          <button v-on:click="saveSearch">
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import searchPatch from '../../apollo/mutations/search-patch.gql';

  import ColorPicker from '../color-picker';
  import IconPicker from '../icon-picker';

  export default {
    data: function() {
      return {};
    },
    components: {
      IconPicker,
      ColorPicker
    },
    methods: {
      unfavorite: async function() {
        console.log('Unfavoriting search');

        this.$store.state.tempSearch.favorited = false;

        await this.$apollo.mutate({
          mutation: searchPatch,
          variables: {
            id: this.$store.state.tempSearch.id,
            favorited: false
          }
        });

        this.$store.state.currentSearch = this.$store.state.tempSearch;

        this.$emit('close');
      },

      deleteSearch: async function() {
        console.log('Deleting search');

        await this.$apollo.mutate({
          mutation: searchDelete,
          variables: {
            id: this.$store.state.tempSearch.id
          }
        });

        this.$store.state.currentSearch = {};

        this.$emit('close');
      },

      saveSearch: async function() {
        console.log('Saving search');

        await this.$apollo.mutate({
          mutation: searchPatch,
          variables: {
            id: this.$store.state.tempSearch.id,
            icon_color: this.$store.state.tempSearch.icon_color,
            icon: this.$store.state.tempSearch.icon,
            name: this.$store.state.tempSearch.name
          }
        });

        this.$store.state.currentSearch = this.$store.state.tempSearch;

        this.$emit('close');
      }
    }
  }
</script>
