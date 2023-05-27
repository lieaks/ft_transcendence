<script setup lang="ts">
	import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
	<header class="p-4">
		<nav class="flex justify-center gap-4 text-white text-2xl">
			<RouterLink to="/">Home</RouterLink>
			<RouterLink to="/game">Game</RouterLink>
			<RouterLink to="/chat">Chat</RouterLink>
			<RouterLink to="/friends">Friends</RouterLink>
		</nav>
		<RouterView />
	</header>
</template>

<style>

/* To debug */
/* * {
	border: 1px solid red;
} */

a {
	transition: color 0.4s;
}

a:hover {
	color: #4fd1c5;
}

body {
	background-color: #1a202c;
}
</style>
