<script setup>
// No dialogue — this is a pure end screen.
// Drop your good-end background into @/assets/bg_good_end.webp
import bgImg from '@/assets/Chaldea_HQ_outside.webp'
</script>

<style scoped>
.end-screen {
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

.title-card {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
}

.end-label {
  font-family: 'Georgia', serif;
  font-size: 3rem;
  letter-spacing: 0.25em;
  color: #d4af6a;
  text-shadow: 0 0 30px rgba(212, 175, 106, 0.6), 0 2px 8px rgba(0,0,0,0.8);
}

.end-sub {
  margin-top: 1rem;
  font-family: 'Georgia', serif;
  font-size: 1.1rem;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
}
</style>

<template>
  <div class="end-screen">
    <img class="bg" :src="bgImg" alt="good end background">
    <div class="title-card">
      <span class="end-label">Good End</span>
      <span class="end-sub">Rin Route</span>
    </div>
  </div>
</template>
