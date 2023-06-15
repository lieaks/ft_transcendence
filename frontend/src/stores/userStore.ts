import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { Socket } from 'socket.io-client'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export const useUserStore = defineStore('user', () => {
  const id = ''
  const name = ref('name')
  const avatar = ref('')
  const socket = ref<Socket>()
  const gameId = ref('')
  const inQueue = ref(false);

  const { result } = useQuery(
    gql`
      query me {
        me {
          name
          avatar
        }
      }
    `,
    { fetchPolicy: 'cache-and-network' }
  )
  watch(result, async (res) => {
    if (res) {
      const me = res.me
      if (!me) return
      name.value = me.name
      avatar.value = me.avatar
    }
  })

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

  return { id, name, avatar, socket, gameId, inQueue, setName, setAvatar, setGameId, setInQueue }
})
