<script setup lang="ts">
import { type IChannel, type IUser, type IMessage, chatType } from '@/interfaces/chat.interfaces'
import { useUserStore } from '@/stores/userStore'
import { ref, type PropType, type Ref } from 'vue'

const user = useUserStore()
const newChannelName = ref('')
const modal: Ref<HTMLDialogElement | null> = ref(null)
let password = ''
let currentChannel: Ref<IChannel | undefined> = ref(undefined)

defineProps({
  availableChannels: {
    type: Array as PropType<IChannel[]>,
    required: true
  }
})

function joinChannel(channel: IChannel) {
  if (channel.type == chatType.PROTECTED) {
    showModal(channel)
  } else {
    user?.socket.emit('joinChannel', { ...channel })
  }
}
function createChannel() {
  user?.socket.emit('createChannel', { name: newChannelName.value })
  newChannelName.value = ''
}

function showModal(channel: IChannel) {
  currentChannel.value = channel
  modal.value?.showModal()
}

function submit() {
  const channel = currentChannel.value
  if (!channel) return
  const input: any = {}
  if (password !== '') {
    input.password = password
  } else {
    input.password = ''
  }
  user?.socket.emit('joinChannel', { ...channel, ...input })
  modal.value?.close()
}
</script>
<template>
  <dialog id="my_modal_2" class="modal" ref="modal">
    <form method="dialog" class="modal-box" @submit.prevent="submit">
      <div class="flex flex-col items-center justify-center">
        <label for="password" class="mb-2">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          class="input input-primary"
          placeholder="password"
          v-model="password"
        />
      </div>
      <input type="submit" value="Submit" class="btn mt-4" />
    </form>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
  <ul>
    <li v-for="channel in availableChannels" :key="channel.id" class="inline">
      <div class="mr-2 indicator">
        <span v-if="channel.type == chatType.PROTECTED" class="indicator-item">🔐</span>
        <span v-else-if="channel.type == chatType.PRIVATE" class="indicator-item">🧑‍🤝‍🧑</span>
        <span v-else class="indicator-item translate-x-[0.2rem] translate-y-[-0.6rem]">🌎</span>
        <button class="btn btn-sm btn-primary normal-case" @click="joinChannel(channel)">
          {{ channel.name }}
        </button>
      </div>
    </li>
    <li class="inline">
      <input
        type="text"
        class="input input-primary mr-2 input-sm"
        placeholder="new channel name"
        v-model="newChannelName"
      />
      <button class="btn btn-primary btn-sm" @click="createChannel()">create channel</button>
    </li>
  </ul>
</template>
