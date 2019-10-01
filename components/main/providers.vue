<template>
    <transition appear
                name="page-load"
    >
        <main data-intro-selector="provider-grid">
            <div class="scroller">
                <div v-if="$store.getters.authenticated === true"
                     id="provider-grid"
                >
                    <div v-for="provider in providerHydratedMany"
                         v-bind:key="provider.id"
                         v-bind:class="[{associated: provider.assoc_count > 0}, provider.tags]"
                         class="mix"
                         v-bind:data-id="provider.id"
                         v-bind:data-assoc-count="provider.assoc_count"
                         v-on:click="showConnectionModal(provider)"
                    >
                        <div class="box-content">
                            <span v-if="provider.assoc_count > 1">{{ provider.assoc_count }}</span>
                            <h1>
                                <i v-bind:class="getProviderIcon(provider)"></i>
                            </h1>
                            <p>{{ provider.name }}</p>
                        </div>
                    </div>
                </div>
                <div v-else-if="$store.getters.authenticated !== true"
                     id="provider-grid"
                >
                    <div v-for="provider in loginMaps"
                         v-bind:key="provider.id"
                         class="mix"
                         v-bind:class="[provider.tags]"
                         v-bind:data-id="provider.id"
                         v-on:click="showConnectionModal(provider)"
                    >
                        <div class="box-content">
                            <h1>
                                <i v-bind:class="getProviderIcon(provider)"></i>
                            </h1>
                            <p>{{ provider.name }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <modals-container />
        </main>
    </transition>
</template>

<script>
	import _ from 'lodash';
	import connectionCreateModal from '../../components/modals/connection-create.vue';
	import icons from '../../lib/util/icons';
	import loginHelpModal from '../../components/modals/login-help.vue';
	import providerHydratedMany from '../../apollo/queries/provider-hydrated-many.gql';
	import providerWithMapMany from '../../apollo/queries/provider-with-map-many.gql';
	import userTutorialComplete from '../../apollo/mutations/user-tutorial-complete.gql';

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


		beforeMount: async function() {
			if (this.$store.getters.authenticated === true) {
				let providerHydratedResult = await this.$apollo.query({
					query: providerHydratedMany,
					fetchPolicy: 'no-cache'
				});

				this.$data.providerHydratedMany = providerHydratedResult.data.providerHydratedMany;
			}

			let providerWithMapResult = await this.$apollo.query({
				query: providerWithMapMany,
				fetchPolicy: 'no-cache',
			});

			this.$data.providerWithMapMany = providerWithMapResult.data.providerWithMapMany;
		},

		mounted: async function() {
			let self = this;

			let mixitup = require('mixitup');

			this.$store.mixer = mixitup('#provider-grid', {});

			this.$router.onReady(function() {
				let query = self.$route.query;

				if (query.client && query.client === 'app' && self.$store.getters.authenticated !== true) {
					document.addEventListener('visibilitychange', function() {
						if (document.visibilityState === 'visible') {
							window.location.reload();
						}
					});
				}
			});

			if (self.$store.state.user && _.get(self.$store.state.user, 'tutorials.connections') !== true) {
				self.$intro()
                    .setOptions({
                        steps: [
                            {
                                intro: 'Welcome to LifeScope! In just a few clicks you can have a wealth of data ready to be searched, curated, and shared, regardless of where that data originated.'
                            },
                            {
                                intro: 'This is the Providers page, where you can make Connections to your accounts. Providers are sources of data such as Facebook, Spotify, Google, or reddit. Connections are individual accounts of yours that you give LifeScope permission to access, and you choose what data LifeScope can retrieve.'
                            },
                            {
                                intro: 'You can filter Providers by their types here.',
                                element: document.querySelector('[data-intro-selector="provider-filters"')
                            },
                            {
                                intro: 'You can click any of the Providers here to find out how to make a Connection to it. In many cases, this will involve authorizing LifeScope to have access to your data. LifeScope will NEVER have access to your login credentials for your accounts.',
                                element: document.querySelector('[data-intro-selector="provider-grid"')
                            },
                            {
                                intro: 'Providers highlighted in blue are ones you already have a Connection to. You can make multiple Connections to the same provider, e.g. you can connect a personal and work Google account. To do so, you must log out of one account, then log in to the other account during the Connection process.'
                            }
                        ]
                    })
					.start()
					.onskip(async function() {
						let response = await self.$apollo.mutate({
							mutation: userTutorialComplete,
							variables: {
								tutorial: 'connections'
							}
						});

						self.$store.state.user.tutorials = response.data.userTutorialComplete.tutorials;
					})
					.oncomplete(async function() {
						let response = await self.$apollo.mutate({
							mutation: userTutorialComplete,
							variables: {
								tutorial: 'connections'
							}
						});

						self.$store.state.user.tutorials = response.data.userTutorialComplete.tutorials;
					});
			}
		},

		updated() {
			this.$nextTick(function() {
				this.$store.mixer.forceRefresh();
			});
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
				this.$modal.show(connectionCreateModal, {
					provider: provider
				}, {
					height: 'auto',
					scrollable: true
				});
			}
		},
	}
</script>
