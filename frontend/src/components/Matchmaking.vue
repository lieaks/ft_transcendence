<script setup lang="ts"></script>

<template>
  <div class="loading">
    <div class="spinner"></div>
    <div class="message">Looking for a game</div>
  </div>
</template>

<style scoped>
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: #00ff00;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

.message {
  margin-top: 16px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
