import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', name: 'initializer', component: () => import('@/views/Scene.vue') },
    { path: '/test', name: 'test', component: () => import('@/views/DialogueBox.vue') },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
