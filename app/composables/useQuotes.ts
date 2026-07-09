import {
  ref,
  onMounted,
  onUnmounted,
  watch,
  toValue,
  type MaybeRefOrGetter,
} from "vue";

export const useQuotes = (
  quotesList: MaybeRefOrGetter<string[]>,
  intervalMs: number = 10000,
  initialValue: string = "",
) => {
  const currentQuote = ref(initialValue);
  const isQuoteFadingOut = ref(false);
  let quoteInterval: ReturnType<typeof setInterval> | null = null;
  let remainingQuotes: string[] = [];

  function getRandomQuote() {
    const list = toValue(quotesList);
    if (!list || list.length === 0) return "";

    if (remainingQuotes.length === 0) {
      remainingQuotes = [...list];
    }
    const index = Math.floor(Math.random() * remainingQuotes.length);
    const quote = remainingQuotes.splice(index, 1)[0];
    return quote || "";
  }

  function updateQuote(immediate = false) {
    const nextQuote = getRandomQuote();
    if (!nextQuote) return;

    if (immediate || currentQuote.value === initialValue) {
      currentQuote.value = nextQuote;
      return;
    }

    isQuoteFadingOut.value = true;
    setTimeout(() => {
      currentQuote.value = nextQuote;
      isQuoteFadingOut.value = false;
    }, 300);
  }

  // Watch for changes in the quotes list
  watch(
    () => toValue(quotesList),
    (newList) => {
      if (newList && newList.length > 0) {
        remainingQuotes = [...newList];
        if (currentQuote.value === initialValue) {
          updateQuote(true);
        }
      }
    },
    { immediate: true, deep: true },
  );

  onMounted(() => {
    if (currentQuote.value === initialValue) {
      updateQuote(true);
    }
    quoteInterval = setInterval(() => updateQuote(false), intervalMs);
  });

  onUnmounted(() => {
    if (quoteInterval) clearInterval(quoteInterval);
  });

  return {
    currentQuote,
    isQuoteFadingOut,
  };
};
