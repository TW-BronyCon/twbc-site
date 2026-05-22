<script setup lang="ts">
import { ref } from 'vue'
const { t } = useI18n()
const localePath = useLocalePath()
const router = useRouter()

useHead({
  title: t('ticket.title')
})

const currentMode = ref<'detailed' | 'table'>('detailed')
const isHovering = ref(false)
const activeRowIndex = ref<number | null>(null)
const activeColIndex = ref<number | null>(null)

const toggleMode = () => {
  currentMode.value = currentMode.value === 'detailed' ? 'table' : 'detailed'
}

const goHome = () => {
  router.push(localePath('/'))
}

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
    <SharedBackground variant="homepage" />

    <div class="container">
      <div class="border">
        <div class="border">
          <h1>{{ $t('ticket.title') }}</h1>
          <h2>{{ $t('ticket.subtitle') }}</h2>
          <div class="btn">
            <button class="sectionbtn" @click="goHome">{{ $t('ticket.backHome') }}</button>
            <button class="sectionbtn" @click="toggleMode">
              {{ currentMode === 'detailed' ? $t('ticket.viewTable') : $t('ticket.viewDetailed') }}
            </button>
          </div>

          <!-- Detailed View -->
          <div v-if="currentMode === 'detailed'" id="section1" class="section show">
            <a
              v-for="(tier, index) in tiers"
              :key="tier.id"
              :href="tier.url"
              target="_blank"
              class="block-link"
            >
              <div
                class="block"
                :style="{ color: tier.color }"
              >
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

          <!-- Table View -->
          <div v-if="currentMode === 'table'" id="section2" class="section show">
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

<style scoped>
.block-link {
  text-decoration: none;
  color: inherit;
  display: block;
}
.block{
  height: 100%;
}
</style>
