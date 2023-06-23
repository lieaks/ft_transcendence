<script setup lang="ts">
import router from '@/router';
import winImg from '@/assets/win.jpg';
import loseImg from '@/assets/lose.jpg';

const props = defineProps({
  cardType: {
    type: String,
    required: true,
    validator: (value: string) => ['win', 'lose'].includes(value),
  },
})

const cardImage = props.cardType === 'win' ? winImg : loseImg
const cardAlt = props.cardType === 'win' ? 'win' : 'lose'
const cardTitle = props.cardType === 'win' ? 'You Win!' : 'You Lose!'

function backHome() {
  router.push(`/`)
}
</script>

<template>
  <div class="card w-96 bg-base-100 shadow-xl">
    <figure>
      <img :src="cardImage" :alt="cardAlt" />
    </figure>
    <div class="card-body items-center text-center">
      <h2 class="card-title">{{ cardTitle }}</h2>
      <button class="btn btn-primary" @click="backHome">Back Home</button>
    </div>
  </div>
</template>
