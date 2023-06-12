import { defineStore } from 'pinia';
import { ref } from 'vue';
import { io, Socket } from 'socket.io-client';

export const useUserStore = defineStore('user', () => {
	const id = '';
	const jwtToken = '';
	const name = ref('name');
	const avatar = ref('');
	const socket = ref<Socket>();

	socket.value = io('http://localhost:3000');

	async function setName(newName: string) {
		// gpl mutate back
		name.value = newName;
	}

	async function setAvatar(newAvatar: string) {
		// gpl mutate back
		avatar.value = newAvatar;
	}

	return { id, jwtToken, name, avatar, socket, setName, setAvatar };
});