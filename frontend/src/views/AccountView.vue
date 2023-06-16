<script setup lang="ts">
import { useRoute } from 'vue-router'
import gql from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'
import { onMounted, ref, watch } from 'vue'

const route = useRoute()
const user = ref({
    name: '',
    id: '',
})

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
    variables: {
        userId: "3eb82a25-f26f-41bc-a397-5ae33dc9b2b8"
    }
  },
  {
	fetchPolicy: 'cache-and-network',
  }
)

watch(result, async (res) => {
  console.log("test1")
  if (res) {
    console.log("test2")
    const data = res.user
    if (!data) return
    console.log("test3")
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