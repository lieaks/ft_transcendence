<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { ref, watch } from 'vue';

const userStore = useUserStore()
const user = ref({
  friends: [] as { name: string; avatar: string; id: string }[],
  friendOf: [] as { name: string; avatar: string; id: string }[]
})

const { result, refetch } = useQuery(
  gql`
    query user($userId: String!) {
      user(id: $userId) {
	  		friendOf {
				id
				name
				avatar
	  		}
	  		friends {
				id
				name
				avatar
	  		}
      }
    }
  `,
  {
    userId: userStore.id
  },
  {
    fetchPolicy: 'cache-and-network'
 	}
)

watch(
    result,
    async (res) => {
      if (res) {
        const data = res.user
        if (!data) return
				user.value.friends = data.friends.map((friend: any) => ({
					name: friend.name,
					avatar: `data:image/png;base64,${btoa(
						String.fromCharCode(...new Uint8Array(friend.avatar.data))
					)}`,
					id: friend.id
				}))
				user.value.friendOf = data.friendOf.map((friend: any) => ({
					name: friend.name,
					avatar: `data:image/png;base64,${btoa(
						String.fromCharCode(...new Uint8Array(friend.avatar.data))
					)}`,
					id: friend.id
				}))
      }
    },
    { immediate: true }
  )
</script>

<template>
	<div className="dropdown dropdown-hover dropdown-end ">
		<label tabIndex={0} className="btn m-1">Followers</label>
  	<ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
			<li v-for="follower in user.friendOf" className="menu-title">
				<div className="flex items-center">
					<img :src="follower.avatar" className="w-8 h-8 rounded-full" />
					<span className="ml-2 text-sm text-white font-semibold">{{ follower.name }}</span>
				</div>
			</li>
			<li v-if="user.friendOf.length === 0" className="menu-title">
				<span className="ml-2 text-sm text-white font-semibold">No followers</span>
			</li>
  	</ul>
  </div>
	<div className="dropdown dropdown-hover">
		<label tabIndex={0} className="btn m-1">Following</label>
  	<ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
			<li v-for="follow in user.friends" className="menu">
				<div className="flex items-center">
					<img :src="follow.avatar" className="w-8 h-8 rounded-full" />
					<span className="ml-2 text-sm text-white font-semibold">{{ follow.name }}</span>
				</div>
			</li>
			<li v-if="user.friends.length === 0" className="menu-title">
				<span className="ml-2 text-sm text-white font-semibold">No following</span>
			</li>
  	</ul>
  </div>
</template>