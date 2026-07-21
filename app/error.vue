<script setup lang="ts">
import type { NuxtError } from "#app";
import { computed, ref } from "vue";

const props = defineProps<{
  error: NuxtError;
}>();

const { t } = useI18n();

const statusCode = computed(() => Number(props.error?.statusCode || 500));
const is4xx = computed(() => statusCode.value >= 400 && statusCode.value < 500);

const categoryKey = computed(() => {
  const code = statusCode.value;
  if (code === 404) return "404";
  if (code === 403) return "403";
  if (code === 400) return "400";
  if (code === 500) return "500";
  if (code === 503) return "503";
  if (code >= 400 && code < 500) return "General4xx";
  if (code >= 500) return "General5xx";
  return "Default";
});

const errorTitle = computed(() => {
  const key = `error.title${categoryKey.value}`;
  return t(key);
});

const errorDesc = computed(() => {
  const key = `error.desc${categoryKey.value}`;
  return t(key);
});

useHead(() => ({
  title: t("error.pageTitle", { code: statusCode.value }),
}));

const isLeaving = ref(false);

const handleClearError = (path = "/") => {
  if (isLeaving.value) return;
  isLeaving.value = true;
  setTimeout(() => {
    clearError({ redirect: path });
  }, 250);
};
</script>

<template>
  <NuxtLayout name="default">
    <div :class="['error-transition-wrapper', { 'is-leaving': isLeaving }]">
      <PageLayout max-width="56em">
        <template #title>
          <div class="error-hero">
            <div
              class="code-display"
              :class="is4xx ? 'code--4xx' : 'code--5xx'"
            >
              <span class="code-number">{{ statusCode }}</span>
              <div class="code-glow"></div>
            </div>

            <h1 class="error-title">{{ errorTitle }}</h1>
            <p class="error-desc">{{ errorDesc }}</p>
          </div>
        </template>

        <template #surface>
          <div class="error-actions">
            <button
              type="button"
              class="action-btn"
              @click="handleClearError('/')"
            >
              <span>{{ t("error.backHome") }}</span>
            </button>
          </div>
        </template>
      </PageLayout>
    </div>
  </NuxtLayout>
</template>

<style scoped>
/* ── Error Hero Section ──────────────────────────────── */
.error-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem 0 0.5rem;
}

/* ── Code Display Number ─────────────────────────────── */
.code-display {
  position: relative;
  display: inline-block;
  line-height: 1;
  margin-bottom: 1rem;
  user-select: none;
}

.code-number {
  font-size: clamp(5rem, 14vw, 9rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  font-family: var(--font-heading, inherit);
  display: inline-block;
  position: relative;
  z-index: 2;
  animation: floatAnim 4s ease-in-out infinite;
}

.code--4xx .code-number {
  background: linear-gradient(
    135deg,
    var(--color-text-light) 30%,
    var(--color-gold) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(
    0 4px 20px color-mix(in srgb, var(--color-gold) 40%, transparent)
  );
}

.code--5xx .code-number {
  background: linear-gradient(
    135deg,
    var(--color-text-light) 30%,
    var(--color-pink) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(
    0 4px 20px color-mix(in srgb, var(--color-pink) 40%, transparent)
  );
}

.code-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  height: 60%;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.45;
  pointer-events: none;
  z-index: 1;
}

.code--4xx .code-glow {
  background: var(--color-gold);
}

.code--5xx .code-glow {
  background: var(--color-pink);
}

@keyframes floatAnim {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.error-title {
  font-size: clamp(1.6rem, 3.5vw, 2.4rem);
  color: var(--page-title-color);
  text-shadow: var(--page-title-shadow);
  margin-bottom: 0.6rem;
}

.error-desc {
  font-size: clamp(1rem, 1.8vw, 1.2rem);
  color: var(--color-text-light);
  opacity: 0.9;
  max-width: 38em;
  margin: 0 auto;
  line-height: 1.6;
}

/* ── Action Button ──────────────────────────────────── */
.error-actions {
  display: flex;
  justify-content: center;
  margin: 0.5rem 0;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.6rem;
  padding: 0.85rem 2rem;
  border-radius: 0.75rem;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid var(--color-gold);
  background: transparent;
  color: var(--color-gold);
  box-shadow: 0 4px 15px color-mix(in srgb, var(--color-gold) 30%, transparent);
  transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.action-btn i {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.action-btn span {
  display: inline-block;
  line-height: 1;
  cursor: pointer;
}

.action-btn * {
  cursor: pointer;
}

.action-btn:hover {
  background: var(--color-gold);
  color: var(--color-bg-dark);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 20px color-mix(in srgb, var(--color-gold) 45%, transparent);
}

.action-btn:active {
  transform: translateY(0) scale(0.99);
}

@media (max-width: 600px) {
  .action-btn {
    width: 100%;
    justify-content: center;
  }
}

/* ── Page Transitions for Error Page ─────────────────── */
.error-transition-wrapper {
  animation: pageFadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.error-transition-wrapper.is-leaving {
  animation: pageFadeOut 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes pageFadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pageFadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-8px);
  }
}
</style>
