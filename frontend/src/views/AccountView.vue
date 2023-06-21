<script setup lang="ts">
import { useRoute } from 'vue-router'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { onMounted, ref, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'

const route = useRoute()
const user = ref({
  name: '',
  id: '',
  avatar: '',
  points: 0,
  nb_win: 0,
  nb_loose: 0,
  gameHistory: [] as {
    score: number[]
    winner: { name: string; avatar: string }
    loser: { name: string; avatar: string }
  }[]
})

function extractQueryParam<T>(paramName: string): T {
  let value: T = '' as unknown as T
  const paramValue = route.query[paramName]
  if (Array.isArray(paramValue) && paramValue.length > 0) {
    value = paramValue[0]?.toString() as unknown as T
  } else if (paramValue) {
    value = paramValue.toString() as unknown as T
  }
  return value
}

const userStore = useUserStore()
onMounted(() => {
  user.value.id = extractQueryParam<string>('id') || userStore.id

  const { result, refetch } = useQuery(
    gql`
      query user($userId: String!) {
        user(id: $userId) {
          avatar
          name
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
              name
              avatar
            }
            loser {
              name
              avatar
            }
          }
        }
      }
    `,
    {
      userId: user.value.id
    },
    {
      fetchPolicy: 'cache-and-network'
    }
  )

  watch(
    result,
    async (res) => {
      if (res) {
        const data = res.user
        if (!data) return
        const base64 = btoa(String.fromCharCode(...new Uint8Array(data.avatar.data)))
        const avatar = `data:image/png;base64,${base64}`
        user.value.name = data.name
        user.value.avatar = avatar
        user.value.points = data.experience
        user.value.nb_win = data.gamesWon.length
        user.value.nb_loose = data.gamesLost.length
        user.value.gameHistory = data.gameHistory.map((game: any) => ({
          winner: {
            name: game.winner.name,
            avatar: `data:image/png;base64,${btoa(
              String.fromCharCode(...new Uint8Array(game.winner.avatar.data))
            )}`
          },
          loser: {
            name: game.loser.name,
            avatar: `data:image/png;base64,${btoa(
              String.fromCharCode(...new Uint8Array(game.loser.avatar.data))
            )}`
          },
          score: game.winner.name === user.value.name ? game.score : [game.score[1], game.score[0]] ?? []
        }))
      }
    },
    { immediate: true }
  )

  refetch()
})

const { mutate } = useMutation(
  gql`
    mutation UpdateUser($input: UpdateUserInput!) {
      updateUser(input: $input) {
        id
      }
    }
  `
)

function addFriend(id: string) {
  const input = { friendsToAdd: [id] }
  mutate({ input })
}

function removeFriend(id: string) {
  const input = { friendsToRemove: [id] }
  mutate({ input })
}

function blockUser(id: string) {
  const input = { usersToBlock: [id] }
  mutate({ input })
}
</script>

<template>
  <div class="max-w-lg mx-auto my-10 bg-[#71717a] rounded-lg shadow-md p-5">
    <img class="w-32 h-32 rounded-full mx-auto" :src="user.avatar" alt="Profile picture" />
    <h2 class="text-center text-2xl font-semibold text-black mt-3">{{ user.name }}</h2>
    <p class="text-center text-gray-600 mt-1">Points: {{ user.points }}</p>
    <p class="text-center text-gray-600 mt-1">
      Victoires: {{ user.nb_win }} | Defaites: {{ user.nb_loose }}
    </p>
    <div v-if="user.id != userStore.id" class="flex justify-center mt-5">
      <button
        class="text-green-500 hover:text-green-700 mx-3 font-semibold"
        @click="addFriend(user.id)"
      >
        Follow
      </button>
      <button
        class="text-red-500 hover:text-red-700 mx-3 font-semibold"
        @click="removeFriend(user.id)"
      >
        Unfollow
      </button>
      <!-- write, and grey on hover for the button to block user-->
      <button
        class="text-white hover:text-gray-700 mx-3 font-semibold"
        @click="blockUser(user.id)"
      >
        Block User
      </button>
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
                  class="px-5 py-3 border-b-2 border-[#564F6F] text-white text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {{ user.name }}
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-[#564F6F] text-white text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Score
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-[#564F6F] text-white text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
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
                      <p class="text-gray-900 whitespace-no-wrap text-center">
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
                      <img class="w-full h-full rounded-full" :src="user.avatar" alt="" />
                    </div>
                    <div class="ml-3">
                      <p class="text-gray-900 whitespace-no-wrap text-center">
                        {{ user.name == game.winner.name ? game.loser.name : game.winner.name }}
                      </p>
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
