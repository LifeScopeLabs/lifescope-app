import 'isomorphic-fetch'
import Vue from 'vue'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'

Vue.use(VueApollo)

export default (ctx) => {
  const providerOptions = { clients: {} }
  const { isDev, app, route, beforeNuxtRender, store } = ctx

  
    // *** default Apollo client ***
    
    let defaultClientConfig = require('graphql/default.js')
    // es6 module default export or not
    defaultClientConfig = defaultClientConfig.default(ctx) || defaultClientConfig(ctx)

    
    const defaultCache = defaultClientConfig.cache || new InMemoryCache()

    
    const defaultOpts = process.server ? {
      ssrMode: true
    } : {
      ssrForceFetchDelay: 100,
      connectToDevTools: isDev
    }

    // hydrate client cache from the server
    if (!process.server) {
      defaultCache.restore(window.__NUXT__ ? window.__NUXT__.apollo.defaultClient : null)
    }

    
    const defaultFinalOpts = Object.assign({}, defaultOpts, defaultClientConfig, { defaultCache })
    const defaultClient = new ApolloClient(defaultFinalOpts)

    
      providerOptions.defaultClient = defaultClient
    
  

  const apolloProvider = new VueApollo(providerOptions)
  // Allow access to the provider in the context
  app.apolloProvider = apolloProvider
  // Install the provider into the app
  app.provide = apolloProvider.provide()

  if (process.server) {
    beforeNuxtRender(async ({ Components, nuxtState }) => {
      Components.forEach((Component) => {
        // Fix https://github.com/nuxt-community/apollo-module/issues/19
        if (Component.options && Component.options.apollo && Component.options.apollo.$init) {
          delete Component.options.apollo.$init
        }
      })
      await apolloProvider.prefetchAll(ctx, Components)
      nuxtState.apollo = apolloProvider.getStates()
    })
  }
}
