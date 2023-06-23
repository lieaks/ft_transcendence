<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
const user = useUserStore()

function redirectToOAuth(provider: string) {
  window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/${provider}`
}
</script>

<template>
	<div class="flex justify-center items-center h-full">
		<button class="btn btn-primary m-4 md:m-12 h-full w-1/4 text-2xl" @click="redirectToOAuth('42')">login 42</button>
		<button class="btn btn-primary m-4 md:m-12 h-full w-1/4 text-2xl" @click="redirectToOAuth('google')">login google</button>
	</div>
</template>
