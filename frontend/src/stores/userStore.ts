import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { Socket } from 'socket.io-client'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    id: '',
    name: '',
    avatar: '',
    socket: null as Socket | null,
    gameId: '',
    inQueue: false,
  }),
  actions: {
    async setName(newName: string) {
      // gpl mutate back
      this.name = newName
    },

    async setAvatar(newAvatar: string) {
      // gpl mutate back
      this.avatar = newAvatar
    },

    setGameId(id: string) {
      // TODO: remove if not used
      this.gameId = id
      console.log(`Game id set to ${id}`)
    },

    setInQueue(val: boolean) {
      // TODO: remove if not used
      this.inQueue = val
    },

    setupStore() {
      const { result } = useQuery(
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

      watch(result, async (res) => {
        console.log('new result')
        if (res) {
          const me = res.me
          console.log('new result with res', me)
          if (!me) return
          this.name = me.name
          this.id = me.id
          const base64 = btoa(String.fromCharCode(...new Uint8Array(me.avatar.data))) // Convert buffer to base64
          this.avatar = `data:image/png;base64,${base64}`
        }
      })
    },
  },
  persist: true,
})