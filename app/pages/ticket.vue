<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

/**
 * Ticket Page Component
 * Handles displaying detailed ticket tiers and interactive feature comparison table.
 */

const { t, locale } = useI18n();

const isEn = computed(() => locale.value.startsWith("en"));

definePageMeta({
  underDevelopment: false,
});

// Page SEO metadata
useHead({
  title: t("ticket.title"),
});

// Display mode state: 'detailed' view (cards) or 'table' view (comparison grid)
const currentMode = ref<"detailed" | "table">("detailed");

// Interaction states for comparison table hover effects
const isHovering = ref(false);
const activeRowIndex = ref<number | null>(null);
const activeColIndex = ref<number | null>(null);

/**
 * Toggle display mode between card list and comparison table
 */
const toggleMode = () => {
  currentMode.value = currentMode.value === "detailed" ? "table" : "detailed";
};

// Ticket expiration status check
const currentTime = ref(Date.now());
const timeOffset = ref(0);

const isTierClosed = (closeTimeStr?: string | null) => {
  if (!closeTimeStr) return false;
  const now = new Date(currentTime.value + timeOffset.value);
  return now >= new Date(closeTimeStr);
};

async function syncTime() {
  try {
    const res = await fetch(
      "https://timeapi.io/api/Time/current/zone?timeZone=Asia/Taipei",
    );
    const data = await res.json();
    const serverTime = new Date(data.dateTime);
    const localTime = new Date();
    timeOffset.value = serverTime.getTime() - localTime.getTime();
  } catch (error) {
    timeOffset.value = 0;
    console.error("Failed to sync network time, using local time", error);
  }
}

let statusTimer: ReturnType<typeof setInterval> | null = null;

onMounted(async () => {
  await syncTime();
  statusTimer = setInterval(() => {
    currentTime.value = Date.now();
  }, 1000);
});

onUnmounted(() => {
  if (statusTimer) clearInterval(statusTimer);
});

// Ticket tier configurations containing layout colors, graphic assets, and purchase forms
const tiers = [
  {
    id: "budget",
    color: "var(--color-tier-budget)",
    subColor: "var(--color-tier-budget-sub)",
    img: "/img/B.avif",
    url: "https://docs.google.com/forms/d/e/1FAIpQLScQfsnO2xAn2_6HeFo4kghgGDsYjoyk57KowrEsRyrBtYE0LQ/viewform?usp=pp_url&entry.1319398696=%E7%B6%93%E6%BF%9F%E7%A5%A8+$NTD:+500",
    closeTime: "2026-07-26T23:59:59+08:00",
    price: "NT$ 500",
  },
  {
    id: "standard",
    color: "var(--color-tier-standard)",
    subColor: "var(--color-tier-standard-sub)",
    img: "/img/PU.avif",
    url: "https://docs.google.com/forms/d/e/1FAIpQLScQfsnO2xAn2_6HeFo4kghgGDsYjoyk57KowrEsRyrBtYE0LQ/viewform?usp=pp_url&entry.1319398696=%E6%A8%99%E6%BA%96%E7%A5%A8+$NTD:+600",
    closeTime: "2026-07-26T23:59:59+08:00",
    price: "NT$ 600",
  },
  {
    id: "sponsor",
    color: "var(--color-tier-sponsor)",
    subColor: "var(--color-tier-sponsor-sub)",
    img: "/img/PI.avif",
    url: "https://docs.google.com/forms/d/e/1FAIpQLScQfsnO2xAn2_6HeFo4kghgGDsYjoyk57KowrEsRyrBtYE0LQ/viewform?usp=pp_url&entry.1319398696=%E8%B4%BB%E5%8A%A9%E7%A5%A8+$NTD:+1000",
    closeTime: "2026-07-26T23:59:59+08:00",
    price: "NT$ 1,000",
  },
  {
    id: "royale",
    color: "var(--color-tier-royale)",
    subColor: "var(--color-tier-royale-sub)",
    img: "/img/Y.avif",
    url: "https://docs.google.com/forms/d/e/1FAIpQLScQfsnO2xAn2_6HeFo4kghgGDsYjoyk57KowrEsRyrBtYE0LQ/viewform?usp=pp_url&entry.1319398696=%E8%B2%B4%E8%B3%93%E7%A5%A8+$NTD:+5000+(6/30%E6%88%AA%E6%AD%A2)",
    closeTime: "2026-06-30T23:59:59+08:00",
    price: "NT$ 5,000",
  },
];

