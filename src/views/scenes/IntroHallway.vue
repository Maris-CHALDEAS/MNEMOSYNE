<script setup>
 import defaultBg from '@/assets/Chaldea_HQ_Hallway.webp'
 import { computed, onMounted, ref, watch} from 'vue'
 import DialogueBox from '@/components/DialogueBox.vue'
 import introHallwayScript from '@/scripts/introHallway'
 import { useDialogueStore  } from '@/stores/dialogue'
 import { useSceneTransition } from '@/composables/useSceneTransition'
 import { saveGameState } from '@/stores/save'
 const save = saveGameState();

 const store = useDialogueStore();
 const line = computed(() => store.currentLine)
 const bgMusic = computed(() => store.currentBgMusic)

 const currentBg = ref(defaultBg);
 const currentSprite = ref(null);
 const currentSpritePos = ref('');

 watch(line, (newLine) => {
     if (newLine?.background) {
         currentBg.value = newLine.background
     }
     if (newLine?.sprite !== undefined) {
         currentSprite.value = newLine.sprite
     }
     if (newLine?.spritePos !== undefined) {
         currentSpritePos.value = newLine.spritePos
     }
 }, { immediate: true })

     store.loadScript('introHallway', introHallwayScript)
     store.lineIndex = save.lineIndex
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

.sprite.center {
  left: 50%;
  transform: translateX(-50%);
}
.sprite.left {
  left: 5%;
}
.sprite.right {
  right: 5%;
}
button {
  position: relative;
  z-index: 5;
}
</style>


<template>
    <div class="scene">
        <img class="bg" :src="currentBg" :key="currentBg" alt="chaldea hallway">
        <img
            v-if="currentSprite"
            class="sprite"
            :class="currentSpritePos"
            :src="currentSprite"
            alt="dialogue"
        >
        <DialogueBox />
    </div>
</template>
