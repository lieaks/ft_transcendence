<script setup lang="ts">
import ChatComponent from '@/components/chat/ChatComponent.vue'
import ChannelList from '@/components/chat/ChannelList.vue'
import { type IChannel, type IUser, type IMessage, chatType } from '@/interfaces/chat.interfaces'
import { useUserStore } from '@/stores/userStore'
import { ref, type Ref } from 'vue'

const user = useUserStore()

let availableChannels: Ref<IChannel[]> = ref([] as IChannel[])
let joinedChannels: Ref<IChannel[]> = ref([] as IChannel[])
let activeChannel: Ref<IChannel | undefined> = ref(undefined)

user?.socket.on('channelAvailable', (newChannels: IChannel[]) => {
  availableChannels.value = newChannels.filter((channel) => !joinedChannels.value.some((c) => c.id === channel.id))
})
user?.socket.on('newChannel', (newChannel: IChannel) => {
  if (!newChannel) return
	if (newChannel.type === chatType.PRIVATE) {
		newChannel.name = newChannel.users?.find((u) => u.id !== user.id)?.name ?? newChannel.name
		joinedChannels.value.push(newChannel)
	} else {
		availableChannels.value.push(newChannel)
	}
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
    } else channel.users = channel.users.filter((c_user) => c_user.id !== leftUser.user.id)
  }
})

user?.socket.on(
  'channelInfo',
  (channelInfo: { channelId: string; messages: IMessage[]; users: IUser[]; type: chatType }) => {
    if (!channelInfo?.channelId) return
    let channel = joinedChannels.value.find((channel) => channel.id === channelInfo.channelId)
    if (!channel) {
      channel = availableChannels.value.find((channel) => channel.id === channelInfo.channelId)
    }
    if (!channel) return
    channel.messages = channelInfo.messages ?? channel.messages
    channel.users = channelInfo.users ?? channel.users
    channel.type = channelInfo.type ?? channel.type
  }
)

user?.socket.on('newMessage', (newMessage: { channelId: string; message: IMessage }) => {
  if (!newMessage?.channelId || !newMessage?.message) return
  let channel = joinedChannels.value.find((channel) => channel.id === newMessage.channelId)
  if (channel) {
    if (!channel.messages) channel.messages = []
    channel.messages.push(newMessage.message)
  }
})

user?.socket.on('channelDeleted', (channelData: { channelId: string }) => {
  const channelId = channelData.channelId
  if (!channelId) return
  joinedChannels.value = joinedChannels.value.filter((c) => c.id !== channelId)
  availableChannels.value = availableChannels.value.filter((c) => c.id !== channelId)
  if (activeChannel?.value?.id === channelId) activeChannel.value = joinedChannels.value[0]
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
        <div class="mr-2 indicator">
          <span v-if="channel.type == chatType.PROTECTED" class="indicator-item">🔐</span>
          <span v-else-if="channel.type == chatType.PRIVATE" class="indicator-item">🧑‍🤝‍🧑</span>
          <span v-else class="indicator-item translate-x-[0.2rem] translate-y-[-0.6rem]">🌎</span>
          <button
            class="btn btn-sm btn-secondary normal-case"
            :class="{
              'outline outline-offset-1': channel === (activeChannel || joinedChannels[0])
            }"
            @click="activeChannel = channel"
          >
            {{ channel.name }}
          </button>
        </div>
      </li>
    </ul>
  </div>
  <div class="pl-4 p-1 w-full h-full">
    <ChatComponent v-if="joinedChannels.length" :channel="activeChannel || joinedChannels[0]" />
  </div>
</template>
