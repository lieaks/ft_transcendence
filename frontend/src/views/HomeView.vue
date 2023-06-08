<template>
	<div>
		<h1 class="text-white text-1xl">HOME VIEW</h1>
		<button @click="fetchChirelData">Fetch Data</button>
		<p>Chirel data: {{ getChirelData() }}</p>
		<button @click="notLoveChirel">Not Love Chirel</button>
		<button @click="loveChirel">Love Chirel</button>
	</div>
</template>
  
<script setup lang="ts">
	import { useTestStore } from '@/stores/testStore';

	const { fetchChirelData, notLoveChirel, loveChirel, getChirelData } = useTestStore();
</script>

<style scoped>
.text-white {
    color: #fff;
}

.text-1xl {
    font-size: 1.5rem;
}

button {
    background-color: #4caf50;
    color: #fff;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    margin-right: 1rem;
}

button:hover {
    background-color: #3e8e41;
}

p {
    margin-top: 1rem;
    font-size: 1.25rem;
}
</style>
