<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { booths, type Booth } from "~/data/boothData";
import { events, EVENT_COLORS } from "~/data/scheduleData";

const { t, locale } = useI18n();
const localePath = useLocalePath();
const route = useRoute();

definePageMeta({
  underDevelopment: false,
});

useHead(() => ({
  title: t("venue.title"),
}));

// Selection states
const selectedZoneId = ref<string | null>(null);
const selectedBooth = ref<Booth | null>(null);
const hoveredZoneId = ref<string | null>(null);
const hoveredBoothId = ref<string | null>(null);

// Helper for locale checking
const isEn = computed(() => locale.value.startsWith("en"));

// Helpers to support multiline text translations in SVG labels
function getLines(text: string): string[] {
  return text.split("\n");
}

function cleanLabel(text: string): string {
  return text.replace(/\n/g, " ");
}

// Event mapping for zones
const zoneEvents = computed(() => {
  if (!selectedZoneId.value) return [];
  const trackMap: Record<string, string> = {
    stage: "main",
    vendors: "vendor",
    workshop: "workshop",
    social: "social",
  };
  const track = trackMap[selectedZoneId.value];
  if (!track) return [];
  return events
    .filter((e) => e.track === track)
    .map((e) => {
      const rawColor = EVENT_COLORS[e.type];
      const bg = normalizeHexColor(rawColor);
      const text = getContrastColor(bg);
      return {
        title: isEn.value ? e.title.en : e.title.zh,
        start: e.start,
        end: e.end,
        detail: e.detail ? (isEn.value ? e.detail.en : e.detail.zh) : "",
        bg,
        text,
      };
    });
});

// Zoom and Pan States
const zoom = ref(1);
const panX = ref(0);
const panY = ref(0);
const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);
const dragStartX = ref(0);
const dragStartY = ref(0);
const dragDistance = ref(0); // Will store squared distance for performance

// Touch-specific zoom states
const startTouchDistance = ref(0);
const startZoom = ref(1);
const touchMidX = ref(0);
const touchMidY = ref(0);

// SVG size cache to prevent synchronous reflow during panning/zooming
let svgRectW = 0;
let svgRectH = 0;

const updateSvgRectSize = () => {
  const wrapper = document.getElementById("map-wrapper");
  if (wrapper) {
    const rect = wrapper.getBoundingClientRect();
    svgRectW = rect.width;
    svgRectH = rect.height;
  }
};

const cursorStyle = computed(() => {
  if (zoom.value <= 1) return "default";
  return isDragging.value ? "grabbing" : "grab";
});

const clampPan = () => {
  if (svgRectW <= 0 || svgRectH <= 0) return;

  if (zoom.value <= 1) {
    panX.value = 0;
    panY.value = 0;
    return;
  }

  // Allow panning beyond the strict boundaries when zoomed to let elements on the edges center properly.
  // The padding is 0 when zoom is 1, and grows as zoom increases.
  const paddingX = svgRectW * 0.4 * (zoom.value - 1);
  const paddingY = svgRectH * 0.4 * (zoom.value - 1);

  const minX = svgRectW * (1 - zoom.value) - paddingX;
  const maxX = paddingX;
  const minY = svgRectH * (1 - zoom.value) - paddingY;
  const maxY = paddingY;

  panX.value = Math.max(minX, Math.min(maxX, panX.value));
  panY.value = Math.max(minY, Math.min(maxY, panY.value));
};

const startPan = (e: MouseEvent) => {
  isDragging.value = true;
  startX.value = e.clientX - panX.value;
  startY.value = e.clientY - panY.value;
  dragStartX.value = e.clientX;
  dragStartY.value = e.clientY;
  dragDistance.value = 0;
  updateSvgRectSize();

  window.addEventListener("mousemove", onPan);
  window.addEventListener("mouseup", endPan);
};

const onPan = (e: MouseEvent) => {
  if (!isDragging.value) return;
  const dx = e.clientX - dragStartX.value;
  const dy = e.clientY - dragStartY.value;
  dragDistance.value = dx * dx + dy * dy;

  panX.value = e.clientX - startX.value;
  panY.value = e.clientY - startY.value;
  clampPan();
};

const endPan = () => {
  if (!isDragging.value) return;
  isDragging.value = false;
  window.removeEventListener("mousemove", onPan);
  window.removeEventListener("mouseup", endPan);
};

const handleWheel = (e: WheelEvent) => {
  e.preventDefault();
  updateSvgRectSize();
  const zoomFactor = 1.15;
  const nextZoom =
    e.deltaY < 0 ? zoom.value * zoomFactor : zoom.value / zoomFactor;
  adjustZoom(nextZoom, e.clientX, e.clientY, true);
};

// Touch event handlers (improved touch-friendliness)
const startTouchPan = (e: TouchEvent) => {
  updateSvgRectSize();
  if (e.touches.length === 1) {
    const touch0 = e.touches[0];
    if (!touch0) return;
    isDragging.value = true;
    startX.value = touch0.clientX - panX.value;
    startY.value = touch0.clientY - panY.value;
    dragStartX.value = touch0.clientX;
    dragStartY.value = touch0.clientY;
    dragDistance.value = 0;
  } else if (e.touches.length === 2) {
    const touch0 = e.touches[0];
    const touch1 = e.touches[1];
    if (!touch0 || !touch1) return;
    isDragging.value = false;
    startTouchDistance.value = Math.hypot(
      touch0.clientX - touch1.clientX,
      touch0.clientY - touch1.clientY,
    );
    startZoom.value = zoom.value;

    const wrapper = document.getElementById("map-wrapper");
    if (wrapper) {
      const rect = wrapper.getBoundingClientRect();
      touchMidX.value = (touch0.clientX + touch1.clientX) / 2 - rect.left;
      touchMidY.value = (touch0.clientY + touch1.clientY) / 2 - rect.top;
    }
  }
};

const onTouchPan = (e: TouchEvent) => {
  if (e.touches.length === 1 && isDragging.value) {
    const touch0 = e.touches[0];
    if (!touch0) return;
    if (zoom.value > 1) {
      e.preventDefault();
      panX.value = touch0.clientX - startX.value;
      panY.value = touch0.clientY - startY.value;
      clampPan();
    } else {
      // If not zoomed, only prevent horizontal pans to allow scrolling the page vertically on mobile
      const dx = touch0.clientX - startX.value - panX.value;
      const dy = touch0.clientY - startY.value - panY.value;
      if (Math.abs(dx) > Math.abs(dy)) {
        e.preventDefault();
      }
    }
    const dx = touch0.clientX - dragStartX.value;
    const dy = touch0.clientY - dragStartY.value;
    dragDistance.value = dx * dx + dy * dy;
  } else if (e.touches.length === 2) {
    const touch0 = e.touches[0];
    const touch1 = e.touches[1];
    if (!touch0 || !touch1) return;
    e.preventDefault();
    const currentDistance = Math.hypot(
      touch0.clientX - touch1.clientX,
      touch0.clientY - touch1.clientY,
    );
    if (startTouchDistance.value > 0) {
      const scale = currentDistance / startTouchDistance.value;
      const targetZoom = startZoom.value * scale;
      adjustZoom(targetZoom, touchMidX.value, touchMidY.value, false);
    }
  }
};

