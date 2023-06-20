<template>
  <div class="flex-row p-4">
    <h3 class="mb-3 mt-3">chanel list</h3>
    <div class="overflow-scroll" id="msg-list">
      <div v-for="msg in storeChat.listMessage">{{ msg }}</div>
    </div>
    <div class="">
      <input
        v-model="storeChat.message"
        class=""
        @keydown.enter="storeChat.sendMessage"
        placeholder="Envoyer un message"
      />
      <button class="btn btn-primary" @click="storeChat.sendMessage">send</button>
    </div>
    <div class="chat">input in storechat.message: {{ storeChat.message }}</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useChatStore } from '@/stores/chatStore'

const storeChat = useChatStore()
const user = useUserStore()
// const messageContent = ref("");

user.socket?.on('newMessage', (data) => {
  console.log(data.message)
})

// need to add socket.emit to chatStore in actions
// function sendMessage() {
// 	user.socket?.emit(messageContent.value);
// 	messageContent.value = "";
// }
</script>

<style>
#msg-list {
  height: calc(50vh - 40px - 1rem - 5rem);
}
</style>
