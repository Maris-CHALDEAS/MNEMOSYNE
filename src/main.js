import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { saveGameState } from './stores/save'

import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
const save = saveGameState();
save.loadGame();

const { default: router } = await import('./router')

app.use(router)

app.mount('#app')
