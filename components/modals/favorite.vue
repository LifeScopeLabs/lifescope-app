<template>
  <div id="favorite">
    <div class="content padded">
      <div class="flexbox flex-end">
        <i class="close-button fas fa-times-circle" v-on:click="$emit('close')"></i>
      </div>
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
  import searchDelete from '../../apollo/mutations/search-delete.gql';
  import searchPatch from '../../apollo/mutations/search-patch.gql';

  import ColorPicker from '../color-picker';
  import IconPicker from '../icon-picker';

  const HEX_COLOR_PATTERN = '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$';

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
        this.$store.state.tempSearch.favorited = false;

        await this.$apollo.mutate({
          mutation: searchPatch,
          variables: {
            id: this.$store.state.tempSearch.id,
            favorited: false
          }
        });

        this.$store.state.currentSearch = this.$store.state.tempSearch;

        if (this.$store.state.searchMany && this.$store.state.searchMany.length > 0) {
          let self = this;

          let copy = _.cloneDeep(this.$store.state.searchMany);

          let match = _.find(copy, function(item) {
            return item.id === self.$store.state.currentSearch.id;
          });

          match.favorited = false;

          this.$store.state.searchMany = copy;
        }

        this.$emit('close');
      },

      deleteSearch: async function() {
        await this.$apollo.mutate({
          mutation: searchDelete,
          variables: {
            id: this.$store.state.tempSearch.id
          }
        });

        if (this.$store.state.searchMany && this.$store.state.searchMany.length > 0) {
          let self = this;

          let copy = _.cloneDeep(this.$store.state.searchMany);

          _.remove(copy, function(item) {
            return item.id === self.$store.state.currentSearch.id
          });

          this.$store.state.searchMany = copy;
        }

        if (this.$store.state.searchCount && this.$store.state.searchCount > 0) {
          this.$store.state.searchCount -= 1;
        }

        this.$store.state.currentSearch = {};

        this.$emit('close');
      },

      saveSearch: async function() {
        await this.$apollo.mutate({
          mutation: searchPatch,
          variables: {
            id: this.$store.state.tempSearch.id,
            favorited: true,
            icon_color: this.$store.state.tempSearch.icon_color.match(HEX_COLOR_PATTERN) ? this.$store.state.tempSearch.icon_color : this.$store.state.currentSearch.icon_color,
            icon: this.$store.state.tempSearch.icon,
            name: this.$store.state.tempSearch.name
          }
        });

        this.$store.state.tempSearch.favorited = true;

        this.$store.state.currentSearch = this.$store.state.tempSearch;

        if (this.$store.state.searchMany && this.$store.state.searchMany.length > 0) {
          let self = this;

          let copy = _.cloneDeep(this.$store.state.searchMany);

          let match = _.find(copy, function(item) {
            return item.id === self.$store.state.currentSearch.id;
          });

          _.assign(match, this.$store.state.currentSearch);

          this.$store.state.searchMany = copy;
        }

        this.$emit('close');
      }
    }
  }
</script>