// Matrix mapping features to their availability across [budget, standard, sponsor, royale] tiers
const featuresList = [
  { key: "badge", availability: [true, true, true, true] },
  { key: "pin", availability: [false, true, true, true] },
  { key: "postcard", availability: [false, true, true, true] },
  { key: "folder", availability: [false, false, true, true] },
  { key: "bag", availability: [false, false, true, true] },
  { key: "keychain", availability: [false, false, true, true] },
  { key: "standee", availability: [false, false, true, true] },
  { key: "thanks", availability: [false, false, true, true] },
  { key: "intro_thx", availability: [false, false, true, true] },
  { key: "intro_detail", availability: [false, false, false, true] },
  { key: "discord", availability: [false, false, true, true] },
  { key: "mug", availability: [false, false, false, true] },
  { key: "coaster", availability: [false, false, false, true] },
  { key: "tshirt", availability: [false, false, false, true] },
  { key: "speech", availability: [false, false, false, true] },
];

/**
 * Track hovered cell inside comparison table
 */
const onCellMouseEnter = (rowIndex: number, colIndex: number) => {
  isHovering.value = true;
  activeRowIndex.value = rowIndex;
  activeColIndex.value = colIndex;
};

/**
 * Track hovered row inside comparison table
 */
const onRowMouseEnter = (rowIndex: number) => {
  isHovering.value = true;
  activeRowIndex.value = rowIndex;
  activeColIndex.value = null;
};

/**
 * Track hovered column header inside comparison table
 */
const onHeaderMouseEnter = (colIndex: number) => {
  isHovering.value = true;
  activeRowIndex.value = null;
  activeColIndex.value = colIndex;
};

/**
 * Reset hover tracking states on mouse exit
 */
const onMouseLeave = () => {
  isHovering.value = false;
  activeRowIndex.value = null;
  activeColIndex.value = null;
};
</script>

