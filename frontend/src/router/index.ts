import { createRouter, createWebHistory } from 'vue-router'
import GameView from '../views/GameView.vue'
import PlayView from '../views/PlayView.vue'
import HomeView from '../views/HomeView.vue'
import ChatView from '../views/ChatView.vue'
import FriendsView from '../views/FriendsView.vue'
import AccountView from '../views/AccountView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
	  {
		  path: '/',
		  name: 'home',
		  component: HomeView
	  },
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
		  component: FriendsView
	  },
	  {
		  path: '/account',
		  name: 'account',
		  component: AccountView
	  },
	  {
		  path: '/play',
		  name: 'play',
		  component: PlayView
	  }
  ]
})

export default router
