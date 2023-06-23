<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import router from '@/router'

interface Player {
  id: number
  userId: string
  name: string
  avatar: string
  points: number
  win: number
  loose: number
}

const players = ref<Player[]>([])
let currentId = 0

const { onResult, refetch } = useQuery(
  gql`
    query leaderboard($skip: Int, $take: Int) {
      leaderboard(skip: $skip, take: $take) {
        name
        id
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
    fetchPolicy: 'cache-and-network',
    variables: {
      skip: 0,
      take: 10
    }
  }
)

onResult((res) => {
  const leaderboard = res.data?.leaderboard
  if (!leaderboard) return
  players.value = leaderboard.map((player: any) => {
    const base64 = btoa(String.fromCharCode(...new Uint8Array(player.avatar.data)))
    const avatar = `data:image/png;base64,${base64}`
    return {
      id: currentId++,
      userId: player.id,
      name: player.name,
      avatar: avatar,
      points: player.experience,
      win: player.gamesWon.length,
      loose: player.gamesLost.length
    }
  })
})

onMounted(() => {
  refetch()
})

function redirectToUserAccount(userId: string) {
  router.push(`/profil?id=${userId}`)
}
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
                <div class="font-bold">
                  <a
                    href="#"
                    class="font-semibold text-white hover:underline"
                    @click.prevent="redirectToUserAccount(player.userId)"
                    >{{ player.name }}</a
                  >
                </div>
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

<style scoped></style>
