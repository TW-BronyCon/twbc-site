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


//版面隱藏
const toggleBtn = document.getElementById('layoutToggle');

            const notice = document.createElement('div');
            notice.textContent = '版面已隱藏，再次點擊logo來恢復';
            notice.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translate(-50%, -40px);
                opacity: 0;
                z-index: 99999;
                pointer-events: none;

                background: rgba(30, 30, 30, 0.65);
                color: #fff;
                padding: 10px 18px;
                border-radius: 14px;
                font-size: 14px;
                letter-spacing: .04em;

                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                border: 1px solid rgba(255,255,255,.18);
                box-shadow: 0 8px 24px rgba(0,0,0,.25);

                transition: opacity .35s ease, transform .35s ease;
            `;
            document.body.appendChild(notice);

            let noticeTimer = null;

            toggleBtn.addEventListener('click', () => {
                const isHidden = document.body.classList.toggle('layout-hidden');

                showNotice(
                    isHidden
                        ? '版面已隱藏，再次點擊logo來恢復'
                        : '版面已恢復'
                );
            });

            function showNotice(text) {
                notice.textContent = text;

                clearTimeout(noticeTimer);

                requestAnimationFrame(() => {
                    notice.style.opacity = '1';
                    notice.style.transform = 'translate(-50%, 0)';
                });

                noticeTimer = setTimeout(() => {
                    notice.style.opacity = '0';
                    notice.style.transform = 'translate(-50%, -40px)';
                }, 1500);
            }