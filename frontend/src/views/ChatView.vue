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
  <ChannelList :availableChannels="availableChannels" />
  <div class="m-2">
    <ul>
      <li v-for="channel in joinedChannels" :key="channel.id" class="inline">
        <button class="btn btn-secondary m-2 normal-case" @click="activeChannel = channel">
          {{ channel.name }}
        </button>
      </li>
    </ul>
  </div>
  <ChatComponent v-if="joinedChannels.length" :channel="activeChannel || joinedChannels[0]" />
</template>
