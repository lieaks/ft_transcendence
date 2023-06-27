<script setup lang="ts">
import type { IChannel, IUser, IMessage } from '@/interfaces/chat.interfaces'
import { useUserStore } from '@/stores/userStore'
import { ref, type PropType } from 'vue'

const user = useUserStore()
const newMessage = ref('')

const props = defineProps({
  channel: {
    type: Object as PropType<IChannel>,
    required: true
  }
})

function sendMessage() {
  if (!newMessage.value) return
  user?.socket.emit('sendMessage', { channelId: props.channel.id, content: newMessage.value })
  newMessage.value = ''
}
</script>

<template>
  <div class="inline-flex w-full h-full">
		<div class="card bg-neutral items-center shadow-xl p-3 my-2 w-2/5 h-full">
			<h2 class="card-title">{{ channel.name }}</h2>
			<div>channel parameters</div>
			<ul class="card bg-neutral-800 shadow-xl p-3 my-2 w-full divide-y divide-secondary">
				<li v-for="user in channel.users" :key="user.id">
					kick 
					ban 
					mute 
					{{user.name}}
				</li>
			</ul>
		</div>
		<div>
			<ul>
				<li v-for="message in channel.messages">{{ message.sender.name }}: {{ message.content }}</li>
			</ul>
			<div class="inline">
				<input
					type="text"
					class="input input-secondary m-2"
					placeholder="new message"
					v-model="newMessage"
					@keyup.enter="sendMessage"
				/>
				<button class="btn btn-secondary m-2" @click="sendMessage">send</button>
			</div>
		</div>
  </div>
</template>
