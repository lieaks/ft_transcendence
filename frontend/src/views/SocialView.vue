<script setup lang="ts">
  import { toast } from 'vue3-toastify';
  import 'vue3-toastify/dist/index.css';

  const notify = () => {
    toast('Axel t\'as invite a rejoindre sa partie', {
      type: 'info',
      icon: '👏',
    });
  };
</script>

<template>
  <h1 class="text-white text-1xl">fuzzy finder for profile, open profile component</h1>
  <h1 class="text-white text-1xl">same for blocked, blockedOf, friendsOf etc</h1>
  <div>
    <button @click="notify">Notify !</button>
  </div>
</template>
