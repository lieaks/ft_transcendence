import { GraphQLByte } from 'graphql-scalars'
import { useQuery } from '@vue/apollo-composable'
import { defineStore } from 'pinia'
import { ref, computed, type Ref } from 'vue'

export const useUserStore = defineStore('user', () => {
	const id = '';
	const jwtToken = ''
	const name = ref('name')
	const avatar = ref('')

	async function setName(newName: string) {
		// gpl mutate back
		name.value = newName
  }
	async function setAvatar(newAvatar: string) { // blob, buffer ?
		// gpl mutate back
		avatar.value = newAvatar
	}

	return { id, jwtToken, name, avatar, setName, setAvatar }
})
