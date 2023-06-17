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
  const inQueue = ref(false)

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
      const base64 = btoa(String.fromCharCode(...new Uint8Array(me.avatar.data))) // Convert buffer to base64
      avatar.value = `data:image/png;base64,${base64}`
    }
  })

	watch(socket, (newSocket) => {
			if (!newSocket) return
	})

	async function setName(newName: string) {
		// gpl mutate back
		name.value = newName
	}

	async function setAvatar(newAvatar: string) {
		// gpl mutate back
		avatar.value = newAvatar
	}

	function setGameId(id: string) { // TODO: remove if not used
		gameId.value = id
		console.log(`Game id set to ${id}`)
	}

	function setInQueue(val: boolean) { // TODO: remove if not used
		inQueue.value = val
	}

	return { id, name, avatar, socket, gameId, inQueue, setName, setAvatar, setGameId, setInQueue }
})
