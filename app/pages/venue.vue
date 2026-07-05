<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { booths, type Booth } from '~/data/boothData'
import { events } from '~/data/scheduleData'

const { t, locale } = useI18n()

definePageMeta({
  underDevelopment: true
})

useHead(() => ({
  title: t('venue.title'),
}))

// Selection states
const selectedZoneId = ref<string | null>(null)
const selectedBooth = ref<Booth | null>(null)
const hoveredZoneId = ref<string | null>(null)
const hoveredBoothId = ref<string | null>(null)

// Computed active states
const activeModalType = ref<'zone' | 'booth' | null>(null)

// Helper for locale checking
const isEn = computed(() => locale.value.startsWith('en'))

// Event mapping for zones
const zoneEvents = computed(() => {
  if (!selectedZoneId.value) return []
  const trackMap: Record<string, string> = {
    stage: 'main',
    vendors: 'vendor',
    workshop: 'workshop',
    game: 'game'
  }
  const track = trackMap[selectedZoneId.value]
  if (!track) return []
  return events
    .filter(e => e.track === track)
    .map(e => ({
      title: isEn.value ? e.title.en : e.title.zh,
      start: e.start,
      end: e.end,
      detail: e.detail ? (isEn.value ? e.detail.en : e.detail.zh) : ''
    }))
})

// Zoom and Pan States
const zoom = ref(1)
const panX = ref(0)
const panY = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const dragDistance = ref(0)

const cursorStyle = computed(() => {
  if (zoom.value <= 1) return 'default'
  return isDragging.value ? 'grabbing' : 'grab'
})

const clampPan = () => {
  const svg = document.getElementById('venue-svg')
  if (!svg) return
  const rect = svg.getBoundingClientRect()
  const W = rect.width
  const H = rect.height
  
  if (zoom.value <= 1) {
    panX.value = 0
    panY.value = 0
    return
  }
  
  const minX = W * (1 - zoom.value)
  const maxX = 0
  const minY = H * (1 - zoom.value)
  const maxY = 0
  
  panX.value = Math.max(minX, Math.min(maxX, panX.value))
  panY.value = Math.max(minY, Math.min(maxY, panY.value))
}

const startPan = (e: MouseEvent) => {
  isDragging.value = true
  startX.value = e.clientX - panX.value
  startY.value = e.clientY - panY.value
  dragDistance.value = 0
}

const onPan = (e: MouseEvent) => {
  if (!isDragging.value) return
  const dx = e.clientX - (startX.value + panX.value)
  const dy = e.clientY - (startY.value + panY.value)
  dragDistance.value += Math.sqrt(dx*dx + dy*dy)
  
  panX.value = e.clientX - startX.value
  panY.value = e.clientY - startY.value
  clampPan()
}

const endPan = () => {
  isDragging.value = false
}

const handleWheel = (e: WheelEvent) => {
  e.preventDefault()
  const zoomFactor = 1.15
  const nextZoom = e.deltaY < 0 ? zoom.value * zoomFactor : zoom.value / zoomFactor
  adjustZoom(nextZoom, e.clientX, e.clientY, true)
}

const startTouchPan = (e: TouchEvent) => {
  if (e.touches.length === 1) {
    isDragging.value = true
    startX.value = e.touches[0].clientX - panX.value
    startY.value = e.touches[0].clientY - panY.value
    dragDistance.value = 0
  }
}

const onTouchPan = (e: TouchEvent) => {
  if (!isDragging.value || e.touches.length !== 1) return
  const dx = e.touches[0].clientX - (startX.value + panX.value)
  const dy = e.touches[0].clientY - (startY.value + panY.value)
  dragDistance.value += Math.sqrt(dx*dx + dy*dy)
  
  panX.value = e.touches[0].clientX - startX.value
  panY.value = e.touches[0].clientY - startY.value
  clampPan()
}

const endTouchPan = () => {
  isDragging.value = false
}

// Adjust Zoom centered at a screen point
const adjustZoom = (targetZoom: number, screenX: number, screenY: number, useClientCoord = false) => {
  const clampedZoom = Math.max(1, Math.min(4, targetZoom))
  if (clampedZoom === zoom.value) return
  
  const svg = document.getElementById('venue-svg')
  if (svg) {
    const rect = svg.getBoundingClientRect()
    const targetX = useClientCoord ? (screenX - rect.left) : screenX
    const targetY = useClientCoord ? (screenY - rect.top) : screenY
    
    const ptX = (targetX - panX.value) / zoom.value
    const ptY = (targetY - panY.value) / zoom.value
    
    zoom.value = clampedZoom
    panX.value = targetX - ptX * clampedZoom
    panY.value = targetY - ptY * clampedZoom
    clampPan()
  } else {
    zoom.value = clampedZoom
  }
}

