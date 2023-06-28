<template>
	<button
		class="bg-neutral-700 hover:bg-neutral-800 btn"
		@click="showModal"
	>
		Edit
	</button>
  <dialog id="my_modal_2" class="modal" ref="modal">
    <form method="dialog" class="modal-box" @submit.prevent="submit">
      <div class="flex flex-col items-center justify-center">
        <label for="avatar" class="mb-2">New avatar:</label>
        <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" v-on:change="updateAvatar" />
      </div>
      <div class="flex flex-col items-center justify-center">
        <label for="name" class="mb-2">New name:</label>
        <input type="text" id="name" name="name" v-model="name" maxlength="20" />
      </div>
      <input type="submit" value="Submit" class="btn mt-4" />
    </form>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import gql from 'graphql-tag'
import { useMutation } from '@vue/apollo-composable';
import { ref, type Ref } from 'vue';

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
const modal: Ref<HTMLDialogElement | null> = ref(null)

function updateAvatar(event: any) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = () => {
    const buffer = new Uint8Array(reader.result as ArrayBuffer);
    avatar = btoa(String.fromCharCode.apply(null, Array.from(buffer)));
  };
}

function showModal() {
  modal.value?.showModal()
}

function submit() {
  const input: any = {};
  if (name !== '') {
    input.name = name;
  }
  if (avatar !== undefined) {
    input.avatar = avatar;
  }
  mutate({
    input: input
  })
  modal.value?.close()
  window.location.reload();
}
</script>
