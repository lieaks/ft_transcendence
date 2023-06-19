<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useLazyQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { io } from 'socket.io-client'
import { onMounted, ref, watch } from 'vue'
import router from '@/router'

const route = useRoute()
const user = useUserStore()

user.id = ''
user.name = ''
user.avatar = ''

const progress_value = ref(10)
const error = ref('')
const totpinput = ref('')
let totpmodal = document.getElementById('totpmodal') as HTMLDialogElement

function extractQueryParam<T>(paramName: string): T {
  let value: T = '' as unknown as T
  const paramValue = route.query[paramName]
  if (Array.isArray(paramValue) && paramValue.length > 0) {
    value = paramValue[0]?.toString() as unknown as T
  } else if (paramValue) {
    value = paramValue.toString() as unknown as T
  }
  return value
}

const id = extractQueryParam<string>('id')
if (id) user.id = id

const jwtToken = extractQueryParam<string>('jwtToken')
if (jwtToken) localStorage.setItem('jwtToken', jwtToken)

let twoFactorAuth: Boolean = extractQueryParam<string>('twoFactorAuth') === 'true'

const { onResult: onResultMe, load: loadMe } = useLazyQuery(
  gql`
    query me {
      me {
        name
        avatar
      }
    }
  `,
  { fetchPolicy: 'network-only' }
)
onResultMe(async (res) => {
  if (res.data) {
    const me = res.data.me
    if (!me) {
      error.value += 'No user found\n'
      return
    }
    user.name = me.name
    const base64 = btoa(String.fromCharCode(...new Uint8Array(me.avatar.data)))
    user.avatar = `data:image/png;base64,${base64}`
    progress_value.value += 30
  }
})

const { onDone: onDone2FA, mutate: submit2FA } = useMutation(
  gql`
    mutation submit2FA($code: String!) {
      submit2FA(code: $code)
    }
  `, { fetchPolicy: 'no-cache' }
)

onDone2FA(async (res) => {
	if (res.data?.submit2FA) {
		totpmodal = document.getElementById('totpmodal') as HTMLDialogElement
		totpmodal?.close()
		twoFactorAuth = false
	}
})

watch(totpinput, async (value) => {
	totpinput.value = value.replace(/\D/g, '')
	if (value.toString().length === 6) {
		submit2FA({ code: value.toString() })
	}
})

onMounted(async () => {
	if (twoFactorAuth) {
		const totpmodal = document.getElementById('totpmodal') as HTMLDialogElement
		totpmodal?.showModal()
		while (twoFactorAuth) {
			await new Promise((r) => setTimeout(r, 100))
		}
	}
	progress_value.value += 20

	loadMe()

	user.socket = io(import.meta.env.VITE_BACKEND_URL)
	user.socket.on('connect', () => {
		progress_value.value += 20
		console.log("JWT Token: " + localStorage.getItem('jwtToken')) 
		user.socket?.emit('login', { jwtToken: localStorage.getItem('jwtToken') })
	})
	user.socket?.on('logged', (data) => {
		if (data === 'success') {
			progress_value.value += 20
		} else {
			error.value += data + '\n'
		}
	})
})

watch(progress_value, (value) => {
	if (value >= 100) {
		router.push('/')
	}
})
</script>

<template>
	<div class="h-screen">
		<dialog class="modal" id="totpmodal">
			<div class="modal-box">
				<h3 class="font-bold text-lg text-center m-2">a 2FA TOTP is needed</h3>
				<div>
					<input
						type="text"
						maxlength="6"
						class="input input-primary input-bordered m-2 w-full"
						v-model="totpinput"
						placeholder="code"
					/>
				</div>
			</div>
		</dialog>
		<span class="loading loading-infinity scale-[4] text-primary absolute left-1/2 top-1/3"></span>
		<progress
			class="progress w-1/2 progress-primary absolute left-1/4 top-1/2"
			:value="progress_value"
			max="100"
		></progress>
		<span v-if="error" class="text-red-500 absolute text-center w-screen text-2xl top-3/4">{{
			error
			}}</span>
	</div>
</template>
