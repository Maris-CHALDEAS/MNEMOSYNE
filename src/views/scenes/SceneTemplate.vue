<template>
    <div class="scene">
        <img class="bg" :src="currentBg" alt="scene background">
        <img
            v-if="currentSprite"
            class="sprite"
            :class="currentSpritePos"
            :src="currentSprite"
            alt="character"
        >
        <DialogueBox />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import DialogueBox from '@/components/DialogueBox.vue'
import { useDialogueStore } from '@/stores/dialogue'
import { useSceneTransition } from '@/composables/useSceneTransition'
import { saveGameState } from '@/stores/save'

const props = defineProps({
    script: { type: Object, required: true },
    scriptId: { type: String, required: true },
})

const save = saveGameState()
const store = useDialogueStore()
const currentBg = ref(props.script.lines[0]?.background ?? null)
const currentSprite = ref(null)
const currentSpritePos = ref('')

// Load before mounting DialogueBox so scene-level values such as bgMusic
// are already available to shared components.
store.loadScript(props.scriptId, props.script)
store.lineIndex = save.lineIndex

watch(() => store.currentLine, (line) => {
    if (line?.background) currentBg.value = line.background
    if (line?.sprite !== undefined) currentSprite.value = line.sprite
    if (line?.spritePos !== undefined) currentSpritePos.value = line.spritePos
}, { immediate: true })

useSceneTransition()
</script>

<style scoped>
.scene {
    position: fixed;
    inset: 0;
    overflow: hidden;
}

.bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
}

.sprite {
    position: absolute;
    bottom: 0;
    height: 80vh;
    z-index: 2;
}

.sprite.left { left: 5%; }
.sprite.right { right: 5%; }
.sprite.center {
    left: 50%;
    transform: translateX(-50%);
}
</style>
