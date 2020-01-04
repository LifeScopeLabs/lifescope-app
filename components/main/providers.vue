<template>
    <transition appear
                name="page-load"
    >
        <main>
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
	import accountAlreadyConnectedErrorModal from '../../components/modals/account-already-connected-error.vue';
	import connectionCreateModal from '../../components/modals/connection-create.vue';
	import icons from '../../lib/util/icons';
	import loginHelpModal from '../../components/modals/login-help.vue';
	import nonMatchingAccountsErrorModal from '../../components/modals/non-matching-accounts-error.vue';
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
							window.location.href = '/?client=app';
						}
					});
				}
			});

			if (self.$store.state.user && _.get(self.$store.state.user, 'tutorials.connections') !== true) {
                self.$nextTick(function() {
					let tour = self.$shepherd({
						useModalOverlay: true,
						defaultStepOptions: {
							arrow: false,
							cancelIcon: {
								enabled: true,
								label: 'Cancel'
							}
						}
					});

					tour.addSteps([
						{
							title: 'Connections',
							text: 'This is the Connections page, where you can link to your accounts and import data. Add sources of data (Providers) such as Facebook, Spotify, Google, or reddit. Connections are individual accounts that you give LifeScope permission to access, and you choose what data LifeScope can index.',
							buttons: [
								{
									action: function() {
										return tour.cancel();
									},
									text: 'Cancel'
								},
								{
									action: function() {
										return tour.next();
									},
									text: 'Next'
								}
							]
						},
						{
							title: 'Provider Filters',
							text: 'Filter the Provider list by category here.',
							attachTo: {
								element: 'aside.filters',
								on: 'bottom'
							},
							buttons: [
								{
									action: function() {
										return tour.cancel();
									},
									text: 'Cancel'
								},
								{
									action: function() {
										return tour.back();
									},
									text: 'Previous'
								},
								{
									action: function() {
										return tour.next();
									},
									text: 'Next'
								}
							],
							tetherOptions: {
								attachment: 'top center',
								targetAttachment: 'bottom center',
								targetOffset: '220px 0'
							}
						},
						{
							title: 'Create a Connection',
							text: 'Click any of the Providers here to find out how to make a Connection to it. In many cases, this will involve authorizing LifeScope to have access to your data. LifeScope will NEVER have access to your login credentials for your accounts.',
							attachTo: {
								element: '#provider-grid',
								on: 'bottom'
							},
							buttons: [
								{
									action: function() {
										return tour.cancel();
									},
									text: 'Cancel'
								},
								{
									action: function() {
										return tour.back();
									},
									text: 'Previous'
								},
								{
									action: function() {
										return tour.next();
									},
									text: 'Next'
								}
							],
							tetherOptions: {
								attachment: 'top center',
								targetAttachment: 'bottom center',
								targetOffset: '20px 0'
							}
						},
						{
							title: 'Multiple Connections to a Provider',
							text: 'A Provider will highlight blue when a Connection is made to it. You can make multiple Connections to the same Provider, e.g. you can connect a personal and work Google account. To do so, you must log out of one account, then log in to the other account during the Connection process.',
							buttons: [
								{
									action: function() {
										return tour.cancel();
									},
									text: 'Cancel'
								},
								{
									action: function() {
										return tour.back();
									},
									text: 'Previous'
								},
								{
									action: function() {
										return tour.complete();
									},
									text: 'Done'
								}
							]
						}
					]);

					tour.start();

					tour.on('cancel', async function() {
						let response = await self.$apollo.mutate({
							mutation: userTutorialComplete,
							variables: {
								tutorial: 'connections'
							}
						});

						self.$store.state.user.tutorials = response.data.userTutorialComplete.tutorials;
					});

					tour.on('complete', async function() {
						let response = await self.$apollo.mutate({
							mutation: userTutorialComplete,
							variables: {
								tutorial: 'connections'
							}
						});

						self.$store.state.user.tutorials = response.data.userTutorialComplete.tutorials;
					});
				});
			}

			if (_.has(self.$store.state.cookies, 'account_already_connected')) {
				self.showAccountAlreadyConnectedErrorModal(self.$store.state.cookies.account_already_connected);
            }

			if (_.has(self.$store.state.cookies, 'non_matching_accounts')) {
				self.showNonMatchingAccountsErrorModal(self.$store.state.cookies.non_matching_accounts);
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
			},

            showAccountAlreadyConnectedErrorModal: function(provider_name) {
                this.$modal.show(accountAlreadyConnectedErrorModal, {
                    providerName: provider_name
                }, {
                    height: 'auto',
                    scrollable: true
                });

                document.cookie = encodeURIComponent('account_already_connected') +
                    "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" +
                    "; domain=.lifescope.io" +
                    "; path=/";
            },

			showNonMatchingAccountsErrorModal: function(provider_name) {
				this.$modal.show(nonMatchingAccountsErrorModal, {
					providerName: provider_name
				}, {
					height: 'auto',
					scrollable: true
				});

				document.cookie = encodeURIComponent('non_matching_accounts') +
					"=; expires=Thu, 01 Jan 1970 00:00:00 GMT" +
					"; domain=.lifescope.io" +
					"; path=/";
			}
		},
	}
</script>
