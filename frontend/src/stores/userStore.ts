import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref({ name: 'John Doe' })

  return {
    user: computed(() => user.value),
    setName(name: string) {
      user.value.name = name
    }
  }
})
