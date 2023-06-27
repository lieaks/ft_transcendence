<template>
    <form class="z-[2] flex flex-col items-center justify-center bg-base-100 shadow-xl border border-white bg-black rounded-lg" @submit.prevent="submit">
      <div class="flex flex-col items-center justify-center">
        <label for="avatar" class="mb-2">New avatar:</label>
        <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" v-on:change="updateAvatar" />
      </div>
      <div class="flex flex-col items-center justify-center">
        <label for="name" class="mb-2">New name:</label>
        <input type="text" id="name" name="name" v-model="name" />
      </div>
      <input type="submit" value="Submit" class="btn mt-4" />
    </form>
</template>

<script setup lang="ts">
import gql from 'graphql-tag'
import { useMutation } from '@vue/apollo-composable';

const { mutate } = useMutation(
  gql`
    mutation UpdateUser($input: UpdateUserInput!) {
      updateUser(input: $input) {
        name
        avatar
      }
    }
  `
)

let name = '';
let avatar: string;

function updateAvatar(event: any) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = () => {
    const buffer = new Uint8Array(reader.result as ArrayBuffer);
    avatar = btoa(String.fromCharCode.apply(null, Array.from(buffer)));
  };
}

function submit() {
  const input: any = {
  };
  if (name !== '') {
    input.name = name;
  }
  if (avatar !== undefined) {
    input.avatar = avatar;
  }
  mutate({
    input: input
  })
}
</script>
