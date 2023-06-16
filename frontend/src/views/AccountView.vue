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
      id
      name
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
    user.value.name = res.user.name
  }
}, { immediate: true })

onMounted(() => {
  refetch()
})

</script>

<template>
    <!-- h1 text that print the id -->
    <h1 class="text-white text-1xl">Id = {{ user.id }}</h1>
    <h1 class="text-white text-1xl">Name = {{ user.name }}</h1>
  <!-- <h1 class="text-white text-1xl">show profile component, 2fa status, change username</h1> -->
</template>