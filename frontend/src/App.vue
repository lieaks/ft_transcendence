<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
import Matchmaking from './components/Matchmaking.vue'
</script>

<template>
	<Header />
	<RouterView />
	<!-- <Matchmaking /> -->
</template>

<style>

/* To debug */
/* * {
	border: 1px solid red;
} */

body {
	@apply bg-slate-800;
}
</style>
