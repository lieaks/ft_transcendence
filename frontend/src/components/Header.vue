<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const user = useUserStore()
</script>

<template>
  <header class="navbar">
    <RouterLink class="navbar-start title lg:text-3xl" to="/">🏓 ⚔️ Pongquistadors</RouterLink>
    <ul class="navbar-center menu menu-horizontal rounded-box bg-base-200">
      <li><RouterLink class="text-lg mx-2" to="/">Home</RouterLink></li>
      <li><RouterLink class="text-lg mx-2" to="/game">Game</RouterLink></li>
      <li><RouterLink class="text-lg mx-2" to="/chat">Chat</RouterLink></li>
      <li><RouterLink class="text-lg mx-2" to="/social">Social</RouterLink></li>
    </ul>
    <div class="navbar-end">
      <RouterLink
        class="rounded-full h-14 w-48 xl:w-64 xl:h-16 2xl:w-72 2xl:h-18 p-0 menu menu-horizontal flex-nowrap hover:bg-neutral transition bg-base-200"
        to="/account"
      >
        <img
          :src="user.avatar"
          alt="avatar"
          class="avatar hover:animate-spin m-1 rounded-full"
          :class="{ loading: !user.avatar }"
        />
        <div class="flex items-center justify-center w-32 xl:w-3/4">
          <span class="pl-1 text-center text-xl xl:text-2xl truncate block">{{ user.name }}</span>
        </div>
      </RouterLink>
    </div>
  </header>
</template>

<style scoped>
.router-link-active:not(.title) {
  @apply bg-gradient-to-br from-primary to-secondary font-bold transition;
}
</style>
