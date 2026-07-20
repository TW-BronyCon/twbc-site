<script setup lang="ts">
import { computed } from "vue";
import { booths } from "~/data/boothData";

const { t, locale } = useI18n();
const localePath = useLocalePath();
const isEn = computed(() => locale.value.startsWith("en"));

definePageMeta({
  underDevelopment: false,
});

useHead(() => ({
  title: t("booth.list.title"),
  meta: [
    {
      name: "description",
      content: t("booth.list.subtitle"),
    },
  ],
}));
</script>

<template>
  <PageLayout>
    <template #title>
      <h1>{{ t("booth.list.title") }}</h1>
      <p>{{ t("booth.list.subtitle") }}</p>
    </template>

    <template #surface>
      <div class="booths-page-container">
        <!-- Top Toolbar -->
        <div class="toolbar">
          <NuxtLink :to="localePath('/venue')" class="map-link-btn">
            <i class="fa-solid fa-map-location-dot"></i>
            <span>{{ t("booth.backToMap") }}</span>
          </NuxtLink>
        </div>

        <!-- Booths Card Grid -->
        <div class="booths-grid">
          <div v-for="booth in booths" :key="booth.id" class="booth-card">
            <!-- Card Image -->
            <div class="booth-card-image">
              <img
                v-if="booth.image"
                :src="booth.image"
                :alt="booth.name[isEn ? 'en' : 'zh']"
                loading="lazy"
                width="360"
                height="240"
              />
              <div v-else class="image-placeholder">
                <i class="fa-regular fa-image"></i>
              </div>
            </div>

            <!-- Card Content -->
            <div class="booth-card-content">
              <span class="booth-card-badge">
                {{ t("venue.modal.boothTitle", { id: booth.id }) }}
              </span>
              <h3 class="booth-card-title">
                {{ booth.name[isEn ? "en" : "zh"] }}
              </h3>
              <p class="booth-card-desc">
                {{ booth.description[isEn ? "en" : "zh"] }}
              </p>

              <!-- Quick Links -->
              <div
                v-if="booth.links && booth.links.length > 0"
                class="booth-card-links"
              >
                <a
                  v-for="(link, idx) in booth.links.slice(0, 3)"
                  :key="idx"
                  :href="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  :title="link.label"
                  class="quick-link"
                >
                  <i :class="link.icon || 'fa-solid fa-link'"></i>
                </a>
              </div>
            </div>

            <!-- Card Footer / Actions -->
            <div class="booth-card-footer">
              <NuxtLink
                :to="localePath(`/booths/${booth.id}`)"
                class="details-btn"
              >
                <span>{{ t("venue.modal.viewBoothDetail") }}</span>
                <i class="fa-solid fa-arrow-right"></i>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </template>
  </PageLayout>
</template>

<style scoped>
.booths-page-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Toolbar */
.toolbar {
  display: flex;
  justify-content: flex-end;
}

.map-link-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  background: rgba(255, 230, 167, 0.1);
  border: 1px solid rgba(255, 230, 167, 0.25);
  color: var(--color-gold);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.25s ease;
}

.map-link-btn:hover {
  background: var(--color-gold);
  color: #120b18;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 230, 167, 0.2);
}

/* Grid layout */
.booths-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

@media (max-width: 600px) {
  .booths-grid {
    grid-template-columns: 1fr;
  }
}

/* Booth Card */
.booth-card {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background: rgba(20, 10, 25, 0.55);
  border: 1px solid rgba(255, 230, 167, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

.booth-card:hover {
  border-color: rgba(255, 230, 167, 0.35);
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.booth-card-image {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 230, 167, 0.08);
}

.booth-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.booth-card:hover .booth-card-image img {
  transform: scale(1.05);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: rgba(255, 255, 255, 0.15);
}

.booth-card-content {
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  flex-grow: 1;
}

.booth-card-badge {
  align-self: flex-start;
  background: rgba(255, 230, 167, 0.12);
  color: var(--color-gold);
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.booth-card-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  color: #ffffff;
  text-shadow: 0 0 8px rgba(255, 230, 167, 0.15);
}

.booth-card-desc {
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.75);
  white-space: pre-line;
  overflow-wrap: anywhere;
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.booth-card-links {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
}

.quick-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 230, 167, 0.08);
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.quick-link:hover {
  background: var(--color-gold);
  color: #120b18;
  border-color: var(--color-gold);
  transform: translateY(-2px);
}

.booth-card-footer {
  padding: 0 1.25rem 1.25rem 1.25rem;
}

.details-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  width: 100%;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  background: var(--color-gold);
  color: #120b18;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.85rem;
  transition: all 0.25s ease;
  border: 1px solid var(--color-gold);
}

.details-btn:hover {
  background: transparent;
  color: var(--color-gold);
  box-shadow: 0 4px 10px rgba(255, 230, 167, 0.15);
}
</style>
