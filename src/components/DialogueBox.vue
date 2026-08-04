<template>
    <div class="choice-backdrop" v-if="line?.choices"></div>
    <div class="choices selection" v-if="line?.choices">
        <button
            v-for="choice in line.choices"
            @click.stop="store.choose(choice)"
        >
            {{ choice.label }}
        </button>
    </div>
    <div class="dialogue-box" @click="handleClick">
        <div class="dialogue-label" v-if="line?.speaker">
            <span>{{ line.speaker }}</span>
        </div>
        <div class="dialogue-body">
            <p class="line typewriter">{{ displayedText }}</p>
        </div>
    </div>
</template>

<script setup>
 import {ref, watch, onUnmounted, computed } from 'vue'
 import { useDialogueStore } from '@/stores/dialogue'

 const store = useDialogueStore()
 const line = computed(() => store.currentLine)

 const displayedText = ref('')
 let timer = null
 let isTyping = false
 let currentFullText = ''

 function typeText(fullText, speed = 40) {
     clearInterval(timer)
     displayedText.value = ''
     currentFullText = fullText
     isTyping = true
     let i = 0
     timer = setInterval(() => {
         displayedText.value += fullText[i]
         i++
                                if (i >= fullText.length){
                                    isTyping = false
                                    clearInterval(timer)
                                }
     }, speed)
 }

 watch(
     () => line.value?.text,
     (newText) => {
         if (newText) typeText(newText)
     },
     { immediate: true }
 )

 function handleClick() {
     if (isTyping) {
         clearInterval(timer)
         displayedText.value = currentFullText;
         isTyping = false
     } else {
         store.advance()
     }
 }
</script>

<style scoped>
 .dialogue-box {
     position: absolute;
     bottom: 0;
     left: 0;
     width: 100%;
     font-family: sans-serif;
     z-index: 3;
     cursor: pointer;
 }

 .selection {
     position: absolute;
     bottom: 50%;
     left: 40%;
     width: 20%;
     font-family: sans-serif;
     z-index: 3;
     cursor: pointer;

     display: flex;
     flex-direction: column;
     align-items: center;
     gap: 0.5rem;
 }

 .choice-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      z-index: 2;
  }

 .dialogue-label {
     display: inline-block;
     background: linear-gradient(90deg, #1b3a63, #4a90c2);
     color: #bfe6ff;
     font-size: 1.5rem;
     padding: 0.5rem 3rem 0.5rem 1.5rem;
     clip-path: polygon(0 0, 100% 0, calc(100% - 2rem) 100%, 0 100%);
 }

 .dialogue-body {
     background: linear-gradient(180deg, rgba(10, 30, 60, 0.85), rgba(5, 15, 35, 0.95));
     border-top: 2px solid #4a90c2;
     padding: 1.5rem 2rem;
     min-height: 12vh;
 }

 .line {
     color: #7fd4f0;
     font-size: 1.3rem;
     margin: 0.4rem 0;
     white-space: pre-line;
     overflow-wrap: break-word;
     overflow: visible;
 }

 /* .typewriter {
    overflow: hidden;
    white-space: nowrap;
    letter-spacing: .15em;
    animation:
    typing 3.5s steps(40, end);
    }

    @keyframes typing {
    from { width: 0 }
    to { width: 100% }
    } */


 .choices {
     display: flex;
     flex-direction: column;
     gap: 0.5rem;
     margin-top: 1rem;
 }

 .choices button {
     padding: 0.5rem 1rem;
     cursor: pointer;
 }
</style>
