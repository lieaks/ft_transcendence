<template>
  <button class="bg-neutral-700 hover:bg-neutral-800 btn" @click="showModal">Edit</button>
  <dialog id="my_modal_2" class="modal" ref="modal">
    <form method="dialog" class="modal-box" @submit.prevent="submit">
      <div class="flex flex-col items-center justify-center">
        <label for="avatar" class="mb-2">New avatar:</label>
        <input
          type="file"
          id="avatar"
          name="avatar"
          accept="image/png, image/jpeg"
          class="m-2 file-input file-input-bordered file-input-primary w-full max-w-xs"
          v-on:change="updateAvatar"
        />
				<span class="text-red-500">{{error}}</span>
      </div>
      <div class="flex flex-col items-center justify-center">
        <label for="name" class="mb-2">New name:</label>
        <input
          type="text"
          id="name"
          name="name"
          v-model="name"
          class="input input-primary"
          placeholder="name"
          maxlength="20"
        />
      </div>
      <button class="btn btn-primary" @click="enable2fa">Enable 2FA</button>
      <button class="btn btn-primary" @click="disable2FAInput">Disable 2FA</button>
      <input
        type="text"
        id="code"
        name="code"
        v-model="code"
        class="input input-primary"
        placeholder="2FA code"
        maxlength="6"
      />
      <input type="submit" value="Submit" class="btn mt-4" />
    </form>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import gql from 'graphql-tag'
import { useMutation } from '@vue/apollo-composable'
import { ref, type Ref } from 'vue'
import { useUserStore } from '@/stores/userStore';
import * as Notifications from '@/elements/Notifications'
import QrcodeVue from 'qrcode.vue'

const notifs = Notifications.useNotifications()

const user = useUserStore()

const { mutate, onDone, onError } = useMutation(
  gql`
    mutation UpdateUser($input: UpdateUserInput!) {
      updateUser(input: $input) {
				id
        name
        avatar
      }
    }
  `
)

const { mutate: enable2fa, onDone: onDone2fa } = useMutation(
  gql`
    mutation enable2FA {
      enable2FA
    }
  `
)

const { mutate: disable2fa, onDone: onDoneDisable2fa, onError: onErrorDisable2fa   } = useMutation(
  gql`
    mutation Disable2FA($code: String!) {
      disable2FA(code: $code)
    }
  `
)

function disable2FAInput() {
  disable2fa({
    variables: {
      code: code
    }
  })
}

let name = ''
let code = ''
let avatar: string
const error = ref('')
const modal: Ref<HTMLDialogElement | null> = ref(null)

function updateAvatar(event: any) {
  const file = event.target.files[0]
  const reader = new FileReader()
  reader.readAsArrayBuffer(file)
  reader.onload = () => {
		try {
			error.value = ''
			const buffer = new Uint8Array(reader.result as ArrayBuffer)
			avatar = btoa(String.fromCharCode.apply(null, Array.from(buffer)))
		} catch (e){
			if (e instanceof Error && e.message == 'too many arguments provided for a function call') {
				error.value = 'File too big'
			} else {
				error.value = e as any
			}
		}
  }
}

function showModal() {
  modal.value?.showModal()
}

function submit() {
  const input: any = {}
  if (name !== '') {
    input.name = name
  }
  if (avatar !== undefined) {
    input.avatar = avatar
  }
  mutate({
    input: input
  })
  modal.value?.close()
}

onDone((res) => {
	if (res.data.updateUser) {
		const data = res.data.updateUser
		user.name = data.name
    const base64 = btoa(String.fromCharCode(...new Uint8Array(data.avatar.data)))
    user.avatar = `data:image/png;base64,${base64}`
	}
})
onError((err) => {
	notifs.notifyError(err.name + ' ' + err.message)
})

onDone2fa((res) => {
  if (res.data.enable2FA) {
    notifs.notifyError('2FA code: ' + res.data.enable2FA)
    console.log(res.data.enable2FA)
  }
})

onDoneDisable2fa((res) => {
  if (res.data.disable2FA) {
    notifs.notifyError('2FA disabled')
  } else {
    notifs.notifyError('2FA not disabled')
  }
})

onErrorDisable2fa((err) => {
  notifs.notifyError(err.name + ' ' + err.message)
})
</script>
