<script setup lang="ts">
import router from '@/router'
import winImg from '@/assets/win.jpg'
import loseImg from '@/assets/lose.jpg'

const props = defineProps({
  cardType: {
    type: String,
    required: true,
    validator: (value: string) => ['win', 'lose'].includes(value)
  },
  score: {
    type: Array,
    required: true,
    validator: (value: number[]) => value.length === 2
  }
})

const cardImage = props.cardType === 'win' ? winImg : loseImg
const cardAlt = props.cardType === 'win' ? 'win' : 'lose'
const cardTitle = props.score

function backHome() {
  router.push(`/`)
}
</script>

<template>
  <div class="popup fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
    <div class="card w-96 bg-base-100 shadow-xl border border-white bg-black">
      <figure>
        <img :src="cardImage" :alt="cardAlt" />
      </figure>
      <div class="card-body items-center text-center">
        <h2 class="card-title">{{ cardTitle[0] }} - {{ cardTitle[1] }}</h2>
        <button class="btn btn-primary" @click="backHome">Back Home</button>
      </div>
    </div>
  </div>
</template>
