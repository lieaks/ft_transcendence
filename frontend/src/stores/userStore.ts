import { defineStore } from 'pinia';
import { ref } from 'vue';
import { io, Socket } from 'socket.io-client';

export const useUserStore = defineStore('user', () => {
	const id = '';
	const jwtToken = ''; // should store it in localstorage
	const name = ref('name');
	const avatar = ref('');
	const socket = ref<Socket>();
	const gameId = ref('');

	async function setName(newName: string) {
		// gpl mutate back
		name.value = newName;
	}

	async function setAvatar(newAvatar: string) {
		// gpl mutate back
		avatar.value = newAvatar;
	}

	function setGameId(id: string) {
		gameId.value = id;
		console.log(`Game id set to ${id}`);
	}

	return { id, jwtToken, name, avatar, socket, gameId, setName, setAvatar, setGameId};
});
