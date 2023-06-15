<template>
  <div class="flex-row p-4">
    <h3 class="mb-3 mt-3">chanel list</h3>
	<div class="overflow-scroll">

	</div>
    <div>
		<input v-model="messageContent" class="form-control" @keydown.enter="sendMessage()" placeholder="Envoyer un message">
		<button class="btn btn-primary" @click="sendMessage()">send</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'

const user = useUserStore()
const messageContent = ref("");

function sendMessage() {
	user.socket?.emit(messageContent.value);
	messageContent.value = "";
}
</script>

<style></style>