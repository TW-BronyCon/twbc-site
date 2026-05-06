document.addEventListener("DOMContentLoaded", () => {
    const isHomePage = document.querySelector('meta[name="page"]')?.content === "home";

    const urlParams = new URLSearchParams(location.search);
    const urlLang = urlParams.get("lang");

    if (urlLang === "zh-tw") localStorage.setItem("lang", "zh");
    if (urlLang === "en") localStorage.setItem("lang", "en");

    let currentLang = localStorage.getItem("lang") || "zh";

    function syncLangToURL() {
        const langValue = currentLang === "zh" ? "zh-tw" : "en";
        const url = new URL(window.location.href);
        url.searchParams.set("lang", langValue);
        history.replaceState({}, "", url);
    }

    syncLangToURL();

    if (!isHomePage) return;

    const topNav = document.getElementById("topNav");

    const box = document.createElement("div");
    box.id = "langSwitcher";
    box.className = "lang-switcher translucent";

    const langs = [
        { key: "zh", label: "中文" },
        { key: "en", label: "EN" }
    ];

    langs.forEach(item => {
        const btn = document.createElement("button");
        btn.textContent = item.label;
        btn.dataset.lang = item.key;

        btn.addEventListener("click", () => {
            currentLang = item.key;
            localStorage.setItem("lang", currentLang);
            syncLangToURL();
            updateButtons();
        });

        box.appendChild(btn);
    });

    function moveLangSwitcher() {
        if (window.innerWidth <= 800 && topNav) {
            box.classList.add("in-nav");
            topNav.appendChild(box);
        } else {
            box.classList.remove("in-nav");
            document.body.appendChild(box);
        }
    }

    function updateButtons() {
        box.querySelectorAll("button").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.lang === currentLang);
        });
    }

    moveLangSwitcher();
    updateButtons();

    window.addEventListener("resize", moveLangSwitcher);
});