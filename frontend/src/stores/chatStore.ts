import { defineStore } from 'pinia'

export const useChatStore = defineStore({
  id: 'chat',
  state: () => ({
    listMessage: new Array(),
    message: ''
  }),
  actions: {
    sendMessage() {
      // storeUser.socket?.emit(this.message)
      this.listMessage.push(this.message)
      this.message = ''
    }
  }
})
