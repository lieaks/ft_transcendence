<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
	<header class="p-6">
		<nav class="flex justify-center gap-4 text-white text-2xl">
			<RouterLink  to="/">Home</RouterLink>
			<RouterLink to="/game">Game</RouterLink>
			<RouterLink to="/chat">Chat</RouterLink>
			<RouterLink to="/friends">Friends</RouterLink>
		</nav>
	</header>
</template>

<style >
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
	RouterLink {
		@apply rounded bg-gray-400 text-red-400;
	}
}
</style>
