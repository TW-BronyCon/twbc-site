<script setup lang="ts">
type SectionId = 'introduction' | 'coc' | 'mascot' | 'thanks'

const { t, tm, rt, locale } = useI18n()
const route = useRoute()
const router = useRouter()

useHead(() => ({
  title: t('about.title')
}))

const copyButtonText = ref('')

function resetCopyText() {
  copyButtonText.value = t('about.copy')
}

onMounted(() => {
  resetCopyText()
})

watch(() => locale.value, resetCopyText)

async function copyCurrentUrl() {
  try {
    await navigator.clipboard.writeText(window.location.href)

    copyButtonText.value = t('about.copied')

    setTimeout(resetCopyText, 2000)
  }
  catch {
    copyButtonText.value = t('about.copyFailed')

    setTimeout(resetCopyText, 2000)
  }
}

const selectedSection = ref<SectionId | null>(null)

const papers = computed(() => [
  {
    id: 'introduction' as SectionId,
    title: t('about.papers.introduction.title'),
    desc: t('about.papers.introduction.desc')
  },
  {
    id: 'coc' as SectionId,
    title: t('about.papers.coc.title'),
    desc: t('about.papers.coc.desc')
  },
  {
    id: 'mascot' as SectionId,
    title: t('about.papers.mascot.title'),
    desc: t('about.papers.mascot.desc')
  },
  {
    id: 'thanks' as SectionId,
    title: t('about.papers.thanks.title'),
    desc: t('about.papers.thanks.desc')
  }
])

function isSectionId(value: unknown): value is SectionId {
  return (
    value === 'introduction' ||
    value === 'coc' ||
    value === 'mascot' ||
    value === 'thanks'
  )
}

function list(key: string): string[] {
  const value = tm(key)

  if (!Array.isArray(value)) {
    return []
  }

  return value.map(item => rt(item))
}

