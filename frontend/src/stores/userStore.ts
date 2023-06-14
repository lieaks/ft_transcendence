import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { Socket } from 'socket.io-client'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export const useUserStore = defineStore('user', () => {
  const id = ref('')
  const name = ref('name')
  const avatar = ref('')
  const socket = ref<Socket>()
  const gameId = ref('')
  const inQueue = ref(false);

  const { result, variables } = useQuery(
    gql`
      query user($id: String!) {
        user(id: $id) {
          name
          avatar
        }
      }
    `,
    { id: id.value },
    { fetchPolicy: 'cache-and-network' }
  )
  watch(result, async (res) => {
    if (res) {
      const user = res.user
			if (!user) return
      name.value = user.name
      avatar.value = user.avatar
    }
  })

  async function setId(newId: string) {
    id.value = newId
    variables.value = {
      id: newId
    }
  }

  async function setName(newName: string) {
    // gpl mutate back
    name.value = newName
  }

  async function setAvatar(newAvatar: string) {
    // gpl mutate back
    avatar.value = newAvatar
  }

  function setGameId(id: string) {
    gameId.value = id
    console.log(`Game id set to ${id}`)
  }

  function setInQueue(val: boolean) {
	inQueue.value = val;
  }

  return { id, name, avatar, socket, gameId, inQueue, setId, setName, setAvatar, setGameId, setInQueue }
})
