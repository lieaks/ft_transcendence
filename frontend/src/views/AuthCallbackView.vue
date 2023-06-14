<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { io } from 'socket.io-client'

const route = useRoute()
const user = useUserStore()

let id = ''
if (Array.isArray(route.query.id)) {
  id = route.query.id[0]?.toString() || ''
} else {
  id = route.query.id || ''
}

let jwtToken = ''
if (Array.isArray(route.query.jwtToken)) {
  jwtToken = route.query.jwtToken[0]?.toString() || ''
} else {
  jwtToken = route.query.jwtToken || ''
}
localStorage.setItem('jwtToken', jwtToken)

// TODO: request totp if needed
user.setId(id)

user.socket = io(import.meta.env.VITE_BACKEND_URL)
user.socket.on('connect', () => {
  user.socket?.emit('login', { jwtToken: localStorage.getItem('jwtToken') })
})

// TODO: router push to the home page
</script>

<template>
  <h1 class="text-white text-1xl">{{ route.query }}</h1>
</template>