async function openPaper(id: SectionId) {
  selectedSection.value = id

  await router.push({
    query: {
      ...route.query,
      id
    }
  })

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

async function closePaper() {
  selectedSection.value = null

  const query = {
    ...route.query
  }

  delete query.id

  await router.push({
    query
  })

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

watch(
  () => route.query.id,
  (id) => {
    selectedSection.value = isSectionId(id)
      ? id
      : null
  },
  { immediate: true }
)
</script>

<template>
  <div class="page-wrap">
    <div
      id="boardView"
      class="board-view"
      :class="selectedSection ? 'hidden' : 'active'"
      :style="{ display: selectedSection ? 'none' : 'block' }"
    >
      <div class="wood-board">
        <h1>{{ t('about.title') }}</h1>

        <h2>{{ t('about.boardTitle') }}</h2>

        <p>{{ t('about.boardDesc') }}</p>

        <div class="wish-paper-grid">
          <button
            v-for="paper in papers"
            :key="paper.id"
            class="wish-paper"
            type="button"
            @click="openPaper(paper.id)"
          >
            <span class="wish-paper-title">
              {{ paper.title }}
            </span>

            <span class="wish-paper-desc">
              {{ paper.desc }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <div
      id="paperView"
      class="paper-view"
      :class="selectedSection ? 'active' : 'hidden'"
      :style="{ display: selectedSection ? 'block' : 'none' }"
    >
      <div class="full-paper">
        <div class="paper-topbar">
          <button
            class="back-btn"
            type="button"
            @click="closePaper"
          >
            {{ t('about.back') }}
          </button>

          <button
            class="copy-btn"
            type="button"
            @click="copyCurrentUrl"
          >
            {{ copyButtonText }}
          </button>
        </div>

        <div id="paperContent">
          <div
            v-if="selectedSection === 'introduction'"
            class="section"
          >
            <div class="block">
              <h2>{{ t('about.sections.introduction.title') }}</h2>

              <h4>{{ t('about.sections.introduction.whatTitle') }}</h4>

              <p
                v-for="item in list('about.sections.introduction.what')"
                :key="item"
              >
                {{ item }}
              </p>

              <h4>{{ t('about.sections.introduction.specialTitle') }}</h4>

              <p
                v-for="item in list('about.sections.introduction.special')"
                :key="item"
              >
                {{ item }}
              </p>

              <p>
                {{ t('about.sections.introduction.singAlongText') }}
                <br>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSenT_SECm3wHZWBY3VyB-UZjvy8lTBBmJEqrcJJYaxKmHNouw/viewform?usp=header"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ t('about.sections.introduction.singAlongLink') }}
                </a>
              </p>

              <h4>{{ t('about.sections.introduction.themeTitle') }}</h4>

              <p
                v-for="item in list('about.sections.introduction.theme')"
                :key="item"
              >
                {{ item }}
              </p>

              <h2>{{ t('about.sections.introduction.buildTitle') }}</h2>

              <p
                v-for="item in list('about.sections.introduction.build')"
                :key="item"
              >
                {{ item }}
              </p>

              <h4>{{ t('about.sections.introduction.communityTitle') }}</h4>

              <p>{{ t('about.sections.introduction.communityText') }}</p>

              <p>
                {{ t('about.sections.introduction.communityInvite1') }}
                <br>
                {{ t('about.sections.introduction.communityInvite2') }}
                <br>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSf1h5OaWHYf2cdqkEwWk_SWcNioLj89ilOAtr1g1sbupTPk1w/viewform?usp=header"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ t('about.sections.introduction.communityLink') }}
                </a>
              </p>

              <h4>{{ t('about.sections.introduction.vendorTitle') }}</h4>

              <p>{{ t('about.sections.introduction.vendorText') }}</p>

              <p>
                {{ t('about.sections.introduction.vendorInvite1') }}
                <br>
                {{ t('about.sections.introduction.vendorInvite2') }}
                <br>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSe_AH-DG67VmJxCAm8Dt07m8IosoE765XZKukSn5AIWN-HIvQ/viewform?usp=header"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ t('about.sections.introduction.vendorLink') }}
                </a>
              </p>

              <h4>{{ t('about.sections.introduction.mascotTitle') }}</h4>

              <p>
                {{ t('about.sections.introduction.mascotText') }}
                <br>
                <button
                  class="copy-btn"
                  type="button"
                  @click="openPaper('mascot')"
                >
                  {{ t('about.sections.introduction.mascotLink') }}
                </button>
              </p>

              <h4>{{ t('about.sections.introduction.volunteerTitle') }}</h4>

              <p>{{ t('about.sections.introduction.volunteerText') }}</p>

              <p>
                {{ t('about.sections.introduction.volunteerInvite1') }}
                <br>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSc-oA7Cbqis71Azd_7ZF2i6e7OqMr9h5pXCwP8D7IZFfIiCFg/viewform?usp=header"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ t('about.sections.introduction.volunteerLink') }}
                </a>
              </p>

              <h2>{{ t('about.sections.introduction.invitationTitle') }}</h2>

              <p
                v-for="item in list('about.sections.introduction.invitation')"
                :key="item"
              >
                {{ item }}
              </p>

              <p style="text-align: center;">
                💌
              </p>

              <p
                v-for="item in list('about.sections.introduction.invitation2')"
                :key="item"
              >
                {{ item }}
              </p>

              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScQfsnO2xAn2_6HeFo4kghgGDsYjoyk57KowrEsRyrBtYE0LQ/viewform"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ t('about.sections.introduction.ticketLink') }}
              </a>
            </div>
          </div>

          <div
            v-else-if="selectedSection === 'coc'"
            class="section"
          >
            <div class="block">
              <h2>{{ t('about.sections.coc.title') }}</h2>

              <p
                v-for="item in list('about.sections.coc.intro')"
                :key="item"
              >
                {{ item }}
              </p>

              <h3
                v-for="rule in list('about.sections.coc.rules')"
                :key="rule"
              >
                {{ rule }}
              </h3>
            </div>
          </div>

          <div
            v-else-if="selectedSection === 'mascot'"
            class="section"
          >
            <div class="block">
              <h2>{{ t('about.sections.mascot.title') }}</h2>

              <img
                alt="Mascot"
                class="center-img"
                src="/img/Mascot.avif"
              >

              <h4>{{ t('about.sections.mascot.guardianTitle') }}</h4>

              <p>{{ t('about.sections.mascot.guardianText') }}</p>

              <h4>{{ t('about.sections.mascot.basicTitle') }}</h4>

              <p
                v-for="item in list('about.sections.mascot.basic')"
                :key="item"
              >
                {{ item }}
              </p>

              <h4>{{ t('about.sections.mascot.messageTitle') }}</h4>

              <p
                v-for="item in list('about.sections.mascot.message')"
                :key="item"
              >
                {{ item }}
              </p>
            </div>
          </div>

          <div
            v-else-if="selectedSection === 'thanks'"
            class="section"
          >
            <div class="block">
              <h2>{{ t('about.sections.thanks.title') }}</h2>

              <h4 style="text-align: right; margin-bottom: -2em;">
                {{ t('about.sections.thanks.volunteerTitle') }}
              </h4>

              <h5
                v-for="(item, index) in list('about.sections.thanks.volunteers')"
                :key="item"
              >
                {{ index + 1 }}. {{ item }}
              </h5>

              <br>

              <h4 style="text-align: right; margin-bottom: -2em;">
                {{ t('about.sections.thanks.specialTitle') }}
              </h4>

              <h5
                v-for="(item, index) in list('about.sections.thanks.special')"
                :key="item"
              >
                {{ index + 1 }}. {{ item }}
              </h5>

              <br>

              <h4 style="text-align: right; margin-bottom: -2em;">
                {{ t('about.sections.thanks.staffTitle') }}
              </h4>

              <h5
                v-for="(item, index) in list('about.sections.thanks.staff')"
                :key="item"
              >
                {{ index + 1 }}. {{ item }}
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="@/assets/css/font.css"></style>
<style src="@/assets/css/about.css"></style>