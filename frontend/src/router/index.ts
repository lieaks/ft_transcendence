import { createRouter, createWebHistory } from 'vue-router'
import GameView from '../views/GameView.vue'
import HomeView from '../views/HomeView.vue'
import ChatView from '../views/ChatView.vue'
import AccountView from '../views/AccountView.vue'
import AuthCallbackView from '../views/AuthCallbackView.vue'
import SocialView from '../views/SocialView.vue'

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
      path: '/social',
      name: 'social',
      component: SocialView
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView
    },
    {
      path: '/auth/callback',
      name: 'authCallback',
      component: AuthCallbackView
    }
  ]
})

export default router
