import { ref, onMounted, onUnmounted } from "vue";

export const useCountdown = (targetDateStr: string, endDateStr: string) => {
  const targetDate = new Date(targetDateStr);
  const endDate = new Date(endDateStr);

  const timeOffset = ref(0);
  const countdownMsg = ref("");
  const days = ref(0);
  const hours = ref(0);
  const minutes = ref(0);
  const seconds = ref(0);

  let countdownTimer: ReturnType<typeof setInterval> | null = null;

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

  function updateCountdown() {
    const now = new Date(Date.now() + timeOffset.value);

    if (now >= endDate) {
      countdownMsg.value = "eventEnded";
      return;
    }

    if (now >= targetDate) {
      countdownMsg.value = "eventStarted";
      return;
    }

    countdownMsg.value = "";
    const diff = targetDate.getTime() - now.getTime();

    days.value = Math.floor(diff / (1000 * 60 * 60 * 24));
    hours.value = Math.floor((diff / (1000 * 60 * 60)) % 24);
    minutes.value = Math.floor((diff / (1000 * 60)) % 60);
    seconds.value = Math.floor((diff / 1000) % 60);
  }

  onMounted(async () => {
    await syncTime();
    updateCountdown();
    countdownTimer = setInterval(updateCountdown, 1000);
  });

  onUnmounted(() => {
    if (countdownTimer) clearInterval(countdownTimer);
  });

  return {
    countdownMsg,
    days,
    hours,
    minutes,
    seconds,
  };
};
