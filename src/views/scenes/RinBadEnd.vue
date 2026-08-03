<script setup>
// Drop your bad-end background into @/assets/bg_bad_end.webp
import bgImg from '@/assets/Chaldea_HQ_Hallway.webp'
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
  filter: grayscale(60%) brightness(0.6);
}

.title-card {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.55);
}

.end-label {
  font-family: 'Georgia', serif;
  font-size: 3rem;
  letter-spacing: 0.25em;
  color: #c0392b;
  text-shadow: 0 0 30px rgba(192, 57, 43, 0.7), 0 2px 8px rgba(0,0,0,0.9);
}

.end-sub {
  margin-top: 1rem;
  font-family: 'Georgia', serif;
  font-size: 1.1rem;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
}
</style>

<template>
  <div class="end-screen">
    <img class="bg" :src="bgImg" alt="bad end background">
    <div class="title-card">
      <span class="end-label">Bad End</span>
      <span class="end-sub">Rin Route</span>
    </div>
  </div>
</template>
