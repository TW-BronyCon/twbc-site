<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { handleModalTab } from "~/utils/focus";
import {
  columns as rawColumns,
  events as rawEvents,
  startHour,
  endHour,
  slotMinutes,
  EVENT_COLORS,
} from "~/data/scheduleData";

const { t, locale } = useI18n();

definePageMeta({
  underDevelopment: false,
});

useHead(() => ({
  title: t("schedule.title"),
  meta: [
    {
      name: "description",
      content: t("schedule.description"),
    },
  ],
}));

const gridContainer = ref<HTMLElement | null>(null);
const activeModalIndex = ref<number | null>(null);

watch(activeModalIndex, (newVal) => {
  if (import.meta.client) {
    const root = document.getElementById("__nuxt");
    if (root) {
      if (newVal !== null) {
        root.setAttribute("inert", "");
      } else {
        root.removeAttribute("inert");
      }
    }
  }
});
const focusedIndex = ref<number>(-1);

const columns = computed(() => {
  const isEn = locale.value.startsWith("en");
  return rawColumns.map((col) => ({
    key: col.key,
    label: col.label ? (isEn ? col.label.en : col.label.zh) : "",
    min: col.min,
    grow: col.grow,
    color: col.color,
  }));
});

function formatHourLabel(hour: number) {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

const timeLabels = computed(() => {
  const labels = [];
  const rightTimeColumn = rawColumns.length;

  for (let h = startHour; h < endHour; h++) {
    const hourMinutes = h * 60;
    const startMinutes = startHour * 60;
    const hourRow = 2 + Math.round((hourMinutes - startMinutes) / slotMinutes);

    labels.push({
      key: `hour-${h}`,
      text: formatHourLabel(h),
      col: 1,
      row: hourRow,
      isHalf: false,
    });

    const halfHour = h + 0.5;
    if (halfHour < endHour) {
      const halfMinutes = halfHour * 60;
      const halfRow =
        2 + Math.round((halfMinutes - startMinutes) / slotMinutes);

      labels.push({
        key: `half-${h}`,
        text: formatHourLabel(halfHour),
        col: rightTimeColumn,
        row: halfRow,
        isHalf: true,
      });
    }
  }
  return labels;
});

function timeToMinutes(time: string) {
  const [h = 0, m = 0] = String(time).split(":").map(Number);
  return h * 60 + m;
}

function timeToSlotIndex(time: string) {
  const startMinutes = startHour * 60;
  return Math.round((timeToMinutes(time) - startMinutes) / slotMinutes);
}

function timeToGridRowStart(time: string) {
  return 2 + timeToSlotIndex(time);
}

function timeSpanSlots(start: string, end: string) {
  return Math.max(1, timeToSlotIndex(end) - timeToSlotIndex(start));
}

function getColumnIndex(trackKey: string) {
  const index = rawColumns.findIndex((col) => col.key === trackKey);
  return index >= 0 ? index + 1 : 2;
}

function getDynamicFontSize(rowSpan: number) {
  if (rowSpan <= 2) return "0.72rem";
  if (rowSpan <= 4) return "0.84rem";
  if (rowSpan <= 6) return "0.94rem";
  return "inherit";
}

const processedEvents = computed(() => {
  const isEn = locale.value.startsWith("en");
  return rawEvents.map((event, index) => {
    const columnIndex = getColumnIndex(event.track);
    const startRow = timeToGridRowStart(event.start);
    const rowSpan = timeSpanSlots(event.start, event.end);
    const isCompact = rowSpan <= 5;

    const rawColor = EVENT_COLORS[event.type];
    const eventColor = normalizeHexColor(rawColor);
    const textColor = getContrastColor(eventColor);
    const fontSize = getDynamicFontSize(rowSpan);
    const titleText = isEn ? event.title.en : event.title.zh;
    const detailText = event.detail
      ? isEn
        ? event.detail.en
        : event.detail.zh
      : "";
    const formattedTitle = titleText.replace(/\n/g, "<br>");

    const duration = (
      (timeToMinutes(event.end) - timeToMinutes(event.start)) /
      60
    )
      .toFixed(1)
      .replace(".0", "");

    const matchingCol = rawColumns.find((col) => col.key === event.track);
    const areaLabel = matchingCol?.label
      ? isEn
        ? matchingCol.label.en
        : matchingCol.label.zh
      : matchingCol?.key || "";

    return {
      ...event,
      index,
      titleText,
      detailText,
      formattedTitle,
      columnIndex,
      startRow,
      rowSpan,
      isCompact,
      backgroundColor: eventColor,
      textColor,
      fontSize,
      duration,
      area: areaLabel,
    };
  });
});

const gridStyles = computed(() => {
  const slotsPerHour = 60 / slotMinutes;
  const totalHours = endHour - startHour;
  const totalSlots = Math.round(totalHours * slotsPerHour);

  const gridColumns = rawColumns
    .map((col) => {
      const min = col.min || "8em";
      if (col.key === "time-left" || col.key === "time-right") {
        return min;
      }
      return `minmax(${min}, ${col.grow || 1}fr)`;
    })
    .join(" ");

  const contentStart = 2;
  const contentEnd = rawColumns.length;

  return {
    "--columns": gridColumns,
    "--rows": `4em repeat(${totalSlots}, var(--slot-h))`,
    "--content-start": String(contentStart),
    "--content-end": String(contentEnd),
  };
});

const activeModalEvent = computed(() => {
  if (activeModalIndex.value === null) return null;
  return processedEvents.value[activeModalIndex.value] || null;
});

function getEventElement(index: number) {
  return gridContainer.value?.querySelector<HTMLElement>(
    `[data-index="${index}"]`,
  );
}

function scrollToFocusedEvent() {
  if (focusedIndex.value < 0) return;
  const el = getEventElement(focusedIndex.value);
  if (!el) return;
  el.scrollIntoView({
    block: "nearest",
    inline: "nearest",
    behavior: "smooth",
  });
}

function moveFocus(direction: "up" | "down" | "left" | "right") {
  const selectable = processedEvents.value.filter(
    (e) => e.PointerEvent !== false,
  );
  if (!selectable.length) return;

  if (focusedIndex.value < 0) {
    focusedIndex.value = selectable[0]!.index;
    scrollToFocusedEvent();
    return;
  }

  const currentEl = getEventElement(focusedIndex.value);
  if (!currentEl) return;

  const currentRect = currentEl.getBoundingClientRect();
  let bestIndex = focusedIndex.value;
  let bestScore = Infinity;

  selectable.forEach((event) => {
    if (event.index === focusedIndex.value) return;

    const el = getEventElement(event.index);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const dx = rect.left - currentRect.left;
    const dy = rect.top - currentRect.top;

    const overlapY =
      Math.min(currentRect.bottom, rect.bottom) -
      Math.max(currentRect.top, rect.top);

    const overlapX =
      Math.min(currentRect.right, rect.right) -
      Math.max(currentRect.left, rect.left);

    let valid = false;
    let score = Infinity;

    switch (direction) {
      case "right":
        valid = dx > 5 && overlapY > 10;
        score = Math.abs(dx) - overlapY * 5;
        break;

      case "left":
        valid = dx < -5 && overlapY > 10;
        score = Math.abs(dx) - overlapY * 5;
        break;

      case "down":
        valid = dy > 5 && overlapX > 10;
        score = Math.abs(dy) - overlapX * 2;
        break;

      case "up":
        valid = dy < -5 && overlapX > 10;
        score = Math.abs(dy) - overlapX * 2;
        break;
    }

    if (valid && score < bestScore) {
      bestScore = score;
      bestIndex = event.index;
    }
  });

  if (bestIndex !== focusedIndex.value) {
    focusedIndex.value = bestIndex;
    scrollToFocusedEvent();
  }
}

function getCurrentSelectableIndex() {
  if (focusedIndex.value >= 0) {
    return focusedIndex.value;
  }
  const selectable = processedEvents.value.filter(
    (e) => e.PointerEvent !== false,
  );
  if (!selectable.length) return -1;

  focusedIndex.value = selectable[0]!.index;
  scrollToFocusedEvent();
  return focusedIndex.value;
}

const triggerElement = ref<HTMLElement | null>(null);

function openEvent(index: number) {
  if (import.meta.client) {
    triggerElement.value = document.activeElement as HTMLElement | null;
  }
  focusedIndex.value = index;
  activeModalIndex.value = index;
  document.body.style.overflow = "hidden";

  nextTick(() => {
    const closeBtn = document.querySelector(
      ".expo-tt-modal-close",
    ) as HTMLElement | null;
    if (closeBtn) closeBtn.focus();
  });
}

function closeModal() {
  activeModalIndex.value = null;
  document.body.style.overflow = "";

  nextTick(() => {
    if (triggerElement.value) {
      triggerElement.value.focus();
      triggerElement.value = null;
    }
  });
}

function clearFocus() {
  focusedIndex.value = -1;
}

function toggleEvent(index: number, clearFocusWhenClose = true) {
  const isModalOpen = activeModalIndex.value !== null;

  if (isModalOpen && activeModalIndex.value === index) {
    closeModal();
    if (clearFocusWhenClose) {
      clearFocus();
    }
    return;
  }

  openEvent(index);
}

function handleKeyDown(e: KeyboardEvent) {
  const target = e.target as HTMLElement | null;
  if (!target) return;

  // Skip if typing in an input, textarea, select, or contenteditable element
  if (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT" ||
    target.isContentEditable
  ) {
    return;
  }

  const isModalOpen = activeModalIndex.value !== null;

  // Modal interactions override general navigation
  if (isModalOpen) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeModal();
      clearFocus();
      return;
    }
    if (e.key === "Tab") {
      const modalEl = document.querySelector(
        ".expo-tt-modal",
      ) as HTMLElement | null;
      if (modalEl) {
        handleModalTab(e, modalEl);
      }
      return;
    }
  }

  // Scope WASD/Arrow/Space/Enter navigation specifically to the timetable grid
  const isFocusInGrid = gridContainer.value?.contains(target) || false;
  if (!isFocusInGrid) {
    return;
  }

  switch (e.key.toLowerCase()) {
    case "w":
    case "arrowup":
      if (isModalOpen) return;
      e.preventDefault();
      moveFocus("up");
      break;

    case "s":
    case "arrowdown":
      if (isModalOpen) return;
      e.preventDefault();
      moveFocus("down");
      break;

    case "a":
    case "arrowleft":
      if (isModalOpen) return;
      e.preventDefault();
      moveFocus("left");
      break;

    case "d":
    case "arrowright":
      if (isModalOpen) return;
      e.preventDefault();
      moveFocus("right");
      break;

    case " ": {
      e.preventDefault();
      const targetIndex = getCurrentSelectableIndex();
      if (targetIndex < 0) return;
      toggleEvent(targetIndex, false);
      break;
    }

    case "enter": {
      e.preventDefault();
      const targetIndex = getCurrentSelectableIndex();
      if (targetIndex < 0) return;
      openEvent(targetIndex);
      break;
    }
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
  document.body.style.overflow = "";
});

