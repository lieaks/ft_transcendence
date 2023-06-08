<script setup lang="ts">
	import { useUserStore } from '@/stores/userStore';
	import { ref } from 'vue';

	const { user, setName } = useUserStore();
	const newUser = ref('');
</script>

<template>
	<div>
	  <h1 class="text-white text-1xl">HOME VIEW</h1>
	  <p>Welcome, {{ user.name }}</p>
	  <input v-model="newUser" />
	  <button @click="setName(newUser)">Set User</button>
	</div>
</template>
