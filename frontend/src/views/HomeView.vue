<script setup lang="ts">
import { useTestStore } from '@/stores/testStore'
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';
import Matchmaking from '@/components/Matchmaking.vue';

// const { fetchChirelData, notLoveChirel, loveChirel, getChirelData } = useTestStore()
const user = useUserStore()
const router = useRouter()

function redirectToOAuth(provider: string) {
  console.log('redirectToOAuth(42)')
  window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/${provider}`
}

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
  <div>
    <!-- <h1 class="text-white text-1xl">HOME VIEW</h1> -->
    <!-- <button @click="fetchChirelData">Fetch Data</button> -->
    <!-- <p>Chirel data: {{ getChirelData() }}</p> -->
    <!-- <button @click="notLoveChirel">Not Love Chirel</button> -->
    <!-- <button @click="loveChirel">Love Chirel</button> -->
    <button @click="joinQueue">Join Queue</button>
    <!-- If the user.inQueue = True, print "In Queue" -->
    <Matchmaking/>
  </div>
  <input
    type="text"
    placeholder="user's name"
    v-model="user.name"
    class="input input-bordered m-4"
  />
  <button class="btn m-4 btn-primary" @click="redirectToOAuth('42')">login 42</button>
  <button class="btn m-4 btn-primary" @click="redirectToOAuth('google')">login google</button>
</template>

<style scoped>
.text-white {
  color: #fff;
}

.text-1xl {
  font-size: 1.5rem;
}

button {
  background-color: #4caf50;
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  margin-right: 1rem;
}

button:hover {
  background-color: #3e8e41;
}

p {
  margin-top: 1rem;
  font-size: 1.25rem;
}
</style>
