<script setup lang="ts">
  import { useUserStore } from '@/stores/userStore';

  const user = useUserStore()

  function cancelQueue() {
    user.socket?.emit('leaveQueue', {})
    user.setInQueue(false)
  }
</script>

<template>
  <div class="load text-info">
    <div class="loading loading-ball loading-lg"></div>
    <div class="message">Looking for a game</div>
    <button class="btn btn-outline btn-error" @click="cancelQueue">Cancel</button>
  </div>
</template>

<style scoped>
.load {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.message {
  margin-top: 16px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}
</style>
