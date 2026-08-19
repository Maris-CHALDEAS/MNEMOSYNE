<script setup>
 import bgImg from '@/assets/Chaldea_HQ_outside.webp'
 // import bgImg from '@/assets/Chaldea_HQ_Hallway.webp'
 import { computed, onMounted } from 'vue'
 import DialogueBox from '@/components/DialogueBox.vue'
 import introScript from '@/scripts/intro'
 import { useDialogueStore  } from '@/stores/dialogue'
 import { useSceneTransition } from '@/composables/useSceneTransition'
 import { saveGameState } from '@/stores/save'
 const save = saveGameState();

 const store = useDialogueStore();
 const line = computed(() => store.currentLine)

 onMounted(() => {
     store.loadScript('intro', introScript)
     store.lineIndex = save.lineIndex
 })
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
</style>


<template>
    <div class="scene">
        <img class="bg" :src="bgImg" alt="chaldea headquaters">
        <img
            v-if="line?.sprite"
            class="sprite"
            :class="line.spritePos"
            :src="line.sprite"
            alt="dialogue"
        >
        <DialogueBox />
    </div>
</template>
