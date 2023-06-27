<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { type PropType, type Ref, ref, computed } from 'vue'
import { type User as gqlUser } from '@/graphql'
import router from '@/router'

interface IUser {
  id: string
  name: string
  avatar: string
  status: 'OFFLINE' | 'ONLINE' | 'INGAME'
}

const props = defineProps({
  relation: {
    required: true,
    type: String as PropType<'friends' | 'friendOf' | 'blocked' | 'blockedOf' | 'users'>,
    validator: (value: string) => {
      return ['friends', 'friendOf', 'blocked', 'blockedOf', 'users'].includes(value)
    }
  }
})

const relations: Ref<IUser[]> = ref([])

const GQL_QUERY =
  props.relation === 'users'
    ? gql`
        query users {
          users {
            id
            name
            status
            avatar
          }
        }
      `
    : gql`
		query relations {
			me {
				id
				${props.relation} {
					id
					name
					status
					avatar
				}
			}
		}
		`

const { onResult } = useQuery(GQL_QUERY, null, {
  fetchPolicy: 'cache-and-network'
})
onResult((res) => {
  if (!res.data) return
  const data = props.relation === 'users' ? res.data.users : res.data.me[props.relation]
  relations.value = data.map((user: gqlUser): IUser => {
    const base64 = btoa(String.fromCharCode(...new Uint8Array(user.avatar?.data)))
    const avatar = `data:image/png;base64,${base64}`
    return {
      ...user,
      status: user.status || 'OFFLINE',
      avatar
    }
  })
})

const { onResult: onResultStatus } = useQuery(
  gql`
    query users($ids: [String!]!) {
      usersByIds(ids: $ids) {
        id
        status
      }
    }
  `,
  computed(() => {
    return {
      ids: relations.value.map((user: IUser) => user.id)
    }
  }),
  {
    fetchPolicy: 'cache-and-network'
  }
)
onResultStatus((res) => {
  if (!res.data?.usersByIds) return
  relations.value = relations.value.map((user: IUser) => {
    const status = res.data.usersByIds.find((u: IUser) => u.id === user.id)?.status || 'OFFLINE'
    return {
      ...user,
      status
    }
  })
})

const onlyOnline = ref(false)
const reverse = ref(false)
const regex = ref('')
const relationsFiltered = computed(() => {
  let lrelations = relations.value.slice()
  if (reverse.value) {
    lrelations.reverse()
  }
  lrelations = lrelations.filter((user: IUser) => {
    if (onlyOnline.value && user.status === 'OFFLINE') return false
    if (regex.value) {
      try {
        const re = new RegExp(regex.value, 'i')
        if (!re.test(user.name)) return false
      } catch (e) {}
    }
    return true
  })
  return lrelations
})
</script>

<template>
  <div class="overflow-x-auto">
    <table class="table">
      <!-- head -->
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>
            <label class="cursor-pointer label">
              <span class="label-text mr-2">reverse</span>
              <input type="checkbox" class="toggle toggle-sm toggle-accent" v-model="reverse" />
            </label>
          </th>
          <th>
            <input
              type="text"
              placeholder="regex seach"
              class="input input-accent input-sm"
              v-model="regex"
            />
          </th>
          <th>
            <label class="cursor-pointer label">
              <span class="label-text mr-2">only online</span>
              <input type="checkbox" class="toggle toggle-sm toggle-accent" v-model="onlyOnline" />
            </label>
          </th>
        </tr>
        <tr v-for="(user, index) in relationsFiltered" :key="user.id">
          <th v-if="reverse">{{ relationsFiltered.length - index }}</th>
          <th v-else>{{ index + 1 }}</th>
          <td>
            <div className="flex items-center space-x-3">
              <div className="avatar">
                <div className="mask mask-squircle w-12 h-12">
                  <img :src="user.avatar" alt="Avatar" />
                </div>
              </div>
              <div>
                <div class="font-bold">
                  <a
                    class="font-semibold text-white hover:underline"
                    @click.prevent="router.push(`/profil/${user.id}`)"
                    >{{ user.name }}</a
                  >
                </div>
              </div>
            </div>
          </td>
          <td>
            <div v-if="user.status == 'ONLINE'" class="badge badge-accent">Online</div>
            <div v-else-if="user.status == 'INGAME'" class="badge badge-warning">In game</div>
            <div v-else class="badge badge-error">Offline</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
