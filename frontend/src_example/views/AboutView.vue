<script setup lang="ts">
import { useCounterStore } from '@/stores/counter';
import { ref } from 'vue';

const counterStore = useCounterStore();

const count = ref(0);
</script>

<template>
  <div class="bout">
    <h1 class="my-2">This is an about page</h1>

	<!-- rajouter par lucas pour montrer le store pinia -->
	<h1>couter store: {{counterStore.count}}</h1>
	<h1>couter store: * 2: {{counterStore.doubleCount}}</h1>
	<button class="button" @click="counterStore.increment">increment counter store</button>

	<!-- simple couter --> 
 	<h1 class="mt-2">cout: {{count}}</h1>
	<button class="button" @click="count++">count is {{ count }}</button>
  </div>
</template>

<style>

button {
	@apply bg-gray-500 hover:bg-gray-700 transition duration-200 rounded p-1;
}

@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
