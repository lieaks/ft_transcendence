<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import MatchmakingComponent from '@/components/MatchmakingComponent.vue'
import LeaderboardComponent from '@/components/LeaderBoardComponent.vue'
import FollowersComponent from '@/components/FollowersComponent.vue'

const user = useUserStore()
const router = useRouter()
function joinQueue() {
  user.socket?.emit('joinQueue', {})
}
</script>

<template>
  <div class="flex justify-center items-center">
    <button v-if="!user.inQueue" class="btn btn-primary m-4" @click="joinQueue">Join Queue</button>
    <MatchmakingComponent v-if="user.inQueue" />
  </div>
  <LeaderboardComponent />
</template>
