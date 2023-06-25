<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { type PropType, type Ref, ref } from 'vue'

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
					status
				}
			}
		}
	`, {
		fetchPolicy: 'cache-and-network',
	}
)
onResult((res) => {
  if (!res.data?.me) return
	relations.value = res.data.me[props.relation]
})
</script>

<template>
	<input type="text" placeholder="regex expression">
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
				<tr v-for="(user, index) in relations" :key="user.id">
					<th>{{index + 1}}</th>
					<td>avatar {{ user.name }}</td>
					<td>{{ user.status }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
