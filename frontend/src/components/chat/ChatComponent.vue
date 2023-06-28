<script setup lang="ts">
import type { IChannel, IUser, IMessage } from '@/interfaces/chat.interfaces'
import router from '@/router';
import { useUserStore } from '@/stores/userStore'
import { ref, type PropType, type Ref } from 'vue'

const user = useUserStore()
const newMessage = ref('')
const modal: Ref<HTMLDialogElement | null> = ref(null)
let password = ''

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

function redirectToUserAccount(userId: string) {
  router.push({
    name: 'profil',
    params: { id: userId }
  })
}

function kickUser(userId: string) {
  user?.socket.emit('kickUser', { id: userId, channelID: props.channel.id })
}

function banUser(userId: string) {
  user?.socket.emit('banUser', { id: userId, channelID: props.channel.id, seconds: 10 })
}

function muteUser(userId: string) {
  user?.socket.emit('muteUser', { id: userId, channelID: props.channel.id, seconds: 10 })
}

function opUser(userId: string) {
  user?.socket.emit('opUser', { id: userId, channelID: props.channel.id })
}

function showModal() {
  modal.value?.showModal()
}

function submit() {
  const input: any = {};
  if (password !== '') {
    input.password = password;
  } else {
    input.password = ""
  }
  user?.socket.emit('changePassword', { id: props.channel.id, password: password })
  modal.value?.close()
}

</script>

<template>
  <dialog id="my_modal_2" class="modal" ref="modal">
    <form method="dialog" class="modal-box" @submit.prevent="submit">
      <div class="flex flex-col items-center justify-center">
        <label for="password" class="mb-2">Password:</label>
        <input type="password" id="password" name="password" v-model="password" />
      </div>
      <input type="submit" value="Submit" class="btn mt-4" />
    </form>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
  <div class="inline-flex w-full h-full">
		<div class="card bg-neutral items-center shadow-xl p-3 my-2 w-2/5 h-full">
			<h2 class="card-title">{{ channel.name }}</h2>
      <a href="#" class="text-white hover:underline" @click.prevent="showModal">Channel settings</a>
			<ul class="card bg-neutral-800 shadow-xl p-3 my-2 w-full divide-y divide-secondary">
				<li v-for="user in channel.users" :key="user.id">
					<a href="#" class="text-red-500" @click.prevent="kickUser(user.id)">kick</a>
          <a href="#" class="text-red-500" @click.prevent="banUser(user.id)">ban</a>
          <a href="#" class="text-red-500" @click.prevent="muteUser(user.id)">mute</a>
          <a href="#" class="text-red-500" @click.prevent="opUser(user.id)">op</a>
					{{ user.name }}
				</li>
			</ul>
		</div>
		<div>
			<ul>
				<li v-for="message in channel.messages">
          <a
            href="#"
            class="font-semibold hover:underline"
            @click.prevent="redirectToUserAccount(message.sender.id)"
          >
            {{ message.sender.name }}
          </a>
					: {{ message.content }}
				</li>
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
