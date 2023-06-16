import { createApp, provide, h } from 'vue'
import { createPinia } from 'pinia'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'

import './assets/tailwind.css'

import App from './App.vue'
import router from './router'

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_BACKEND_URL + '/graphql'
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('jwtToken')
  console.log('token is ' + token) // TODO: debub to see new query to the server, not cached

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },
  render: () => h(App)
})

app.use(router).use(createPinia()).mount('#app')
