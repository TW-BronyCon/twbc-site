<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { columns as rawColumns, events as rawEvents, startHour, endHour, slotMinutes } from '~/data/scheduleData'

const { t, locale } = useI18n()

useHead(() => ({
  title: t('schedule.title'),
}))

const gridContainer = ref<HTMLElement | null>(null)
const activeModalIndex = ref<number | null>(null)
const focusedIndex = ref<number>(-1)

const columns = computed(() => {
  const isEn = locale.value.startsWith('en')
  return rawColumns.map(col => ({
    key: col.key,
    label: col.label ? (isEn ? col.label.en : col.label.zh) : '',
    min: col.min,
    grow: col.grow,
    color: col.color,
  }))
})

function formatHourLabel(hour: number) {
  const h = Math.floor(hour)
  const m = Math.round((hour - h) * 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

const timeLabels = computed(() => {
  const labels = []
  const rightTimeColumn = rawColumns.length

  for (let h = startHour; h < endHour; h++) {
    const hourMinutes = h * 60
    const startMinutes = startHour * 60
    const hourRow = 2 + Math.round((hourMinutes - startMinutes) / slotMinutes)

    labels.push({
      key: `hour-${h}`,
      text: formatHourLabel(h),
      col: 1,
      row: hourRow,
      isHalf: false,
    })

    const halfHour = h + 0.5
    if (halfHour < endHour) {
      const halfMinutes = halfHour * 60
      const halfRow = 2 + Math.round((halfMinutes - startMinutes) / slotMinutes)

      labels.push({
        key: `half-${h}`,
        text: formatHourLabel(halfHour),
        col: rightTimeColumn,
        row: halfRow,
        isHalf: true,
      })
    }
  }
  return labels
})

function timeToMinutes(time: string) {
  const [h = 0, m = 0] = String(time).split(':').map(Number)
  return h * 60 + m
}

function timeToSlotIndex(time: string) {
  const startMinutes = startHour * 60
  return Math.round((timeToMinutes(time) - startMinutes) / slotMinutes)
}

function timeToGridRowStart(time: string) {
  return 2 + timeToSlotIndex(time)
}

function timeSpanSlots(start: string, end: string) {
  return Math.max(1, timeToSlotIndex(end) - timeToSlotIndex(start))
}

function getColumnIndex(trackKey: string) {
  const index = rawColumns.findIndex(col => col.key === trackKey)
  return index >= 0 ? index + 1 : 2
}

function normalizeHexColor(color?: string) {
  if (!color || typeof color !== 'string') return '#235cc9'

  let hex = color.trim()
  if (!hex.startsWith('#')) hex = `#${hex}`

  if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
    hex = `#${hex
      .slice(1)
      .split('')
      .map(char => char + char)
      .join('')}`
  }

  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return '#235cc9'

  return hex
}

const processedEvents = computed(() => {
  const isEn = locale.value.startsWith('en')
  return rawEvents.map((event, index) => {
    const columnIndex = getColumnIndex(event.track)
    const startRow = timeToGridRowStart(event.start)
    const rowSpan = timeSpanSlots(event.start, event.end)
    const isCompact = rowSpan <= 5

    const eventColor = normalizeHexColor(event.color)
    const textColor = event.textColor || '#222'
    const titleText = isEn ? event.title.en : event.title.zh
    const detailText = event.detail ? (isEn ? event.detail.en : event.detail.zh) : ''
    const formattedTitle = titleText.replace(/\n/g, '<br>')

    const duration = ((timeToMinutes(event.end) - timeToMinutes(event.start)) / 60)
      .toFixed(1)
      .replace('.0', '')

    const matchingCol = rawColumns.find(col => col.key === event.track)
    const areaLabel = matchingCol?.label ? (isEn ? matchingCol.label.en : matchingCol.label.zh) : (matchingCol?.key || '')

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
      duration,
      area: areaLabel,
    }
  })
})

const gridStyles = computed(() => {
  const slotsPerHour = 60 / slotMinutes
  const totalHours = endHour - startHour
  const totalSlots = Math.round(totalHours * slotsPerHour)

  const gridColumns = rawColumns
    .map(col => {
      const min = col.min || '8em'
      if (col.key === 'time-left' || col.key === 'time-right') {
        return min
      }
      return `minmax(${min}, ${col.grow || 1}fr)`
    })
    .join(' ')

  const contentStart = 2
  const contentEnd = rawColumns.length

  return {
    '--columns': gridColumns,
    '--rows': `4em repeat(${totalSlots}, var(--slot-h))`,
    '--content-start': String(contentStart),
    '--content-end': String(contentEnd),
  }
})

const activeModalEvent = computed(() => {
  if (activeModalIndex.value === null) return null
  return processedEvents.value[activeModalIndex.value] || null
})

function getEventElement(index: number) {
  return gridContainer.value?.querySelector<HTMLElement>(`[data-index="${index}"]`)
}

function scrollToFocusedEvent() {
  if (focusedIndex.value < 0) return
  const el = getEventElement(focusedIndex.value)
  if (!el) return
  el.scrollIntoView({
    block: 'nearest',
    inline: 'nearest',
    behavior: 'smooth',
  })
}

