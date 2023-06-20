<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import MatchmakingComponent from '@/components/MatchmakingComponent.vue'
import LeaderboardComponent from '@/components/LeaderBoardComponent.vue'

const user = useUserStore()
const router = useRouter()
function joinQueue() {
  user.socket?.emit('joinQueue', {})
}

user.socket?.on('joinQueue', () => user.setInQueue(true))
user.socket?.on('startGame', (data) => {
  user.setInQueue(false)
  user.setGameId(data.id)
  router.push('/game')
})
</script>

<template>
  <div class="flex justify-center items-center">
    <button v-if="!user.inQueue" class="btn btn-primary m-4" @click="joinQueue">Join Queue</button>
    <MatchmakingComponent v-if="user.inQueue" />
  </div>
  <LeaderboardComponent />
</template>
