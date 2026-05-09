import { ref, onMounted, onUnmounted } from 'vue'

export const useQuotes = (quotesList: string[], intervalMs: number = 10000) => {
  const currentQuote = ref('Loading...')
  const isQuoteFadingOut = ref(false)
  let quoteInterval: ReturnType<typeof setInterval> | null = null
  let remainingQuotes = [...quotesList]

  function getRandomQuote() {
    if (remainingQuotes.length === 0) {
      remainingQuotes = [...quotesList]
    }
    const index = Math.floor(Math.random() * remainingQuotes.length)
    const quote = remainingQuotes.splice(index, 1)[0]
    return quote || ''
  }

  function updateQuote() {
    isQuoteFadingOut.value = true
    setTimeout(() => {
      currentQuote.value = getRandomQuote()
      isQuoteFadingOut.value = false
    }, 300)
  }

  onMounted(() => {
    updateQuote()
    quoteInterval = setInterval(updateQuote, intervalMs)
  })

  onUnmounted(() => {
    if (quoteInterval) clearInterval(quoteInterval)
  })

  return {
    currentQuote,
    isQuoteFadingOut
  }
}