<template>
  <PageLayout>
    <template #title>
      <h1>{{ $t("ticket.title") }}</h1>
      <p>{{ $t("ticket.subtitle") }}</p>
    </template>

    <template #surface>
      <div
        v-if="
          isTierClosed(tiers.find((tier) => tier.id === 'royale')?.closeTime)
        "
        class="ticket-status-banner"
      >
        <i class="fa-solid fa-circle-exclamation"></i>
        <span>{{ $t("ticket.royaleClosedBanner") }}</span>
      </div>
      <div class="btn">
        <button class="sectionbtn" @click="toggleMode">
          {{
            currentMode === "detailed"
              ? $t("ticket.viewTable")
              : $t("ticket.viewDetailed")
          }}
        </button>
      </div>

      <!-- Detailed vs. Table View transition switcher -->
      <Transition name="fade-slide" mode="out-in">
        <!-- Detailed View (Card List) -->
        <div
          v-if="currentMode === 'detailed'"
          id="section1"
          class="section show"
        >
          <a
            v-for="(tier, index) in tiers"
            :key="tier.id"
            :href="isTierClosed(tier.closeTime) ? undefined : tier.url"
            :target="isTierClosed(tier.closeTime) ? undefined : '_blank'"
            class="block-link"
            :class="{ 'is-disabled': isTierClosed(tier.closeTime) }"
            :aria-disabled="isTierClosed(tier.closeTime)"
          >
            <div
              class="block"
              :style="{ color: tier.color }"
              :class="{ 'is-closed': isTierClosed(tier.closeTime) }"
            >
              <!-- Ribbon Banner for Royale card if closed -->
              <div v-if="isTierClosed(tier.closeTime)" class="ribbon-closed">
                <span>{{ $t("ticket.closed") }}</span>
              </div>
              <img
                :src="tier.img"
                :alt="$t(`ticket.tiers.${tier.id}`)"
                class="ticket-img"
              />
              <div class="ticket-text">
                <div class="ticket-title">
                  {{ $t(`ticket.tiers.${tier.id}`) }}
                </div>
                <div class="description">
                  <div class="desc-top">
                    <span :style="{ color: tier.subColor }">{{
                      $t(`ticket.descriptions.${tier.id}`)
                    }}</span>
                  </div>
                  <div class="desc-bottom">
                    {{ $t("ticket.includes")
                    }}{{
                      featuresList
                        .filter((f) => f.availability[index])
                        .map((f) => $t(`ticket.features.${f.key}`))
                        .join(isEn ? ", " : "、")
                    }}
                  </div>
                </div>
              </div>
              <div class="ticket-price">{{ tier.price }}</div>
            </div>
          </a>
        </div>

        <!-- Table View (Comparison Grid) -->
        <div
          v-else-if="currentMode === 'table'"
          id="section2"
          class="section show"
        >
          <div class="compare-wrap">
            <table
              :class="['compare-table', { 'is-hovering': isHovering }]"
              @mouseleave="onMouseLeave"
            >
              <thead>
                <tr>
                  <th scope="col" class="feature-head"></th>
                  <th
                    v-for="(tier, index) in tiers"
                    :key="tier.id"
                    scope="col"
                    class="tier-head"
                    :class="{
                      'active-col': activeColIndex === index,
                      'is-closed-col': isTierClosed(tier.closeTime),
                    }"
                    @mouseenter="onHeaderMouseEnter(index)"
                  >
                    <span :class="['tier-label', tier.id]">{{
                      $t(`ticket.tiers.${tier.id}`)
                    }}</span>
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
                    scope="row"
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
                        'is-closed-col': isTierClosed(tiers[cIndex]?.closeTime),
                      },
                    ]"
                    @mouseenter="onCellMouseEnter(rIndex, cIndex)"
                  >
                    {{ avail ? "✔" : "✖" }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Transition>
    </template>
  </PageLayout>
</template>

<style scoped>
.block-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.block {
  height: 100%;
}

/* Mode Switch Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ===== 按鈕 ===== */
.btn {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.9rem;
  margin: 0 auto 1.5rem;
  transition: all 0.2s ease-out;
}

.sectionbtn {
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 9.5rem;
  padding: 0.75em 1.5em;
  font-size: 1rem;
  color: var(--color-gold-hover);
  background: linear-gradient(
    180deg,
    rgba(110, 64, 145, 0.85),
    rgba(66, 34, 86, 0.92)
  );
  border: 1px solid rgba(239, 200, 120, 0.62);
  border-radius: 999px;
  cursor: pointer;
  box-shadow:
    inset 0 0 0 1px rgba(255, 244, 220, 0.08),
    0 6px 18px rgba(0, 0, 0, 0.24);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background-color 0.18s ease;
}

.sectionbtn:hover {
  transform: translateY(-2px);
  box-shadow:
    inset 0 0 0 1px rgba(255, 244, 220, 0.14),
    0 10px 24px rgba(0, 0, 0, 0.28),
    0 0 16px rgba(255, 218, 136, 0.1);
}

.sectionbtn:active {
  transform: translateY(1px);
  box-shadow:
    inset 0 0 0 1px rgba(255, 244, 220, 0.08),
    0 4px 10px rgba(0, 0, 0, 0.2);
}

.section {
  transition: all 0.3s ease-out;
}

.hidden {
  display: none;
  pointer-events: none;
}

.show {
  position: relative;
}

/* ===== 票卡 ===== */
#section1.show {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
  align-items: stretch;
}

