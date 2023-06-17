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

const progress_value = ref(20);
const error = ref('');

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
progress_value.value += 20;

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

watch(result, async (res) => {
	if (res) {
		const me = res.me
		if (!me) {
			error.value += 'No user found\n'
			return
		}
		user.name = me.name
		const base64 = btoa(String.fromCharCode(...new Uint8Array(me.avatar.data))) // Convert buffer to base64
		user.avatar = `data:image/png;base64,${base64}`
		progress_value.value += 30;
	}
})

user.socket = io(import.meta.env.VITE_BACKEND_URL)
user.socket.on('connect', () => {
	progress_value.value += 20;
	user.socket?.emit('login', { jwtToken: localStorage.getItem('jwtToken') })
})
user.socket?.on('logged', (data) => {
	if (data === 'success') {
		progress_value.value += 20;
	} else {
		error.value += data + '\n'
	}
})

watch(progress_value, (value) => {
	if (value >= 100) {
		router.push('/')
	}
})

</script>

<template>
	<div class="h-screen">
		<span class="loading loading-infinity scale-[4] text-primary absolute left-1/2 top-1/3"></span>
		<progress class="progress w-1/2 progress-primary absolute left-1/4 top-1/2" :value="progress_value" max="100"></progress>
		<span v-if="error" class="text-red-500 absolute text-center w-screen text-2xl top-3/4">{{ error }}</span>
	
	</div>
</template>
