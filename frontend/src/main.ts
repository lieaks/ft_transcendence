import { createApp, provide, h } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'

import './assets/tailwind.css'

import App from './App.vue'
import router from './router'

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_BACKEND_URL + '/graphql'
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('jwtToken')
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token}`
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

app.use(router)
app.use(createPinia().use(piniaPluginPersistedState))
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: 'top-left',
} as ToastContainerOptions)
app.mount('#app')
