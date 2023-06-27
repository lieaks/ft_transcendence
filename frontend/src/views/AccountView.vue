<script setup lang="ts">
import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import { ref } from 'vue'
import router from '@/router'
import FollowersComponent from '@/components/FollowersComponent.vue'
import EditProfilComponent from '@/components/EditProfilComponent.vue'

interface User {
  name: string
  id: string
  avatar: string
}

const user = ref({
  name: '',
  id: '',
	rank: 0,
  avatar: '',
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
        avatar
				rank
        name
        id
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
  const base64 = btoa(String.fromCharCode(...new Uint8Array(userRes.avatar.data)))
  const avatar = `data:image/png;base64,${base64}`
  user.value.id = userRes.id
  user.value.name = userRes.name
  user.value.avatar = avatar
  user.value.points = userRes.experience
  user.value.nb_win = userRes.gamesWon.length
  user.value.nb_loose = userRes.gamesLost.length
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
    score: game.winner.id === userRes.id ? game.score.slice().sort((a: number, b: number) => b - a) : game.score.slice().sort((a: number, b: number) => a - b)
  }))
})

function redirectToUserAccount(userId: string) {
  router.push(`/profil/${userId}`)
}
</script>

<template>
  <EditProfilComponent v-if="user.editing" />
  <div class="card md:card-side bg-neutral shadow-xl md:w-3/4 xl:w-/ w-1/2 mx-auto">
    <figure>
      <img class="w-full md:h-full md:w-auto" :src="user.avatar" alt="Profile picture" />
    </figure>
    <div class="card-body">
		  <div class="flex justify-between items-center">
        <h2 class="card-title mb-4 font-bold text-2xl">{{ user.name }}</h2>
        <button
          class="bg-[#564F6F] hover:bg-[#3E3756] text-white font-bold py-2 px-4 rounded"
          @click="user.editing = true"
        >
          Edit
        </button>
      </div>
      <h2 class="card-title mb-2 font-bold text-2xl">{{ user.name }}</h2>
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
                  {{ user.name }}
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
                    game.winner.name != user.name
                      ? 'border-red-400 bg-red-300'
                      : 'border-green-400 bg-green-300'
                  "
                >
                  <div class="flex items-center justify-center">
                    <div class="flex-shrink-0 w-10 h-10 hidden sm:table-cell">
                      <img class="v-w-full h-full rounded-full" :src="user.avatar" alt="" />
                    </div>
                    <div class="ml-3">
                      <p class="font-semibold text-gray-900 whitespace-no-wrap text-center">
                        {{ user.name }}
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
                    game.winner.name == user.name
                      ? 'border-red-400 bg-red-300'
                      : 'border-green-400 bg-green-300'
                  "
                >
                  <div class="flex items-center justify-center">
                    <div class="flex-shrink-0 w-10 h-10 hidden sm:table-cell">
                      <img class="w-full h-full rounded-full" :src="game.winner.id == user.id ? game.loser.avatar : game.winner.avatar" alt="" />
                    </div>
                    <div class="ml-3">
                      <a
                        href="#"
                        class="font-semibold text-gray-900 hover:underline hover:text-gray-700"
                        @click.prevent="
                          redirectToUserAccount(
                            user.id == game.winner.id ? game.loser.id : game.winner.id
                          )
                        "
                      >
                        {{ user.name == game.winner.name ? game.loser.name : game.winner.name }}
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
