<script setup lang="ts">
import EndGameComponent from '@/components/EndGameComponent.vue';
</script>

<template>
  <h1 class="text-white text-1xl">fuzzy finder for profile, open profile component</h1>
  <h1 class="text-white text-1xl">same for blocked, blockedOf, friendsOf etc</h1>
  <EndGameComponent card-type="lose"/>
  <EndGameComponent card-type="win"/>
</template>
