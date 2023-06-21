import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import GameView from '@/views/GameView.vue'
import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import ChatView from '@/views/ChatView.vue'
import AccountView from '@/views/AccountView.vue'
import AuthCallbackView from '@/views/AuthCallbackView.vue'
import SocialView from '@/views/SocialView.vue'
import ProfilView from '@/views/ProfilView.vue'
import { useUserStore } from '@/stores/userStore'

async function checkLogin(to: RouteLocationNormalized) {
	const user = useUserStore()
	if (!user.id && !user.loading) return { name: 'login' }
	return true
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
			beforeEnter: checkLogin
    },
		{
			path: '/login',
			name: 'login',
			component: LoginView,
		},
    {
      path: '/game',
      name: 'game',
			component: GameView,
			beforeEnter: checkLogin
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatView,
			beforeEnter: checkLogin
    },
    {
      path: '/social',
      name: 'social',
      component: SocialView,
			beforeEnter: checkLogin
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView,
			beforeEnter: checkLogin
    },
    {
      path: '/auth/callback',
      name: 'authCallback',
      component: AuthCallbackView
    },
	{
		path: '/profil',
		name: 'profil',
		component: ProfilView,
			beforeEnter: checkLogin
	}
	
  ]
})

export default router