#section2.show {
  display: block;
}

.block {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.9rem;
  min-height: 24rem;
  padding: 1.5rem 1.35rem 1.25rem;
  margin: 0;
  border-radius: 1.7rem;
  border: 2px solid color-mix(in srgb, currentColor 62%, #f1d38c 38%);
  background: linear-gradient(
    180deg,
    rgba(255, 246, 227, 0.8),
    rgba(248, 239, 221, 0.9)
  );
  color: var(--color-paper-text);
  box-shadow:
    inset 0 0 0 2px rgba(163, 112, 45, 0.12),
    inset 0 0 30px rgba(255, 255, 255, 0.28),
    0 10px 28px rgba(0, 0, 0, 0.18);
  overflow: hidden;
  transition: all 0.2s ease-out;
}

.block::before {
  content: "";
  position: absolute;
  inset: 10px;
  border-radius: 1.25rem;
  border: 1px solid rgba(164, 120, 57, 0.26);
  pointer-events: none;
}

.block::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.46), transparent 34%),
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.12),
      transparent 20%,
      transparent 80%,
      rgba(148, 108, 54, 0.06)
    );
  opacity: 1;
}

.block:hover {
  transform: translateY(-3px);
  cursor: pointer;
  background: linear-gradient(
    180deg,
    rgba(243, 218, 108, 0.8),
    rgba(255, 248, 183, 0.9)
  );
  box-shadow:
    inset 0 0 0 2px rgba(163, 112, 45, 0.16),
    inset 0 0 30px rgba(255, 255, 255, 0.28),
    0 18px 40px rgba(0, 0, 0, 0.24),
    0 0 26px color-mix(in srgb, currentColor 18%, transparent);
}

.block:active {
  transform: translateY(2px);
  background: linear-gradient(
    180deg,
    rgba(255, 213, 176, 0.8),
    rgba(255, 228, 213, 0.9)
  );
  box-shadow:
    inset 0 0 0 2px rgba(163, 112, 45, 0.12),
    inset 0 0 30px rgba(255, 255, 255, 0.28),
    0 10px 28px rgba(0, 0, 0, 0.18);
}

.ticket-img {
  position: relative;
  z-index: 1;
  width: auto;
  height: 6.25rem;
  margin: 0 auto 0.2rem;
  object-fit: contain;
  flex-shrink: 0;
  color: color-mix(in srgb, currentColor 58%, white 42%);
  filter: drop-shadow(0 0 10px currentColor)
    drop-shadow(0 0 20px color-mix(in srgb, currentColor 45%, transparent));
  transition: all 0.2s ease-out;
  animation-play-state: paused;
}

.block:hover .ticket-img {
  animation: wiggle 1.5s infinite ease;
}

@keyframes wiggle {
  0% {
    transform: translateY(0px) scale(1) rotate(-4deg);
  }
  25% {
    transform: translateY(-2px) scale(1.04) rotate(4deg);
  }
  50% {
    transform: translateY(2px) scale(1.1) rotate(-4deg);
  }
  75% {
    transform: translateY(-2px) scale(1.04) rotate(4deg);
  }
  100% {
    transform: translateY(0px) scale(1) rotate(-4deg);
  }
}

.ticket-text {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  text-align: center;
  font-weight: 600;
  transition: all 0.2s ease-out;
}

.ticket-title {
  width: 100%;
  margin-bottom: 0.25rem;
  font-size: clamp(1.6rem, 2vw, 2rem);
  line-height: 1.2;
  text-align: center;
  color: color-mix(in srgb, currentColor 65%, #6a4b22 35%);
  letter-spacing: 0.08em;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.42);
}

.ticket-title::after {
  content: "";
  display: block;
  width: 5.5rem;
  height: 1px;
  margin: 0.55rem auto 0;
  background: linear-gradient(90deg, transparent, currentColor, transparent);
  opacity: 0.55;
}

