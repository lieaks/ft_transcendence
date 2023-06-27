<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import * as Notifications from '@/elements/Notifications'
const notifs = Notifications.useNotifications()

interface User {
  name: string
  id: string
  avatar: string
}

const props = defineProps({
  userId: {
    required: true,
    type: String
  }
})

const router = useRouter()
const userStore = useUserStore()
const user = ref({
  name: '',
  id: '',
  avatar: '',
  points: 0,
  nb_win: 0,
  nb_loose: 0,
  rank: 0,
  gameHistory: [] as {
    score: number[]
    winner: User
    loser: User
  }[],
  isFriend: false,
  isBlocked: false,
  status: ''
})

const { onResult: onUserResult } = useQuery(
  gql`
    query user($userId: String!) {
      user(id: $userId) {
        avatar
        name
        experience
        status
        rank
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
  props,
  {
    fetchPolicy: 'cache-and-network'
  }
)

onUserResult((res) => {
  if (!res.data?.user) return
  const userData = res.data.user
  const base64 = btoa(String.fromCharCode(...new Uint8Array(userData.avatar.data)))
  const avatar = `data:image/png;base64,${base64}`
  user.value.id = props.userId
  user.value.name = userData.name
  user.value.rank = userData.rank
  user.value.avatar = avatar
  user.value.status = userData.status
  user.value.points = userData.experience
  user.value.nb_win = userData.gamesWon.length
  user.value.nb_loose = userData.gamesLost.length
  user.value.gameHistory = userData.gameHistory.map((game: any) => ({
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
    score: game.winner.id === user.value.id ? game.score.slice().sort((a: number, b: number) => b - a) : game.score.slice().sort((a: number, b: number) => a - b)
  }))
})

const { onResult: onFriendResult } = useQuery(
  gql`
    query isFriend($friendId: String!) {
      isFriend(id: $friendId)
      isBlocked(id: $friendId)
    }
  `,
  computed(() => {
    return { friendId: props.userId }
  }),
  {
    fetchPolicy: 'cache-and-network'
  }
)

onFriendResult((res) => {
  if (res.data?.isFriend) user.value.isFriend = res.data.isFriend
  if (res.data?.isBlocked) user.value.isBlocked = res.data.isBlocked
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
  user.value.isFriend = true
  notifs.notifyFollow(user.value.name)
}

function removeFriend(id: string) {
  const input = { friendsToRemove: [id] }
  mutate({ input })
  user.value.isFriend = false
  notifs.notifyUnfollow(user.value.name)
}

function blockUser(id: string) {
  const input = { usersToBlock: [id] }
  if (user.value.isFriend) removeFriend(id)
  mutate({ input })
  user.value.isBlocked = true
  notifs.notifyBlock(user.value.name)
}

function unblockUser(id: string) {
  const input = { usersToUnblock: [id] }
  mutate({ input })
  user.value.isBlocked = false
  notifs.notifyUnblock(user.value.name)
}

function redirectToUserAccount(userId: string) {
  router.push({
    name: 'profil',
    params: { id: userId }
  })
}

function inviteToGame(userId: string) {
  userStore.socket.emit('inviteToGame', { id: userId })
}

function spectateGame(userId: string) {
  userStore.socket.emit('spectateGame', { id: userId })
}
</script>

<template>
  <div class="card md:card-side bg-neutral shadow-xl md:w-3/4 xl:w-/ w-1/2 mx-auto">
    <figure>
      <img class="w-full md:h-full md:w-auto" :src="user.avatar" alt="Profile picture" />
    </figure>
    <div class="card-body">
      <div class="flex justify-between items-center">
        <h2 class="card-title mb-4 font-bold text-2xl">{{ user.name }}</h2>
        <div v-if="user.status == 'ONLINE'" className="badge badge-accent">Online</div>
        <div v-else-if="user.status == 'INGAME'" className="badge badge-warning">In game</div>
        <div v-else className="badge badge-error">Offline</div>
      </div>
      <p>Points: {{ user.points }}</p>
      <p>Rank: {{ user.rank }}</p>
      <p>Victoires: {{ user.nb_win }} | Defaites: {{ user.nb_loose }}</p>
      <div v-if="userStore.id && user.id && userStore.id !== user.id" class="flex">
        <div v-if="!user.isBlocked">
          <button
            v-if="!user.isFriend"
            class="text-green-500 hover:text-green-700 font-semibold"
            @click="addFriend(user.id)"
          >
            Follow
          </button>

          <button
            v-if="user.isFriend"
            class="text-red-500 hover:text-red-700 font-semibold"
            @click="removeFriend(user.id)"
          >
            Unfollow
          </button>

          <button
            class="text-white hover:text-gray-700 mx-3 font-semibold"
            @click="blockUser(user.id)"
          >
            Block User
          </button>
          <button
            v-if="user.status == 'ONLINE'"
            class="btn btn-primary"
            @click="inviteToGame(user.id)"
          >
            Invite to game
          </button>
          <button
            v-if="user.status == 'INGAME'"
            class="btn btn-primary"
            @click="spectateGame(user.id)"
          >
            Spectate game
          </button>
        </div>
        <button
          v-if="user.isBlocked"
          class="text-white hover:text-gray-700 mx-3 font-semibold"
          @click="unblockUser(user.id)"
        >
          Unblock User
        </button>
      </div>
    </div>
  </div>

  <div v-if="!user.isBlocked" class="container mx-auto px-4 sm:px-8">
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
                      <img class="w-full h-full rounded-full" :src="user.id == game.winner.id ? game.loser.avatar : game.winner.avatar" alt="" />
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
