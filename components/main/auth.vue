<template>
    <main>
        <transition appear
                    name="page-load"
        >
            <section v-if="$store.state.user != undefined"
                     id="content"
            >
                <div v-if="$data.error == null"
                     class="boxed-group"
                >
                    <div class="align-center">
                        <a v-bind:href="$store.state.auth.app.homepage_url">{{
                            $store.state.auth.app.name }}
                        </a>
                        would like to connect to your LifeScope account.
                    </div>
                    <div class="align-center padded paragraphed">
                        <div>{{ $store.state.auth.app.description }}</div>

                        <div class="scopes padded align-center">
                            <div style="margin-bottom: 0.5em">
                                {{ $store.state.auth.app.name }} is requesting access to the following information:
                            </div>
                            <div class="flexbox flex-column">
                                <li v-for="scope in $store.state.auth.scopes"
                                    v-bind:key="scope"
                                >
                                    {{ translateScope(scope) }}
                                </li>
                            </div>
                            <div style="margin-top: 0.5em">
                                This app will have access to this information indefinitely. Their privacy policy can be
                                found
                                <a v-bind:href="$store.state.auth.app.privacy_policy_url">here</a>
                                .
                            </div>
                        </div>

                        <div class="mobile-buttons flex-center">
                            <button class="primary left-button"
                                    v-on:click="allowAuth"
                            >
                                Allow
                            </button>
                            <button class="danger"
                                    v-on:click="denyAuth"
                            >
                                Deny
                            </button>
                        </div>
                    </div>
                </div>
                <div v-if="$data.error != null"
                     class="align-center"
                >
                    {{ $data.error }}
                </div>
            </section>
        </transition>
    </main>
</template>

<script>
	import _ from 'lodash';
	import querystring from 'querystring';
	import url from 'url';

	import { oauthAppOneAuthorization } from '../../apollo/queries/oauth-app-one-authorization.gql';
	import { oauthTokenAuthorize } from '../../apollo/mutations/oauth-token-authorize.gql';

	let scopeTranslation = {
		basic: 'Basic user information like LifeScope ID (Read-only)',
		'contacts:read': 'LifeScope Contacts (Read-only)',
		'content:read': 'LifeScope Content (Read-only)',
		'locations:read': 'LifeScope Locations (Read-only)',
		'events:read': 'LifeScope Events (also includes Contacts, Content, and Locations; Read-only)',
		'people:read': 'LifeScope People (Read-only)'
	};

	function returnError(errorObj) {
		let parsed = url.parse(errorObj.route.query.redirect_uri);
		let queryParsed = querystring.parse(parsed.query);

		queryParsed.error = errorObj.error;
		queryParsed.error_description = errorObj.description;
		parsed.query = queryParsed;

		window.location.href = url.format(parsed);
	}

	export default {
		data: function() {
			return {
				error: null
			};
		},

		beforeMount: async function() {
			let result = await this.$apollo.query({
				query: oauthAppOneAuthorization,
				variables: {
					client_id: this.$route.query.client_id
				},
				fetchPolicy: 'no-cache'
			});

			if (result == null) {
				this.$data.error = 'Code 400: Invalid Client ID';
			}

			this.$store.state.auth.app = result.data.oauthAppOneAuthorization;
			this.$store.state.auth.scopes = this.$route.query.scope.split(',');
		},

		methods: {
			allowAuth: async function() {
				try {
					let result = await this.$apollo.mutate({
						mutation: oauthTokenAuthorize,
						variables: {
							response_type: this.$route.query.response_type,
							client_id: this.$route.query.client_id,
							redirect_uri: this.$route.query.redirect_uri,
							scope: this.$route.query.scope,
							state: this.$route.query.state
						}
					});

					let obj = result.data.oauthTokenAuthorization;
					let parsed = url.parse(this.$route.query.redirect_uri);
					let queryParsed = querystring.parse(parsed.query);

					queryParsed.code = obj.code;
					queryParsed.state = obj.state;
					parsed.query = queryParsed;

					window.location.href = url.format(parsed);
				}
				catch (err) {
					let errorMessage = _.get(err, 'graphQLErrors[0].message') || _.get(err, 'data.errors[0].message');
					let missingParameter = /was not provided/.test(errorMessage);
					let invalidClientId = /Invalid client_id/.test(errorMessage);
					let invalidRedirectUri = /Invalid redirect_uri/.test(errorMessage);
					let invalidScopes = /Invalid scopes/.test(errorMessage);
					let invalidResponseType = /response_type must be/.test(errorMessage);

					if (missingParameter || invalidScopes || invalidResponseType) {
						if (missingParameter) {
							returnError({
								route: this.$route,
								error: 'invalid_request',
								description: 'One or more required parameters were missing, the wrong type, or invalid in some other way.'
							});
						}
						else if (invalidScopes) {
							returnError({
								route: this.$route,
								error: 'invalid_scope',
								description: 'One or more of the scopes you requested is not a valid scope for the platform.'
							});
						}
						else if (invalidResponseType) {
							returnError({
								route: this.$route,
								error: 'unsupported_response_type',
								description: 'The only currently supported response_types are \'code\' and \'refresh_token\'.'
							});
						}
					}
					else {
						if (invalidClientId) {
							this.$data.error = 'Code 400: Invalid Client ID';
						}

						if (invalidRedirectUri) {
							this.$data.error = 'Code 400: Invalid Redirect URI';
						}
					}

				}
			},

			denyAuth: async function() {
				returnError({
					route: this.$route,
					error: 'access_denied',
					description: 'The user denied the request'
				});
			},

			translateScope: function(scope) {
				return scopeTranslation[scope];
			}
		},
	}
</script>