.description {
  width: 100%;
  margin-top: 0.3rem;
  font-size: 1.04rem;
  line-height: 1.7;
  color: var(--color-paper-text);
}

.desc-top {
  text-align: center;
  width: 100%;
  margin-bottom: 0.45rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.desc-bottom {
  width: 100%;
  max-width: 26em;
  margin: 0 auto;
  text-align: center;
  word-break: break-word;
}

.ticket-price {
  position: relative;
  z-index: 1;
  margin-top: auto;
  font-size: clamp(1.5rem, 2vw, 1.9rem);
  line-height: 1.1;
  text-align: center;
  white-space: nowrap;
  font-weight: 1000;
  color: color-mix(in srgb, currentColor 72%, #7a5626 28%);
  text-shadow:
    0 0 5px rgba(255, 245, 225, 0.7),
    0 0 10px rgba(255, 240, 218, 0.5),
    0 0 20px rgba(255, 251, 238, 0.3);
}

/* ===== 比較表 ===== */
.compare-wrap {
  max-width: 1040px;
  margin: 1rem auto 0.4rem;
  padding: 0;
  border-radius: 10px;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  background: var(--color-paper-bg);
  border: 1px solid rgba(120, 85, 40, 0.25);
  box-shadow:
    0 10px 26px rgba(0, 0, 0, 0.28),
    inset 0 0 18px rgba(120, 80, 30, 0.12);
}

.compare-table {
  position: relative;
  min-width: 600px;
  width: 100%;
  padding: 1.6rem 1.4rem;
  background:
    radial-gradient(circle at 0% 0%, rgba(90, 60, 20, 0.18), transparent 38%),
    radial-gradient(circle at 100% 0%, rgba(90, 60, 20, 0.14), transparent 38%),
    radial-gradient(circle at 0% 100%, rgba(90, 60, 20, 0.12), transparent 38%),
    radial-gradient(
      circle at 100% 100%,
      rgba(90, 60, 20, 0.18),
      transparent 38%
    ),
    repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.025) 0px,
      rgba(0, 0, 0, 0.025) 1px,
      transparent 1px,
      transparent 3px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.02) 0px,
      rgba(0, 0, 0, 0.02) 1px,
      transparent 1px,
      transparent 5px
    ),
    var(--color-paper-bg-gradient);
  border-collapse: collapse;
  table-layout: fixed;
  color: var(--color-paper-text);
}

.compare-table thead th {
  padding-top: 0;
  padding-bottom: 0.25rem;
  border-bottom: 2px solid rgba(137, 97, 43, 0.24);
}

.feature-head {
  width: 30%;
  transition: all 0.2s ease-out;
}

.tier-head {
  height: 4.5rem;
  padding-bottom: 10px;
  position: relative;
  vertical-align: bottom;
  text-align: center;
}

.tier-label {
  position: absolute;
  left: 50%;
  bottom: 1.5rem;
  transform: translateX(-50%) rotate(-32deg);
  transform-origin: center bottom;
  white-space: nowrap;
  font-size: clamp(1rem, 2vw, 1.35rem);
  font-weight: 800;
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.32);
  pointer-events: none;
}

.tier-label.budget {
  color: var(--color-tier-budget-dark);
}
.tier-label.standard {
  color: var(--color-tier-standard-dark);
}
.tier-label.sponsor {
  color: var(--color-tier-sponsor-dark);
}
.tier-label.royale {
  color: var(--color-tier-royale-dark);
}

.compare-table td.col-1.yes {
  color: var(--color-tier-budget-dark);
}
.compare-table td.col-2.yes {
  color: var(--color-tier-standard-dark);
}
.compare-table td.col-3.yes {
  color: var(--color-tier-sponsor-dark);
}
.compare-table td.col-4.yes {
  color: var(--color-tier-royale-dark);
}

