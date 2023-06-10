import { createApp, provide, h } from 'vue'
import { createPinia } from 'pinia'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'

import './assets/tailwind.css'

import App from './App.vue'
import router from './router'

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql'
})

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },
  render: () => h(App)
})

app.use(router).use(createPinia()).mount('#app')
