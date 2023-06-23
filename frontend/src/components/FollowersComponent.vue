<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import router from '@/router'

const user  = useUserStore()

function redirectToUserAccount(userId: string) {
  router.push(`/profil?id=${userId}`)
}
</script>

<template>
	<div className="dropdown dropdown-hover dropdown-end ">
		<label tabIndex={0} className="btn m-1">Followers</label>
  	<ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
			<li v-for="follower in user.friendOf" className="menu-title">
				<div className="flex items-center">
					<!-- <img :src="follower.avatar" className="w-8 h-8 rounded-full" /> -->
					<a href="#" class="font-semibold text-white hover:underline" @click.prevent="redirectToUserAccount(follower.id)">
						{{ follower.name }}
					</a>
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
					<!-- <img :src="follow.avatar" className="w-8 h-8 rounded-full" /> -->
					<a href="#" class="font-semibold text-white hover:underline" @click.prevent="redirectToUserAccount(follow.id)">
						{{ follow.name }}
					</a>
				</div>
			</li>
			<li v-if="user.friends.length === 0" className="menu-title">
				<span className="ml-2 text-sm text-white font-semibold">No following</span>
			</li>
  	</ul>
  </div>
</template>