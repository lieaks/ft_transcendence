<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { type PropType, type Ref, ref, computed } from 'vue'
import { type User as gqlUser } from '@/graphql'
import router from '@/router';

interface IUser {
  id: string
  name: string
  avatar: string
  status: 'OFFLINE' | 'ONLINE' | 'INGAME'
}

const props = defineProps({
	relation: {
		required: true,
		type: String as PropType<'friends' | 'friendOf' | 'blocked' | 'blockedOf'>,
		validator: (value: string) => {
			return ['friends', 'friendOf', 'blocked', 'blockedOf'].includes(value);
		},
	}
});

const relations: Ref<IUser[]> = ref([])

const { onResult } = useQuery(
  gql`
		query relations {
			me {
				id
				${props.relation} {
					id
					name
					avatar
				}
			}
		}
		`, null,
	{
		fetchPolicy: 'cache-and-network',
	}
)
onResult((res) => {
  if (!res.data?.me) return
	relations.value = res.data.me[props.relation].map((user: gqlUser): IUser => {
		const base64 = btoa(String.fromCharCode(...new Uint8Array(user.avatar?.data)))
		const avatar = `data:image/png;base64,${base64}`
		return {
			...user,
			status: user.status || 'OFFLINE',
			avatar,
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
		`, computed(() => {
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
			status,
		}
	})
})
function redirectToUserAccount(userId: string) {
	router.push(`/profil/${userId}`)
}
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
					<th class="w-1/2">
						<input type="text" placeholder="number search" class="input input-secondary input-sm">
					</th>
					<th class="w-1/2">
						<input type="text" placeholder="regex seach" class="input input-secondary input-sm">
					</th>
					<th class="w-1/2">
						check box
					</th>
				</tr>
				<tr v-for="(user, index) in relations" :key="user.id">
					<th>{{index + 1}}</th>
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
                    href="#"
                    class="font-semibold text-white hover:underline"
                    @click.prevent="redirectToUserAccount(user.id)"
                    >{{ user.name }}</a
                  >
                </div>
              </div>
            </div>
          </td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
