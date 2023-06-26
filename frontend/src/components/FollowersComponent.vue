<script setup lang="ts">
import router from '@/router'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref } from 'vue'

interface Player {
  id: string
  name: string
  avatar: string
}

const followers = ref({
  friendOf: [] as Player[],
  friends: [] as Player[]
})

const { onResult } = useQuery(
  gql`
    query me {
      me {
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
  `, null,
  {
    fetchPolicy: 'cache-and-network'
  }
)

onResult((res) => {
  const followersRes = res.data?.me
  if (!followersRes) return
  followers.value.friendOf = followersRes.friendOf
  followers.value.friends = followersRes.friends
})

function redirectToUserAccount(userId: string) {
  router.push(`/profil/${userId}`)
}
</script>

<template>
  <div className="dropdown dropdown-hover dropdown-end ">
    <label tabIndex="{0}" className="btn md:mr-2 mb-1">Followers</label>
    <ul
      tabIndex="{0}"
      className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
    >
      <li v-for="follower in followers.friendOf" className="menu-title">
        <div className="flex items-center">
          <!-- <img :src="follower.avatar" className="w-8 h-8 rounded-full" /> -->
          <a
            href="#"
            class="font-semibold text-white hover:underline"
            @click.prevent="redirectToUserAccount(follower.id)"
          >
            {{ follower.name }}
          </a>
        </div>
      </li>
      <li v-if="followers.friendOf.length === 0" className="menu-title">
        <span className="ml-2 text-sm text-white font-semibold">No followers</span>
      </li>
    </ul>
  </div>
  <div className="dropdown dropdown-hover">
    <label tabIndex="{0}" className="btn">Following</label>
    <ul
      tabIndex="{0}"
      className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
    >
      <li v-for="follow in followers.friends" className="menu">
        <div className="flex items-center">
          <!-- <img :src="follow.avatar" className="w-8 h-8 rounded-full" /> -->
          <a
            href="#"
            class="font-semibold text-white hover:underline"
            @click.prevent="redirectToUserAccount(follow.id)"
          >
            {{ follow.name }}
          </a>
        </div>
      </li>
      <li v-if="followers.friends.length === 0" className="menu-title">
        <span className="ml-2 text-sm text-white font-semibold">No following</span>
      </li>
    </ul>
  </div>
</template>
