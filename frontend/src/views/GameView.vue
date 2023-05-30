<script setup lang="ts">
import { onMounted, ref } from 'vue'

const pongCanvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  const canvas = pongCanvas.value;
  if (!canvas) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    color: 'white'
  };

  function drawBall() {
    context!.beginPath();
    context!.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context!.fillStyle = ball.color;
    context!.fill();
    context!.closePath();
  }

  drawBall();
});
</script>

<template>
  <canvas ref="pongCanvas" width="800" height="600" class="mx-auto bg-black"></canvas>
</template>
