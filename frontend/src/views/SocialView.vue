<script setup lang="ts">
  import * as Notifications from "@/elements/Notifications";

  const notifs = Notifications.useNotifications();
</script>

<template>
  <h1 class="text-white text-1xl">fuzzy finder for profile, open profile component</h1>
  <h1 class="text-white text-1xl">same for blocked, blockedOf, friendsOf etc</h1>
  <div>
    <!-- <button @click="notifs.notifyGameInvite('Axel invite you in a game !')">Invite !</button> -->
    <!-- <button @click="notifs.notifyError('Error')">Error !</button> -->
    <!-- <button @click="notifs.notifySuccess('Valid')">Valid !</button> -->
  </div>
</template>
