<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/userStore';
import { computed } from 'vue';

const user = useUserStore()
const userAvatar = computed(() => {
	return user.avatar || 'src/assets/default_avatar.png'
})

</script>

<template>
  <header class="p-2 mb-4 text-white grid grid-flow-col justify-stretch items-center w-full">
    <RouterLink class="title text-3xl" to="/">🏓 ⚔️ Pongquistadors</RouterLink>
    <nav class="text-2xl">
      <RouterLink class="btn px-2 rounded-l-full pl-4" to="/">Home</RouterLink>
      <RouterLink class="btn px-2 rounded-none" to="/game">Game</RouterLink>
      <RouterLink class="btn px-2 rounded-none" to="/chat">Chat</RouterLink>
      <RouterLink class="btn px-2 rounded-r-full pr-4" to="/friends">Friends</RouterLink>
    </nav>
    <RouterLink class="btn rounded-full ml-auto" to="/account">
      <img
        :src="userAvatar"
        alt="avatar"
        class="avatar hover:animate-spin h-10 w-10 relative -left-3 rounded-full ring ring-primary"
				:class="{ loading: !userAvatar }"
      />
      <h5>{{ user.name }}</h5>
    </RouterLink>
  </header>
</template>

<style scoped>
.router-link-active:not(.title) {
  @apply btn-primary;
}
</style>
