<script setup>
import { useRouter } from 'vue-router'
import { saveGameState } from '@/stores/save'
import { useAffinityStore } from '@/stores/affinity'
import backgroundOne from '@/assets/backgrounds/BG_01B.jpg'
import backgroundTwo from '@/assets/backgrounds/BG_01A.jpg'
import backgroundThree from '@/assets/backgrounds/BG_01C.jpg'
const router = useRouter()
const save = saveGameState()
const affinity = useAffinityStore()
const backgrounds = [backgroundOne, backgroundTwo, backgroundThree]
const background = backgrounds[Math.floor(Math.random() * backgrounds.length)]

const stories = [
    {
        title: 'Chaldea: First Contact',
        description: 'Arrive at the Chaldea facility and discover what awaits beyond its halls.',
        status: 'Playable demo',
        route: '/demo/arrival',
    },
]
function startStory(story) {
    save.resetGame()
    affinity.$reset()
    router.push(story.route)
}
</script>
<template>
    <main class="home" :style="{ '--background-image': `url(${background})` }">
        <div class="shade" aria-hidden="true"></div>
        <div class="grid-overlay" aria-hidden="true"></div>
        <div class="scanline" aria-hidden="true"></div>

        <header class="title-card">
            <p class="eyebrow">Chaldea Security Organization</p>
            <h1>MNEMOSYNE</h1>
            <span class="tagline">Select a record</span>
        </header>

        <section class="library" aria-labelledby="records-heading">
            <h2 id="records-heading">Records</h2>
            <div class="story-list">
                <article v-for="story in stories" :key="story.title" class="story-card">
                    <div class="status-tab">{{ story.status }}</div>
                    <h3>{{ story.title }}</h3>
                    <p>{{ story.description }}</p>
                    <button type="button" class="begin-btn" @click="startStory(story)">
                        Begin
                    </button>
                </article>
            </div>
        </section>
    </main>
</template>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

:global(body) { margin: 0; background: #060d16; }

.home {
    --panel-start: rgba(31, 64, 98, 0.82);
    --panel-end: rgba(9, 19, 32, 0.88);
    --line: rgba(150, 195, 235, 0.32);
    --line-bright: rgba(180, 215, 250, 0.55);
    --accent: #6fc3f0;
    --accent-bright: #a9def9;
    --ink: #eaf3fb;
    --ink-dim: rgba(213, 229, 245, 0.72);

    position: relative;
    isolation: isolate;
    min-height: 100vh;
    overflow: auto;
    padding: 3rem 1.5rem 4rem;
    background: var(--background-image) center / cover fixed no-repeat;
    color: var(--ink);
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
}

.shade {
    position: absolute;
    z-index: -3;
    inset: 0;
    background: linear-gradient(180deg, rgba(6, 14, 24, 0.8) 0%, rgba(9, 19, 32, 0.62) 45%, rgba(4, 10, 18, 0.86) 100%);
}

.grid-overlay {
    position: absolute;
    z-index: -2;
    inset: 0;
    pointer-events: none;
    opacity: 0.05;
    background-image:
        repeating-linear-gradient(0deg, #8cbee6 0px, #8cbee6 1px, transparent 1px, transparent 64px),
        repeating-linear-gradient(90deg, #8cbee6 0px, #8cbee6 1px, transparent 1px, transparent 64px);
}

.scanline {
    position: absolute;
    z-index: -1;
    left: 0;
    right: 0;
    height: 140px;
    background: linear-gradient(180deg, transparent, rgba(120, 195, 245, 0.05) 40%, rgba(120, 195, 245, 0.09), rgba(120, 195, 245, 0.05) 60%, transparent);
    animation: scan 10s linear infinite;
    pointer-events: none;
}

 @keyframes scan {
     0% { transform: translateY(-20%); }
     100% { transform: translateY(115vh); }
 }

.title-card {
    margin: 7vh auto 12vh;
    max-width: 40rem;
    text-align: center;
}

.eyebrow {
    margin: 0;
    color: var(--accent);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.32em;
    text-transform: uppercase;
}

.title-card h1 {
    margin: 0.9rem 0 1.1rem;
    font-family: 'Rajdhani', 'Inter', sans-serif;
    font-size: clamp(2.6rem, 8vw, 5.5rem);
    font-weight: 600;
    letter-spacing: 0.14em;
    text-shadow: 0 0 28px rgba(111, 195, 240, 0.35), 0 2px 10px rgba(0, 0, 0, 0.6);
}

.tagline {
    display: inline-block;
    padding: 0.35rem 1rem;
    border: 1px solid var(--line);
    background: rgba(15, 28, 45, 0.4);
    backdrop-filter: blur(4px);
    color: var(--ink-dim);
    font-size: 0.68rem;
    letter-spacing: 0.24em;
    text-transform: uppercase;
}

.library { max-width: 54rem; margin: 0 auto; }

.library h2 {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0 0 1.5rem;
    color: var(--accent-bright);
    font-family: 'Rajdhani', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.3em;
    text-transform: uppercase;
}

.library h2::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, var(--line-bright), transparent);
}

.story-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1.25rem;
}

.story-card {
    position: relative;
    width: min(100%, 21rem);
    padding: 2.4rem 1.5rem 1.5rem;
    background: linear-gradient(155deg, var(--panel-start), var(--panel-end));
    border: 1px solid var(--line);
    backdrop-filter: blur(6px);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 12px 30px rgba(0, 0, 0, 0.35);
}

.status-tab {
    position: absolute;
    top: 0;
    left: 0;
    padding: 0.4rem 1.5rem 0.4rem 1rem;
    background: linear-gradient(120deg, #2c5c88, #17324f);
    border-bottom: 1px solid var(--line-bright);
    border-right: 1px solid var(--line-bright);
    clip-path: polygon(0 0, 100% 0, 78% 100%, 0% 100%);
    color: var(--accent-bright);
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
}

.story-card h3 {
    margin: 0.6rem 0;
    font-family: 'Rajdhani', sans-serif;
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: 0.02em;
}

.story-card > p {
    min-height: 3.2rem;
    margin: 0 0 1.4rem;
    color: var(--ink-dim);
    font-size: 0.92rem;
    line-height: 1.55;
}

.begin-btn {
    position: relative;
    display: inline-block;
    padding: 0.6rem 1.6rem 0.6rem 1.4rem;
    border: 1px solid var(--line-bright);
    background: linear-gradient(135deg, #23507a, #12283f);
    clip-path: polygon(0 0, 100% 0, 100% 68%, 90% 100%, 0 100%);
    color: var(--ink);
    font: inherit;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s ease, box-shadow 0.2s ease;
}

.begin-btn:hover,
.begin-btn:focus-visible {
    background: linear-gradient(135deg, #2f6494, #1a3652);
    box-shadow: 0 0 0 1px var(--accent-bright), 0 0 18px rgba(111, 195, 240, 0.4);
}

@media (prefers-reduced-motion: reduce) {
    .scanline { animation: none; opacity: 0; }
    .begin-btn { transition: none; }
}
</style>
