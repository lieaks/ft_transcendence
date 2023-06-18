<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderComponent from './components/HeaderComponent.vue'
</script>

<template>
  <HeaderComponent class="mb-2" />
  <RouterView />
</template>

<style>
/* To debug */
/* * {
	border: 1px solid red;
} */
</style>
