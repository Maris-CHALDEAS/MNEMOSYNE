import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDialogueStore  } from '@/stores/dialogue'
import { useAffinityStore } from '@/stores/affinity';

export function useSceneTransition() {
    const store = useDialogueStore();
    const router = useRouter();

    watch(() => store.finished, (done) => {
        if (done && store.nextScene) {
            const target = typeof store.nextScene === 'function'
                  ? store.nextScene(useAffinityStore().$state)
                  : store.nextScene
            router.push(target)
        }
    })
}
