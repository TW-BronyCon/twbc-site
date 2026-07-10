<template>
  <div class="background-container">
    <template v-if="variant === 'homepage'">
      <div
        v-for="(layer, index) in layers"
        :key="index"
        :class="['bg-layer', `bg${index + 1}`]"
        :ref="
          (el) => {
            if (el) layerRefs[index] = el as HTMLElement;
          }
        "
      >
        <img :src="layer.src" :alt="layer.alt || ''" @load="onImgLoad" />
      </div>
    </template>
    <div v-else :class="['bg-layer', variant]"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

interface BackgroundLayerConfig {
  src: string;
  start: number;
  end: number;
  mobileStart: number;
  mobileEnd: number;
  scale: number;
  mobileScale: number;
  x: string;
  mobileX: string;
  alt?: string;
}

interface ParallaxImage extends HTMLImageElement {
  _movable?: number;
}

const props = withDefaults(
  defineProps<{
    variant?: string;
    config?: BackgroundLayerConfig[];
  }>(),
  {
    variant: "village", // 'village' or 'homepage'
    config: () => [
      {
        src: "/img/bg1-2560.avif",
        start: 0,
        end: 100,
        mobileStart: 0,
        mobileEnd: 100,
        scale: 1,
        mobileScale: 1,
        x: "-50%",
        mobileX: "-50%",
      },
      {
        src: "/img/bg2-2560.avif",
        start: -20,
        end: 105,
        mobileStart: -5,
        mobileEnd: 145,
        scale: 1,
        mobileScale: 1.1,
        x: "-50%",
        mobileX: "-50%",
      },
      {
        src: "/img/bg3-2560.avif",
        start: 40,
        end: 95,
        mobileStart: 8,
        mobileEnd: 92,
        scale: 1,
        mobileScale: 1,
        x: "-50%",
        mobileX: "0",
      },
    ],
  },
);

const layerRefs = ref<HTMLElement[]>([]);
const layers = computed(() => props.config);

const isMobile = () =>
  typeof window !== "undefined" && window.innerWidth <= 800;

const setupSizes = () => {
  if (props.variant !== "homepage") return;
  const mobile = isMobile();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  layers.value.forEach((layer, index) => {
    const el = layerRefs.value[index];
    if (!el) return;
    const img = el.querySelector("img") as ParallaxImage | null;
    if (!img) return;

    const scale = mobile ? layer.mobileScale : layer.scale;
    const ratio = img.naturalHeight / img.naturalWidth || 1;

    let w = vw * scale;
    let h = w * ratio;

    if (h < vh) {
      h = vh * scale;
      w = h / ratio;
    }

    img._movable = Math.max(0, h - vh);
    img.style.width = `${w}px`;
    img.style.height = `${h}px`;
    img.style.willChange = "transform";
  });
};

const updateParallax = () => {
  if (props.variant !== "homepage") return;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  const mobile = isMobile();

  layers.value.forEach((layer, index) => {
    const el = layerRefs.value[index];
    if (!el) return;
    const img = el.querySelector("img") as ParallaxImage | null;
    if (!img || img._movable === undefined) return;

    const start = mobile ? layer.mobileStart : layer.start;
    const end = mobile ? layer.mobileEnd : layer.end;
    const x = mobile ? layer.mobileX : layer.x;

    const percent = start + (end - start) * progress;
    const y = -img._movable * (percent / 100);

    img.style.transform = `translate3d(${x}, ${y}px, 0)`;
  });
};

let scrollTicking = false;
const requestUpdate = () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    updateParallax();
    scrollTicking = false;
  });
};

let resizeTimer: ReturnType<typeof setTimeout> | null = null;
const requestResizeUpdate = () => {
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    setupSizes();
    updateParallax();
  }, 120);
};

const onImgLoad = () => {
  setupSizes();
  updateParallax();
};

onMounted(() => {
  if (props.variant === "homepage") {
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestResizeUpdate);

    // Initial setup after all images are likely loaded or on next tick
    setTimeout(() => {
      setupSizes();
      updateParallax();
    }, 100);
  }
});

onUnmounted(() => {
  window.removeEventListener("scroll", requestUpdate);
  window.removeEventListener("resize", requestResizeUpdate);
  if (resizeTimer) clearTimeout(resizeTimer);
});
</script>

<style scoped>
.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  background-color: var(--color-bg-dark); /* Dark purple matching site scheme */
}

.bg-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

.bg-layer img {
  position: absolute;
  top: 0;
  left: 50%;
  width: 100vw;
  height: auto;
  min-height: 100vh;
  object-fit: cover;
  object-position: top center;
}

.village {
  background-color: var(--color-bg-dark);
}

.bg1 {
  z-index: 1;
}
.bg2 {
  z-index: 2;
}
.bg3 {
  z-index: 3;
}
</style>
