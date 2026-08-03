import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', name: 'initializer', component: () => import('@/views/scenes/IntroScene.vue') },
    { path: '/IntroHallway', name: 'IntroHallway', component: () => import('@/views/scenes/IntroHallway.vue') },
    { path: '/RinHallway2',  name: 'RinHallway2',  component: () => import('@/views/scenes/RinHallway2.vue') },
    { path: '/rin-good-end', name: 'RinGoodEnd',   component: () => import('@/views/scenes/RinGoodEnd.vue') },
    { path: '/rin-bad-end',  name: 'RinBadEnd',    component: () => import('@/views/scenes/RinBadEnd.vue') },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
