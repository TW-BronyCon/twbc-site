<script setup lang="ts">
const { t } = useI18n();

definePageMeta({
  underDevelopment: false,
});

const route = useRoute();
const siteUrl = "https://twbronycon.org";

useSeoMeta({
  title: () => t("transport.title"),
  ogTitle: () => t("transport.title"),
  twitterTitle: () => t("transport.title"),
  description: () => t("seo.description"),
  ogDescription: () => t("seo.description"),
  twitterDescription: () => t("seo.description"),
  ogImage: `${siteUrl}/img/text-logo.avif`,
  twitterImage: `${siteUrl}/img/text-logo.avif`,
  ogUrl: computed(() => `${siteUrl}${route.path}`),
});
</script>

<template>
  <PageLayout>
    <template #title>
      <h1>{{ t("transport.title") }}</h1>
    </template>

    <template #surface>
      <div class="transport-grid">
        <!-- Transport Info Cards -->
        <div class="transport-info-col">
          <div class="transport-card">
            <div class="card-icon">
              <i class="fa-solid fa-train-subway"></i>
            </div>
            <div class="card-text">
              <h5>{{ t("transport.mrt") }}</h5>
              <p v-html="t('transport.mrtDesc')"></p>
            </div>
          </div>

          <div class="transport-card">
            <div class="card-icon"><i class="fa-solid fa-bus"></i></div>
            <div class="card-text">
              <h5>{{ t("transport.bus") }}</h5>
              <p>{{ t("transport.busDesc") }}</p>
            </div>
          </div>

          <div class="transport-card">
            <div class="card-icon"><i class="fa-solid fa-car"></i></div>
            <div class="card-text">
              <h5>{{ t("transport.driving") }}</h5>
              <p>{{ t("transport.drivingDesc") }}</p>
            </div>
          </div>
        </div>

        <!-- Google Maps Embed -->
        <div class="map-embed-col">
          <div class="map-frame">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3613.682855169476!2d121.4842186!3d25.0787593!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a94562095f9d%3A0xa6428784d0812739!2zMjQx5paw5YyX5biC5LiJ6YeN5Y2A5LiJ5ZKM6Lev5Zub5q61MTEx6JmfMTDmqkw!5e0!3m2!1szh-TW!2stw!4v1720166000000!5m2!1szh-TW!2stw"
              width="100%"
              height="100%"
              style="border: 0"
              allowfullscreen="true"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              :title="t('transport.mapTitle')"
            ></iframe>
          </div>
        </div>
      </div>
    </template>
  </PageLayout>
</template>

<style scoped>
.transport-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 2.5rem;
  align-items: stretch;
}

@media (max-width: 850px) {
  .transport-grid {
    grid-template-columns: 1fr;
  }
}

.transport-info-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.transport-card {
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;
  padding: 1.5rem;
  border-radius: 0.8rem;
  background: rgba(20, 10, 25, 0.55);
  border: 1px solid rgba(255, 230, 167, 0.08);
  transition: all 0.3s ease;
}

.transport-card:hover {
  border-color: rgba(255, 230, 167, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
}

.card-icon {
  font-size: 1.8rem;
  color: var(--color-gold);
  background: rgba(255, 230, 167, 0.1);
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
}

.card-text h5 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: #ffffff;
  text-shadow: 0 0 8px rgba(255, 230, 167, 0.2);
}

.card-text p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
}

.map-embed-col {
  width: 100%;
  min-height: 350px;
}

.map-frame {
  width: 100%;
  height: 100%;
  min-height: 350px;
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid rgba(255, 230, 167, 0.15);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}
</style>
