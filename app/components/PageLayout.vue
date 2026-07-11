<script setup lang="ts">
import { computed, useSlots } from "vue";

/**
 * PageLayout.vue
 * Shared page wrapper component. Provides:
 *   - Consistent top/bottom padding accounting for the fixed SiteNav.
 *   - An optional hero title section (#title slot).
 *   - An optional content surface card (#surface slot).
 *   - A default slot for free-form page content.
 *
 * Slots:
 *   title   – Page heading. Renders inside the hero header block.
 *   surface – Content inside the frosted surface card (optional).
 *   default – Content below the surface card, or standalone content.
 */
withDefaults(
  defineProps<{
    /** Max-width of the surface card. Defaults to var(--page-surface-max-width). */
    maxWidth?: string;
  }>(),
  {
    maxWidth: undefined,
  },
);

const slots = useSlots();
const hasTitleSlot = computed(() => !!slots.title);
const hasSurfaceSlot = computed(() => !!slots.surface);
</script>

<template>
  <div class="page-layout">
    <div class="page-layout__body">
      <!-- Title outside surface card (when surface card is NOT used) -->
      <header v-if="hasTitleSlot && !hasSurfaceSlot" class="page-layout__hero">
        <slot name="title" />
      </header>

      <!-- Surface card: only rendered when surface slot is provided -->
      <section
        v-if="hasSurfaceSlot"
        class="page-layout__surface"
        :style="maxWidth ? { maxWidth } : undefined"
      >
        <!-- Title inside surface card (when surface card IS used) -->
        <header
          v-if="hasTitleSlot"
          class="page-layout__hero page-layout__hero--inside"
        >
          <slot name="title" />
        </header>
        <slot name="surface" />
      </section>

      <!-- Default slot for free-form content -->
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* ── PageLayout: BEM root ──────────────────────────────── */
.page-layout {
  position: relative;
  min-height: auto;
  padding-top: var(--page-padding-top);
  padding-bottom: var(--page-padding-bottom);
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
}

.page-layout__body {
  position: relative;
  z-index: 1;
  margin: auto 0;
}

/* ── Hero ─────────────────────────────────────────────── */
.page-layout__hero {
  width: min(97.5%, var(--page-surface-max-width));
  max-width: 100%;
  margin: 0 auto 2rem;
  text-align: center;
}

.page-layout__hero--inside {
  width: 100%;
  margin: 0 auto 2rem;
}

/* Consumers place their own h1/h2 inside the title slot.
   These defaults style them consistently. */
.page-layout__hero :deep(h1),
.page-layout__hero :deep(h2) {
  margin: 0 0 0.25em;
  font-size: var(--page-title-size);
  line-height: 1.1;
  color: var(--page-title-color);
  text-shadow: var(--page-title-shadow);
}

.page-layout__hero :deep(p) {
  margin: 0.15em 0;
  font-size: clamp(1.1rem, 1.75vw, 1.4rem);
  line-height: 1.7;
  font-weight: 600;
  color: var(--page-title-color);
}

/* ── Surface card ─────────────────────────────────────── */
.page-layout__surface {
  width: min(97.5%, var(--page-surface-max-width));
  max-width: 100%;
  margin: 0 auto;
  padding: 2em 2.25em 2.5em;
  border-radius: var(--page-surface-radius);
  background: var(--page-surface-bg);
  box-shadow:
    var(--page-surface-shadow),
    inset 0 0 0 1px var(--page-surface-border);
  color: var(--color-paper-text);
}

@media (max-width: 850px) {
  .page-layout__surface {
    padding: 1.5em 1.2em 2em;
  }
}
</style>
