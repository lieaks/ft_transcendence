<script setup lang="ts">
import { useRoute } from 'vue-router'
import gql from 'graphql-tag'
import { useQuery, useMutation, useLazyQuery } from '@vue/apollo-composable'
import { onMounted, ref, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'
import router from '@/router'
import FollowersComponent from '@/components/FollowersComponent.vue'

const route = useRoute()
const user = useUserStore()

function redirectToUserAccount(userId: string) {
  router.push(`/profil?id=${userId}`)
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
    <div class="text-center text-gray-600 mt-1">
      <FollowersComponent/>
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
                      <img class="w-full h-full rounded-full" :src="user.avatar" alt="" />
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