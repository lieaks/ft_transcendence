<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router'
const accountName = ref("account")
const	accountAvatar = ref("")

// TODO: accountAvatar, accountName should be in a store
setTimeout(() => {
	accountAvatar.value = "src/assets/default_avatar.png"
}, 1000)

</script>

<template>
	<header class="p-2 mb-4 text-white grid grid-flow-col justify-stretch items-center w-full">
		<RouterLink class="title text-3xl" to="/">🏓 ⚔️ Pongquistadors</RouterLink>
		<nav class="text-2xl">
			<RouterLink class="btn px-2 rounded-l-full pl-4" to="/">Home</RouterLink>
			<RouterLink class="btn px-2 rounded-none" to="/game">Game</RouterLink>
			<RouterLink class="btn px-2 rounded-none" to="/chat">Chat</RouterLink>
			<RouterLink class="btn px-2 rounded-r-full pr-4" to="/friends">Friends</RouterLink>
		</nav>
		<RouterLink class="btn rounded-full ml-auto" to="/account">
			<img :src="accountAvatar" alt="avatar"
				class="avatar hover:animate-spin h-10 w-10 relative -left-3 rounded-full ring ring-primary"
				:class="{ loading: !accountAvatar }"
			>
			<h5 class="">{{accountName}}</h5>
		</RouterLink>
	</header>
</template>

<style scoped>
.router-link-active:not(.title) {
	@apply btn-primary;
}
</style>
