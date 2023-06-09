<script setup lang="ts">
import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import { ref } from 'vue'
import router from '@/router'
import FollowersComponent from '@/components/FollowersComponent.vue'
import EditProfilComponent from '@/components/EditProfilComponent.vue'
import { useUserStore } from '@/stores/userStore'

interface User {
  name: string
  id: string
  avatar: string
}

const userStore = useUserStore()

const user = ref({
  rank: 0,
  points: 0,
  nb_win: 0,
  nb_loose: 0,
  gameHistory: [] as {
    score: number[]
    winner: User
    loser: User
  }[],
  editing: false
})

const { onResult } = useQuery(
  gql`
    query user {
      me {
				id
        rank
        experience
        gamesWon {
          id
        }
        gamesLost {
          id
        }
        gameHistory {
          score
          winner {
            id
            name
            avatar
          }
          loser {
            id
            name
            avatar
          }
        }
      }
    }
  `,
  null,
  {
    fetchPolicy: 'cache-and-network'
  }
)

onResult((res) => {
  const userRes = res.data?.me
  if (!userRes) return
  user.value.points = userRes.experience
  user.value.nb_win = userRes.gamesWon.length
  user.value.nb_loose = userRes.gamesLost.length
  user.value.rank = userRes.rank
  user.value.gameHistory = userRes.gameHistory.map((game: any) => ({
    winner: {
      name: game.winner.name,
      avatar: `data:image/png;base64,${btoa(
        String.fromCharCode(...new Uint8Array(game.winner.avatar.data))
      )}`,
      id: game.winner.id
    },
    loser: {
      name: game.loser.name,
      avatar: `data:image/png;base64,${btoa(
        String.fromCharCode(...new Uint8Array(game.loser.avatar.data))
      )}`,
      id: game.loser.id
    },
    score:
      game.winner.id === userRes.id
        ? game.score.slice().sort((a: number, b: number) => b - a)
        : game.score.slice().sort((a: number, b: number) => a - b)
  }))
})

function redirectToUserAccount(userId: string) {
  router.push(`/profil/${userId}`)
}
function logout() {
  localStorage.removeItem('jwtToken')
  window.location.href = '/'
}
</script>

<template>
  <div class="card md:card-side bg-neutral shadow-xl md:w-3/4 xl:w-/ w-1/2 mx-auto">
    <figure>
      <img class="w-full md:h-full md:w-auto" :src="userStore.avatar" alt="Profile picture" />
    </figure>
    <div class="card-body">
      <div class="flex justify-between items-center">
        <h2 class="card-title mb-4 font-bold text-2xl">{{ userStore.name }}</h2>
        <div class="inline-block">
          <button class="btn m-2 btn-error" @click="logout">logout</button>
          <EditProfilComponent />
        </div>
      </div>
      <p>Points: {{ user.points }}</p>
      <p>Rank: {{ user.rank }}</p>
      <p>Victoires: {{ user.nb_win }} | Defaites: {{ user.nb_loose }}</p>
      <div>
        <FollowersComponent />
      </div>
    </div>
  </div>

  <div class="container mx-auto px-4 sm:px-8">
    <div class="py-8">
      <div>
        <h2 class="text-2xl font-semibold leading-tight text-center">Matches History</h2>
      </div>
      <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
        <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
          <table class="min-w-full leading-normal">
            <thead class="bg-[#564F6F]">
              <tr>
                <th
                  class="px-5 text-white border-b-2 border-[#564F6F] text-center text-xs font-semibold uppercase tracking-wider"
                >
                  {{ userStore.name }}
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-[#564F6F] text-center text-xs font-semibold text-white uppercase tracking-wider"
                >
                  Score
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-[#564F6F] text-center text-xs font-semibold text-white uppercase tracking-wider"
                >
                  Opponent
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="game in user.gameHistory">
                <td
                  class="px-5 py-5 border-b text-sm w-2/5"
                  :class="
                    game.winner.name != userStore.name
                      ? 'border-red-400 bg-red-300'
                      : 'border-green-400 bg-green-300'
                  "
                >
                  <div class="flex items-center justify-center">
                    <div class="flex-shrink-0 w-10 h-10 hidden sm:table-cell">
                      <img class="v-w-full h-full rounded-full" :src="userStore.avatar" alt="" />
                    </div>
                    <div class="ml-3">
                      <p class="font-semibold text-gray-900 whitespace-no-wrap text-center">
                        {{ userStore.name }}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p class="text-gray-900 whitespace-no-wrap text-center">
                    {{ game.score[0] }} - {{ game.score[1] }}
                  </p>
                </td>
                <td
                  class="px-5 py-5 border-b text-sm w-2/5"
                  :class="
                    game.winner.name == userStore.name
                      ? 'border-red-400 bg-red-300'
                      : 'border-green-400 bg-green-300'
                  "
                >
                  <div class="flex items-center justify-center">
                    <div class="flex-shrink-0 w-10 h-10 hidden sm:table-cell">
                      <img
                        class="w-full h-full rounded-full"
                        :src="game.winner.id == userStore.id ? game.loser.avatar : game.winner.avatar"
                        alt=""
                      />
                    </div>
                    <div class="ml-3">
                      <a
                        href="#"
                        class="font-semibold text-gray-900 hover:underline hover:text-gray-700"
                        @click.prevent="
                          redirectToUserAccount(
                            userStore.id == game.winner.id ? game.loser.id : game.winner.id
                          )
                        "
                      >
                        {{ userStore.name == game.winner.name ? game.loser.name : game.winner.name }}
                      </a>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
