<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderComponent from './components/HeaderComponent.vue'
import { KeepAlive } from 'vue';
</script>

<template>
  <HeaderComponent class="mb-2" />

	<router-view v-slot="{ Component }">
		<keep-alive include="ChatView">
			<component :is="Component" />
		</keep-alive>
	</router-view>

</template>
