<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { io } from 'socket.io-client'
import { ref, watch } from 'vue'
import router from '@/router'

const route = useRoute()
const user = useUserStore()

function extractQueryParam<T>(paramName: string): T {
  let value: T = '' as unknown as T
  const paramValue = route.query[paramName]
  if (Array.isArray(paramValue) && paramValue.length > 0) {
    value = paramValue[0]?.toString() as unknown as T
  } else if (paramValue) {
    value = paramValue.toString() as unknown as T
  }
  return value
}
const id = extractQueryParam<string>('id')
if (id) user.id = id

const jwtToken = extractQueryParam<string>('jwtToken')
if (jwtToken) localStorage.setItem('jwtToken', jwtToken)

// TODO: submit totp if needed
const twoFactorAuth = extractQueryParam<Boolean>('twoFactorAuth')
console.log('twoFactorAuth needed', twoFactorAuth) // TODO: debug

const { result } = useQuery(
  gql`
    query me {
      me {
        name
        avatar
      }
    }
  `,
  { fetchPolicy: 'network-only' }
)

user.socket = io(import.meta.env.VITE_BACKEND_URL)
user.socket.on('connect', () => {
  user.socket?.emit('login', { jwtToken: localStorage.getItem('jwtToken') })
})

watch(result, async (res) => {
  if (res) {
    const me = res.me
    if (!me) return
    console.log('new user', me.name, 'old one was', user.name) // TODO: debug
    user.name = me.name
		const base64 = btoa(String.fromCharCode(...new Uint8Array(me.avatar.data))) // Convert buffer to base64
		user.avatar = `data:image/png;base64,${base64}`
		router.replace('/')
	}
})
</script>

<template>
	<h1 class="text-white text-1xl">{{ route.query }}</h1>
</template>
