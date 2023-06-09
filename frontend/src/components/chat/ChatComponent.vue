<script setup lang="ts">
import { type IChannel, type IUser, type IMessage, chatRole } from '@/interfaces/chat.interfaces'
import router from '@/router'
import { useUserStore } from '@/stores/userStore'
import { ref, type PropType, type Ref, computed, watch, onMounted } from 'vue'

const userStore = useUserStore()
const newMessage = ref('')
const modal: Ref<HTMLDialogElement | null> = ref(null)
let password = ''
let time = 0

const props = defineProps({
  channel: {
    type: Object as PropType<IChannel>,
    required: true
  }
})

const isAdmin = computed(() => {
  return props.channel.users?.some(
    (user) =>
      user.id === userStore.id && (user.role === chatRole.ADMIN || user.role === chatRole.CREATOR)
  )
})
const isCreator = computed(() => {
  return props.channel.users?.some(
    (user) => user.id === userStore.id && user.role === chatRole.CREATOR
  )
})

const messages = computed(() => {
  return props.channel.messages?.filter((message) => !message.sender.blocked)
})

function sendMessage() {
  if (!newMessage.value) return
  userStore?.socket.emit('sendMessage', { channelId: props.channel.id, content: newMessage.value })
  newMessage.value = ''
}

function updateUser(userId: string, action: string, time?: number) {
  userStore?.socket.emit('updateUser', {
    id: userId,
    channelID: props.channel.id,
    time: time,
    action: action
  })
}

function deleteChannel() {
  userStore?.socket.emit('deleteChannel', { id: props.channel.id })
}

function leaveChannel() {
  userStore?.socket.emit('leaveChannel', { id: props.channel.id })
}

function submit() {
  const input: any = {}
  if (password !== '') {
    input.password = password
  } else {
    input.password = ''
  }
  userStore?.socket.emit('changePassword', { id: props.channel.id, password: password })
  modal.value?.close()
}

watch(props, () => {
	const chat = document.getElementById('chat')
	if (chat) {
		setTimeout(() => {
			chat.scrollTop = chat.scrollHeight
		}, 100);
	}
}, { immediate: true })
</script>

<template>
  <dialog id="channelSettingsModal" class="modal" ref="modal">
    <form method="dialog" class="modal-box" @submit.prevent="submit">
      <div class="flex flex-col items-center justify-center">
        <label for="password" class="mb-2">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          class="input input-secondary"
          v-model="password"
        />
      </div>
      <div class="inline-flex justify-between w-full p-2 mt-2">
        <input type="submit" value="Submit" class="btn btn-primary" />
        <button class="btn btn-warning" v-if="isCreator" @click.prevent="deleteChannel">
          delete channel
        </button>
      </div>
    </form>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
  <div class="inline-flex w-full h-full my-2">
    <div class="card bg-neutral items-center shadow-xl p-3 w-1/2 h-full">
      <div class="inline-flex justify-center items-center w-full">
        <span class="mx-2 truncate card-title">{{ channel.name }}</span>
					<button v-if="isAdmin" class="btn bg-neutral-800 btn-ghost btn-xs mr-1" @click.prevent="modal?.showModal()">⚙️</button>
					<button class="btn btn-error btn-xs" @click.prevent="leaveChannel">leave</button>
      </div>
      <ul class="card bg-neutral-800 shadow-xl p-3 my-2 w-full divide-y divide-secondary">
        <li v-for="user in channel.users" :key="user.id">
          <div
            v-if="isAdmin && user.id !== userStore.id && user.role !== chatRole.CREATOR"
            class="w-auto inline-block"
          >
            <a class="btn btn-xs btn-error" @click.prevent="updateUser(user.id, 'kick')">kick</a>
            <a class="btn btn-xs btn-error" @click.prevent="updateUser(user.id, 'ban', time)">ban</a>
            <a class="btn btn-xs btn-error" @click.prevent="updateUser(user.id, 'mute', time)"
              >mute</a
            >
            <a
              class="btn btn-xs btn-error"
              v-if="isCreator && user.role !== chatRole.ADMIN"
              @click.prevent="updateUser(user.id, 'op')"
              >op</a
            >
            <a
              class="btn btn-xs btn-error"
              v-if="isCreator && user.role === chatRole.ADMIN"
              @click.prevent="updateUser(user.id, 'deop')"
              >deop</a
            >
            <input
              type="number"
              class="input input-secondary w-32 m-1"
              v-model="time"
              placeholder="seconds"
            />
          </div>
					<a class="link truncate m-1 first:m-0" @click.prevent="router.push(`/profil/${user.id}`)">
            {{ user.name }}
          </a>
        </li>
      </ul>
    </div>
		<div class="ml-4 shadow-xl bg-neutral rounded-box p-4 h-[60vh]">
			<ul class="overflow-scroll h-5/6" id="chat">
        <li v-for="message in messages">
					<div class="chat" :class="[ message.sender.id === userStore.id ? 'chat-end' : 'chat-start' ]">
						<a class="link chat-header" @click.prevent="router.push(`/profil/${message.sender.id}`)">
							{{ message.sender.name }}
						</a>
						<div class="chat-bubble chat-bubble-secondary scale-90 text-lg">
							{{ message.content }}
						</div>
					</div>
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