const zoomIn = () => {
  const svg = document.getElementById('venue-svg')
  if (svg) {
    const rect = svg.getBoundingClientRect()
    adjustZoom(zoom.value * 1.3, rect.width / 2, rect.height / 2)
  } else {
    zoom.value = Math.min(4, zoom.value * 1.3)
  }
}

const zoomOut = () => {
  const svg = document.getElementById('venue-svg')
  if (svg) {
    const rect = svg.getBoundingClientRect()
    adjustZoom(zoom.value / 1.3, rect.width / 2, rect.height / 2)
  } else {
    zoom.value = Math.max(1, zoom.value / 1.3)
  }
}

const resetZoom = () => {
  zoom.value = 1
  panX.value = 0
  panY.value = 0
}

// Handlers
const openZone = (zoneId: string) => {
  if (dragDistance.value > 6) return // Skip click if panned
  selectedZoneId.value = zoneId
  selectedBooth.value = null
  activeModalType.value = 'zone'
  document.body.style.overflow = 'hidden'
}

const openBooth = (booth: Booth) => {
  if (dragDistance.value > 6) return // Skip click if panned
  selectedBooth.value = booth
  selectedZoneId.value = null
  activeModalType.value = 'booth'
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  activeModalType.value = null
  selectedZoneId.value = null
  selectedBooth.value = null
  document.body.style.overflow = ''
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeModal()
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
  <div class="venue-page-root">
    <div class="venue-page-body">
      <!-- Title Section -->
      <section class="venue-hero">
        <div class="venue-hero-header">
          <h2>{{ t('venue.title') }}</h2>
          <p>{{ t('venue.hint') }}</p>
        </div>
      </section>

      <!-- Main Layout Section -->
      <section class="venue-main-section">
        <!-- SVG Map Container -->
        <div class="map-container-card">
          <div class="map-wrapper">
            <svg id="venue-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 598.22 598.22" :style="{ cursor: cursorStyle }" @mousedown="startPan" @mousemove="onPan" @mouseup="endPan" @mouseleave="endPan" @wheel="handleWheel" @touchstart="startTouchPan" @touchmove="onTouchPan" @touchend="endTouchPan">
              <defs>
                <!-- SVG Filter for custom glow effects -->
                <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <!-- Scalable Viewport Group -->
              <g :style="{ transform: `translate(${panX}px, ${panY}px) scale(${zoom})`, transformOrigin: '0 0' }">
                <!-- Wood Floor Background -->
                <path class="wood-floor" d="M497.88,107.34v188.78l-39.08,53.09h-249.9l-91.28-122.84-25.7,19.1-22.53-30.43,3.13-2.34c-1.49-.05-2.96-.16-4.42-.32l.14-1.14c-10.19-1.3-19.84-5.36-27.9-11.73l11.46-14.52c16.49,13.05,40.43,10.26,53.48-6.23,13.04-16.47,10.27-40.39-6.18-53.45l-.47-.39,10.14-13.23.67-4.35h388.44Z"/>
                
                <!-- Outer Border Walls -->
                <path class="outer-border" d="M546.36,465.67l-95.84-.2v16.86h-60.18v-17.06l-114.95-.3v-39.79h-20.65l-32.85,24.41L55.39,225.52l17.13-12.82c-31.34-1.08-56.4-26.82-56.4-58.42s26.17-58.46,58.46-58.46c13.06,0,25.13,4.28,34.86,11.52h436.92v200.87l-59.36,80.79v34.3h59.36"/>

                <!-- Structural Pillars -->
                <rect class="pillar" x="264.81" y="237.23" width="23.26" height="23.73"/>
                <rect class="pillar" x="407.27" y="237.23" width="23.26" height="23.73"/>
                <rect class="pillar" x="308.75" y="392.76" width="68.84" height="30.54"/>
                
                <!-- Connector line -->
                <line class="map-line" x1="304.55" y1="423.31" x2="487" y2="423.31"/>

                <!-- Interactive Zone: Main Stage -->
                <g class="zone-group stage-group" :class="{ active: hoveredZoneId === 'stage' }" @mouseover="hoveredZoneId = 'stage'" @mouseleave="hoveredZoneId = null" @click="openZone('stage')">
                  <rect class="zone-shape shape-stage" x="260.35" y="107.34" width="175.11" height="156.75"/>
                  <text class="zone-label-text" transform="translate(327.1 142.22)">{{ isEn ? 'Stage' : '主舞台' }}</text>
                </g>

                <!-- Interactive Zone: Vendor Alley -->
                <!-- Interactive Zone: Vendor Alley -->
                <g class="zone-group vendors-group" :class="{ active: hoveredZoneId === 'vendors' }" @mouseover="hoveredZoneId = 'vendors'" @mouseleave="hoveredZoneId = null" @click="openZone('vendors')">
                  <polygon class="zone-shape shape-vendors" points="260.35 183.43 175.42 183.43 77.93 255.86 221.89 449.6 254.74 425.18 260.35 425.19 260.35 183.43"/>
                  <text class="zone-label-text" transform="translate(170.13 310.92)">{{ isEn ? 'Vendors' : '攤位區' }}</text>
                </g>

                <!-- Interactive Zone: Workshop Area -->
                <g class="zone-group workshop-group" :class="{ active: hoveredZoneId === 'workshop' }" @mouseover="hoveredZoneId = 'workshop'" @mouseleave="hoveredZoneId = null" @click="openZone('workshop')">
                  <rect class="zone-shape shape-workshop" x="435.46" y="107.35" width="62.42" height="169.22"/>
                  <text class="zone-label-text" transform="translate(447.23 202.93)">{{ isEn ? 'Workshop' : '工坊區' }}</text>
                </g>

                <!-- Interactive Zone: Game Area -->
                <g class="zone-group game-group" :class="{ active: hoveredZoneId === 'game' }" @mouseover="hoveredZoneId = 'game'" @mouseleave="hoveredZoneId = null" @click="openZone('game')">
                  <rect class="zone-shape shape-game" x="260.35" y="264.09" width="175.11" height="85.13"/>
                  <text class="zone-label-text" transform="translate(323.76 309.31)">{{ isEn ? 'Games' : '遊戲區' }}</text>
                </g>

                <!-- Interactive Zone: Exhibition -->
                <g class="zone-group exhibition-group" :class="{ active: hoveredZoneId === 'exhibition' }" @mouseover="hoveredZoneId = 'exhibition'" @mouseleave="hoveredZoneId = null" @click="openZone('exhibition')">
                  <polygon class="zone-shape shape-exhibition" points="487 389.01 487 423.31 377.59 423.31 377.59 349.22 458.8 349.22 497.88 296.12 535.13 323.49 487 389.01"/>
                  <text class="zone-label-text" transform="translate(436.1 384.09)">{{ isEn ? 'Exhibition' : '展示區' }}</text>
                </g>

                <!-- Interactive Zone: Bar -->
                <g class="zone-group bar-group" :class="{ active: hoveredZoneId === 'bar' }" @mouseover="hoveredZoneId = 'bar'" @mouseleave="hoveredZoneId = null" @click="openZone('bar')">
                  <polygon class="zone-shape shape-bar" points="22.3 180.48 25.12 185.48 28.41 190.17 32.15 194.52 36.3 198.49 40.82 202.03 45.66 205.11 50.78 207.69 56.13 209.77 61.66 211.31 67.31 212.3 73.03 212.73 78.77 212.6 84.47 211.91 90.07 210.66 95.52 208.87 100.77 206.55 105.77 203.74 110.46 200.44 114.82 196.7 118.78 192.55 122.32 188.03 125.4 183.19 127.99 178.07 130.06 172.72 131.6 167.19 132.59 161.54 133.02 155.82 132.89 150.08 132.2 144.38 130.95 138.78 129.16 133.33 126.85 128.08 124.03 123.08 120.73 118.39 116.99 114.03 112.84 110.07 108.32 106.53 103.48 103.45 98.36 100.86 93.01 98.79 87.48 97.25 81.83 96.26 76.11 95.83 70.37 95.96 64.68 96.65 59.07 97.9 53.62 99.69 48.37 102 43.37 104.82 38.68 108.12 34.33 111.86 30.36 116.01 26.82 120.53 23.74 125.37 21.16 130.49 19.08 135.84 17.54 141.37 16.55 147.02 16.12 152.74 16.25 158.48 16.94 164.17 18.19 169.78 19.98 175.23 22.3 180.48"/>
                  <text class="zone-label-text" transform="translate(75.89 169.96)">{{ isEn ? 'Bar' : '吧台' }}</text>
                </g>

                <!-- Interactive Zone: Check-in -->
                <g class="zone-group checkin-group" :class="{ active: hoveredZoneId === 'checkin' }" @mouseover="hoveredZoneId = 'checkin'" @mouseleave="hoveredZoneId = null" @click="openZone('checkin')">
                  <rect class="zone-shape shape-checkin" x="308.75" y="392.76" width="68.84" height="30.54"/>
                  <text class="zone-label-text" transform="translate(402.55 475.15)">{{ isEn ? 'Check-in' : '報到處' }}</text>
                </g>

                <!-- Interactive Zone: Entrance -->
                <g class="zone-group entrance-group" :class="{ active: hoveredZoneId === 'entrance' }" @mouseover="hoveredZoneId = 'entrance'" @mouseleave="hoveredZoneId = null" @click="openZone('entrance')">
                  <polygon class="zone-shape shape-entrance" points="553.51 441.24 549.52 445.47 553.51 449.7 553.51 441.24"/>
                  <text class="zone-label-text" transform="translate(556.28 449.8)">{{ isEn ? 'Entrance' : '入口' }}</text>
                </g>

                <!-- Interactive Booths Layer -->
                <g id="booths-layer">
                  <g v-for="booth in booths" :key="booth.id" class="booth-group" :class="{ active: hoveredBoothId === booth.id }" :transform="`translate(${booth.x}, ${booth.y}) rotate(${booth.rotate})`" @mouseover="hoveredBoothId = booth.id" @mouseleave="hoveredBoothId = null" @click.stop="openBooth(booth)">
                    <!-- Table / slot rectangle -->
                    <rect class="booth-rect" :x="-(booth.w || 22) / 2" :y="-(booth.h || 15) / 2" :width="booth.w || 22" :height="booth.h || 15" rx="2" ry="2" />
                    <!-- Label inside booth -->
                    <text class="booth-label" x="0" y="0.5" dominant-baseline="central" text-anchor="middle">
                      {{ booth.id }}
                    </text>
                  </g>
                </g>
              </g>
            </svg>

            <!-- Interactive Zoom & Pan Controls Overlay -->
            <div class="map-controls">
              <button class="control-btn" type="button" @click="zoomIn" :aria-label="t('common.zoomIn')" title="Zoom In">
                <i class="fa-solid fa-plus"></i>
              </button>
              <button class="control-btn" type="button" @click="zoomOut" :aria-label="t('common.zoomOut')" title="Zoom Out">
                <i class="fa-solid fa-minus"></i>
              </button>
              <button class="control-btn" type="button" @click="resetZoom" :aria-label="t('common.resetZoom')" title="Reset View">
                <i class="fa-solid fa-arrows-to-dot"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Sidebar / Interactive Info Deck -->
        <div class="info-sidebar-card">
          <!-- Hover/Selection Context Info -->
          <div class="sidebar-content-wrapper">
            <template v-if="hoveredBoothId">
              <div class="sidebar-item-preview">
                <span class="preview-badge booth-badge">{{ hoveredBoothId }}</span>
                <h3>{{ booths.find(b => b.id === hoveredBoothId)?.name[isEn ? 'en' : 'zh'] }}</h3>
                <p class="preview-desc">{{ booths.find(b => b.id === hoveredBoothId)?.description[isEn ? 'en' : 'zh'] }}</p>
              </div>
            </template>
            <template v-else-if="hoveredZoneId">
              <div class="sidebar-item-preview">
                <span class="preview-badge" :class="`zone-badge-${hoveredZoneId}`">{{ t(`venue.legend.${hoveredZoneId}`) }}</span>
                <p class="preview-desc">{{ t(`venue.zones.${hoveredZoneId}`) }}</p>
              </div>
            </template>
            <template v-else>
              <div class="sidebar-placeholder">
                <i class="fa-solid fa-map-location-dot placeholder-icon"></i>
                <p>{{ t('venue.hint') }}</p>
              </div>
            </template>
          </div>

          <!-- Legend Table -->
          <div class="legend-container">
            <h4>{{ t('venue.legend.title') }}</h4>
            <div class="legend-grid">
              <div class="legend-item" @mouseover="hoveredZoneId = 'stage'" @mouseleave="hoveredZoneId = null" @click="openZone('stage')">
                <span class="legend-dot dot-stage"></span>
                <span>{{ t('venue.legend.stage') }}</span>
              </div>
              <div class="legend-item" @mouseover="hoveredZoneId = 'vendors'" @mouseleave="hoveredZoneId = null" @click="openZone('vendors')">
                <span class="legend-dot dot-vendors"></span>
                <span>{{ t('venue.legend.vendors') }}</span>
              </div>
              <div class="legend-item" @mouseover="hoveredZoneId = 'workshop'" @mouseleave="hoveredZoneId = null" @click="openZone('workshop')">
                <span class="legend-dot dot-workshop"></span>
                <span>{{ t('venue.legend.workshop') }}</span>
              </div>
              <div class="legend-item" @mouseover="hoveredZoneId = 'game'" @mouseleave="hoveredZoneId = null" @click="openZone('game')">
                <span class="legend-dot dot-game"></span>
                <span>{{ t('venue.legend.game') }}</span>
              </div>
              <div class="legend-item" @mouseover="hoveredZoneId = 'bar'" @mouseleave="hoveredZoneId = null" @click="openZone('bar')">
                <span class="legend-dot dot-bar"></span>
                <span>{{ t('venue.legend.bar') }}</span>
              </div>
              <div class="legend-item" @mouseover="hoveredZoneId = 'exhibition'" @mouseleave="hoveredZoneId = null" @click="openZone('exhibition')">
                <span class="legend-dot dot-exhibition"></span>
                <span>{{ t('venue.legend.exhibition') }}</span>
              </div>
              <div class="legend-item" @mouseover="hoveredZoneId = 'checkin'" @mouseleave="hoveredZoneId = null" @click="openZone('checkin')">
                <span class="legend-dot dot-checkin"></span>
                <span>{{ t('venue.legend.checkin') }}</span>
              </div>
              <div class="legend-item" @mouseover="hoveredZoneId = 'entrance'" @mouseleave="hoveredZoneId = null" @click="openZone('entrance')">
                <span class="legend-dot dot-entrance"></span>
                <span>{{ t('venue.legend.entrance') }}</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot dot-booth"></span>
                <span>{{ t('venue.legend.booth') }} (1-10)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Transport Guide & Google Map Embed -->
      <section class="venue-transport-section">
        <h3>{{ t('venue.transport.title') }}</h3>
        
        <div class="transport-grid">
          <!-- Transport Info Cards -->
          <div class="transport-info-col">
            <div class="transport-card">
              <div class="card-icon"><i class="fa-solid fa-train-subway"></i></div>
              <div class="card-text">
                <h5>{{ t('venue.transport.mrt') }}</h5>
                <p v-html="t('venue.transport.mrtDesc')"></p>
              </div>
            </div>

            <div class="transport-card">
              <div class="card-icon"><i class="fa-solid fa-bus"></i></div>
              <div class="card-text">
                <h5>{{ t('venue.transport.bus') }}</h5>
                <p>{{ t('venue.transport.busDesc') }}</p>
              </div>
            </div>

            <div class="transport-card">
              <div class="card-icon"><i class="fa-solid fa-car"></i></div>
              <div class="card-text">
                <h5>{{ t('venue.transport.driving') }}</h5>
                <p>{{ t('venue.transport.drivingDesc') }}</p>
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
                style="border:0;" 
                allowfullscreen="true" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade"
                title="AS Life Space Map"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <!-- Modal Overlay -->
      <div class="venue-modal" :class="{ show: activeModalType !== null }" :aria-hidden="activeModalType === null">
        <div class="venue-modal-bg" @click="closeModal" />

        <!-- Zone Information Modal -->
        <div v-if="activeModalType === 'zone' && selectedZoneId !== null" class="venue-modal-box">
          <button class="venue-modal-close" type="button" :aria-label="t('common.close')" @click="closeModal">×</button>
          
          <div class="modal-body-content">
            <span class="modal-badge" :class="`zone-badge-${selectedZoneId}`">
              {{ t(`venue.legend.${selectedZoneId}`) }}
            </span>
            <h3>{{ t(`venue.legend.${selectedZoneId}`) }}</h3>
            <div class="modal-section-title">{{ t('venue.modal.details') }}</div>
            <p class="modal-desc">{{ t(`venue.zones.${selectedZoneId}`) }}</p>

            <!-- Linked Events Schedule -->
            <div v-if="['stage', 'vendors', 'workshop', 'game'].includes(selectedZoneId)" class="modal-events-section">
              <div class="modal-section-title">{{ t('venue.modal.events') }}</div>
              
              <div v-if="zoneEvents.length > 0" class="events-list">
                <div v-for="(event, idx) in zoneEvents" :key="idx" class="event-item">
                  <div class="event-time">🕒 {{ event.start }} - {{ event.end }}</div>
                  <div class="event-title">{{ event.title }}</div>
                  <div v-if="event.detail" class="event-desc">{{ event.detail }}</div>
                </div>
              </div>
              <p v-else class="no-events-text">{{ t('venue.modal.noEvents') }}</p>
            </div>
          </div>
        </div>

        <!-- Booth Information Modal -->
        <div v-if="activeModalType === 'booth' && selectedBooth !== null" class="venue-modal-box">
          <button class="venue-modal-close" type="button" :aria-label="t('common.close')" @click="closeModal">×</button>
          
          <div class="modal-body-content">
            <span class="modal-badge booth-badge">{{ t('venue.modal.boothTitle', { id: selectedBooth.id }) }}</span>
            <h3>{{ selectedBooth.name[isEn ? 'en' : 'zh'] }}</h3>
            
            <div class="modal-section-title">{{ t('venue.modal.description') }}</div>
            <p class="modal-desc">{{ selectedBooth.description[isEn ? 'en' : 'zh'] }}</p>

            <!-- Links -->
            <div v-if="selectedBooth.links && selectedBooth.links.length > 0" class="modal-links-section">
              <div class="modal-section-title">{{ t('venue.modal.links') }}</div>
              <div class="links-grid">
                <a v-for="(link, idx) in selectedBooth.links" :key="idx" :href="link.url" target="_blank" rel="noopener noreferrer" class="booth-social-link">
                  <i :class="link.icon || 'fa-solid fa-link'"></i>
                  <span>{{ link.label }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Page Layout */
.venue-page-root {
  position: relative;
  min-height: auto;
  padding-top: clamp(4.5rem, 7vw, 6.5rem);
  padding-bottom: 4rem;
  font-family: "LXGW WenKai Mono TC", monospace;
  --color-font: #efefef;
}

.venue-page-body {
  position: relative;
  z-index: 1;
}

.venue-hero {
  width: min(97.5%, 76em);
  margin: 0 auto 1.5rem auto;
}

.venue-hero-header {
  text-align: center;
}

.venue-hero-header h2 {
  margin: 0 0 .25em;
  font-size: clamp(2.2rem, 4vw, 3.6rem);
  line-height: 1.1;
  color: var(--color-font);
  text-shadow: 0 2px 6px rgba(255, 255, 255, .4);
}

.venue-hero-header p {
  margin: .15em 0;
  font-size: clamp(1rem, 1.5vw, 1.25rem);
  line-height: 1.6;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
}

/* Main map section layout */
.venue-main-section {
  width: min(97.5%, 76em);
  max-width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 3fr 1.6fr;
  gap: 1.5em;
  align-items: stretch;
}

@media (max-width: 950px) {
  .venue-main-section {
    grid-template-columns: 1fr;
  }
}

.map-container-card {
  padding: 1.5em;
  border-radius: 1.25em;
  background: linear-gradient(180deg, rgba(72, 38, 82, .75), rgba(72, 38, 82, .75));
  box-shadow: 0 1em 2em rgba(0, 0, 0, .25), inset 0 0 0 1px rgba(127, 100, 50, .12);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.map-wrapper {
  width: 100%;
  max-width: 580px;
  position: relative;
  overflow: hidden;
  user-select: none;
}

.info-sidebar-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5em;
  padding: 1.5em;
  border-radius: 1.25em;
  background: linear-gradient(180deg, rgba(46, 21, 56, 0.82), rgba(29, 13, 36, 0.9));
  box-shadow: 0 1em 2em rgba(0, 0, 0, .25), inset 0 0 0 1px rgba(127, 100, 50, 0.15);
  min-height: 250px;
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

#venue-svg g {
  transition: transform 0.05s ease-out; /* Smooth dragging experience */
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
  font-family: NotoSansTC-Regular, 'Noto Sans TC', sans-serif;
  font-size: 13.5px;
  font-weight: 700;
  fill: #ffffff;
  opacity: 0.65;
  pointer-events: none;
  transition: all 0.25s ease;
  user-select: none;
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
  fill: #1a98ff;
  stroke: #1a98ff;
}
.font-workshop path {
  fill: #85c8ff;
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

/* Game Area Color System */
.shape-game {
  fill: #1affec;
  stroke: #1affec;
}
.font-game path {
  fill: #a6fff8;
}
.game-group:hover .shape-game,
.game-group.active .shape-game {
  fill-opacity: 0.38;
  stroke: #ffffff;
  filter: url(#neon-glow);
}
.game-group:hover .font-game path,
.game-group.active .font-game path {
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

/* Entrance Color System */
.shape-entrance {
  fill: #ff3366;
  stroke: #ff3366;
}
.font-entrance path {
  fill: #ff3366;
}
.entrance-group:hover .shape-entrance,
.entrance-group.active .shape-entrance {
  fill-opacity: 0.45;
  stroke: #ffffff;
  filter: url(#neon-glow);
}
.entrance-group:hover .font-entrance path,
.entrance-group.active .font-entrance path {
  fill: #ffffff;
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
  justify-content: center;
}

.sidebar-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: rgba(255, 255, 255, 0.45);
  gap: 0.8rem;
}

.placeholder-icon {
  font-size: 2.5rem;
  color: rgba(255, 230, 167, 0.25);
  animation: float-slow 4s ease-in-out infinite;
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.sidebar-item-preview {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  animation: fadeIn 0.25s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.preview-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 99px;
  text-transform: uppercase;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.zone-badge-stage { background-color: rgba(186, 85, 211, 0.75); }
.zone-badge-vendors { background-color: rgba(255, 215, 0, 0.75); color: #120b18; }
.zone-badge-workshop { background-color: rgba(30, 144, 255, 0.75); }
.zone-badge-game { background-color: rgba(26, 255, 236, 0.75); color: #120b18; }
.zone-badge-exhibition { background-color: rgba(163, 161, 160, 0.75); color: #120b18; }
.zone-badge-checkin { background-color: rgba(255, 94, 98, 0.75); color: #ffffff; }
.zone-badge-bar { background-color: rgba(255, 189, 222, 0.75); color: #120b18; }
.zone-badge-entrance { background-color: rgba(255, 51, 102, 0.75); }
.booth-badge { background-color: var(--color-gold); color: #120b18; }

.sidebar-item-preview h3 {
  margin: 0;
  font-size: 1.4rem;
  color: #ffffff;
  text-shadow: 0 0 8px rgba(255, 230, 167, 0.35);
}

.preview-desc {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
}

.legend-container {
  border-top: 1px solid rgba(255, 230, 167, 0.1);
  padding-top: 0.8rem;
}

.legend-container h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 230, 167, 0.65);
}

.legend-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.4rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s;
  padding: 0.1rem;
  border-radius: 4px;
}

.legend-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

.legend-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}

.dot-stage { background-color: #ba55d3; box-shadow: 0 0 4px #ba55d3; }
.dot-vendors { background-color: #fffb1a; box-shadow: 0 0 4px #fffb1a; }
.dot-workshop { background-color: #1a98ff; box-shadow: 0 0 4px #1a98ff; }
.dot-game { background-color: #1affec; box-shadow: 0 0 4px #1affec; }
.dot-bar { background-color: #ffbdde; box-shadow: 0 0 4px #ffbdde; }
.dot-exhibition { background-color: #a3a1a0; box-shadow: 0 0 4px #a3a1a0; }
.dot-checkin { background-color: #ff5e62; box-shadow: 0 0 4px #ff5e62; }
.dot-entrance { background-color: #ff3366; box-shadow: 0 0 4px #ff3366; }
.dot-booth { background-color: var(--color-gold); box-shadow: 0 0 4px var(--color-gold); }

/* Transport Section */
.venue-transport-section {
  width: min(97.5%, 76em);
  margin: 2.5rem auto 0 auto;
  padding: 2em;
  border-radius: 1.25em;
  background: linear-gradient(180deg, rgba(72, 38, 82, 0.45), rgba(46, 21, 56, 0.45));
  box-shadow: 0 1em 2em rgba(0, 0, 0, .25), inset 0 0 0 1px rgba(127, 100, 50, .08);
}

.venue-transport-section h3 {
  margin: 0 0 1.25rem 0;
  font-size: 1.8rem;
  color: var(--color-font);
  text-shadow: 0 1px 4px rgba(255, 255, 255, .3);
  text-align: center;
}

.transport-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 2rem;
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
  gap: 1.2rem;
}

.transport-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.8rem;
  background: rgba(20, 10, 25, 0.55);
  border: 1px solid rgba(255, 230, 167, 0.08);
  transition: border-color 0.25s;
}

.transport-card:hover {
  border-color: rgba(255, 230, 167, 0.25);
}

.card-icon {
  font-size: 1.5rem;
  color: var(--color-gold);
  background: rgba(255, 230, 167, 0.1);
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
}

.card-text h5 {
  margin: 0 0 0.35rem 0;
  font-size: 1.15rem;
  color: #ffffff;
}

.card-text p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.8);
}

.map-embed-col {
  width: 100%;
  min-height: 300px;
}

.map-frame {
  width: 100%;
  height: 100%;
  min-height: 300px;
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid rgba(255, 230, 167, 0.15);
  box-shadow: 0 8px 30px rgba(0, 0, 0, .3);
}

/* Modals styling */
.venue-modal {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 9999;
}

.venue-modal.show {
  display: block;
}

.venue-modal-bg {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, .5);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.venue-modal-box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: min(75vw, 42em);
  max-width: 95%;
  max-height: 85vh;
  overflow-y: auto;
  border-radius: 1.2rem;
  background: var(--color-paper-bg);
  color: var(--color-paper-text-muted);
  box-shadow: 0 18px 48px rgba(0, 0, 0, .28);
  padding: clamp(1.2rem, 2vw, 2.2rem) clamp(1.2rem, 2vw, 2.5rem);
  animation: modalPop 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalPop {
  from { opacity: 0; transform: translate(-50%, -46%) scale(0.96); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

.venue-modal-close {
  position: absolute;
  top: .2em;
  right: .4em;
  border: none;
  background: transparent;
  font-size: clamp(2rem, 2vw, 3.5rem);
  cursor: pointer;
  color: var(--color-paper-text-muted);
  line-height: 1;
}

.venue-modal-close:hover {
  color: #ff1e1ebb;
  transition: color .25s;
}

.modal-body-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.modal-badge {
  align-self: flex-start;
  padding: 0.25rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 700;
  border-radius: 99px;
  color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.modal-body-content h3 {
  margin: 0.25rem 0 0.5rem 0;
  color: var(--color-paper-text-dark);
  font-size: clamp(1.5rem, 2vw, 2rem);
  line-height: 1.2;
}

.modal-section-title {
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
  color: var(--color-paper-text);
  border-bottom: 2px solid rgba(74, 53, 34, 0.1);
  padding-bottom: 0.2rem;
  margin-top: 0.5rem;
}

.modal-desc {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--color-paper-text);
  white-space: pre-wrap;
}

/* Event schedules in modal */
.modal-events-section,
.modal-links-section {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-top: 0.2rem;
}

.event-item {
  background: rgba(74, 53, 34, 0.04);
  border-left: 3px solid var(--color-nav-bg);
  padding: 0.5rem 0.8rem;
  border-radius: 0 4px 4px 0;
}

.event-time {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--color-paper-text-muted);
  margin-bottom: 0.15rem;
}

.event-title {
  font-size: 1.02rem;
  font-weight: 700;
  color: var(--color-paper-text-dark);
  margin-bottom: 0.15rem;
}

.event-desc {
  font-size: 0.88rem;
  line-height: 1.5;
  color: var(--color-paper-text-muted);
}

.no-events-text {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-paper-text-muted);
  font-style: italic;
}

/* Booth links */
.links-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.2rem;
}

.booth-social-link {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.9rem;
  border-radius: 6px;
  background: rgba(74, 53, 34, 0.06);
  color: var(--color-paper-text-dark);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s;
  border: 1px solid rgba(74, 53, 34, 0.06);
}

.booth-social-link:hover {
  background: var(--color-nav-bg);
  color: #ffffff;
  border-color: var(--color-nav-bg);
}
</style>
