<template>
  <main>
    <div class="scroller">
      <div id="provider-grid">
        <div v-if="$store.getters.authenticated" v-model="providerHydratedMany" v-for="provider in providerHydratedMany"
             v-on:click="showConnectionModal(provider)" v-bind:key="provider.id"
             v-bind:class="[{associated: provider.assoc_count > 0}, provider.tags, {'coming-soon': provider.coming_soon === true}]" class="mix"
             v-bind:data-id="provider.id" v-bind:data-assoc-count="provider.assoc_count">
          <div class="box-content">
            <span v-if="provider.assoc_count > 1">{{ provider.assoc_count }}</span>
            <h1><i v-bind:class="getProviderIcon(provider)"></i></h1>
            <p>{{ provider.name }}</p>
          </div>
          <div v-if="provider.coming_soon === true" class="coming-soon-text">Coming Soon</div>
        </div>
        <div v-if="$store.getters.authenticated !== true" v-model="providerWithMapMany"
             v-for="provider in loginMaps" v-on:click="showConnectionModal(provider)"
             v-bind:key="provider.id" v-bind:class="[provider.tags, {'coming-soon': provider.coming_soon === true}]" class="mix" v-bind:data-id="provider.id">
          <div class="box-content">
            <h1><i v-bind:class="getProviderIcon(provider)"></i></h1>
            <p>{{ provider.name }}</p>
          </div>
          <div v-if="provider.coming_soon === true" class="coming-soon-text">Coming Soon</div>
        </div>
      </div>
    </div>

    <modals-container/>
  </main>
</template>

<script>
  import _ from 'lodash';
  import connectionCreateModal from '../../components/modals/connection-create';
  import icons from '../../lib/util/icons';
  import loginHelpModal from '../../components/modals/login-help';
  import providerHydratedMany from '../../apollo/queries/provider-hydrated-many.gql';
  import providerWithMapMany from '../../apollo/queries/provider-with-map-many.gql';

  export default {
    data: function() {
      return {
        providerHydratedMany: [],
        providerWithMapMany: []
      }
    },

    computed: {
      loginMaps: function() {
        return _.filter(this.$data.providerWithMapMany, function(map) {
          return map.login === true;
        });
      }
    },

    methods: {
      getProviderIcon: function(provider) {
        return icons('provider', provider.name);
      },

      connectionLink: function(id) {
        return 'https://app.lifescope.io/settings/connections?provider=' + id;
      },

      getPlaceholder: function(provider) {
        return 'My ' + provider.name + 'Account';
      },

      showLoginHelpModal: function() {
        this.$modal.show(loginHelpModal);
      },

      showConnectionModal: function(provider) {
        if (provider.coming_soon !== true) {
          this.$modal.show(connectionCreateModal, {
            provider: provider
          }, {
            height: 'auto',
            scrollable: true
          });
        }
      }
    },

    beforeMount: async function() {
      if (this.$store.getters.authenticated === true) {
        let providerHydratedResult = await this.$apollo.query({
          query: providerHydratedMany
        });

        this.$data.providerHydratedMany = providerHydratedResult.data.providerHydratedMany;
      }

      let providerWithMapResult = await this.$apollo.query({
        query: providerWithMapMany,
      });

      this.$data.providerWithMapMany = providerWithMapResult.data.providerWithMapMany;
    },

    mounted: async function() {
      let mixitup = require('mixitup');

      this.$store.mixer = mixitup('#provider-grid', {});
    },

    updated() {
      this.$nextTick(function() {
        this.$store.mixer.forceRefresh();
      });
    }
  }
</script>