.compare-table tbody tr {
  border-bottom: 1px solid rgba(137, 97, 43, 0.16);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease,
    background-color 0.2s ease;
}

.feature-name {
  text-indent: 1em;
  text-align: left;
  padding: 0.8rem 0.8rem;
  font-size: clamp(1rem, 2vw, 1.35rem);
  font-weight: 800;
  line-height: 1.3;
  word-break: break-word;
  color: var(--color-paper-text-muted);
}

.compare-table td {
  text-align: center;
  padding: 0.7rem 0.35rem;
  font-size: 1.12rem;
  font-weight: 700;
  color: var(--color-paper-text);
  transition:
    opacity 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
}

.compare-table td,
.compare-table th {
  position: relative;
}

.compare-table td:not(:first-child),
.compare-table thead th:not(:first-child) {
  width: 2.9em;
}

.compare-table td.yes {
  text-shadow: 0 0 8px currentColor;
  font-size: clamp(1.1rem, 2vw, 1.4rem);
}

.compare-table td.no {
  color: var(--color-paper-text-muted);
  font-size: clamp(1.1rem, 2vw, 1.4rem);
}

.compare-table.is-hovering tbody td,
.compare-table.is-hovering tbody th {
  opacity: 0.25;
}

.compare-table.is-hovering thead th {
  opacity: 0.25;
}

.compare-table.is-hovering thead th.active-col:not(.is-closed-col) {
  opacity: 1;
}

.compare-table.is-hovering .active-row,
.compare-table.is-hovering .active-row td:not(.is-closed-col),
.compare-table.is-hovering .active-row th:not(.is-closed-col),
.compare-table.is-hovering .active-col:not(.is-closed-col) {
  opacity: 1;
}

.compare-table.is-hovering .active-row {
  background: rgba(188, 139, 46, 0.08);
}

.compare-table.is-hovering td.active-col:not(.is-closed-col),
.compare-table.is-hovering th.active-col:not(.is-closed-col) {
  background: rgba(157, 112, 41, 0.06);
}

.compare-table.is-hovering .active-row .feature-name {
  color: var(--color-paper-text-dark);
}

.compare-table.is-hovering .active-col .tier-label {
  opacity: 1;
  text-shadow:
    0 0 6px currentColor,
    0 0 14px rgba(255, 255, 255, 0.18);
}

/* ===== 平板 ===== */
@media screen and (max-width: 1100px) {
  .container {
    width: min(100vw - 28px, 980px);
    padding: 0.8rem;
  }

  #section1.show {
    grid-template-columns: 1fr 1fr;
  }

  .block {
    min-height: 22rem;
  }

  .desc-bottom {
    max-width: none;
  }
}

