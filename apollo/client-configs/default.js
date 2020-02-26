import https from 'https';

import {ApolloLink, from, split} from 'apollo-link';
import {HttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {WebSocketLink} from 'apollo-link-ws';
import {getMainDefinition} from 'apollo-utilities';
import _ from 'lodash';

export default (ctx) => {
	let agentOptions = {};

	if (process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development') {
		agentOptions.rejectUnauthorized = false;
	}

	let apiDomain = process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development' ? 'dev.api.lifescope.io' : 'api.lifescope.io';

	const httpLink = new HttpLink({
		fetchOptions: {
			agent: new https.Agent(agentOptions)
		},
		uri: 'https://' + apiDomain + '/gql',
		credentials: 'include'
	});

	const wsLink = process.client ? new WebSocketLink({
		uri: 'wss://' + apiDomain + '/subscriptions',
		options: {
			reconnect: true
		}
	}) : '';

	const link = process.server ? httpLink : split(({query}) => {
			const {kind, operation} = getMainDefinition(query);

			return kind === 'OperationDefinition' && operation === 'subscription';
		},
		wsLink,
		httpLink
	);

	const middlewareLink = new ApolloLink((operation, forward) => {
		if (_.hasIn(ctx, 'req.headers')) {
			const headers = ctx.req.headers;

			operation.setContext({
				headers: headers
			});
		}

		if (_.hasIn(ctx, 'store.state.csrf_token')) {
			let headers = operation.getContext().headers;

			if (headers == null) {
				headers = {};
			}

			headers['X-CSRF-Token'] = ctx.store.state.csrf_token;

			operation.setContext({
				headers: headers
			});
		}

		return forward(operation);
	});

	return {
		link: from([
			middlewareLink,
			link,
		]),
		cache: new InMemoryCache(),
		defaultHttpLink: false
	}
}