// Deselect active activity when leaving the page
onBeforeRouteLeave(() => {
  activeModalIndex.value = null;
  focusedIndex.value = -1;
  document.body.style.overflow = "";
});
</script>

<template>
  <PageLayout>
    <template #title>
      <h2>{{ t("schedule.title") }}</h2>
      <p>{{ t("schedule.hint") }}</p>
      <p class="touch-only">
        {{ t("schedule.mobilehint") }}
      </p>
      <p>{{ t("schedule.note") }}</p>
    </template>

    <template #surface>
      <div class="expo-tt-shell">
        <div ref="gridContainer" class="expo-tt-grid" :style="gridStyles">
          <!-- Render column titles -->
          <div
            v-for="(col, index) in columns"
            :key="col.key"
            v-show="col.label"
            class="expo-col-title"
            :style="{
              gridColumn: index + 1,
              gridRow: 1,
              color: col.color || '#3f71e6',
            }"
          >
            {{ col.label }}
          </div>

          <!-- Background slot -->
          <div class="expo-slot-bg" />

          <!-- Time labels -->
          <template v-for="timeLabel in timeLabels" :key="timeLabel.key">
            <div
              class="expo-time"
              :class="{ 'expo-time-half': timeLabel.isHalf }"
              :style="{
                gridColumn: timeLabel.col,
                gridRow: timeLabel.row,
              }"
            >
              {{ timeLabel.text }}
            </div>
          </template>

          <!-- Events -->
          <button
            v-for="event in processedEvents"
            :key="event.index"
            type="button"
            :class="[
              'expo-event',
              event.vertical ? 'vertical' : '',
              event.isCompact ? 'compact' : '',
              { 'keyboard-focus': focusedIndex === event.index },
            ]"
            :style="{
              gridColumn: event.columnIndex,
              gridRow: `${event.startRow} / span ${event.rowSpan}`,
              background: event.backgroundColor,
              color: event.textColor,
              fontSize: event.fontSize,
              pointerEvents: event.PointerEvent === false ? 'none' : 'auto',
            }"
            :data-index="event.index"
            @click="toggleEvent(event.index)"
          >
            <span class="title" v-html="event.formattedTitle"></span>
            <span v-if="!event.vertical && !event.isCompact" class="sub">
              {{ event.start }} - {{ event.end }}
            </span>
          </button>
        </div>
      </div>
    </template>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="schedule-modal">
        <div
          v-if="activeModalEvent !== null"
          class="expo-tt-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="schedule-modal-title"
          @click.self="closeModal"
        >
          <div class="expo-tt-modal-box">
            <button
              class="expo-tt-modal-close"
              type="button"
              :aria-label="t('common.close')"
              @click="closeModal"
            >
              ×
            </button>

            <div>
              <h3
                id="schedule-modal-title"
                v-html="activeModalEvent.formattedTitle"
              ></h3>

              <div class="expo-tt-modal-meta">
                <span>
                  🕒 {{ activeModalEvent.start }} - {{ activeModalEvent.end }} ▶
                  {{ t("schedule.duration") }}: {{ activeModalEvent.duration }}h
                </span>

                <span
                  >📍 {{ t("schedule.area") }}:
                  {{ activeModalEvent.area }}</span
                >
              </div>

              <p>
                {{
                  activeModalEvent.detailText || t("schedule.detailPlaceholder")
                }}
              </p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </PageLayout>
