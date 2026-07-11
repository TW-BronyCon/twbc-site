<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { booths } from "~/data/boothData";

const { t, locale } = useI18n();
const route = useRoute();
const localePath = useLocalePath();

const id = route.params.id as string;
const booth = computed(() => booths.find((b) => b.id === id));
const isEn = computed(() => locale.value.startsWith("en"));

// Head configuration
useHead(() => ({
  title: booth.value
    ? `${booth.value.name[isEn.value ? "en" : "zh"]} - ${t("venue.legend.booth")}`
    : t("booth.notFound.title"),
  meta: [
    {
      name: "description",
      content: booth.value
        ? booth.value.description[isEn.value ? "en" : "zh"]
        : t("booth.notFound.message"),
    },
  ],
}));

// Gallery active state
const activeImageIdx = ref(0);

// Lightbox state
const isLightboxOpen = ref(false);

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    isLightboxOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});

const boothImages = computed(() => {
  if (!booth.value) return [];
  // Fallback to booth.image if booth.images is not defined
  return booth.value.images || (booth.value.image ? [booth.value.image] : []);
});

const currentImage = computed(() => {
  return boothImages.value[activeImageIdx.value] || "";
});
</script>

<template>
  <PageLayout>
    <template #title>
      <div class="booth-header" v-if="booth">
        <span class="booth-badge">{{
          t("venue.modal.boothTitle", { id: booth.id })
        }}</span>
        <h1>{{ booth.name[isEn ? "en" : "zh"] }}</h1>
      </div>
      <div class="booth-header" v-else>
        <h1>{{ t("booth.notFound.title") }}</h1>
      </div>
    </template>

    <template #surface>
      <div v-if="booth" class="booth-detail-grid">
        <!-- Gallery Section -->
        <div class="booth-gallery-col">
          <div class="main-image-container" @click="isLightboxOpen = true">
            <img
              v-if="currentImage"
              :src="currentImage"
              :alt="booth.name[isEn ? 'en' : 'zh']"
              class="main-image"
              width="600"
              height="400"
            />
            <div v-else class="no-image-placeholder">
              <i class="fa-regular fa-image"></i>
            </div>
          </div>

          <!-- Thumbnails -->
          <div v-if="boothImages.length > 1" class="gallery-thumbnails">
            <button
              v-for="(img, idx) in boothImages"
              :key="idx"
              class="thumbnail-btn"
              :class="{ active: activeImageIdx === idx }"
              type="button"
              @click="activeImageIdx = idx"
            >
              <img :src="img" alt="Thumbnail" width="80" height="60" />
            </button>
          </div>
        </div>

        <!-- Info Section -->
        <div class="booth-info-col">
          <!-- Description -->
          <div class="info-card">
            <h4 class="section-title">{{ t("venue.modal.description") }}</h4>
            <p class="description-text">
              {{ booth.description[isEn ? "en" : "zh"] }}
            </p>
          </div>

          <!-- Links Section -->
          <div v-if="booth.links && booth.links.length > 0" class="info-card">
            <h4 class="section-title">{{ t("booth.links") }}</h4>
            <div class="links-grid">
              <a
                v-for="(link, idx) in booth.links"
                :key="idx"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="booth-link-btn"
              >
                <i :class="link.icon || 'fa-solid fa-link'"></i>
                <span>{{ link.label }}</span>
              </a>
            </div>
          </div>

          <!-- Actions -->
          <div class="actions-section">
            <!-- Back to Map -->
            <NuxtLink
              :to="localePath({ path: '/venue', query: { booth: booth.id } })"
              class="back-map-btn"
            >
              <i class="fa-solid fa-map-location-dot"></i>
              <span>{{ t("booth.backToMap") }}</span>
            </NuxtLink>
            <!-- Back to Booths List -->
            <NuxtLink :to="localePath('/booths')" class="back-list-btn">
              <i class="fa-solid fa-list"></i>
              <span>{{ t("booth.backToList") }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Not Found State -->
      <div v-else class="not-found-state">
        <p class="not-found-message">{{ t("booth.notFound.message") }}</p>
        <NuxtLink :to="localePath('/booths')" class="back-list-btn">
          <i class="fa-solid fa-list"></i>
          <span>{{ t("booth.backToList") }}</span>
        </NuxtLink>
      </div>

      <!-- Lightbox Modal -->
      <Teleport to="body">
        <Transition name="lightbox-fade">
          <div
            v-if="isLightboxOpen && currentImage"
            class="lightbox-overlay"
            @click="isLightboxOpen = false"
          >
            <button
              class="lightbox-close"
              type="button"
              @click="isLightboxOpen = false"
              :aria-label="t('common.close')"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
            <div class="lightbox-content" @click.stop>
              <img
                :src="currentImage"
                :alt="booth ? booth.name[isEn ? 'en' : 'zh'] : ''"
                class="lightbox-img"
              />
            </div>
          </div>
        </Transition>
      </Teleport>
    </template>
  </PageLayout>
</template>

<style scoped>
.booth-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.booth-badge {
  background: var(--color-gold);
  color: #120b18;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.booth-detail-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 2.5rem;
  align-items: start;
}

@media (max-width: 850px) {
  .booth-detail-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

/* Gallery styles */
.booth-gallery-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.main-image-container {
  width: 100%;
  aspect-ratio: 3 / 2;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 230, 167, 0.15);
  background: rgba(0, 0, 0, 0.2);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-in;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.5s ease;
}

.main-image:hover {
  transform: scale(1.02);
}

.no-image-placeholder {
  font-size: 3.5rem;
  color: rgba(255, 255, 255, 0.15);
}

.gallery-thumbnails {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.thumbnail-btn {
  width: 80px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid rgba(255, 230, 167, 0.15);
  background: transparent;
  padding: 0;
  cursor: pointer;
  transition: all 0.25s ease;
}

.thumbnail-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-btn:hover {
  border-color: rgba(255, 230, 167, 0.6);
  transform: translateY(-2px);
}

.thumbnail-btn.active {
  border-color: var(--color-gold);
  box-shadow: 0 0 10px rgba(255, 230, 167, 0.4);
}

/* Info column styles */
.booth-info-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-card {
  padding: 1.5rem;
  border-radius: 12px;
  background: rgba(20, 10, 25, 0.55);
  border: 1px solid rgba(255, 230, 167, 0.08);
}

.section-title {
  margin: 0 0 1rem 0;
  font-size: 1.15rem;
  color: var(--color-gold);
  border-bottom: 1px solid rgba(255, 230, 167, 0.15);
  padding-bottom: 0.5rem;
}

.description-text {
  margin: 0;
  font-size: 1rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.9);
  white-space: pre-wrap;
}

.links-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.booth-link-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 230, 167, 0.1);
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.25s ease;
}

