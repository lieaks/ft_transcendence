<script setup lang="ts">
import { ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable';
import { onMounted, onActivated, onDeactivated } from 'vue';
import gql from 'graphql-tag';

const players = ref([])
let currentId = 0
const { result, refetch } = useQuery(
  gql`
  query leaderboard($skip: Int, $take: Int) {
    leaderboard(skip: $skip, take: $take) {
      name
      avatar
      experience
      gamesWon {
        id
      }
      gamesLost {
        id
      }
    }
  }
  `,
  {
    fetchPolicy: 'network-only',
    variables: {
      skip: 0,
      take: 10
    }
  }
)

watch(result, async (res) => {
  if (res) {
    const data = res.leaderboard
    if (!data) return
    players.value = res.leaderboard.map((player: any) => {
      const base64 = btoa(String.fromCharCode(...new Uint8Array(player.avatar.data)))
      const avatar = `data:image/png;base64,${base64}`
      return {
        id: currentId++,
        name: player.name,
        avatar: avatar,
        points: player.experience,
        win: player.gamesWon,
        loose: player.gamesLost
      }
    })
  }
})

onMounted(() => {
  refetch()
})

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