</template>

<style scoped>
/* Scoped styles for Schedule Page */
.expo-tt-shell {
  width: 100%;
  margin: 0 auto;
  overflow: visible;
  padding-bottom: 0.6em;
  display: flex;
  justify-content: center;
  transition: all 0.2s ease-out;
}

.expo-tt-grid {
  --columns: 5em 10em 7em 6.5em 7.5em 5em;
  --rows: 4em repeat(168, var(--slot-h));
  --content-start: 2;
  --content-end: 6;

  --hour-h: 7em;
  --slot-h: calc(var(--hour-h) / 12);

  position: relative;
  width: 100%;
  min-width: 0;
  display: grid;
  grid-template-columns: var(--columns);
  grid-template-rows: var(--rows);
  column-gap: 0.45em;
  padding: 0.8em 0;
  align-items: stretch;
}

.expo-col-title {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.2em;
  font-size: clamp(1rem, 1.75vw, 1.5rem);
  font-weight: 700;
  z-index: 2;
}

.expo-slot-bg {
  grid-column: var(--content-start) / var(--content-end);
  grid-row: 2 / -1;
  margin: 0 -0.75em;
  position: relative;
  overflow: hidden;
  border-radius: 1.1em;
  border: 1px solid rgba(255, 255, 255, 0.01);
  background:
    repeating-linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.1) 0,
      rgba(255, 255, 255, 0.05) 1px,
      transparent 1px,
      transparent calc(var(--hour-h) / 2)
    ),
    rgba(20, 25, 35, 0.72);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}