const endTouchPan = (e: TouchEvent) => {
  if (e.touches.length === 0) {
    isDragging.value = false;
    // If the user was just pinch-zooming, keep dragDistance high to prevent triggering a click when fingers lift
    if (startTouchDistance.value > 0) {
      dragDistance.value = 999999;
    }
    startTouchDistance.value = 0;
  } else if (e.touches.length === 1) {
    const touch0 = e.touches[0];
    if (!touch0) return;
    isDragging.value = true;
    startX.value = touch0.clientX - panX.value;
    startY.value = touch0.clientY - panY.value;
    dragStartX.value = touch0.clientX;
    dragStartY.value = touch0.clientY;

    // If the user was just pinch-zooming, keep dragDistance high to prevent triggering a click on release
    if (startTouchDistance.value > 0) {
      dragDistance.value = 999999;
    } else {
      dragDistance.value = 0;
    }
    startTouchDistance.value = 0;
  }
};

// Adjust Zoom centered at a screen point
const adjustZoom = (
  targetZoom: number,
  screenX: number,
  screenY: number,
  useClientCoord = false,
) => {
  const clampedZoom = Math.max(1, Math.min(4, targetZoom));
  if (clampedZoom === zoom.value) return;

  if (svgRectW > 0 && svgRectH > 0) {
    let rectLeft = 0;
    let rectTop = 0;
    if (useClientCoord) {
      const wrapper = document.getElementById("map-wrapper");
      if (wrapper) {
        const rect = wrapper.getBoundingClientRect();
        rectLeft = rect.left;
        rectTop = rect.top;
      }
    }

    const targetX = useClientCoord ? screenX - rectLeft : screenX;
    const targetY = useClientCoord ? screenY - rectTop : screenY;

    const ptX = (targetX - panX.value) / zoom.value;
    const ptY = (targetY - panY.value) / zoom.value;

    zoom.value = clampedZoom;
    panX.value = targetX - ptX * clampedZoom;
    panY.value = targetY - ptY * clampedZoom;
    clampPan();
  } else {
    zoom.value = clampedZoom;
  }
};

const zoomIn = () => {
  updateSvgRectSize();
  if (svgRectW > 0) {
    adjustZoom(zoom.value * 1.3, svgRectW / 2, svgRectH / 2);
  } else {
    zoom.value = Math.min(4, zoom.value * 1.3);
  }
};

const zoomOut = () => {
  updateSvgRectSize();
  if (svgRectW > 0) {
    adjustZoom(zoom.value / 1.3, svgRectW / 2, svgRectH / 2);
  } else {
    zoom.value = Math.max(1, zoom.value / 1.3);
  }
};

const resetZoom = () => {
  zoom.value = 1;
  panX.value = 0;
  panY.value = 0;
};

// Convert SVG coordinates to screen coordinates and zoom/pan to center
const zoomToCoords = (svgX: number, svgY: number, targetZoom = 2) => {
  updateSvgRectSize();
  if (svgRectW <= 0 || svgRectH <= 0) return;

  zoom.value = targetZoom;

  const scaleX = svgRectW / 598.22;
  const scaleY = svgRectH / 598.22;
  const targetX = svgX * scaleX;
  const targetY = svgY * scaleY;

  panX.value = svgRectW / 2 - targetX * targetZoom;
  panY.value = svgRectH / 2 - targetY * targetZoom;
  clampPan();
};

// Handlers
const openZone = (zoneId: string) => {
  if (dragDistance.value > 256) return; // Skip click if panned (16px squared for improved touch sensitivity)
  selectedZoneId.value = zoneId;
  selectedBooth.value = null;

  const zoneCenters: Record<string, { x: number; y: number }> = {
    stage: { x: 347.9, y: 185.7 },
    vendors: { x: 190.0, y: 310.0 },
    workshop: { x: 466.7, y: 192.0 },
    social: { x: 347.9, y: 306.7 },
    exhibition: { x: 435.0, y: 385.0 },
    bar: { x: 74.6, y: 154.3 },
    checkin: { x: 420.4, y: 474.0 },
  };

  const coords = zoneCenters[zoneId];
  if (coords) {
    zoomToCoords(coords.x, coords.y, 1.8);
  }
};

const openBooth = (booth: Booth) => {
  if (dragDistance.value > 256) return; // Skip click if panned (16px squared for improved touch sensitivity)
  selectedBooth.value = booth;
  selectedZoneId.value = null;

  const boothCenters: Record<string, { x: number; y: number }> = {
    "1": { x: 107.56, y: 260.74 },
    "2": { x: 125.97, y: 285.52 },
    "3": { x: 152.03, y: 320.59 },
    "4": { x: 170.44, y: 345.37 },
    "5": { x: 196.5, y: 380.44 },
    "6": { x: 165.16, y: 233.38 },
    "7": { x: 183.57, y: 258.17 },
    "8": { x: 196.95, y: 209.75 },
    "9": { x: 215.37, y: 234.53 },
    "10": { x: 212.86, y: 264.25 },
  };
  const coords = boothCenters[booth.id];
  if (coords) {
    zoomToCoords(coords.x, coords.y, 2.5);
  }
};

const openBoothById = (id: string) => {
  const booth = booths.find((b) => b.id === id);
  if (booth) {
    openBooth(booth);
  }
};

const clearSelection = () => {
  selectedZoneId.value = null;
  selectedBooth.value = null;
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    clearSelection();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("resize", updateSvgRectSize);

  setTimeout(() => {
    updateSvgRectSize();
    if (route.query.booth) {
      const boothId = route.query.booth as string;
      openBoothById(boothId);
    }
  }, 100);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("resize", updateSvgRectSize);
  window.removeEventListener("mousemove", onPan);
  window.removeEventListener("mouseup", endPan);
});
</script>

