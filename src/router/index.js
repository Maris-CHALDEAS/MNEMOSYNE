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

// save.loadGame();

router.beforeEach((to) => {
    if (!save.sceneState) {
        return true
    }

    // Older saves stored route names (e.g. "IntroHallway"); current saves
    // store paths (e.g. "/IntroHallway"). Accept both formats.
    let savedPath
    try {
        savedPath = save.sceneState.startsWith('/')
            ? save.sceneState
            : router.resolve({ name: save.sceneState }).fullPath
    } catch {
        save.sceneState = null
        return true
    }
    const savedRoute = router.resolve(savedPath)

    // Do not redirect to a route that no longer exists.
    if (!savedRoute.matched.length) {
        save.sceneState = null
        return true
    }

    if (to.path === savedRoute.path) {
        return true
    }

    return savedRoute.fullPath
})

export default router