.expo-time {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  transform: translateY(-0.5em);
  font-weight: 700;
  font-size: clamp(1rem, 1.75vw, 1.25rem);
  color: var(--page-title-color);
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.45);
  z-index: 2;
}

.expo-event {
  position: relative;
  z-index: 3;
  width: auto;
  height: auto;
  margin: 0.225em 0 0em 0;
  align-self: stretch;
  justify-self: stretch;
  border: none;
  border-radius: 0.6em;
  padding: 0.22em 0.38em;
  cursor: pointer;
  text-align: center;
  font: inherit;
  line-height: 1.18;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.22);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
  overflow: hidden;
}

.expo-event:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.28);
}

.expo-event .title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
  font-weight: 600;
  margin-top: calc(0.1rem - 0.05vw);
  font-size: clamp(1rem, 1.25vw, 1.2rem);
  white-space: normal;
  word-break: break-word;
}

.expo-event .sub {
  display: block;
  margin-top: clamp(0rem, 1.5vw, 0.2rem);
  font-size: clamp(0.88rem, 1.25vw, 1.15rem);
  opacity: 0.9;
}

.expo-tt-modal {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.expo-tt-modal-box {
  width: min(75vw, 60em);
  max-height: 85vh;
  overflow: auto;
  border-radius: 1.2em;
  background: var(--color-paper-bg);
  color: var(--color-paper-text-muted);
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.24);
  padding: clamp(1.2rem, 2vw, 2rem) clamp(1rem, 2vw, 2.5rem)
    clamp(1rem, 2vw, 2rem);
  position: relative;
}

