<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Ticket Page Component
 * Handles displaying detailed ticket tiers and interactive feature comparison table.
 */

const { t } = useI18n()

// Page SEO metadata
useHead({
  title: t('ticket.title')
})

// Display mode state: 'detailed' view (cards) or 'table' view (comparison grid)
const currentMode = ref<'detailed' | 'table'>('detailed')

// Interaction states for comparison table hover effects
const isHovering = ref(false)
const activeRowIndex = ref<number | null>(null)
const activeColIndex = ref<number | null>(null)

/**
 * Toggle display mode between card list and comparison table
 */
const toggleMode = () => {
  currentMode.value = currentMode.value === 'detailed' ? 'table' : 'detailed'
}

// Ticket expiration status check (Royale ticket 5000 NTD expires on 6/30 23:59:59 UTC+8)
const isRoyaleClosed = ref(false)
const cutoffTime = new Date('2026-06-30T23:59:59+08:00')
const timeOffset = ref(0)

const checkRoyaleStatus = () => {
  const now = new Date(Date.now() + timeOffset.value)
  isRoyaleClosed.value = now >= cutoffTime
}

async function syncTime() {
  try {
    const res = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=Asia/Taipei')
    const data = await res.json()
    const serverTime = new Date(data.dateTime)
    const localTime = new Date()
    timeOffset.value = serverTime.getTime() - localTime.getTime()
  } catch (error) {
    timeOffset.value = 0
    console.error("Failed to sync network time, using local time", error)
  }
}

let statusTimer: ReturnType<typeof setInterval> | null = null

onMounted(async () => {
  await syncTime()
  checkRoyaleStatus()
  statusTimer = setInterval(checkRoyaleStatus, 1000)
})

onUnmounted(() => {
  if (statusTimer) clearInterval(statusTimer)
})

// Ticket tier configurations containing layout colors, graphic assets, and purchase forms
const tiers = [
  { 
    id: 'budget', 
    color: '#73bfe5', 
    subColor: '#6baaca', 
    img: '/img/B.avif',
    url: "https://docs.google.com/forms/d/e/1FAIpQLScQfsnO2xAn2_6HeFo4kghgGDsYjoyk57KowrEsRyrBtYE0LQ/viewform?usp=pp_url&entry.1319398696=%E7%B6%93%E6%BF%9F%E7%A5%A8+$NTD:+500"
  },
  { 
    id: 'standard', 
    color: '#8673e5', 
    subColor: '#7c6ccc', 
    img: '/img/PU.avif',
    url: "https://docs.google.com/forms/d/e/1FAIpQLScQfsnO2xAn2_6HeFo4kghgGDsYjoyk57KowrEsRyrBtYE0LQ/viewform?usp=pp_url&entry.1319398696=%E6%A8%99%E6%BA%96%E7%A5%A8+$NTD:+600"
  },
  { 
    id: 'sponsor', 
    color: '#e57399', 
    subColor: '#ce6e8e', 
    img: '/img/PI.avif',
    url: "https://docs.google.com/forms/d/e/1FAIpQLScQfsnO2xAn2_6HeFo4kghgGDsYjoyk57KowrEsRyrBtYE0LQ/viewform?usp=pp_url&entry.1319398696=%E8%B4%BB%E5%8A%A9%E7%A5%A8+$NTD:+1000"
  },
  { 
    id: 'royale', 
    color: '#e5d273', 
    subColor: '#b4a34c', 
    img: '/img/Y.avif',
    url: "https://docs.google.com/forms/d/e/1FAIpQLScQfsnO2xAn2_6HeFo4kghgGDsYjoyk57KowrEsRyrBtYE0LQ/viewform?usp=pp_url&entry.1319398696=%E8%B2%B4%E8%B3%93%E7%A5%A8+$NTD:+5000+(6/30%E6%88%AA%E6%AD%A2)"
  }
]

// Matrix mapping features to their availability across [budget, standard, sponsor, royale] tiers
const featuresList = [
  { key: 'badge', availability: [true, true, true, true] },
  { key: 'pin', availability: [false, true, true, true] },
  { key: 'postcard', availability: [false, true, true, true] },
  { key: 'folder', availability: [false, false, true, true] },
  { key: 'bag', availability: [false, false, true, true] },
  { key: 'keychain', availability: [false, false, true, true] },
  { key: 'standee', availability: [false, false, true, true] },
  { key: 'thanks', availability: [false, false, true, true] },
  { key: 'intro_thx', availability: [false, false, true, true] },
  { key: 'intro_detail', availability: [false, false, false, true] },
  { key: 'discord', availability: [false, false, true, true] },
  { key: 'mug', availability: [false, false, false, true] },
  { key: 'coaster', availability: [false, false, false, true] },
  { key: 'tshirt', availability: [false, false, false, true] },
  { key: 'speech', availability: [false, false, false, true] }
]

/**
 * Track hovered cell inside comparison table
 */
const onCellMouseEnter = (rowIndex: number, colIndex: number) => {
  isHovering.value = true
  activeRowIndex.value = rowIndex
  activeColIndex.value = colIndex
}

