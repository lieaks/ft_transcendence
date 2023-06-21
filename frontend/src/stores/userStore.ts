import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { Socket } from 'socket.io-client'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import router from '@/router'
import { useRoute } from 'vue-router'

export const useUserStore = defineStore('user', () => {
  const route = useRoute()
  const id = ref('')
  const name = ref('name')
  const avatar = ref('')
  const socket = ref<Socket>()
  const gameId = ref('')
  const inQueue = ref(false)

  const { onResult, onError, loading } = useQuery(
    gql`
      query me {
        me {
          name
          avatar
          id
        }
      }
    `,
    { fetchPolicy: 'cache-and-network' }
  )
  onResult((res) => {
    const me = res.data?.me
    if (!me) return
    name.value = me.name
    id.value = me.id
    const base64 = btoa(String.fromCharCode(...new Uint8Array(me.avatar.data))) // Convert buffer to base64
    avatar.value = `data:image/png;base64,${base64}`
  })
  onError((err) => {
    if (err.message === 'Unauthorized' && !['login', 'authCallback'].includes(route.name as string))
      router.push('/login')
  })

  watch(socket, (newSocket) => {
    // TODO: remove if not used
    if (!newSocket) return
  })

  async function setName(newName: string) {
    // TODO: gpl mutate back
    name.value = newName
  }

  async function setAvatar(newAvatar: string) {
    // TODO: gpl mutate back
    avatar.value = newAvatar
  }

  function setGameId(id: string) {
    // TODO: remove if not used
    gameId.value = id
    console.log(`Game id set to ${id}`)
  }

  function setInQueue(val: boolean) {
    // TODO: remove if not used
    inQueue.value = val
  }

  return {
    loading,
    id,
    name,
    avatar,
    socket,
    gameId,
    inQueue,
    setName,
    setAvatar,
    setGameId,
    setInQueue
  }
})