<template>
  <PageLayout>
    <template #title>
      <h1>{{ t("venue.title") }}</h1>
      <p>{{ t("venue.hint") }}</p>
    </template>

    <template #surface>
      <div class="venue-layout">
        <!-- SVG Map Container -->
        <div class="map-container-card">
          <div class="map-wrapper" id="map-wrapper">
            <div
              class="map-viewport"
              :class="{
                'smooth-pan': !isDragging && startTouchDistance === 0,
              }"
              :style="{
                transform: `translate3d(${panX}px, ${panY}px, 0) scale(${zoom})`,
                transformOrigin: '0 0',
              }"
            >
              <svg
                id="venue-svg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 598.22 598.22"
                :style="{
                  cursor: cursorStyle,
                  touchAction: zoom > 1 ? 'none' : 'pan-y',
                }"
                @mousedown="startPan"
                @wheel="handleWheel"
                @touchstart="startTouchPan"
                @touchmove="onTouchPan"
                @touchend="endTouchPan"
              >
                <defs>
                  <!-- SVG Filter for custom glow effects -->
                  <filter
                    id="neon-glow"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                  >
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <!-- Scalable Viewport Group -->
                <g>
                  <!-- Wood Floor Background -->
                  <path
                    class="wood-floor"
                    d="M497.88,107.34v188.78l-39.08,53.09h-249.9l-91.28-122.84-25.7,19.1-22.53-30.43,3.13-2.34c-1.49-.05-2.96-.16-4.42-.32l.14-1.14c-10.19-1.3-19.84-5.36-27.9-11.73l11.46-14.52c16.49,13.05,40.43,10.26,53.48-6.23,13.04-16.47,10.27-40.39-6.18-53.45l-.47-.39,10.14-13.23.67-4.35h388.44Z"
                  />

                  <!-- Outer Border Walls -->
                  <path
                    class="outer-border"
                    d="M546.36,465.67l-95.84-.2v16.86h-60.18v-17.06l-114.95-.3v-39.79h-20.65l-32.85,24.41L55.39,225.52l17.13-12.82c-31.34-1.08-56.4-26.82-56.4-58.42s26.17-58.46,58.46-58.46c13.06,0,25.13,4.28,34.86,11.52h436.92v200.87l-59.36,80.79v34.3h59.36"
                  />

                  <!-- Structural Pillars -->
                  <rect
                    class="pillar"
                    x="264.81"
                    y="237.23"
                    width="23.26"
                    height="23.73"
                  />
                  <rect
                    class="pillar"
                    x="407.27"
                    y="237.23"
                    width="23.26"
                    height="23.73"
                  />
                  <rect
                    class="pillar"
                    x="308.75"
                    y="392.76"
                    width="68.84"
                    height="30.54"
                  />

                  <!-- Connector line -->
                  <line
                    class="map-line"
                    x1="304.55"
                    y1="423.31"
                    x2="487"
                    y2="423.31"
                  />

                  <!-- Interactive Zone: Main Stage -->
                  <g
                    class="zone-group stage-group"
                    :class="{
                      active:
                        hoveredZoneId === 'stage' || selectedZoneId === 'stage',
                    }"
                    @mouseover="hoveredZoneId = 'stage'"
                    @mouseleave="hoveredZoneId = null"
                    @click="openZone('stage')"
                  >
                    <rect
                      class="zone-shape shape-stage"
                      x="260.35"
                      y="107.34"
                      width="175.11"
                      height="156.75"
                    />
                    <text class="zone-label-text" x="347.9" y="185.7">
                      <tspan
                        v-for="(line, idx) in getLines(t('venue.legend.stage'))"
                        :key="idx"
                        x="347.9"
                        :dy="
                          idx === 0
                            ? getLines(t('venue.legend.stage')).length > 1
                              ? '-0.6em'
                              : '0'
                            : '1.2em'
                        "
                      >
                        {{ line }}
                      </tspan>
                    </text>
                  </g>

                  <!-- Interactive Zone: Vendor Alley -->
                  <g
                    class="zone-group vendors-group"
                    :class="{
                      active:
                        hoveredZoneId === 'vendors' ||
                        selectedZoneId === 'vendors',
                    }"
                    @mouseover="hoveredZoneId = 'vendors'"
                    @mouseleave="hoveredZoneId = null"
                    @click="openZone('vendors')"
                  >
                    <polygon
                      class="zone-shape shape-vendors"
                      points="260.35 183.43 175.42 183.43 77.93 255.86 221.89 449.6 254.74 425.18 260.35 425.19 260.35 183.43"
                    />
                    <text class="zone-label-text" x="190.0" y="310.0">
                      <tspan
                        v-for="(line, idx) in getLines(
                          t('venue.legend.vendors'),
                        )"
                        :key="idx"
                        x="190.0"
                        :dy="
                          idx === 0
                            ? getLines(t('venue.legend.vendors')).length > 1
                              ? '-0.6em'
                              : '0'
                            : '1.2em'
                        "
                      >
                        {{ line }}
                      </tspan>
                    </text>
                  </g>

                  <!-- Interactive Zone: Workshop Area -->
                  <g
                    class="zone-group workshop-group"
                    :class="{
                      active:
                        hoveredZoneId === 'workshop' ||
                        selectedZoneId === 'workshop',
                    }"
                    @mouseover="hoveredZoneId = 'workshop'"
                    @mouseleave="hoveredZoneId = null"
                    @click="openZone('workshop')"
                  >
                    <rect
                      class="zone-shape shape-workshop"
                      x="435.46"
                      y="107.35"
                      width="62.42"
                      height="169.22"
                    />
                    <text class="zone-label-text" x="466.7" y="192.0">
                      <tspan
                        v-for="(line, idx) in getLines(
                          t('venue.legend.workshop'),
                        )"
                        :key="idx"
                        x="466.7"
                        :dy="
                          idx === 0
                            ? getLines(t('venue.legend.workshop')).length > 1
                              ? '-0.6em'
                              : '0'
                            : '1.2em'
                        "
                      >
                        {{ line }}
                      </tspan>
                    </text>
                  </g>

                  <!-- Interactive Zone: Social Area -->
                  <g
                    class="zone-group social-group"
                    :class="{
                      active:
                        hoveredZoneId === 'social' ||
                        selectedZoneId === 'social',
                    }"
                    @mouseover="hoveredZoneId = 'social'"
                    @mouseleave="hoveredZoneId = null"
                    @click="openZone('social')"
                  >
                    <rect
                      class="zone-shape shape-social"
                      x="260.35"
                      y="264.09"
                      width="175.11"
                      height="85.13"
                    />
                    <text class="zone-label-text" x="347.9" y="306.7">
                      <tspan
                        v-for="(line, idx) in getLines(
                          t('venue.legend.social'),
                        )"
                        :key="idx"
                        x="347.9"
                        :dy="
                          idx === 0
                            ? getLines(t('venue.legend.social')).length > 1
                              ? '-0.6em'
                              : '0'
                            : '1.2em'
                        "
                      >
                        {{ line }}
                      </tspan>
                    </text>
                  </g>

                  <!-- Interactive Zone: Exhibition -->
                  <g
                    class="zone-group exhibition-group"
                    :class="{
                      active:
                        hoveredZoneId === 'exhibition' ||
                        selectedZoneId === 'exhibition',
                    }"
                    @mouseover="hoveredZoneId = 'exhibition'"
                    @mouseleave="hoveredZoneId = null"
                    @click="openZone('exhibition')"
                  >
                    <polygon
                      class="zone-shape shape-exhibition"
                      points="487 389.01 487 423.31 377.59 423.31 377.59 349.22 458.8 349.22 497.88 296.12 535.13 323.49 487 389.01"
                    />
                    <text class="zone-label-text" x="435.0" y="385.0">
                      <tspan
                        v-for="(line, idx) in getLines(
                          t('venue.legend.exhibition'),
                        )"
                        :key="idx"
                        x="435.0"
                        :dy="
                          idx === 0
                            ? getLines(t('venue.legend.exhibition')).length > 1
                              ? '-0.6em'
                              : '0'
                            : '1.2em'
                        "
                      >
                        {{ line }}
                      </tspan>
                    </text>
                  </g>

                  <!-- Interactive Zone: Bar -->
                  <g
                    class="zone-group bar-group"
                    :class="{
                      active:
                        hoveredZoneId === 'bar' || selectedZoneId === 'bar',
                    }"
                    @mouseover="hoveredZoneId = 'bar'"
                    @mouseleave="hoveredZoneId = null"
                    @click="openZone('bar')"
                  >
                    <polygon
                      class="zone-shape shape-bar"
                      points="22.3 180.48 25.12 185.48 28.41 190.17 32.15 194.52 36.3 198.49 40.82 202.03 45.66 205.11 50.78 207.69 56.13 209.77 61.66 211.31 67.31 212.3 73.03 212.73 78.77 212.6 84.47 211.91 90.07 210.66 95.52 208.87 100.77 206.55 105.77 203.74 110.46 200.44 114.82 196.7 118.78 192.55 122.32 188.03 125.4 183.19 127.99 178.07 130.06 172.72 131.6 167.19 132.59 161.54 133.02 155.82 132.89 150.08 132.2 144.38 130.95 138.78 129.16 133.33 126.85 128.08 124.03 123.08 120.73 118.39 116.99 114.03 112.84 110.07 108.32 106.53 103.48 103.45 98.36 100.86 93.01 98.79 87.48 97.25 81.83 96.26 76.11 95.83 70.37 95.96 64.68 96.65 59.07 97.9 53.62 99.69 48.37 102 43.37 104.82 38.68 108.12 34.33 111.86 30.36 116.01 26.82 120.53 23.74 125.37 21.16 130.49 19.08 135.84 17.54 141.37 16.55 147.02 16.12 152.74 16.25 158.48 16.94 164.17 18.19 169.78 19.98 175.23 22.3 180.48"
                    />
                    <text class="zone-label-text" x="74.6" y="154.3">
                      <tspan
                        v-for="(line, idx) in getLines(t('venue.legend.bar'))"
                        :key="idx"
                        x="74.6"
                        :dy="
                          idx === 0
                            ? getLines(t('venue.legend.bar')).length > 1
                              ? '-0.6em'
                              : '0'
                            : '1.2em'
                        "
                      >
                        {{ line }}
                      </tspan>
                    </text>
                  </g>

                  <!-- Interactive Zone: Check-in -->
                  <g
                    class="zone-group checkin-group"
                    :class="{
                      active:
                        hoveredZoneId === 'checkin' ||
                        selectedZoneId === 'checkin',
                    }"
                    @mouseover="hoveredZoneId = 'checkin'"
                    @mouseleave="hoveredZoneId = null"
                    @click="openZone('checkin')"
                  >
                    <rect
                      class="zone-shape shape-checkin"
                      x="390.34"
                      y="465.47"
                      width="60.18"
                      height="17.06"
                    />
                    <text class="zone-label-text" x="420.4" y="474.0">
                      <tspan
                        v-for="(line, idx) in getLines(
                          t('venue.legend.checkin'),
                        )"
                        :key="idx"
                        x="420.4"
                        :dy="
                          idx === 0
                            ? getLines(t('venue.legend.checkin')).length > 1
                              ? '-0.6em'
                              : '0'
                            : '1.2em'
                        "
                      >
                        {{ line }}
                      </tspan>
                    </text>
                  </g>

                  <!-- Non-interactive Zone: Entrance -->
                  <g class="entrance-group">
                    <polygon
                      class="shape-entrance"
                      points="553.51 441.24 549.52 445.47 553.51 449.7 553.51 441.24"
                    />
                    <text class="zone-label-text-static" x="544.5" y="445.5">
                      <tspan
                        v-for="(line, idx) in getLines(
                          t('venue.legend.entrance'),
                        )"
                        :key="idx"
                        x="544.5"
                        :dy="
                          idx === 0
                            ? getLines(t('venue.legend.entrance')).length > 1
                              ? '-0.6em'
                              : '0'
                            : '1.2em'
                        "
                      >
                        {{ line }}
                      </tspan>
                    </text>
                  </g>

                  <!-- Interactive Booths Layer -->
                  <g id="booths-layer">
                    <!-- Booth 1 -->
                    <g
                      class="booth-group"
                      v-if="booths.some((b) => b.id === '1')"
                      :class="{
                        active:
                          hoveredBoothId === '1' || selectedBooth?.id === '1',
                      }"
                      transform="translate(107.56, 260.74) rotate(-36.62)"
                      @mouseover="hoveredBoothId = '1'"
                      @mouseleave="hoveredBoothId = null"
                      @click.stop="openBoothById('1')"
                    >
                      <rect
                        class="booth-rect"
                        x="-9.34"
                        y="-7.72"
                        width="18.68"
                        height="15.44"
                        rx="2"
                        ry="2"
                      />
                      <text
                        class="booth-label"
                        x="0"
                        y="0.5"
                        dominant-baseline="central"
                        text-anchor="middle"
                      >
                        1
                      </text>
                    </g>
                    <!-- Booth 2 -->
                    <g
                      class="booth-group"
                      v-if="booths.some((b) => b.id === '2')"
                      :class="{
                        active:
                          hoveredBoothId === '2' || selectedBooth?.id === '2',
                      }"
                      transform="translate(125.97, 285.52) rotate(-36.62)"
                      @mouseover="hoveredBoothId = '2'"
                      @mouseleave="hoveredBoothId = null"
                      @click.stop="openBoothById('2')"
                    >
                      <rect
                        class="booth-rect"
                        x="-9.34"
                        y="-7.72"
                        width="18.68"
                        height="15.44"
                        rx="2"
                        ry="2"
                      />
                      <text
                        class="booth-label"
                        x="0"
                        y="0.5"
                        dominant-baseline="central"
                        text-anchor="middle"
                      >
                        2
                      </text>
                    </g>
                    <!-- Booth 3 -->
                    <g
                      class="booth-group"
                      v-if="booths.some((b) => b.id === '3')"
                      :class="{
                        active:
                          hoveredBoothId === '3' || selectedBooth?.id === '3',
                      }"
                      transform="translate(152.03, 320.59) rotate(-36.62)"
                      @mouseover="hoveredBoothId = '3'"
                      @mouseleave="hoveredBoothId = null"
                      @click.stop="openBoothById('3')"
                    >
                      <rect
                        class="booth-rect"
                        x="-9.34"
                        y="-7.72"
                        width="18.68"
                        height="15.44"
                        rx="2"
                        ry="2"
                      />
                      <text
                        class="booth-label"
                        x="0"
                        y="0.5"
                        dominant-baseline="central"
                        text-anchor="middle"
                      >
                        3
                      </text>
                    </g>
                    <!-- Booth 4 -->
                    <g
                      class="booth-group"
                      v-if="booths.some((b) => b.id === '4')"
                      :class="{
                        active:
                          hoveredBoothId === '4' || selectedBooth?.id === '4',
                      }"
                      transform="translate(170.44, 345.37) rotate(-36.62)"
                      @mouseover="hoveredBoothId = '4'"
                      @mouseleave="hoveredBoothId = null"
                      @click.stop="openBoothById('4')"
                    >
                      <rect
                        class="booth-rect"
                        x="-9.34"
                        y="-7.72"
                        width="18.68"
                        height="15.44"
                        rx="2"
                        ry="2"
                      />
                      <text
                        class="booth-label"
                        x="0"
                        y="0.5"
                        dominant-baseline="central"
                        text-anchor="middle"
                      >
                        4
                      </text>
                    </g>
                    <!-- Booth 5 -->
                    <g
                      class="booth-group"
                      v-if="booths.some((b) => b.id === '5')"
                      :class="{
                        active:
                          hoveredBoothId === '5' || selectedBooth?.id === '5',
                      }"
                      transform="translate(196.5, 380.44) rotate(-36.62)"
                      @mouseover="hoveredBoothId = '5'"
                      @mouseleave="hoveredBoothId = null"
                      @click.stop="openBoothById('5')"
                    >
                      <rect
                        class="booth-rect"
                        x="-9.34"
                        y="-7.72"
                        width="18.68"
                        height="15.44"
                        rx="2"
                        ry="2"
                      />
                      <text
                        class="booth-label"
                        x="0"
                        y="0.5"
                        dominant-baseline="central"
                        text-anchor="middle"
                      >
                        5
                      </text>
                    </g>
                    <!-- Booth 6 -->
                    <g
                      class="booth-group"
                      v-if="booths.some((b) => b.id === '6')"
                      :class="{
                        active:
                          hoveredBoothId === '6' || selectedBooth?.id === '6',
                      }"
                      transform="translate(165.16, 233.38) rotate(-36.62)"
                      @mouseover="hoveredBoothId = '6'"
                      @mouseleave="hoveredBoothId = null"
                      @click.stop="openBoothById('6')"
                    >
                      <rect
                        class="booth-rect"
                        x="-9.34"
                        y="-7.72"
                        width="18.68"
                        height="15.44"
                        rx="2"
                        ry="2"
                      />
                      <text
                        class="booth-label"
                        x="0"
                        y="0.5"
                        dominant-baseline="central"
                        text-anchor="middle"
                      >
                        6
                      </text>
                    </g>
                    <!-- Booth 7 -->
                    <g
                      class="booth-group"
                      v-if="booths.some((b) => b.id === '7')"
                      :class="{
                        active:
                          hoveredBoothId === '7' || selectedBooth?.id === '7',
                      }"
                      transform="translate(183.57, 258.17) rotate(-36.62)"
                      @mouseover="hoveredBoothId = '7'"
                      @mouseleave="hoveredBoothId = null"
                      @click.stop="openBoothById('7')"
                    >
                      <rect
                        class="booth-rect"
                        x="-9.34"
                        y="-7.72"
                        width="18.68"
                        height="15.44"
                        rx="2"
                        ry="2"
                      />
                      <text
                        class="booth-label"
                        x="0"
                        y="0.5"
                        dominant-baseline="central"
                        text-anchor="middle"
                      >
                        7
                      </text>
                    </g>
                    <!-- Booth 8 -->
                    <g
                      class="booth-group"
                      v-if="booths.some((b) => b.id === '8')"
                      :class="{
                        active:
                          hoveredBoothId === '8' || selectedBooth?.id === '8',
                      }"
                      transform="translate(196.95, 209.75) rotate(-36.62)"
                      @mouseover="hoveredBoothId = '8'"
                      @mouseleave="hoveredBoothId = null"
                      @click.stop="openBoothById('8')"
                    >
                      <rect
                        class="booth-rect"
                        x="-9.34"
                        y="-7.72"
                        width="18.68"
                        height="15.44"
                        rx="2"
                        ry="2"
                      />
                      <text
                        class="booth-label"
                        x="0"
                        y="0.5"
                        dominant-baseline="central"
                        text-anchor="middle"
                      >
                        8
                      </text>
                    </g>
                    <!-- Booth 9 -->
                    <g
                      class="booth-group"
                      v-if="booths.some((b) => b.id === '9')"
                      :class="{
                        active:
                          hoveredBoothId === '9' || selectedBooth?.id === '9',
                      }"
                      transform="translate(215.37, 234.53) rotate(-36.62)"
                      @mouseover="hoveredBoothId = '9'"
                      @mouseleave="hoveredBoothId = null"
                      @click.stop="openBoothById('9')"
                    >
                      <rect
                        class="booth-rect"
                        x="-9.34"
                        y="-7.72"
                        width="18.68"
                        height="15.44"
                        rx="2"
                        ry="2"
                      />
                      <text
                        class="booth-label"
                        x="0"
                        y="0.5"
                        dominant-baseline="central"
                        text-anchor="middle"
                      >
                        9
                      </text>
                    </g>
                    <!-- Booth 10 -->
                    <g
                      class="booth-group"
                      v-if="booths.some((b) => b.id === '10')"
                      :class="{
                        active:
                          hoveredBoothId === '10' || selectedBooth?.id === '10',
                      }"
                      transform="translate(212.86, 264.25) rotate(-36.62)"
                      @mouseover="hoveredBoothId = '10'"
                      @mouseleave="hoveredBoothId = null"
                      @click.stop="openBoothById('10')"
                    >
                      <rect
                        class="booth-rect"
                        x="-7.72"
                        y="-9.34"
                        width="15.44"
                        height="18.68"
                        rx="2"
                        ry="2"
                      />
                      <text
                        class="booth-label"
                        x="0"
                        y="0.5"
                        dominant-baseline="central"
                        text-anchor="middle"
                      >
                        10
                      </text>
                    </g>
                  </g>
                </g>
              </svg>
            </div>

            <!-- Interactive Zoom & Pan Controls Overlay -->
            <div class="map-controls">
              <button
                class="control-btn"
                type="button"
                @click="zoomIn"
                :aria-label="t('common.zoomIn')"
                title="Zoom In"
              >
                <i class="fa-solid fa-plus" aria-hidden="true"></i>
              </button>
              <button
                class="control-btn"
                type="button"
                @click="zoomOut"
                :aria-label="t('common.zoomOut')"
                title="Zoom Out"
              >
                <i class="fa-solid fa-minus" aria-hidden="true"></i>
              </button>
              <button
                class="control-btn"
                type="button"
                @click="resetZoom"
                :aria-label="t('common.resetZoom')"
                title="Reset View"
              >
                <i class="fa-solid fa-arrows-to-dot" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Sidebar / Interactive Info Deck Column Wrapper -->
        <div class="sidebar-column-wrapper">
          <div
            class="info-sidebar-card"
            :class="{ 'has-selection': selectedZoneId || selectedBooth }"
          >
            <!-- Clear Selection Close Button -->
            <button
              v-if="selectedZoneId || selectedBooth"
              class="clear-selection-btn"
              type="button"
              @click="clearSelection"
              :title="t('common.close')"
              :aria-label="t('common.close')"
            >
              <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>

            <!-- Hover/Selection Context Info -->
            <div class="sidebar-content-wrapper">
              <!-- 1. Selection State: Booth -->
              <template v-if="selectedBooth">
                <div class="sidebar-item-detail">
                  <span class="preview-badge booth-badge">{{
                    t("venue.modal.boothTitle", { id: selectedBooth.id })
                  }}</span>
                  <h3>{{ selectedBooth.name[isEn ? "en" : "zh"] }}</h3>
                  <div class="sidebar-section-title">
                    {{ t("venue.modal.description") }}
                  </div>
                  <p class="detail-desc">
                    {{ selectedBooth.description[isEn ? "en" : "zh"] }}
                  </p>

                  <div class="booth-cta-section">
                    <NuxtLink
                      :to="localePath(`/booths/${selectedBooth.id}`)"
                      class="view-detail-btn"
                    >
                      <span>{{ t("venue.modal.viewBoothDetail") }}</span>
                      <i class="fa-solid fa-arrow-right"></i>
                    </NuxtLink>
                  </div>

                  <!-- Links -->
                  <div
                    v-if="selectedBooth.links && selectedBooth.links.length > 0"
                    class="sidebar-links-section"
                  >
                    <div class="sidebar-section-title">
                      {{ t("venue.modal.links") }}
                    </div>
                    <div class="links-grid">
                      <a
                        v-for="(link, idx) in selectedBooth.links"
                        :key="idx"
                        :href="link.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="booth-social-link"
                      >
                        <i :class="link.icon || 'fa-solid fa-link'"></i>
                        <span>{{ link.label }}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </template>

              <!-- 2. Selection State: Zone -->
              <template v-else-if="selectedZoneId">
                <div class="sidebar-item-detail">
                  <span
                    class="preview-badge"
                    :class="`zone-badge-${selectedZoneId}`"
                  >
                    {{ cleanLabel(t(`venue.legend.${selectedZoneId}`)) }}
                  </span>
                  <h3>{{ cleanLabel(t(`venue.legend.${selectedZoneId}`)) }}</h3>
                  <div class="sidebar-section-title">
                    {{ t("venue.modal.details") }}
                  </div>
                  <p class="detail-desc">
                    {{ t(`venue.zones.${selectedZoneId}`) }}
                  </p>

                  <!-- Linked Events Schedule -->
                  <div
                    v-if="
                      ['stage', 'vendors', 'workshop', 'social'].includes(
                        selectedZoneId,
                      )
                    "
                    class="sidebar-events-section"
                  >
                    <div class="sidebar-section-title">
                      {{ t("venue.modal.events") }}
                    </div>

                    <div v-if="zoneEvents.length > 0" class="events-list">
                      <div
                        v-for="(event, idx) in zoneEvents"
                        :key="idx"
                        class="event-item"
                        :style="{
                          borderLeftColor: event.bg,
                          backgroundColor: event.bg + '12',
                        }"
                      >
                        <div class="event-time" :style="{ color: event.bg }">
                          🕒 {{ event.start }} - {{ event.end }}
                        </div>
                        <div class="event-title">{{ event.title }}</div>
                        <div v-if="event.detail" class="event-desc">
                          {{ event.detail }}
                        </div>
                      </div>
                    </div>
                    <p v-else class="no-events-text">
                      {{ t("venue.modal.noEvents") }}
                    </p>
                  </div>
                </div>
              </template>

              <!-- 3. Hover State: Booth -->
              <template v-else-if="hoveredBoothId">
                <div class="sidebar-item-preview">
                  <span class="preview-badge booth-badge">{{
                    t("venue.modal.boothTitle", { id: hoveredBoothId })
                  }}</span>
                  <h3>
                    {{
                      booths.find((b) => b.id === hoveredBoothId)?.name[
                        isEn ? "en" : "zh"
                      ]
                    }}
                  </h3>
                  <p class="preview-desc">
                    {{
                      booths.find((b) => b.id === hoveredBoothId)?.description[
                        isEn ? "en" : "zh"
                      ]
                    }}
                  </p>
                  <div class="tap-hint">
                    <i class="fa-solid fa-hand-pointer"></i>
                    <span>{{
                      isEn
                        ? "Click to show links & details"
                        : "點擊以顯示詳情與連結"
                    }}</span>
                  </div>
                </div>
              </template>

              <!-- 4. Hover State: Zone -->
              <template
                v-else-if="hoveredZoneId && hoveredZoneId !== 'entrance'"
              >
                <div class="sidebar-item-preview">
                  <span
                    class="preview-badge"
                    :class="`zone-badge-${hoveredZoneId}`"
                    >{{ cleanLabel(t(`venue.legend.${hoveredZoneId}`)) }}</span
                  >
                  <h3>{{ cleanLabel(t(`venue.legend.${hoveredZoneId}`)) }}</h3>
                  <p class="preview-desc">
                    {{ t(`venue.zones.${hoveredZoneId}`) }}
                  </p>
                  <div
                    class="tap-hint"
                    v-if="
                      ['stage', 'vendors', 'workshop', 'social'].includes(
                        hoveredZoneId,
                      )
                    "
                  >
                    <i class="fa-solid fa-hand-pointer"></i>
                    <span>{{
                      isEn
                        ? "Click to view event timetable"
                        : "點擊以查看活動時程"
                    }}</span>
                  </div>
                </div>
              </template>

              <!-- 5. Default State -->
              <template v-else>
                <div class="sidebar-placeholder">
                  <i class="fa-solid fa-map-location-dot placeholder-icon"></i>
                  <p>{{ t("venue.hint") }}</p>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>
  </PageLayout>