.booth-link-btn:hover {
  background: rgba(255, 230, 167, 0.1);
  border-color: var(--color-gold);
  transform: translateX(4px);
}

.booth-link-btn i {
  font-size: 1.1rem;
  color: var(--color-gold);
}

/* Actions Section */
.actions-section {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
}

.back-map-btn,
.back-list-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  background: var(--color-gold);
  color: #120b18;
  text-decoration: none;
  font-weight: 700;
  transition: all 0.25s ease;
  border: 1px solid var(--color-gold);
  cursor: pointer;
}

.back-map-btn:hover,
.back-list-btn:hover {
  background: transparent;
  color: var(--color-gold);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 230, 167, 0.25);
}

/* Not Found styles */
.not-found-state {
  text-align: center;
  padding: 3rem 1.5rem;
}

.not-found-message {
  font-size: 1.15rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
}

/* Lightbox Styles */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(10, 5, 20, 0.95);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
}

.lightbox-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 230, 167, 0.15);
  color: #ffffff;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
  z-index: 1010;
}

.lightbox-close:hover {
  background: var(--color-gold);
  color: #120b18;
  border-color: var(--color-gold);
  transform: scale(1.1);
}

.lightbox-content {
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 230, 167, 0.15);
  cursor: default;
  transition: transform 0.3s ease;
}

/* Lightbox Fade Transition */
.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}

.lightbox-fade-enter-active .lightbox-img {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.lightbox-fade-enter-from .lightbox-img {
  transform: scale(0.9);
}
</style>
