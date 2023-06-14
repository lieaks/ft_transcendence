<template>
	<div class="flex-row p-4">
		<h3 class="mb-3 mt-3"> chanel list</h3>
		<div>
			<button class="btn btn-primary my-4 me-4">friend list</button>
			<button class="btn btn-primary my-4 me-4">create channel</button>
			<button class="btn btn-primary my-4 me-4">channel available</button>
		</div>
	</div>
	<div class="overflow-scroll" it="channel-list">
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore()
// useUserStore.socket?.em

</script>

<style>
</style>