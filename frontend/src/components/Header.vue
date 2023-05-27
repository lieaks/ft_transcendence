<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
	<header class="p-2 my-2 mb-4 text-white grid grid-flow-col justify-stretch items-center w-full">
		<RouterLink class="title text-3xl" to="/">🏓 ⚔️ Pongquistadors</RouterLink>
		<nav class="text-2xl">
			<RouterLink class="hover:text-gray-400 transition p-2" to="/">Home</RouterLink>
			<RouterLink class="hover:text-gray-400 transition p-2" to="/game">Game</RouterLink>
			<RouterLink class="hover:text-gray-400 transition p-2" to="/chat">Chat</RouterLink>
			<RouterLink class="hover:text-gray-400 transition p-2" to="/friends">Friends</RouterLink>
		</nav>
		<RouterLink class="text-2xl p-2 inline-flex justify-end ml-auto mr-0" to="/account">
			<img src="" alt="avatar">
			<h5 class="mx-2">account</h5>
		</RouterLink>
	</header>
</template>

<style scoped>
.router-link-active:not(.title) {
	@apply text-teal-200;
}
</style>
