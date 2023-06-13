<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { io } from 'socket.io-client';

const route = useRoute();
const user = useUserStore()
if (Array.isArray(route.query.id)) {
	user.id = route.query.id[0]?.toString() || '';
} else {
	user.id = route.query.id || '';
}
if (Array.isArray(route.query.jwtToken)) {
	user.jwtToken = route.query.jwtToken[0]?.toString() || '';
} else {
	user.jwtToken = route.query.jwtToken || '';
}
// request totp if needed
// call a store function to get the avatar and name from the server
// temporary :
if (Array.isArray(route.query.id)) {
	user.name = route.query.id[0]?.toString() || '';
} else {
	user.name = route.query.id || '';
}
user.socket = io(import.meta.env.VITE_BACKEND_URL);
user.socket.on('connect', () => {
	user.socket?.emit('login', { jwtToken: user.jwtToken });
});
</script>

<template>
	<h1 class="text-white text-1xl">{{route.query}}</h1>
</template>
