<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

const route = useRoute();
const user = useUserStore()
user.id = route.query.id
user.jwtToken = route.query.id
// request totp if needed
// call a store function to get the avatar and name from the server
// temporary :
user.name = route.query.id
</script>

<template>
	<h1 class="text-white text-1xl">{{route.query}}</h1>
</template>