</template>

<style scoped>
/* Page Layout */
.venue-layout {
  width: 100%;
  display: grid;
  grid-template-columns: 3fr 1.6fr;
  gap: 1.5em;
  align-items: stretch;
}

@media (max-width: 950px) {
  .venue-layout {
    grid-template-columns: 1fr;
  }
}

.map-container-card {
  min-width: 0; /* Prevent grid column overflow on smaller desktops/tablets */
  padding: 1.5em;
  border-radius: 1.25em;
  background: linear-gradient(
    180deg,
    rgba(72, 38, 82, 0.75),
    rgba(72, 38, 82, 0.75)
  );
  box-shadow:
    0 1em 2em rgba(0, 0, 0, 0.25),
    inset 0 0 0 1px rgba(127, 100, 50, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.map-wrapper {
  width: 100%;
  max-width: 650px;
  min-width: 0; /* Prevent flexbox item overflow */
  position: relative;
  overflow: hidden;
  user-select: none;
  border-radius: 0.75em; /* Smooth corners for the map viewport */
  border: 1px solid rgba(255, 230, 167, 0.25); /* Gold outline border around the map */
}

/* Sidebar Wrapper & Card Styling (Prevents content-based height expansion on desktop) */
.sidebar-column-wrapper {
  position: relative;
  width: 100%;
}

@media (min-width: 951px) {
  .sidebar-column-wrapper {
    height: 100%;
  }

  .info-sidebar-card {
    position: absolute;
    inset: 0;
  }
}

@media (max-width: 950px) {
  .sidebar-column-wrapper {
    height: auto;
  }
}

.info-sidebar-card {
  display: flex;
  flex-direction: column;
  padding: 1.8em;
  border-radius: 1.25em;
  background: linear-gradient(
    180deg,
    rgba(46, 21, 56, 0.85),
    rgba(29, 13, 36, 0.95)
  );
  box-shadow:
    0 1em 2em rgba(0, 0, 0, 0.25),
    inset 0 0 0 1px rgba(127, 100, 50, 0.15);
  transition: all 0.3s ease;
  overflow: hidden; /* Lock main container; only wrapper inside scrolls */
}

@media (max-width: 950px) {
  .info-sidebar-card {
    position: relative;
    min-height: 380px;
    max-height: 500px;
  }
}

.info-sidebar-card.has-selection {
  border: 1px solid rgba(255, 230, 167, 0.25);
  box-shadow:
    0 1em 2.5em rgba(0, 0, 0, 0.35),
    0 0 15px rgba(255, 230, 167, 0.05);
}

.clear-selection-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.45);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  z-index: 10;
}

