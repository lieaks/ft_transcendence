<template>
	<div>
	  <h1 class="text-white text-1xl">HOME VIEW</h1>
	  <button @click="fetchChirelData">Fetch Data</button>
	  <p>Chirel data: {{ getChirelData() }}</p>
	</div>
  </template>
  
  <script setup lang="ts">
	import { useTestStore } from '@/stores/testStore';
	import { ref } from 'vue';
  
	const { fetchChirelData, getChirelData } = useTestStore();
  </script>
