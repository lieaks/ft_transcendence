<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
</script>

<template>
	<Header />
	<RouterView />
</template>

<style>

/* To debug */
/* * {
	border: 1px solid red;
} */

body {
	background-color: #1a202c;
}
</style>
