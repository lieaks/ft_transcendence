<template>
    <canvas ref="pongCanvas" width="1600" height="800" class="mx-auto bg-black"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Game } from '@/elements/Game.js';
import { io } from 'socket.io-client';

const pongCanvas = ref<HTMLCanvasElement | null>(null);
const socket = io('http://localhost:3000');

onMounted(() => {

    const canvas = pongCanvas.value;
    if (!canvas) return;

    const game = new Game(canvas);

    window.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'w':
            socket.emit('movePaddle', { direction: 'up' });
            break;

            case 's':
            socket.emit('movePaddle', { direction: 'down' });
            break;
        }
    });

    socket.on('movePaddle', (data) => {
        console.log(data);
        if (data.player === 'left') {
            game.updateLeftPaddlePosition(data.direction);
        } else {
            game.updateRightPaddlePosition(data.direction);
        }
    });

    setInterval(() => {
        game.draw();
    }, 1000 / 60);
});
</script>

<style scoped>
    /* Debug border */
    /* * {
        border: 1px solid red;
    } */
    canvas {
        width: 100vw;
        height: auto;
        max-width: 1600px;
    }
</style>
