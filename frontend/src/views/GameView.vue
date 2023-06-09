<template tabindex>
  <EndGameComponent
    v-if="user.gameEnded"
    :card-type="user.gameWon ? 'win' : 'lose'"
    :score="user.score"
  />
  <canvas ref="pongCanvas" width="1600" height="800" class="mx-auto bg-black"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Game } from '@/elements/Game.js'
import { useUserStore } from '@/stores/userStore'
import { onBeforeRouteLeave } from 'vue-router'
import EndGameComponent from '@/components/EndGameComponent.vue'

const pongCanvas = ref<HTMLCanvasElement | null>(null)
const userStore = useUserStore()

const user = ref({
  gameEnded: false,
  gameWon: false,
  score: [0, 0]
})

let keydownHandler: (event: KeyboardEvent) => void

onMounted(() => {
  const canvas = pongCanvas.value
  if (!canvas) return

  const game = new Game(canvas)

  keydownHandler = (event) => {
    switch (event.key) {
      case '1':
        game.bg_color = 'black'
        break

      case '2':
        game.bg_color = 'gray'
        break

      case '3':
        game.bg_color = 'green'
        break

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
        break

      default:
        break
    }
  }

  document.addEventListener('keydown', keydownHandler)

  userStore.socket?.on('updateBallPosition', (data) => game.updateBallPosition(data))
  userStore.socket?.on('updatePaddlePosition', (data) => game.updatePaddlePosition(data))
  userStore.socket?.on('updateScore', (data) => game.updateScore(data))
  userStore.socket?.on('finishGame', (data) => {
    user.value.gameEnded = true
    user.value.gameWon = data.isWinner
    user.value.score = data.score
  })
  setInterval(() => {
    game.draw()
  }, 1000 / 60)

  // console.log('mounted')
})

onBeforeRouteLeave((to, from, next) => {
  // console.log('leaving')
  document.removeEventListener('keydown', keydownHandler)
  next()
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
