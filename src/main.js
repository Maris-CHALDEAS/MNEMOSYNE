import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { saveGameState } from './stores/save'
import { useAffinityStore } from './stores/affinity'

import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
const save = saveGameState();
save.loadGame();

const affinity = useAffinityStore();
for (const [characterId, values] of Object.entries(save.characters)) {
  affinity.characters[characterId] = {
    love: 0,
    hate: 0,
    ...values,
  };
}

const { default: router } = await import('./router')

app.use(router)

app.mount('#app')
