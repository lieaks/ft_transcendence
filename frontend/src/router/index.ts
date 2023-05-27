import { createRouter, createWebHistory } from 'vue-router'
import GameView from '../views/GameView.vue'
import ChatView from '../views/ChatView.vue'
import ChatView from '../views/ChatView.vue'
import accountView from '../views/accountView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
	  {
		  path: '/game',
		  name: 'game',
		  component: GameView
	  },
	  {
		  path: '/chat',
		  name: 'chat',
		  component: ChatView
	  },
	  {
		  path: '/friends',
		  name: 'friends',
		  component: friendsView
	  },
	  {
		  path: '/account',
		  name: 'account',
		  component: accoutView
	  },
  ]
})

export default router
