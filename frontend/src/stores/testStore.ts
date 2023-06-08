import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTestStore = defineStore('test', () => {
  return {
    user: computed(() => user.value),
    setName(name: string) {
      user.value.name = name
    }
  }
})   