function moveFocus(direction: 'up' | 'down' | 'left' | 'right') {
  const selectable = processedEvents.value.filter(e => e.PointerEvent !== false)
  if (!selectable.length) return

  if (focusedIndex.value < 0) {
    focusedIndex.value = selectable[0].index
    scrollToFocusedEvent()
    return
  }

  const currentEl = getEventElement(focusedIndex.value)
  if (!currentEl) return

  const currentRect = currentEl.getBoundingClientRect()
  let bestIndex = focusedIndex.value
  let bestScore = Infinity

  selectable.forEach(event => {
    if (event.index === focusedIndex.value) return

    const el = getEventElement(event.index)
    if (!el) return

    const rect = el.getBoundingClientRect()
    const dx = rect.left - currentRect.left
    const dy = rect.top - currentRect.top

    const overlapY =
      Math.min(currentRect.bottom, rect.bottom) -
      Math.max(currentRect.top, rect.top)

    const overlapX =
      Math.min(currentRect.right, rect.right) -
      Math.max(currentRect.left, rect.left)

    let valid = false
    let score = Infinity

    switch (direction) {
      case 'right':
        valid = dx > 5 && overlapY > 10
        score = Math.abs(dx) - overlapY * 5
        break

      case 'left':
        valid = dx < -5 && overlapY > 10
        score = Math.abs(dx) - overlapY * 5
        break

      case 'down':
        valid = dy > 5 && overlapX > 10
        score = Math.abs(dy) - overlapX * 2
        break

      case 'up':
        valid = dy < -5 && overlapX > 10
        score = Math.abs(dy) - overlapX * 2
        break
    }

    if (valid && score < bestScore) {
      bestScore = score
      bestIndex = event.index
    }
  })

  if (bestIndex !== focusedIndex.value) {
    focusedIndex.value = bestIndex
    scrollToFocusedEvent()
  }
}

function getCurrentSelectableIndex() {
  if (focusedIndex.value >= 0) {
    return focusedIndex.value
  }
  const selectable = processedEvents.value.filter(e => e.PointerEvent !== false)
  if (!selectable.length) return -1
  
  focusedIndex.value = selectable[0].index
  scrollToFocusedEvent()
  return focusedIndex.value
}

function openEvent(index: number) {
  focusedIndex.value = index
  activeModalIndex.value = index
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  activeModalIndex.value = null
  document.body.style.overflow = ''
}

function clearFocus() {
  focusedIndex.value = -1
}

function toggleEvent(index: number, clearFocusWhenClose = true) {
  const isModalOpen = activeModalIndex.value !== null

  if (isModalOpen && activeModalIndex.value === index) {
    closeModal()
    if (clearFocusWhenClose) {
      clearFocus()
    }
    return
  }

  openEvent(index)
}

function handleKeyDown(e: KeyboardEvent) {
  const isModalOpen = activeModalIndex.value !== null

  switch (e.key.toLowerCase()) {
    case 'w':
    case 'arrowup':
      if (isModalOpen) return
      e.preventDefault()
      moveFocus('up')
      break

    case 's':
    case 'arrowdown':
      if (isModalOpen) return
      e.preventDefault()
      moveFocus('down')
      break

    case 'a':
    case 'arrowleft':
      if (isModalOpen) return
      e.preventDefault()
      moveFocus('left')
      break

    case 'd':
    case 'arrowright':
      if (isModalOpen) return
      e.preventDefault()
      moveFocus('right')
      break

    case ' ': {
      e.preventDefault()
      const targetIndex = getCurrentSelectableIndex()
      if (targetIndex < 0) return
      toggleEvent(targetIndex, false)
      break
    }

    case 'enter': {
      e.preventDefault()
      const targetIndex = getCurrentSelectableIndex()
      if (targetIndex < 0) return
      openEvent(targetIndex)
      break
    }

    case 'escape':
      e.preventDefault()
      closeModal()
      clearFocus()
      break
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="legacy-page-root">
    <div class="legacy-page-body">
      <section class="expo-tt">
        <div class="expo-tt-header">
          <h2>{{ t('schedule.title') }}</h2>
          <p>{{ t('schedule.hint') }}</p>
          <p class="touch-only">
            {{ t('schedule.mobilehint') }}
          </p>
          <p>{{ t('schedule.note') }}</p>
        </div>

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
                color: col.color || '#3f71e6'
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
                  gridRow: timeLabel.row
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
                { 'keyboard-focus': focusedIndex === event.index }
              ]"
              :style="{
                gridColumn: event.columnIndex,
                gridRow: `${event.startRow} / span ${event.rowSpan}`,
                background: event.backgroundColor,
                color: event.textColor,
                pointerEvents: event.PointerEvent === false ? 'none' : 'auto'
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
      </section>

      <!-- Modal -->
      <div
        class="expo-tt-modal"
        :class="{ show: activeModalEvent !== null }"
        :aria-hidden="activeModalEvent === null"
      >
        <div
          class="expo-tt-modal-bg"
          @click="closeModal"
        />

        <div v-if="activeModalEvent !== null" class="expo-tt-modal-box">
          <button
            class="expo-tt-modal-close"
            type="button"
            :aria-label="t('common.close')"
            @click="closeModal"
          >
            ×
          </button>

          <div>
            <h3 v-html="activeModalEvent.formattedTitle"></h3>

            <div class="expo-tt-modal-meta">
              <span>
                🕒 {{ activeModalEvent.start }} - {{ activeModalEvent.end }}
                ▶ {{ t('schedule.duration') }}: {{ activeModalEvent.duration }}h
              </span>

              <span>📍 {{ t('schedule.area') }}: {{ activeModalEvent.area }}</span>
            </div>

            <p>{{ activeModalEvent.detailText || t('schedule.detailPlaceholder') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="~/assets/css/font.css"></style>
<style src="~/assets/css/schedule.css"></style>

<style>
.legacy-page-root {
  position: relative;
  min-height: auto;
  padding-top: clamp(4.5rem, 7vw, 6.5rem);
  padding-bottom: 4rem;
}

.legacy-page-body {
  position: relative;
  z-index: 1;
}
</style>