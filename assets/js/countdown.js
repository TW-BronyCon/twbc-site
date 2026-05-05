const targetDate = new Date('2026-08-15T00:00:00+08:00'); // 活動開始單位15號0點
targetDate.setHours(targetDate.getHours() + 10);           // 早上10點 0+10
const endDate = new Date('2026-08-16T00:00:00+08:00');    // 活動結束單位16號0點
endDate.setHours(endDate.getHours() - 3);                 // 晚上9點 24-3

let timeOffset = 0; // 網路時間 - 本機時間

async function syncTime() {
    try {
        const res = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=Asia/Taipei');
        const data = await res.json();

        const serverTime = new Date(data.dateTime);
        const localTime = new Date();

        timeOffset = serverTime - localTime;
        console.log("使用網路時間", data.dateTime);
    } catch (error) {
        timeOffset = 0;
        console.log("無法取得網路時間，改用本機時間");
        console.error(error);
    }
}

function getNow() {
    return new Date(Date.now() + timeOffset);
}

function renderMessage(text) {
    const countdown = document.getElementById('countdown');
    if (!countdown) return;
    countdown.innerHTML = `<span class="countdown-message">${text}</span>`;
}

function renderCountdown(days, hours, minutes, seconds) {
    const countdown = document.getElementById('countdown');
    if (!countdown) return;
    countdown.innerHTML = `
        <span id="days">${days}</span> 天
        <span id="hours">${hours}</span> 時
        <span id="minutes">${minutes}</span> 分
        <span id="seconds">${seconds}</span> 秒
    `;
}

function updateCountdown() {
    const now = getNow();

    if (now >= endDate) {
        renderMessage('活動已完結');
        return;
    }

    if (now >= targetDate) {
        renderMessage('盛會已奏響');
        return;
    }

    const diff = targetDate - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    renderCountdown(days, hours, minutes, seconds);
}

async function initCountdown() {
    await syncTime();
    updateCountdown();

    // 第一次畫面真的出來後，再通知 loader 可以關掉
    document.dispatchEvent(new Event("pageReady"));

    setInterval(updateCountdown, 1000);
}

initCountdown();