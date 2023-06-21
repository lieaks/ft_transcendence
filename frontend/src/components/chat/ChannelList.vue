<template>
  <div class="flex-row p-4">
    <h3 class="mb-3 mt-3">chanel list</h3>
    <div>
      <button class="btn btn-primary my-4 me-4">friend list</button>
      <button class="btn btn-primary my-4 me-4" @click="storeChat.createChannel">
        create channel
      </button>
      <button class="btn btn-primary my-4 me-4" @click="storeChat.channelAvailable">
        channel available
      </button>
    </div>
  </div>
  <div class="overflow-scroll" it="channel-list"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useChatStore } from '@/stores/chatStore'

const storeChat = useChatStore()
const user = useUserStore()

user.socket?.on('newChannel', (data) => {
  console.log(data)
})

user.socket?.on('channelAvailable', (data) => {
  console.log(data)
})
</script>

<style></style>
