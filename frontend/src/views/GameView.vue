<script setup lang="ts">
// Import
</script>

<template>
	<!-- <h1>Game</h1> -->

	<div class="flex justify-center">
		<img src="../assets/basic_map/ScoreBarP1.png" alt="ScoreBar" class="transform -scale-x-100 w-1/5" />
		<img src="../assets/basic_map/ScoreBarP2.png" alt="ScoreBar" class="w-1/5" />
	</div>
	<div class="w-2/3 mx-auto relative">
		<img src="../assets/basic_map/Board.png" alt="Board" class="w-full" />
		<img src="../assets/basic_map/Player1.png" alt="Player1" class="absolute left-0 top-1/2 transform -translate-y-1/2" />
		<img src="../assets/basic_map/Player2.png" alt="Player2" class="absolute right-0 top-1/2 transform -translate-y-1/2" />
	</div>

	<img src="../assets/basic_map/redBall.png" alt="Ball" class="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2" />
</template>
  
<style>
	/* * {
		border: 1px solid red;
	} */
</style>
