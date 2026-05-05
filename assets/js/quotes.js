const quotes = [
    "「不管你做什麼，永遠都不會有萬事俱備的時候。」- Applejack",
    "「壞事就是會發生，但這並不代表你要放棄！」- Applejack",
    "「不要忘記你是誰。」- Fluttershy",
    "「不只是鞭策自己，而是朝著正確的方向鞭策自己。」- Rainbow Dash",
    "「恐懼並不可怕，放棄才是。」- Princess Luna",
    "「每個人都值得被原諒一次。」- Princess Celestia",
    "「你不需要完美，只需要做你自己。」- Starlight Glimmer",
    "「即使改變很難，也值得去嘗試。」- Sunset Shimmer",
    "「忠於自己，別讓別人定義你。」- Rainbow Dash",
    "「笑一笑，事情就會變好一點！」- Pinkie Pie",
    "「真正的美，來自你自己的內心。」- Rarity",
    "「誠實，才是最重要、最好的原則。」- Applejack",
    "「善良比任何力量都強大。」- Fluttershy",
    "「友情不總是簡單，但值得去守護。」- Twilight Sparkle",
    "「派對是交朋友最棒的方法！」- Pinkie Pie"
];

const QUOTE_HIDE_WIDTH = 800;

let remainingQuotes = [...quotes];
let quoteInterval = null;

function getRandomQuote() {
    if (remainingQuotes.length === 0) {
        remainingQuotes = [...quotes];
    }

    const index = Math.floor(Math.random() * remainingQuotes.length);
    const quote = remainingQuotes[index];
    remainingQuotes.splice(index, 1);
    return quote;
}

function resetQuoteStyle(el) {
    el.classList.remove("fade-in", "fade-out");
    el.style.opacity = "";
    el.style.transform = "";
}

function updateQuote() {
    const el = document.getElementById("quoteText");
    if (!el) return;

    if (window.innerWidth < QUOTE_HIDE_WIDTH) {
        el.textContent = "";
        resetQuoteStyle(el);
        return;
    }

    el.classList.remove("fade-in");
    el.classList.add("fade-out");

    setTimeout(() => {
        el.textContent = getRandomQuote();

        el.classList.remove("fade-in", "fade-out");
        el.style.opacity = "0";
        el.style.transform = "translateY(10px)";

        requestAnimationFrame(() => {
            el.style.opacity = "";
            el.style.transform = "";
            el.classList.add("fade-in");
        });
    }, 300);
}

function startQuoteRotation() {
    if (quoteInterval) return;

    updateQuote();
    quoteInterval = setInterval(updateQuote, 10000);
}

function stopQuoteRotation() {
    if (quoteInterval) {
        clearInterval(quoteInterval);
        quoteInterval = null;
    }

    const el = document.getElementById("quoteText");
    if (!el) return;

    el.textContent = "";
    resetQuoteStyle(el);
}

function handleResize() {
    if (window.innerWidth < QUOTE_HIDE_WIDTH) {
        stopQuoteRotation();
        return;
    }

    if (!quoteInterval) {
        startQuoteRotation();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    handleResize();
    window.addEventListener("resize", handleResize);
});