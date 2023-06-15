<script setup lang="ts">
 
import { ref } from 'vue'
import alan from '@/assets/aboulest.jpg'
import valentin from '@/assets/vlepille.jpg'

 const players = ref([
  { id: 1, name: 'John Doe', points: 100, avatar: 'https://i.pravatar.cc/150?img=1', win: 9, loose: 4 },
  { id: 2, name: 'Jane Doe', points: 90, avatar: 'https://i.pravatar.cc/150?img=2', win: 2, loose: 1 },
  { id: 3, name: 'Bob Smith', points: 80, avatar: 'https://i.pravatar.cc/150?img=3', win: 7, loose: 12 },
  { id: 3, name: 'Aboulest', points: 60, avatar: alan, win: 2, loose: 17 },
  { id: 3, name: 'Vlepille', points: 40, avatar: valentin, win: 0, loose: 10 },
  { id: 3, name: 'Giraffe', points: 20, avatar: 'https://i.pravatar.cc/150?img=6', win: 3, loose: 1 },
  { id: 3, name: 'Jquil', points: 5, avatar: 'https://i.pravatar.cc/150?img=7', win: 19, loose: 0 },
])


</script>

<template>
<div className="mx-auto overflow-x-auto w-1/2">
  <table className="table">
    <thead>
      <tr>
        <th class="text-center">Rank</th>
        <th>Name</th>
        <th className="text-center">Point</th>
        <th className="text-center">Win</th>
        <th className="text-center">Loose</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(player, index) in players" :key="player.id">
        <td className="text-center">{{ index + 1 }}</td>
        <td>
          <div className="flex items-center space-x-3">
            <div className="avatar">
              <div className="mask mask-squircle w-12 h-12">
                <img :src="player.avatar" alt="Avatar" />
              </div>
            </div>
            <div>
              <div className="font-bold">{{ player.name }}</div>
            </div>
          </div>
        </td>
        <td className="text-center">{{ player.points }}</td>
        <td className="text-center">{{ player.win }}</td>
        <td className="text-center">{{ player.loose }}</td>
      </tr>
    </tbody>
    
  </table>
</div>
</template>

<style scoped>

</style>