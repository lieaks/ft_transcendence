<script setup lang="ts"></script>

<template>
  <div class="load">
    <div class="loading loading-ball loading-lg"></div>
    <div class="message">Looking for a game</div>
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
