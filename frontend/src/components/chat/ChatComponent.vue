<script setup lang="ts">
import type { IChannel, IUser, IMessage } from '@/interfaces/chat.interfaces'
import { useUserStore } from '@/stores/userStore';
import { ref, type PropType } from 'vue';

const user = useUserStore()
const newMessage = ref('')

const props = defineProps({
	channel: {
		type: Object as PropType<IChannel>,
		required: true
	},
});

function sendMessage() {
	if (!newMessage.value) return
	user?.socket.emit('sendMessage', { channelId: props.channel.id, content: newMessage.value })
	newMessage.value = ''
}

</script>

<template>
	<div>
		channel {{ channel.name }}
		<ul>
			<li v-for="message in channel.messages">
				{{ message.sender.name }}: {{ message.content }}
			</li>
		</ul>
		<div class="inline">
			<input type="text" class="input input-secondary m-2" placeholder="new message" v-model="newMessage">
			<button class="btn btn-secondary m-2" @click="sendMessage()">send</button>
		</div>
	</div>
</template>
