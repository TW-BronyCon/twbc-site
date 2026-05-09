<script setup lang="ts">
import { ref, computed } from 'vue'
const { t } = useI18n()

const currentMode = ref<'detailed' | 'table'>('detailed')
const isHovering = ref(false)
const activeRowIndex = ref<number | null>(null)
const activeColIndex = ref<number | null>(null)

const toggleMode = () => {
  currentMode.value = currentMode.value === 'detailed' ? 'table' : 'detailed'
}

const goToPurchase = () => {
  window.open('https://docs.google.com/forms/d/e/1FAIpQLScQfsnO2xAn2_6HeFo4kghgGDsYjoyk57KowrEsRyrBtYE0LQ/viewform', '_blank')
}

const tiers = [
  { id: 'budget', color: '#73bfe5', subColor: '#bddeef', img: '/img/form-b.png' },
  { id: 'standard', color: '#8673e5', subColor: '#c2b9ed', img: '/img/form-g.png' },
  { id: 'sponsor', color: '#e57399', subColor: '#e8b2c4', img: '/img/form-p.png' },
  { id: 'royale', color: '#e5d273', subColor: '#efe6b8', img: '/img/form-o.png' }
]

const featuresList = [
  { key: 'badge', availability: [true, true, true, true] },
  { key: 'pin', availability: [false, true, true, true] },
  { key: 'postcard', availability: [false, true, true, true] },
  { key: 'folder', availability: [false, false, true, true] },
  { key: 'bag', availability: [false, false, true, true] },
  { key: 'keychain', availability: [false, false, true, true] },
  { key: 'standee', availability: [false, false, true, true] },
  { key: 'thanks', availability: [false, false, true, true] },
  { key: 'intro_thx', availability: [false, false, true, false] },
  { key: 'intro_detail', availability: [false, false, false, true] },
  { key: 'discord', availability: [false, false, true, true] },
  { key: 'mug', availability: [false, false, false, true] },
  { key: 'coaster', availability: [false, false, false, true] },
  { key: 'tshirt', availability: [false, false, false, true] },
  { key: 'speech', availability: [false, false, false, true] }
]

const onCellMouseEnter = (rowIndex: number, colIndex: number) => {
  isHovering.value = true
  activeRowIndex.value = rowIndex
  activeColIndex.value = colIndex
}

const onRowMouseEnter = (rowIndex: number) => {
  isHovering.value = true
  activeRowIndex.value = rowIndex
  activeColIndex.value = null
}

const onHeaderMouseEnter = (colIndex: number) => {
  isHovering.value = true
  activeRowIndex.value = null
  activeColIndex.value = colIndex
}

const onMouseLeave = () => {
  isHovering.value = false
  activeRowIndex.value = null
  activeColIndex.value = null
}
</script>

<template>
  <div class="ticket-root">
    <SharedBackground variant="village" />

    <div class="container">
      <div class="border">
        <div class="border">
          <h1>{{ $t('ticket.title') }}</h1>
          <h2>{{ $t('ticket.subtitle') }}</h2>
          <div class="btn">
            <button class="sectionbtn" @click="toggleMode">
              {{ currentMode === 'detailed' ? $t('ticket.viewTable') : $t('ticket.viewDetailed') }}
            </button>
            <button class="sectionbtn" @click="goToPurchase">{{ $t('ticket.purchase') }}</button>
          </div>

          <!-- Detailed View -->
          <div v-if="currentMode === 'detailed'" class="section show">
            <div
              v-for="tier in tiers"
              :key="tier.id"
              class="block"
              :style="{ color: tier.color }"
            >
              <img :src="tier.img" :alt="$t(`ticket.tiers.${tier.id}`)" class="ticket-img">
              <div class="ticket-text">
                <div class="ticket-title">{{ $t(`ticket.tiers.${tier.id}`) }}</div>
                <div class="description">
                  <span :style="{ color: tier.subColor }">{{ $t(`ticket.descriptions.${tier.id}`) }}</span>
                  <br>{{ $t('ticket.includes') }}{{ featuresList.filter(f => f.availability[tiers.indexOf(tier)]).map(f => $t(`ticket.features.${f.key}`)).join('、') }}
                </div>
              </div>
              <div class="ticket-price">{{ $t(`ticket.prices.${tier.id}`) }}</div>
            </div>
          </div>

          <!-- Table View -->
          <div v-if="currentMode === 'table'" class="section show">
            <div class="compare-wrap">
              <table :class="['compare-table', { 'is-hovering': isHovering }]" @mouseleave="onMouseLeave">
                <thead>
                  <tr>
                    <th class="feature-head"></th>
                    <th
                      v-for="(tier, index) in tiers"
                      :key="tier.id"
                      class="tier-head"
                      :class="{ 'active-col': activeColIndex === index }"
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
                        { 'active-col': activeColIndex === cIndex }
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
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="~/assets/css/ticket.css"></style>
