import { GraphQLByte } from 'graphql-scalars'
import { useQuery } from '@vue/apollo-composable'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
	const id = '';
	const jwtToken = ''
	const name = ref('name')
	const avatar = ref<GraphQLByte>('')

	async function setName(newName: string) {
		// gpl mutate back
		name.value = newName
  }
	async function setAvatar(newAvatar: typeof GraphQLByte) { // blob, buffer ?
		// gpl mutate back
		avatar.value = newAvatar
	}

	return { id, jwtToken, name, avatar, setName, setAvatar }
})
