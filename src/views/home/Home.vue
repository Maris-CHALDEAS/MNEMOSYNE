<script setup>
import { useRouter } from 'vue-router'
import { saveGameState } from '@/stores/save'
import { useAffinityStore } from '@/stores/affinity'
import mash from '@/assets/sprites/mash/st_face_0020_000.png'
const router = useRouter()
const save = saveGameState()
const affinity = useAffinityStore()
// Keep story metadata together so adding another story only requires one entry.
const stories = [
    {
        title: 'Chaldea: First Contact',
        description: 'Arrive at the Chaldea facility and discover what awaits beyond its halls.',
        status: 'Playable demo',
        route: '/demo/arrival',
        portrait: mash,
    },
]
function startStory(story) {
    save.resetGame()
    affinity.$reset()
    router.push(story.route)
}
</script>
<template>
    <main class="home">
        <p class="brand">Mnemosyne</p>
        <div class="grid">
            <button
                v-for="story in stories"
                :key="story.title"
                type="button"
                class="story-card"
                @click="startStory(story)"
            >
                <div class="card-inner">
                    <div class="portrait">
                        <img :src="story.portrait" :alt="story.title" />
                    </div>
                    <div class="card-body">
                        <p class="card-status">{{ story.status }}</p>
                        <h2 class="card-title">{{ story.title }}</h2>
                        <div class="card-banner"><span>Story</span></div>
                        <p class="card-desc">{{ story.description }}</p>
                    </div>
                </div>
            </button>
        </div>
    </main>
</template>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

:global(body) { margin: 0; background: #04060c; }

.home {
    --gold-1: #f6e2a8;
    --gold-2: #cf9f4c;
    --gold-3: #8a651f;
    --gold-4: #4a3410;
    --navy-1: #16223a;
    --navy-2: #0a1220;
    --ink: #f3ead2;
    --ink-dim: rgba(200, 210, 225, 0.78);
    --accent-gold: #e3c07a;

    position: relative;
    isolation: isolate;
    /* min-height: 100vh; */
    overflow-x: hidden;
    padding: 4.5rem 1.5rem 3rem;
    background: radial-gradient(ellipse at 50% -10%, #16233d 0%, #070b14 55%, #04060c 100%);
    color: var(--ink);
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
}

.home::before {
    content: '';
    position: absolute;
    z-index: -1;
    inset: 0;
    opacity: 0.04;
    pointer-events: none;
    background-image: repeating-linear-gradient(115deg, #8cbee6 0px, #8cbee6 1px, transparent 1px, transparent 46px);
}

.brand {
    position: fixed;
    z-index: 2;
    top: 1.1rem;
    left: 1.4rem;
    margin: 0;
    font-family: 'Rajdhani', sans-serif;
    font-weight: 600;
    font-size: 0.85rem;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: var(--gold-1);
    opacity: 0.85;
    text-shadow: 0 0 12px rgba(230, 190, 110, 0.35);
    pointer-events: none;
}

.grid {
    max-width: 76rem;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.75rem;
}

.story-card {
    width: 100%;
    max-width: 17rem;
    aspect-ratio: 5 / 7.3;
    margin: 0 auto;
    padding: 7px;
    border: 0;
    border-radius: 20px;
    background: linear-gradient(160deg, var(--gold-1), var(--gold-2) 42%, var(--gold-3) 72%, var(--gold-4));
    box-shadow: 0 14px 34px rgba(0, 0, 0, 0.55);
    cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    font: inherit;
    text-align: inherit;
}

.story-card:hover,
.story-card:focus-visible {
    transform: translateY(-6px);
    box-shadow: 0 20px 44px rgba(0, 0, 0, 0.6), 0 0 0 2px var(--gold-1), 0 0 26px rgba(230, 190, 110, 0.45);
    outline: none;
}

.card-inner {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    border-radius: 14px;
    overflow: hidden;
    background-color: var(--navy-2);
    background-image:
        repeating-linear-gradient(115deg, rgba(255, 255, 255, 0.05) 0 2px, transparent 2px 42px),
        linear-gradient(175deg, var(--navy-1), var(--navy-2));
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
}

.portrait {
    position: relative;
    flex: 1 1 58%;
    min-height: 0;
    overflow: hidden;
}

.portrait img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
}

.portrait::before {
    content: '';
    position: absolute;
    inset: -20% -20% auto -20%;
    height: 70%;
    background: radial-gradient(circle at 50% 30%, rgba(150, 200, 255, 0.35), transparent 65%);
    pointer-events: none;
}

.portrait::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 58%, var(--navy-2) 96%);
    pointer-events: none;
}

.card-body {
    flex: 0 0 auto;
    padding: 0.9rem 1rem 1.1rem;
    text-align: center;
}

.card-status {
    margin: 0 0 0.3rem;
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: var(--accent-gold);
}

.card-title {
    margin: 0 0 0.65rem;
    font-family: 'Rajdhani', sans-serif;
    font-weight: 700;
    font-size: 1.15rem;
    line-height: 1.2;
    letter-spacing: 0.02em;
    color: var(--ink);
}

.card-banner {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0 0.25rem 0.65rem;
}

.card-banner::before,
.card-banner::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold-3), transparent);
}

.card-banner span {
    font-size: 0.58rem;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: var(--accent-gold);
    white-space: nowrap;
}

.card-desc {
    margin: 0;
    font-size: 0.78rem;
    line-height: 1.5;
    color: var(--ink-dim);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

@media (prefers-reduced-motion: reduce) {
    .story-card { transition: none; }
}
</style>
