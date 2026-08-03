import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDialogueStore  } from '@/stores/dialogue'

export function useSceneTransition() {
    const store = useDialogueStore();
    const router = useRouter();

    watch(() => store.finished, (done) => {
        if (done && store.nextScene) {
            router.push(store.nextScene)
        }
    })
}
