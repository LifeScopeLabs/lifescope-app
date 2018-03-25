import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

export default (ctx) => {
  const graphQLURI = 'http://graphql.org/swapi-graphql'; // https://lifescope-api.glitch.me/gql';
  
  const httpLink = new HttpLink({ uri: graphQLURI})

  // middleware
  const middlewareLink = new ApolloLink((operation, forward) => {
    const token = process.server ? ctx.req.session : window.__NUXT__.state.session

    operation.setContext({
      headers: { authorization: `Bearer ${token}` }
    })
    return forward(operation)
  });
  const link = middlewareLink.concat(httpLink)
  return {
    link,
    cache: new InMemoryCache()
  }
}
