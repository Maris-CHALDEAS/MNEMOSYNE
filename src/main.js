import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { saveGameState } from './stores/save'


import App from './App.vue'
import router from './router'

const app = createApp(App);
const save = saveGameState();

save.loadGame();

app.use(createPinia())
app.use(router)

app.mount('#app')
