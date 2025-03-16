<template>
  <div class="container-main">
    <!-- Floating Bubbles SVG -->
    <div class="bubbles-container">
      <svg class="bubbles-svg">
        <title>AI Timetabling</title>
        <circle
          v-for="bubble in bubbles"
          :key="bubble.id"
          :cx="bubble.x"
          :cy="bubble.y"
          :r="bubble.size"
          :fill="bubble.color"
          class="bubble"
          :style="{
            '--random-duration': `${5 + Math.random() * 10}s`,
            '--random-x': `${bubble.x + Math.random() * 100 - 50}px`,
            '--random-y': `${bubble.y + Math.random() * 100 - 50}px`
          }"
        />
      </svg>
    </div>

    <!-- Content -->
    <div class="content-container">
      <div class="content-wrapper fade-in">
        <h1 class="title">
          <span v-for="(word, wordIndex) in words" :key="wordIndex" class="word">
            <span 
              v-for="(letter, letterIndex) in word.split('')" 
              :key="`${wordIndex}-${letterIndex}`"
              class="letter"
              :style="{ '--delay': `${wordIndex * 0.1 + letterIndex * 0.03}s` }"
            >
              {{ letter }}
            </span>
          </span>
        </h1>

        <div class="button-wrapper">
          <router-link :to="to" class="explore-button-link">
            <button class="explore-button">
              <span class="button-text">Explore the AIpick</span>
              <span class="button-arrow">→</span>
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

// Props
const props = defineProps({
  title: {
    type: String,
    default: 'AI Timetabling'
  },
  to: {
    type: String,
    default: '/choose' // 默认跳转路径
  }
});

// Computed
const words = computed(() => props.title.split(' '));

// State
const bubbles = ref([]);

// Lifecycle
onMounted(() => {
  const newBubbles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 20 + 5,
    color: `rgba(${Math.random() * 50 + 50},${Math.random() * 50 + 100},${Math.random() * 50 + 200},0.3)`, // Blue-themed bubble colors
  }));
  bubbles.value = newBubbles;
});
</script>

<style scoped>

@import '@/style/global.css';

/* Main container */
.container-main {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: white;
}

/* Bubbles container */
.bubbles-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bubbles-svg {
  width: 100%;
  height: 100%;
}

/* Content styling */
.content-container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 768px) {
  .content-container {
    padding: 0 1.5rem;
  }
}

.content-wrapper {
  max-width: 56rem;
  margin: 0 auto;
  text-align: center;
}

/* Title styling */
.title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 2rem;
  letter-spacing: -0.05em;
  color: #1e3a8a; /* text-blue-900 */
}

@media (min-width: 640px) {
  .title {
    font-size: 4.5rem;
  }
}

@media (min-width: 768px) {
  .title {
    font-size: 6rem;
  }
}

.word {
  display: inline-block;
  margin-right: 1rem;
}

.word:last-child {
  margin-right: 0;
}

.letter {
  display: inline-block;
  color: transparent;
  background-image: linear-gradient(to right, #0940b8, #1279f7); /* from-blue-600 to-blue-400 */
  -webkit-background-clip: text;
  background-clip: text;
  opacity: 0;
  transform: translateY(100px);
  animation: letterAnimation 0.5s forwards;
  animation-delay: var(--delay);
}

/* Button styling */
.button-wrapper {
  display: inline-block;
  position: relative;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s;
  border: 1px solid #e1effe; /* border-blue-200 */
}

.button-wrapper:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.explore-button-link {
  display: block;
  text-decoration: none;
}

.explore-button {
  border-radius: 1.15rem;
  padding: 1.5rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  background-color: white;
  color: #1e3a8a; /* text-blue-900 */
  transition: all 0.3s;
  border: 1px solid #e1effe; /* border-blue-200 */
  cursor: pointer;
}

.explore-button:hover {
  background-color: #f9fafb; /* bg-gray-50 */
  transform: translateY(-0.125rem);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.button-text {
  opacity: 0.9;
  transition: opacity 0.3s;
}

.button-wrapper:hover .button-text {
  opacity: 1;
}

.button-arrow {
  margin-left: 0.75rem;
  opacity: 0.7;
  transition: all 0.3s;
}

.button-wrapper:hover .button-arrow {
  opacity: 1;
  transform: translateX(0.375rem);
}

/* Animations */
.fade-in {
  animation: fadeIn 2s forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes letterAnimation {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bubble {
  opacity: 0.7;
  transform-origin: center;
  animation: bubbleFloat var(--random-duration) infinite alternate;
}

@keyframes bubbleFloat {
  0% {
    opacity: 0.7;
    transform: scale(1) translate(0, 0);
  }
  50% {
    opacity: 0.3;
    transform: scale(1.2) translate(calc(var(--random-x) - 50%), calc(var(--random-y) - 50%));
  }
  100% {
    opacity: 0.7;
    transform: scale(1) translate(0, 0);
  }
}
</style>