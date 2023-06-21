<script setup lang="ts">
import type { IChannel, IUser, IMessage } from '@/interfaces/chat.interfaces'
import { useUserStore } from '@/stores/userStore'
import { ref, type PropType } from 'vue'

const user = useUserStore()
const newChannelName = ref('')

defineProps({
  availableChannels: {
    type: Array as PropType<IChannel[]>,
    required: true
  }
})

function joinChannel(channel: IChannel) {
  user?.socket.emit('joinChannel', { ...channel })
}
function createChannel() {
  user?.socket.emit('createChannel', { name: newChannelName.value })
  newChannelName.value = ''
}
</script>
<template>
  <ul class="m-2">
    <li v-for="channel in availableChannels" :key="channel.id" class="inline">
      <button class="btn btn-primary m-2 normal-case" @click="joinChannel(channel)">
        {{ channel.name }}
      </button>
    </li>
    <li class="inline">
      <input
        type="text"
        class="input input-primary m-2"
        placeholder="new channel name"
        v-model="newChannelName"
      />
      <button class="btn btn-primary m-2" @click="createChannel()">create channel</button>
    </li>
  </ul>
</template>
