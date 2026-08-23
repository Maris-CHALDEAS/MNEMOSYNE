import { createRouter, createWebHistory } from 'vue-router'
import { saveGameState } from '@/stores/save'

const routes = [
    { path: '/', name: 'Home', component: () => import('@/views/home/Home.vue') },
    { path: '/demo/arrival', name: 'DemoArrivalDirect', component: () => import('@/views/demo/scenes/Arrival.vue') },
    { path: '/demo/briefing', name: 'DemoBriefing', component: () => import('@/views/demo/scenes/Briefing.vue') },
    { path: '/demo/hallway', name: 'DemoHallway', component: () => import('@/views/demo/scenes/Hallway.vue') },
    { path: '/demo/observation', name: 'DemoObservation', component: () => import('@/views/demo/scenes/Observation.vue') },
    { path: '/demo/decision', name: 'DemoDecision', component: () => import('@/views/demo/scenes/Decision.vue') },
    { path: '/rin-good-end', name: 'RinGoodEnd', component: () => import('@/views/demo/scenes/RinGoodEnd.vue') },
    { path: '/rin-bad-end', name: 'RinBadEnd', component: () => import('@/views/demo/scenes/RinBadEnd.vue') },
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
