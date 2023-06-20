<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
const user = useUserStore()

function redirectToOAuth(provider: string) {
	window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/${provider}`
}
</script>

<template>
	<div v-if="!user.id || !user.name">
		<button class="btn btn-primary m-2" @click="redirectToOAuth('42')">login 42</button>
		<button class="btn btn-primary m-2" @click="redirectToOAuth('google')">login google</button>
	</div>
</template>
