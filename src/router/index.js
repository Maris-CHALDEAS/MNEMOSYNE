import { createRouter, createWebHistory } from 'vue-router'
import { saveGameState } from '@/stores/save'
import SceneTemplate from '@/views/scenes/SceneTemplate.vue'
import demoArrival from '@/scripts/demoArrival'
import demoBriefing from '@/scripts/demoBriefing'
import demoHallway from '@/scripts/demoHallway'
import demoObservation from '@/scripts/demoObservation'
import demoDecision from '@/scripts/demoDecision'

const routes = [
    { path: '/', name: 'initializer', component: () => import('@/views/scenes/IntroScene.vue') },
    { path: '/IntroHallway', name: 'IntroHallway', component: () => import('@/views/scenes/IntroHallway.vue') },
    { path: '/RinHallway2',  name: 'RinHallway2',  component: () => import('@/views/scenes/RinHallway2.vue') },
    { path: '/rin-good-end', name: 'RinGoodEnd',   component: () => import('@/views/scenes/RinGoodEnd.vue') },
    { path: '/rin-bad-end',  name: 'RinBadEnd',    component: () => import('@/views/scenes/RinBadEnd.vue') },
    { path: '/demo/arrival', name: 'DemoArrival', component: SceneTemplate, props: { script: demoArrival, scriptId: 'demoArrival' } },
    { path: '/demo/briefing', name: 'DemoBriefing', component: SceneTemplate, props: { script: demoBriefing, scriptId: 'demoBriefing' } },
    { path: '/demo/hallway', name: 'DemoHallway', component: SceneTemplate, props: { script: demoHallway, scriptId: 'demoHallway' } },
    { path: '/demo/observation', name: 'DemoObservation', component: SceneTemplate, props: { script: demoObservation, scriptId: 'demoObservation' } },
    { path: '/demo/decision', name: 'DemoDecision', component: SceneTemplate, props: { script: demoDecision, scriptId: 'demoDecision' } },
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