.clear-selection-btn:hover {
  color: var(--color-gold);
  background: rgba(255, 255, 255, 0.05);
  transform: scale(1.1);
}

/* SVG styling */
#venue-svg {
  width: 100%;
  height: auto;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
  overflow: hidden;
}

.map-viewport {
  width: 100%;
  height: auto;
  display: block;
  transition: none;
  will-change: transform;
}

.map-viewport.smooth-pan {
  transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1);
}

#venue-svg g {
  /* Disabled transition for active drag/pan gesture to prevent heavy/rubbery feedback on touches */
  transition: none;
}

/* Map Controls */
.map-controls {
  position: absolute;
  bottom: 0.8rem;
  right: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  z-index: 10;
}

.control-btn {
  width: 34px;
  height: 34px;
  border-radius: 6px;
  background: rgba(20, 10, 25, 0.88);
  border: 1px solid rgba(255, 230, 167, 0.18);
  color: var(--color-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.control-btn:hover {
  background: var(--color-nav-bg);
  border-color: var(--color-gold);
  color: #fff;
  box-shadow: 0 0 8px var(--color-gold);
}

/* Floor paths & structural styles */
.wood-floor {
  fill: #221424;
  fill-rule: evenodd;
  stroke: #442a49;
  stroke-width: 1px;
}

.outer-border {
  fill: #0c050d;
  stroke: color-mix(in srgb, var(--color-gold) 35%, transparent);
  stroke-miterlimit: 10;
  stroke-width: 2px;
}

.pillar {
  fill: #1e1322;
  stroke: #48344c;
  stroke-width: 1px;
}

.map-line {
  stroke: #48344c;
  stroke-width: 2px;
  stroke-dasharray: 4 4;
}

/* Zone shapes coloring */
.zone-shape {
  fill-opacity: 0.15;
  stroke-width: 2.2px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.zone-characters {
  pointer-events: none;
  transition: all 0.3s ease;
}

.zone-label-text {
  font-family: NotoSansTC-Regular, "Noto Sans TC", sans-serif;
  font-size: 13.5px;
  font-weight: 700;
  fill: #ffffff;
  opacity: 0.65;
  pointer-events: none;
  transition: all 0.25s ease;
  user-select: none;
  text-anchor: middle;
  dominant-baseline: central;
}

.zone-label-text-static {
  font-family: NotoSansTC-Regular, "Noto Sans TC", sans-serif;
  font-size: 12.5px;
  font-weight: 700;
  fill: #ffffff;
  opacity: 0.55;
  pointer-events: none;
  user-select: none;
  text-anchor: end;
  dominant-baseline: central;
}

.zone-group:hover .zone-label-text,
.zone-group.active .zone-label-text {
  opacity: 1;
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
}

/* Main Stage Color System */
.shape-stage {
  fill: #ba55d3;
  stroke: #ba55d3;
}
.font-stage path {
  fill: #da70d6;
}
.stage-group:hover .shape-stage,
.stage-group.active .shape-stage {
  fill-opacity: 0.38;
  stroke: #ffffff;
  filter: url(#neon-glow);
}
.stage-group:hover .font-stage path,
.stage-group.active .font-stage path {
  fill: #ffffff;
}

/* Vendor Alley Color System */
.shape-vendors {
  fill: #fffb1a;
  stroke: #fffb1a;
}
.font-vendors path {
  fill: #ffe6a7;
}
.vendors-group:hover .shape-vendors,
.vendors-group.active .shape-vendors {
  fill-opacity: 0.28;
  stroke: #ffffff;
  filter: url(#neon-glow);
}
.vendors-group:hover .font-vendors path,
.vendors-group.active .font-vendors path {
  fill: #ffffff;
}

/* Workshop Color System */
.shape-workshop {
  fill: #ffaa82;
  stroke: #ffaa82;
}
.font-workshop path {
  fill: #ffdcd0;
}
.workshop-group:hover .shape-workshop,
.workshop-group.active .shape-workshop {
  fill-opacity: 0.38;
  stroke: #ffffff;
  filter: url(#neon-glow);
}
.workshop-group:hover .font-workshop path,
.workshop-group.active .font-workshop path {
  fill: #ffffff;
}

/* Social Area Color System */
.shape-social {
  fill: #1affec;
  stroke: #1affec;
}
.font-social path {
  fill: #a6fff8;
}
.social-group:hover .shape-social,
.social-group.active .shape-social {
  fill-opacity: 0.38;
  stroke: #ffffff;
  filter: url(#neon-glow);
}
.social-group:hover .font-social path,
.social-group.active .font-social path {
  fill: #ffffff;
}

/* Exhibition Color System */
.shape-exhibition {
  fill: #a3a1a0;
  stroke: #a3a1a0;
}
.exhibition-group:hover .shape-exhibition,
.exhibition-group.active .shape-exhibition {
  fill-opacity: 0.38;
  stroke: #ffffff;
  filter: url(#neon-glow);
}

/* Check-in Color System */
.shape-checkin {
  fill: #ff5e62;
  stroke: #ff5e62;
}
.checkin-group:hover .shape-checkin,
.checkin-group.active .shape-checkin {
  fill-opacity: 0.38;
  stroke: #ffffff;
  filter: url(#neon-glow);
}

/* Bar Zone Color System */
.shape-bar {
  fill: #ffbdde;
  stroke: #ffbdde;
}
.font-bar path {
  fill: #ffbdde;
}
.bar-group:hover .shape-bar,
.bar-group.active .shape-bar {
  fill-opacity: 0.38;
  stroke: #ffffff;
  filter: url(#neon-glow);
}
.bar-group:hover .font-bar path,
.bar-group.active .font-bar path {
  fill: #ffffff;
}

/* Entrance Color System (Static reference only) */
.shape-entrance {
  fill: #ff3366;
  stroke: #ff3366;
  fill-opacity: 0.15;
  stroke-width: 2.2px;
}

/* Booth design inside Vendor Alley */
.booth-group {
  cursor: pointer;
  transition: all 0.25s ease;
}

.booth-rect {
  fill: rgba(255, 230, 167, 0.2);
  stroke: var(--color-gold);
  stroke-width: 1px;
  transition: all 0.25s ease;
  transform-origin: 0px 0px;
}

.booth-label {
  fill: var(--color-gold);
  font-size: 7.5px;
  font-weight: 700;
  font-family: inherit;
  pointer-events: none;
  transition: all 0.25s ease;
  transform-origin: 0px 0px;
}

.booth-group:hover .booth-rect,
.booth-group.active .booth-rect {
  fill: var(--color-gold);
  stroke: #ffffff;
  filter: drop-shadow(0 0 4px var(--color-gold));
  transform: scale(1.18);
}

.booth-group:hover .booth-label,
.booth-group.active .booth-label {
  fill: #120b18;
}

/* Sidebar Styling */
.sidebar-content-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* Internal scrolling within stretched side panel */
  min-height: 0; /* Flexbox safety constraint to enable internal scrollbar */
  padding-right: 0.4rem;
}

.sidebar-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: rgba(255, 255, 255, 0.45);
  gap: 1.2rem;
  margin: auto 0;
  padding: 2rem 0;
}

.placeholder-icon {
  font-size: 3rem;
  color: rgba(255, 230, 167, 0.25);
  animation: float-slow 4s ease-in-out infinite;
}

@keyframes float-slow {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

.sidebar-item-preview,
.sidebar-item-detail {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.6rem;
  animation: fadeIn 0.3s ease-out;
  width: 100%;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.preview-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 99px;
  text-transform: uppercase;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.zone-badge-stage {
  background-color: rgba(186, 85, 211, 0.75);
}
.zone-badge-vendors {
  background-color: rgba(255, 215, 0, 0.75);
  color: #120b18;
}
.zone-badge-workshop {
  background-color: rgba(255, 170, 130, 0.75);
}
.zone-badge-social {
  background-color: rgba(26, 255, 236, 0.75);
  color: #120b18;
}
.zone-badge-exhibition {
  background-color: rgba(163, 161, 160, 0.75);
  color: #120b18;
}
.zone-badge-checkin {
  background-color: rgba(255, 94, 98, 0.75);
  color: #ffffff;
}
.zone-badge-bar {
  background-color: rgba(255, 189, 222, 0.75);
  color: #120b18;
}
.zone-badge-entrance {
  background-color: rgba(255, 51, 102, 0.75);
}
.booth-badge {
  background-color: var(--color-gold);
  color: #120b18;
}

.sidebar-item-preview h3,
.sidebar-item-detail h3 {
  margin: 0.2rem 0;
  font-size: clamp(1.4rem, 2vw, 1.8rem);
  color: #ffffff;
  text-shadow: 0 0 8px rgba(255, 230, 167, 0.35);
  line-height: 1.25;
}

.preview-desc,
.detail-desc {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
}

.sidebar-section-title {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
  color: var(--color-gold);
  border-bottom: 1px solid rgba(255, 230, 167, 0.15);
  width: 100%;
  padding-bottom: 0.25rem;
  margin-top: 0.8rem;
  opacity: 0.85;
}

.tap-hint {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  color: var(--color-gold);
  opacity: 0.75;
  margin-top: 0.6rem;
}

/* Event schedules in sidebar */
.sidebar-events-section,
.sidebar-links-section {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  width: 100%;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-top: 0.2rem;
  width: 100%;
}

.event-item {
  border-left: 3px solid var(--color-gold);
  padding: 0.6rem 0.8rem;
  border-radius: 0 6px 6px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.02);
  border-right: 1px solid rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
}

.event-time {
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
}

.event-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.15rem;
}

.event-desc {
  font-size: 0.85rem;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.7);
}

.no-events-text {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
}

/* Booth links in sidebar */
.links-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.2rem;
}

.booth-social-link {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.8rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;
  border: 1px solid rgba(255, 230, 167, 0.1);
}

.booth-social-link:hover {
  background: var(--color-gold);
  color: #120b18;
  border-color: var(--color-gold);
  transform: translateY(-1px);
}

.booth-cta-section {
  margin-top: 1rem;
  margin-bottom: 1.25rem;
}

.view-detail-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  background: var(--color-gold);
  color: #120b18;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.85rem;
  transition: all 0.25s ease;
  border: 1px solid var(--color-gold);
}

.view-detail-btn:hover {
  background: transparent;
  color: var(--color-gold);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 230, 167, 0.2);
}
</style>
