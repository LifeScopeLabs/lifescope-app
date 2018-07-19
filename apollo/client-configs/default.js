import https from 'https';

import { ApolloLink, concat, split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import _ from 'lodash';

export default (ctx) => {
  let agentOptions = {};

  if (process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'dev') {
    agentOptions.rejectUnauthorized = false;
  }

	const httpLink = new HttpLink({
		//Remove fetchOptions in production, as it's only needed for ignoring certs in dev
		fetchOptions: {
			agent: new https.Agent(agentOptions)
		},
		uri: 'https://api.lifescope.io/gql',
		credentials: 'include'
	});

	const wsLink = process.client ? new WebSocketLink({
		uri: 'wss://api.lifescope.io/subscriptions',
		options: {
			reconnect: true
		}
	}) : '';

	const link = process.server ? httpLink : split( ({ query }) => {
			const { kind, operation } = getMainDefinition(query);

			return kind === 'OperationDefinition' && operation === 'subscription';
		},
		wsLink,
		httpLink
	);

	const middlewareLink = new ApolloLink((operation, forward) => {
		if (_.has(ctx, 'req.headers')) {
			const headers = ctx.req.headers;

			operation.setContext({
				headers: headers
			});
		}

		return forward(operation)
	});

	return {
		link: middlewareLink.concat(link),
		cache: new InMemoryCache()
	}
}
