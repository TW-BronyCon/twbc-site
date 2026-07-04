<script setup lang="ts">
const { t } = useI18n()

definePageMeta({
  underDevelopment: true
})

useHead({
  title: 'Dev Test Page'
})
</script>

<template>
  <div class="dev-test-root">
    <div class="card">
      <div class="icon">
        <i class="fa-solid fa-screwdriver-wrench"></i>
      </div>
      <h1>{{ t('development.ribbon') }}</h1>
      <p>This is a demonstration page used to verify the development watermark and corner ribbon features.</p>
      <p>The watermark overlay scales across the background, and the interactive glassmorphic ribbon floats in the top-right corner.</p>
      <NuxtLink to="/" class="back-btn">Back to Home</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.dev-test-root {
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.card {
  background: rgba(30, 15, 45, 0.6);
  border: 1px solid rgba(255, 189, 222, 0.2);
  border-radius: 16px;
  padding: 3rem;
  max-width: 500px;
  text-align: center;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.icon {
  font-size: 3.5rem;
  color: var(--color-pink);
  margin-bottom: 1.5rem;
  animation: pulse-glow 2s infinite ease-in-out;
}

h1 {
  font-size: 2rem;
  color: var(--color-gold);
  margin-bottom: 1rem;
}

p {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.back-btn {
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, var(--color-pink), var(--color-gold));
  color: #120b18;
  font-weight: bold;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 189, 222, 0.2);
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 189, 222, 0.4);
}

@keyframes pulse-glow {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 5px rgba(255, 189, 222, 0.3));
  }
  50% {
    transform: scale(1.05);
    filter: drop-shadow(0 0 15px rgba(255, 189, 222, 0.6));
  }
}
</style>
