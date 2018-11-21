<template>
</template>

<script>
	import querystring from 'querystring';

	import _ from 'lodash';
	import moment from 'moment';

	let allowedScopes = {
		basic: true,
		events: true,
		content: true,
		contacts: true
	};

	export default {
		layout: function(context) {
			return context.req.user != undefined ? 'auth' : 'providers';
		},

		asyncData: async function({ app, req, store, route, error}) {
			store.state.mode = 'auth';
			store.state.pageName = store.state.user ? 'auth' : 'providers';

			let params = route.query;

			let errorMessageSplit = [];

			if (params.response_type == null) {
				errorMessageSplit.push('Request must have parameter \'response_type\'.');
			}

			if (params.client_id == null) {
				errorMessageSplit.push('Request must have parameter \'client_id\'.');
			}

			if (params.redirect_uri == null) {
				errorMessageSplit.push('Request must have parameter \'redirect_uri\'.');
			}

			if (params.state == null) {
				errorMessageSplit.push('Request must have parameter \'state\'.');
			}

			if (params.scope != null) {
				let scopes = params.scope.split(',');
				let scopeErrors = [];

				_.each(scopes, function(scope) {
					if (allowedScopes[scope] !== true) {
						scopeErrors.push(scope);
					}
				});

				if (scopeErrors.length > 0) {
					errorMessageSplit.push('Request has invalid scopes: ' + scopeErrors.join(','));
				}
			}

			if (errorMessageSplit.length > 0) {
				error({ statusCode: 400, message: errorMessageSplit.join(' ') });
			}

			if (req.user == null) {
				app.$cookies.set('auth_parameters', querystring.encode(params), {
					expires: moment().utc().add(5, 'minutes').toDate()
				});
			}
		},

		data: function() {
			return {
				authenticated: this.$store.state.user != undefined
			}
		},
	}
</script>
