import { createRouter, createWebHistory } from 'vue-router'

// Importa la vista de perfil correctamente
import ProfileView from '../views/ProfileView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'

const routes = [
  { path: '/profile', name: 'Profile', component: ProfileView },
  { path: '/home', name: 'Home', component: () => import('../views/HomeView.vue') },
  { path: '/roulette', name: 'Roulette', component: () => import('../views/RouletteView.vue') },
  { path: '/chat', name: 'Chat', component: () => import('../views/ChatView.vue') },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

