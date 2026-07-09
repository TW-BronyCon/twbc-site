<script setup lang="ts">
/**
 * Template Reference Page Component
 * Shows standard page layout structures, design tokens, and typography.
 * Developers can copy this boilerplate to create new content pages.
 */

const { t } = useI18n();

useHead(() => ({
  title: t("template.title"),
}));
</script>

<template>
  <div class="page-root">
    <div class="page-body">
      <!-- Standard Hero Header -->
      <section class="page-hero">
        <h2>{{ t("template.title") }}</h2>
        <p>{{ t("template.description") }}</p>
      </section>

      <!-- Standard Section Card -->
      <section class="page-section-card">
        <div class="template-content">
          <h3>{{ t("template.sectionTitle") }}</h3>
          <p>{{ t("template.paragraph") }}</p>

          <!-- Component Showcases -->
          <div class="token-showcase-grid">
            <div class="showcase-item">
              <h4>{{ t("venue.legend.title") }}</h4>
              <p>
                Uses Noto Sans TC font-family, flex direction layouts, and
                cosmic themes.
              </p>
            </div>
            <div class="showcase-item font-gold">
              <h4>Gold Highlight</h4>
              <p>Uses gold text colors and drop shadow styles.</p>
            </div>
          </div>

          <!-- Sample Interactive Elements -->
          <div class="action-row">
            <button type="button" class="sample-btn">
              {{ t("template.button") }}
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.template-content h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: clamp(1.5rem, 2.5vw, 2.2rem);
  color: var(--color-gold);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

.template-content p {
  font-size: 1.05rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
}

.token-showcase-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.showcase-item {
  padding: 1.5rem;
  border-radius: 0.8rem;
  background: rgba(20, 10, 25, 0.45);
  border: 1px solid rgba(255, 230, 167, 0.08);
}

.showcase-item h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: #fff;
}

.showcase-item p {
  margin: 0;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
}

.font-gold h4 {
  color: var(--color-gold);
  text-shadow: 0 0 8px rgba(255, 230, 167, 0.2);
}

.action-row {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.sample-btn {
  appearance: none;
  background: linear-gradient(
    180deg,
    rgba(110, 64, 145, 0.85),
    rgba(66, 34, 86, 0.92)
  );
  border: 1px solid rgba(239, 200, 120, 0.62);
  border-radius: 999px;
  color: var(--color-gold-hover);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 9.5rem;
  padding: 0.75em 1.5em;
  font-size: 1rem;
  font-weight: 600;
  box-shadow:
    inset 0 0 0 1px rgba(255, 244, 220, 0.08),
    0 6px 18px rgba(0, 0, 0, 0.24);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background-color 0.18s ease;
}

.sample-btn:hover {
  transform: translateY(-2px);
  box-shadow:
    inset 0 0 0 1px rgba(255, 244, 220, 0.14),
    0 10px 24px rgba(0, 0, 0, 0.28),
    0 0 16px rgba(255, 218, 136, 0.1);
}

.sample-btn:active {
  transform: translateY(1px);
  box-shadow:
    inset 0 0 0 1px rgba(255, 244, 220, 0.08),
    0 4px 10px rgba(0, 0, 0, 0.2);
}
</style>
