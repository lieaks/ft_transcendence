<script setup lang="ts">
import ChatComponent from '@/components/chat/ChatComponent.vue'
import ChannelList from '@/components/chat/ChannelList.vue'
import type { IChannel, IUser, IMessage } from '@/interfaces/chat.interfaces'
import { useUserStore } from '@/stores/userStore'
import { ref, type Ref } from 'vue'

const user = useUserStore()

let availableChannels: Ref<IChannel[]> = ref([] as IChannel[])
let joinedChannels: Ref<IChannel[]> = ref([] as IChannel[])
let activeChannel: Ref<IChannel | undefined> = ref(undefined)
user.socket.emit('channelAvailable')

user?.socket.on('channelAvailable', (newChannels: IChannel[]) => {
  availableChannels.value = newChannels
})
user?.socket.on('newChannel', (newChannel: IChannel) => {
  if (!newChannel) return
  availableChannels.value.push(newChannel)
})

user?.socket.on('userJoined', (newUser: { channelId: string; user: IUser }) => {
  if (!newUser) return
  let channel = joinedChannels.value.find((channel) => channel.id === newUser.channelId)
  if (channel) {
    channel.users.push(newUser.user)
  } else {
    availableChannels.value = availableChannels.value.filter((c) => {
      if (c.id === newUser.channelId) {
        if (!c.users) c.users = []
        c?.users.push(newUser.user)
        joinedChannels.value.push(c)
        return false
      } else {
        return true
      }
    })
  }
})

user?.socket.on('userLeft', (leftUser: { channelId: string; user: IUser }) => {
  if (!leftUser) return
  let channel = joinedChannels.value.find((channel) => channel.id === leftUser.channelId)
  if (channel) {
    if (user?.id === leftUser.user.id) {
      joinedChannels.value = joinedChannels.value.filter((c) => c.id !== leftUser.channelId)
      availableChannels.value.push(channel)
    }
    else channel.users = channel.users.filter((c_user) => c_user.id !== leftUser.user.id)
  }
})

user?.socket.on('channelInfo', (channelInfo: { channelId: string; messages: IMessage[]; users: IUser[] }) => {
  if (!channelInfo?.channelId || !channelInfo?.messages || !channelInfo?.users) return
  let channel = joinedChannels.value.find((channel) => channel.id === channelInfo.channelId)
  if (channel) {
    channel.messages = channelInfo.messages
    channel.users = channelInfo.users
  }
})


user?.socket.on('newMessage', (newMessage: { channelId: string; message: IMessage }) => {
  if (!newMessage?.channelId || !newMessage?.message) return
  let channel = joinedChannels.value.find((channel) => channel.id === newMessage.channelId)
  if (channel) {
    if (!channel.messages) channel.messages = []
    channel.messages.push(newMessage.message)
  }
})

</script>

<template>
	<div class="pl-4 p-1 overflow-auto w-full">
    <p class="mb-1">available channels:</p>
    <ChannelList :availableChannels="availableChannels" />
  </div>
	<div class="pl-4 p-1 overflow-auto w-full" v-if="joinedChannels.length">
		<p class="mb-1">joined channels:</p>
    <ul>
      <li v-for="channel in joinedChannels" :key="channel.id" class="inline mr-2">
        <button
          class="btn btn-sm btn-secondary normal-case"
          :class="{ 'outline outline-offset-1': channel === (activeChannel || joinedChannels[0]) }"
          @click="activeChannel = channel"
        >
          {{ channel.name }}
        </button>
      </li>
    </ul>
  </div>
	<div class="pl-4 p-1 w-full h-full">
		<ChatComponent v-if="joinedChannels.length" :channel="activeChannel || joinedChannels[0]" />
	</div>
</template>
