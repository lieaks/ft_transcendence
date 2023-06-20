import { defineStore } from 'pinia'
import { useUserStore } from '@/stores/userStore'

export const useChatStore = defineStore({
  id: 'chat',
  state: () => ({
    listMessage: new Array(),
    message: ''
  }),
  actions: {
    sendMessage() {
      const userStore = useUserStore()
      console.log(userStore.socket)
      userStore.socket?.emit('sendMessage', { message: this.message })
      this.listMessage.push(this.message)
      this.message = ''
    }
  },
  persist: true,
})