/**
 * Track hovered row inside comparison table
 */
const onRowMouseEnter = (rowIndex: number) => {
  isHovering.value = true
  activeRowIndex.value = rowIndex
  activeColIndex.value = null
}

/**
 * Track hovered column header inside comparison table
 */
const onHeaderMouseEnter = (colIndex: number) => {
  isHovering.value = true
  activeRowIndex.value = null
  activeColIndex.value = colIndex
}

/**
 * Reset hover tracking states on mouse exit
 */
const onMouseLeave = () => {
  isHovering.value = false
  activeRowIndex.value = null
  activeColIndex.value = null
}
</script>

<template>
  <div class="ticket-root">
    <SharedBackground variant="homepage" />

    <div class="container">
      <div class="border">
        <div class="border">
          <h1>{{ $t('ticket.title') }}</h1>
          <h2>{{ $t('ticket.subtitle') }}</h2>
          <div v-if="isRoyaleClosed" class="ticket-status-banner">
            <i class="fa-solid fa-circle-exclamation"></i>
            <span>{{ $t('ticket.royaleClosedBanner') }}</span>
          </div>
          <div class="btn">
            <button class="sectionbtn" @click="toggleMode">
              {{ currentMode === 'detailed' ? $t('ticket.viewTable') : $t('ticket.viewDetailed') }}
            </button>
          </div>

          <!-- Detailed vs. Table View transition switcher -->
          <Transition name="fade-slide" mode="out-in">
            <!-- Detailed View (Card List) -->
            <div v-if="currentMode === 'detailed'" id="section1" class="section show">
              <a
                v-for="(tier, index) in tiers"
                :key="tier.id"
                :href="isRoyaleClosed && tier.id === 'royale' ? undefined : tier.url"
                :target="isRoyaleClosed && tier.id === 'royale' ? undefined : '_blank'"
                class="block-link"
                :class="{ 'is-disabled': isRoyaleClosed && tier.id === 'royale' }"
              >
                <div
                  class="block"
                  :style="{ color: tier.color }"
                  :class="{ 'is-closed': isRoyaleClosed && tier.id === 'royale' }"
                >
                  <!-- Ribbon Banner for Royale card if closed -->
                  <div v-if="isRoyaleClosed && tier.id === 'royale'" class="ribbon-closed">
                    <span>{{ $t('ticket.closed') }}</span>
                  </div>
                  <img :src="tier.img" :alt="$t(`ticket.tiers.${tier.id}`)" class="ticket-img">
                  <div class="ticket-text">
                    <div class="ticket-title">{{ $t(`ticket.tiers.${tier.id}`) }}</div>
                    <div class="description">
                      <div class="desc-top">
                        <span :style="{ color: tier.subColor }">{{ $t(`ticket.descriptions.${tier.id}`) }}</span>
                      </div>
                      <div class="desc-bottom">
                        {{ $t('ticket.includes') }}{{ featuresList.filter(f => f.availability[index]).map(f => $t(`ticket.features.${f.key}`)).join('、') }}
                      </div>
                    </div>
                  </div>
                  <div class="ticket-price">{{ $t(`ticket.prices.${tier.id}`) }}</div>
                </div>
              </a>
            </div>

            <!-- Table View (Comparison Grid) -->
            <div v-else-if="currentMode === 'table'" id="section2" class="section show">
              <div class="compare-wrap">
                <table :class="['compare-table', { 'is-hovering': isHovering }]" @mouseleave="onMouseLeave">
                  <thead>
                    <tr>
                      <th class="feature-head"></th>
                      <th
                        v-for="(tier, index) in tiers"
                        :key="tier.id"
                        class="tier-head"
                        :class="{ 
                          'active-col': activeColIndex === index,
                          'is-closed-col': isRoyaleClosed && tier.id === 'royale'
                        }"
                        @mouseenter="onHeaderMouseEnter(index)"
                      >
                        <span :class="['tier-label', tier.id]">{{ $t(`ticket.tiers.${tier.id}`) }}</span>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="(feature, rIndex) in featuresList"
                      :key="feature.key"
                      :class="{ 'active-row': activeRowIndex === rIndex }"
                    >
                      <th
                        class="feature-name"
                        @mouseenter="onRowMouseEnter(rIndex)"
                      >
                        {{ $t(`ticket.features.${feature.key}`) }}
                      </th>
                      <td
                        v-for="(avail, cIndex) in feature.availability"
                        :key="cIndex"
                        :class="[
                          'col-' + (cIndex + 1),
                          avail ? 'yes' : 'no',
                          { 
                            'active-col': activeColIndex === cIndex,
                            'is-closed-col': isRoyaleClosed && tiers[cIndex].id === 'royale'
                          }
                        ]"
                        @mouseenter="onCellMouseEnter(rIndex, cIndex)"
                      >
                        {{ avail ? '✔' : '✖' }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<style scoped src="~/assets/css/ticket.css"></style>

<style scoped>
.ticket-root {
  position: relative;
  padding-top: 3.5rem;
}

.block-link {
  text-decoration: none;
  color: inherit;
  display: block;
}
.block{
  height: 100%;
}
</style>
