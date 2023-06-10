<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/userStore';
import { computed } from 'vue';

const user = useUserStore()
const userAvatar = computed(() => {
	return user.avatar || 'src/assets/default_avatar.png'
})

</script>

<template>
	<header class="navbar">
		<RouterLink class="navbar-start title lg:text-3xl" to="/">🏓 ⚔️ Pongquistadors</RouterLink>
		<ul class="navbar-center menu menu-horizontal rounded-box bg-base-200">
			<li><RouterLink class="text-lg mx-2" to="/">Home</RouterLink></li>
			<li><RouterLink class="text-lg mx-2" to="/game">Game</RouterLink></li>
			<li><RouterLink class="text-lg mx-2" to="/chat">Chat</RouterLink></li>
			<li><RouterLink class="text-lg mx-2" to="/friends">Friends</RouterLink></li>
		</ul>
		<div class="navbar-end">
			<RouterLink class="rounded-full lg:w-44 p-1 menu menu-horizontal flex-nowrap hover:bg-neutral transition bg-base-200" to="/account">
				<img
					:src="userAvatar"
					alt="avatar"
					class="avatar hover:animate-spin h-12 w-12 relative -left-2 rounded-full ring ring-primary"
					:class="{ loading: !userAvatar }"
				/>
				<h5 class="p-3 text-center break-all flex-grow truncate">{{ user.name }}</h5>
			</RouterLink>
		</div>
	</header>
</template>

<style scoped>
.router-link-active:not(.title) {
  @apply bg-gradient-to-br from-primary to-secondary font-bold transition;
}
</style>
