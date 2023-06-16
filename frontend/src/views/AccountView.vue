<script setup lang="ts">
import { useRoute } from 'vue-router'
import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import { onMounted, ref, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const route = useRoute()
const user = ref({
    name: '',
    id: '',
	avatar: '',
	points: 0,
	nb_win: 0,
	nb_loose: 0,
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
    }
  }
  `,
  {
	userId: user.value.id,
  },
  {
	fetchPolicy: 'cache-and-network',
  }
)

watch(result, async (res) => {
  if (res) {
    const data = res.user
    if (!data) return
	const base64 = btoa(String.fromCharCode(...new Uint8Array(data.avatar.data)))
    const avatar = `data:image/png;base64,${base64}`
    user.value.name = res.user.name
	user.value.avatar = avatar
	user.value.points = res.user.experience
	user.value.nb_win = res.user.gamesWon.length
	user.value.nb_loose = res.user.gamesLost.length
  }
}, { immediate: true })

onMounted(() => {
  refetch()
})

</script>

<template>
  <div class="max-w-lg mx-auto my-10 bg-[#71717a] rounded-lg shadow-md p-5">
    <img class="w-32 h-32 rounded-full mx-auto" :src="user.avatar" alt="Profile picture">
    <h2 class="text-center text-2xl font-semibold text-black mt-3">{{ user.name }}</h2>
    <p class="text-center text-gray-600 mt-1">Points: {{ user.points }}</p>
	<!-- Wins and Looses -->
	<p class="text-center text-gray-600 mt-1">Victoires: {{ user.nb_win }} | Defaites: {{ user.nb_loose }}</p>
    <div class="flex justify-center mt-5">
      <a href="#" class="text-green-500 hover:text-green-700 mx-3 font-semibold">Add friend</a>
      <a href="#" class="text-white-500 hover:text-white-700 mx-3 font-semibold">Remove friend</a>
      <a href="#" class="text-red-500 hover:text-red-700 mx-3 font-semibold">Block</a>
    </div>
  </div>
</template>
