<template>
	<div>
		<h1 class="text-white text-1xl">HOME VIEW</h1>
		<button @click="fetchChirelData">Fetch Data</button>
		<p>Chirel data: {{ getChirelData() }}</p>
		<button @click="notLoveChirel">Not Love Chirel</button>
	</div>
</template>
  
<script setup lang="ts">
	import { useTestStore } from '@/stores/testStore';

	const { fetchChirelData, notLoveChirel, getChirelData } = useTestStore();
</script>
