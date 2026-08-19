import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDialogueStore  } from '@/stores/dialogue'
import { useAffinityStore } from '@/stores/affinity';
import { saveGameState } from '@/stores/save';

export function useSceneTransition() {
    const store = useDialogueStore();
    const router = useRouter();
    const save = saveGameState();

    watch(() => store.finished, (done) => {
        if (done && store.nextScene) {
            const target = typeof store.nextScene === 'function'
                  ? store.nextScene(useAffinityStore().$state)
                  : store.nextScene
            save.saveGame(target, 0, useAffinityStore().$state);
            router.push(target)
        }
    })
}
