<script setup lang="ts">
	import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
	<nav>
		<RouterLink to="/">Home</RouterLink>
		<RouterLink to="/game">Game</RouterLink>
	</nav>
	<RouterView />
</template>