.expo-tt-modal-close {
  position: absolute;
  top: 0.25em;
  right: 0.45em;
  border: none;
  background: transparent;
  font-size: clamp(2rem, 2vw, 3.5rem);
  cursor: pointer;
  color: var(--color-paper-text-muted);
}

.expo-tt-modal-close:hover {
  color: #ff1e1ebb;
  transition: color 0.25s;
}

.expo-tt-modal-box h3 {
  margin: 0 0 0.5em;
  color: var(--color-paper-text-dark);
  line-height: 1.4;
  font-size: clamp(1.2rem, 1.5vw, 3rem);
}

.expo-tt-modal-box p {
  margin: 0.5em 0 0;
  line-height: 1.85;
  font-size: clamp(1rem, 1.4vw, 1.4rem);
}

.expo-tt-modal-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em 1em;
  margin-bottom: 0.7em;
  opacity: 0.9;
  font-size: clamp(1rem, 1.5vw, 1.4rem);
}

@media (max-width: 850px) {
  .expo-tt-shell {
    width: 100%;
    overflow-x: auto;
    overflow-y: visible;
    justify-content: flex-start;
  }
  .expo-event .title {
    font-weight: 800;
    transition: all 0.2s ease-out;
  }
}

.expo-event.keyboard-focus {
  outline: 0.25em solid #ffddbe;
  outline-offset: -0.08em;
  z-index: 50;
  transform: scale(1.035);
}

@media (pointer: coarse) {
  .expo-event.keyboard-focus {
    outline: none;
    box-shadow: none;
    transform: none;
  }
}

.touch-only {
  display: none;
}

@media (hover: none) and (pointer: coarse) {
  .touch-only {
    display: block;
  }
}
</style>

<style>
/* Unscoped — modal is teleported to body */

/* Schedule Modal Entry/Exit Animations */
.schedule-modal-enter-active,
.schedule-modal-leave-active {
  transition: opacity 0.25s ease;
}

.schedule-modal-enter-active .expo-tt-modal-box,
.schedule-modal-leave-active .expo-tt-modal-box {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.schedule-modal-enter-from,
.schedule-modal-leave-to {
  opacity: 0;
}

.schedule-modal-enter-from .expo-tt-modal-box {
  transform: scale(0.9) translateY(20px);
}

.schedule-modal-leave-to .expo-tt-modal-box {
  transform: scale(0.95) translateY(10px);
}
</style>
