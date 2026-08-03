import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', name: 'initializer', component: () => import('@/views/scenes/IntroScene.vue') },
    { path: '/IntroHallway', name: 'IntroHallway', component: () => import('@/views/scenes/IntroHallway.vue') },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
