<template>
    <div class="choice-backdrop" v-if="line?.choices"></div>
    <div class="choices selection" v-if="line?.choices">
        <div class="choice-wrapper" v-for="choice in line.choices" >
            <button
                class="choices-btn"
                @click.stop="store.choose(choice)"
            >
                {{ choice.label }}
            </button>
            <div class="shard-1 shard">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="shard-2 shard">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="shard-3 shard">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="shard-4 shard">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="shard-5 shard">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="shard-6 shard">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="shard-7 shard">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="shard-8 shard">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
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


 .choice-wrapper {
     position: relative;
     display: inline-block;
 }

 .shard-1 {
     position: absolute;
     /* inset: 0; */
     top: 10px;
     overflow: visible;
     pointer-events: none;

     width: 16px;
     height: 16px;

     clip-path: polygon(
         50% 0%,
         100% 50%,
         50% 100%,
         0% 50%
     );
     opacity: 0;
     background: linear-gradient(
         135deg,
         rgba(255,255,255,.5),
         rgba(120,200,255,.3),
         rgba(40,120,255,.1)
     );
     backdrop-filter: blur(2px);
 }

 .choices-btn {
     appearance: none;
     border: none;
     outline: none;
     background: none;

     /* Layout and dimensions */
     display: inline-block;
     padding: 0.5rem 1rem;
     cursor: pointer;

     position: relative;
     overflow: hidden;

     /* Typography */
     font-family: inherit;
     font-size: 16px;
     font-weight: 500;
     letter-spacing: 0.02em;
     text-align: center;
     text-decoration: none;

     /* Decoration & Theming */
     background: linear-gradient(
         90deg,
         rgba(27,58,99,0) 0%,
         rgba(27,58,99,.2) 5%,
         rgba(27,58,99,.75) 15%,
         rgba(27,58,99,.75) 85%,
         rgba(27,58,99,.2) 95%,
         rgba(27,58,99,0) 100%
     );
     color: #ffffff;
     /* clip-path: polygon(15% 20%, 85% 20%, 100% 50%, 85% 80%, 15% 80%, 0 50%); */
     box-shadow:
         0 2px 8px rgba(0,0,0,.3),
         inset 0 1px rgba(255,255,255,.15);
     /* Smooth interaction transition */
     transition: all 0.2s ease-in-out;

 }

 .choices-btn::before {
     content: '';

     position: absolute;
     top: 0;
     left: -150%;

     width: 50%;
     height: 100%;

     pointer-events: none;
     background: linear-gradient(
         90deg,
         transparent,
         rgba(255,255,255,0.4),
         rgba(180,220,255,0.6),
         rgba(255,255,255,0.4),
         transparent
     );
 }
@keyframes sweep {
    from {
        left: -150%;
    }

    to {
        left: 150%;
    }
}
 .choices-btn:hover::before {
    animation: sweep 400ms ease-out;
}

 .choice-wrapper:hover .shard-1 {
     opacity: 1;
 }
 /* .choices-btn:hover {
    transform: scale(1.05);
    } */
</style>
