<template>
  <canvas ref="pongCanvas" width="1600" height="800" class="mx-auto bg-black"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Game } from '@/elements/Game.js'
import { useUserStore } from '@/stores/userStore';

const pongCanvas = ref<HTMLCanvasElement | null>(null)
const userStore = useUserStore()

onMounted(() => {
  const canvas = pongCanvas.value
  if (!canvas) return

  const game = new Game(canvas)

  window.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'w':
		userStore.socket?.emit('movePaddle', { direction: 'up', gameId: userStore.gameId })
        break

	  case 'o':
		userStore.socket?.emit('movePaddle', { direction: 'up', gameId: userStore.gameId })
        break

      case 's':
		userStore.socket?.emit('movePaddle', { direction: 'down', gameId: userStore.gameId })
        break

	  case 'l':
		userStore.socket?.emit('movePaddle', { direction: 'down', gameId: userStore.gameId })
        break

	  case 'q':
		userStore.socket?.emit('joinQueue', {})
		console.log('join queue')
		break

	  default:
		break
    }
  })

  userStore.socket?.on('startGame', (data) => userStore.setGameId(data.id))
  userStore.socket?.on('updateBallPosition', (data) => game.updateBallPosition(data))
  userStore.socket?.on('updatePaddlePosition', (data) => game.updatePaddlePosition(data))
  userStore.socket?.on('updateScore', (data) => game.updateScore(data))
  setInterval(() => {
    game.draw()
  }, 1000 / 60)
})
</script>

<style scoped>
/* Debug border */
/* * {
        border: 1px solid red;
    } */
canvas {
  width: 100vw;
  height: auto;
  max-width: 1600px;
}
</style>