/* ===== 手機 ===== */
@media screen and (max-width: 800px) {
  .container {
    width: calc(100vw - 12px);
    margin: 0.35rem auto;
    padding: 0.35rem;
    border-radius: 1rem;
  }

  .border {
    min-height: auto;
    padding: 0.3rem;
    border-width: 2px;
    border-radius: 0.9rem;
  }

  .border .border {
    padding: 0.25rem;
    border-radius: 0.7rem;
  }

  h1 {
    margin-top: 0.5em;
  }

  h1::before,
  h1::after {
    margin: 0 0.22em;
  }

  h2 {
    margin-bottom: 1rem;
    padding: 0 0.6rem;
  }

  .btn {
    gap: 0.65rem;
    margin-bottom: 1rem;
  }

  .sectionbtn {
    width: min(100%, 15rem);
    min-width: 0;
    padding: 0.78em 1.1em;
    font-size: 0.95rem;
  }

  #section1.show {
    grid-template-columns: 1fr;
    gap: 0.9rem;
  }

  .block {
    min-height: unset;
    padding: 1.15rem 1rem 1rem;
    border-radius: 1.25rem;
  }

  .ticket-img {
    height: 5rem;
  }

  .ticket-title {
    font-size: 1.45rem;
  }

  .description {
    font-size: 0.97rem;
    line-height: 1.65;
  }

  .desc-top {
    margin-bottom: 0.35rem;
  }

  .desc-bottom {
    text-align: left;
  }

  .ticket-price {
    font-size: 1.45rem;
  }

  /* compare-table 保持表格，只做橫向滑動 */
  .compare-wrap {
    padding: 0;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
  }

  .compare-table {
    min-width: 600px;
    padding: 0.7rem;
  }

  .compare-table thead {
    display: table-header-group;
  }

  .compare-table tbody {
    display: table-row-group;
  }

  .compare-table tr {
    display: table-row;
  }

  .compare-table th,
  .compare-table td {
    display: table-cell;
  }

  .feature-name {
    padding: 0.55rem 0.45rem;
    font-size: 0.92rem;
    text-align: left;
    border-bottom: none;
    margin-bottom: 0;
  }

  .compare-table td {
    padding: 0.45rem 0.2rem;
    font-size: 0.95rem;
    font-weight: 700;
    border-bottom: none;
  }

  .compare-table td::before {
    content: none;
  }

  .compare-table td.yes,
  .compare-table td.no {
    font-size: 0.95rem;
  }

  .tier-head {
    height: 3.8rem;
  }

  .tier-label {
    bottom: 1.2rem;
    font-size: 0.85rem;
    transform: translateX(-50%) rotate(-28deg);
  }

  .compare-table td:not(:first-child),
  .compare-table thead th:not(:first-child) {
    width: 2.4em;
  }

  .compare-table.is-hovering tbody tr,
  .compare-table.is-hovering tbody td,
  .compare-table.is-hovering tbody th,
  .compare-table.is-hovering thead th {
    opacity: 1;
  }
}

/* ===== 超大螢幕 ===== */
@media screen and (min-width: 1400px) {
  .container {
    width: min(1320px, calc(100vw - 80px));
  }

  #section1.show {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .block {
    min-height: 26rem;
  }

  .ticket-img {
    height: 5.8rem;
  }

  .feature-head {
    width: 36%;
  }
}

/* ===== Expired Ticket Banner & Ribbon ===== */
.ticket-status-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  margin: 0 auto 1.5rem;
  padding: 0.75rem 1.5rem;
  width: fit-content;
  max-width: 90%;
  background: linear-gradient(
    135deg,
    rgba(183, 28, 28, 0.35),
    rgba(127, 0, 0, 0.45)
  );
  border: 1px solid rgba(211, 47, 47, 0.5);
  border-radius: 0.75rem;
  color: #ffcdd2;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ribbon-closed {
  position: absolute;
  top: 1.2rem;
  right: -2.6rem;
  background: linear-gradient(135deg, #d32f2f, #b71c1c);
  color: #fff;
  text-align: center;
  font-weight: 700;
  font-size: 0.95rem;
  line-height: 1.5;
  padding: 0.15rem 2.8rem;
  transform: rotate(45deg);
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.block-link.is-disabled {
  cursor: not-allowed;
}

.block-link.is-disabled .block {
  opacity: 0.65;
  filter: grayscale(0.5);
}

.block-link.is-disabled .block:hover {
  transform: none;
  background: linear-gradient(
    180deg,
    rgba(255, 246, 227, 0.8),
    rgba(248, 239, 221, 0.9)
  );
  box-shadow:
    inset 0 0 0 2px rgba(163, 112, 45, 0.12),
    inset 0 0 30px rgba(255, 255, 255, 0.28),
    0 10px 28px rgba(0, 0, 0, 0.18);
}

.block-link.is-disabled .block:hover .ticket-img {
  animation: none;
  transform: none;
}

/* Compare table closed tier styles */
.compare-table thead th.is-closed-col,
.compare-table tbody td.is-closed-col {
  opacity: 0.35;
  filter: grayscale(0.5);
}
</style>
