<script setup lang="ts">
import { type IChannel, type IUser, type IMessage, chatRole } from '@/interfaces/chat.interfaces'
import router from '@/router'
import { useUserStore } from '@/stores/userStore'
import { ref, type PropType, type Ref, computed } from 'vue'

const userStore = useUserStore()
const newMessage = ref('')
const modal: Ref<HTMLDialogElement | null> = ref(null)
let password = ''

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

function redirectToUserAccount(userId: string) {
  router.push({
    name: 'profil',
    params: { id: userId }
  })
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
  <div class="inline-flex w-full h-full">
    <div class="card bg-neutral items-center shadow-xl p-3 my-2 w-1/2 h-full">
      <div class="inline-flex justify-center items-center w-full">
        <span class="mx-2 truncate card-title">{{ channel.name }}</span>
					<button class="btn bg-neutral-800 btn-ghost btn-xs mr-1" @click.prevent="modal?.showModal()">⚙️</button>
					<button class="btn btn-error btn-xs" @click.prevent="leaveChannel">leave</button>
      </div>
      <ul class="card bg-neutral-800 shadow-xl p-3 my-2 w-full divide-y divide-secondary">
        <li v-for="user in channel.users" :key="user.id">
          <div
            v-if="isAdmin && user.id !== userStore.id && user.role !== chatRole.CREATOR"
            class="w-auto inline-block"
          >
            <a class="btn btn-xs btn-error" @click.prevent="updateUser(user.id, 'kick')">kick</a>
            <a class="btn btn-xs btn-error" @click.prevent="updateUser(user.id, 'ban', 10)">ban</a>
            <a class="btn btn-xs btn-error" @click.prevent="updateUser(user.id, 'mute', 10)"
              >mute</a
            >
            <a
              class="btn btn-xs btn-error"
              v-if="isCreator"
              @click.prevent="updateUser(user.id, 'op')"
              >op</a
            >
          </div>
          <span class="truncate m-1 first:m-0">
            {{ user.name }}
          </span>
        </li>
      </ul>
    </div>
    <div>
      <ul>
        <li v-for="message in messages">
          <a class="link" @click.prevent="redirectToUserAccount(message.sender.id)">
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
