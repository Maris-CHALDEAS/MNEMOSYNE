import { createRouter, createWebHistory } from 'vue-router'
import { saveGameState } from '@/stores/save'

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

const save = saveGameState();

save.loadGame();

router.beforeEach((to, from) => {
    if (save.sceneState === null) {
        return true;
    }
    if (to.name !== save.sceneState ) {
        return { name: save.sceneState };
    }
})

export default router
