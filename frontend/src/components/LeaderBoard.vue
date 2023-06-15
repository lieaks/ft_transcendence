<script setup lang="ts">
 
import { ref } from 'vue'

 const players = ref([
  { id: 1, name: 'John Doe', points: 100, avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'Jane Doe', points: 90, avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: 3, name: 'Bob Smith', points: 80, avatar: 'https://i.pravatar.cc/150?img=3' },
])

</script>

<template>
<div className="overflow-x-auto">
  <table className="table">
    <thead>
      <tr>
        <th class="text-center">Rank</th>
        <th>Name</th>
        <th>Point</th>
        <th></th>
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
        <td>{{ player.points }}</td>
        <th>
          <button className="btn btn-ghost btn-xs">details</button>
        </th>
      </tr>
    </tbody>
    
  </table>
</div>
</template>

<style scoped>

</style>