<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Ball } from '../stores/Ball';
import { Paddle } from '../stores/Paddle';
import { Game } from '../stores/Game';

const pongCanvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {

	const canvas = pongCanvas.value;
	if (!canvas) return;

	const ball = new Ball(canvas.width / 2, canvas.height / 2, 10, 'white');

	const paddle = {
		width: 20,
		height: 175,
		speed: 10
	}

	const leftPaddle = new Paddle(canvas.width - 20 - paddle.width,
		canvas.height / 2 - paddle.height / 2,
		paddle.width, paddle.height,
		paddle.speed,
		'blue'
	);

	const rightPaddle = new Paddle(20,
		canvas.height / 2 - paddle.height / 2,
		paddle.width, paddle.height,
		paddle.speed,
		'red'
	);

	const game = new Game(canvas, ball, leftPaddle, rightPaddle);

    window.addEventListener('keydown', (event) => {
		if (event.key === 'w' || event.key === 's') {
			game.updateLeftPaddlePosition(event.key);
		}
        if (event.key === 'i' || event.key === 'k') {
            game.updateRightPaddlePosition(event.key);
        }
    });

	game.render();
});
</script>

<template>
	<canvas ref="pongCanvas" width="1600" height="800" class="mx-auto bg-black"></canvas>
</template>

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