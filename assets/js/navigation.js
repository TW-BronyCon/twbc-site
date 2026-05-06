document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.getElementById("navToggle");
    const topNav = document.getElementById("topNav");
    const groups = document.querySelectorAll(".top-nav .menu-group");

    if (!topNav) return;

    const DISABLE_TOPNAV_HIDE = true;

    topNav.classList.remove("hide");

    function closeAllSubmenus() {
        groups.forEach(group => group.classList.remove("open"));
    }

    /* =========================
       桌機：頂邊欄自動隱藏（已停用）
    ========================= */
    function initDesktopTopNav() {
        if (DISABLE_TOPNAV_HIDE) return;

        const HIDE_SCROLL = 490;
        const DELTA = 10;
        let lastScroll = window.scrollY;

        window.addEventListener("scroll", () => {
            if (window.innerWidth <= 800) return;

            const current = window.scrollY;
            if (Math.abs(current - lastScroll) < DELTA) return;

            if (current < HIDE_SCROLL) {
                topNav.classList.remove("hide");
            } else if (current > lastScroll) {
                topNav.classList.add("hide");
            } else {
                topNav.classList.remove("hide");
            }

            lastScroll = current;
        });
    }

    /* =========================
       手機：側邊欄 hamburger
    ========================= */
    if (navToggle) {
        function closeMobileNav() {
            navToggle.classList.remove("active");
            topNav.classList.remove("open");
            closeAllSubmenus();
        }

        navToggle.addEventListener("click", e => {
            e.stopPropagation();

            navToggle.classList.toggle("active");
            topNav.classList.toggle("open");
            topNav.classList.remove("hide");
        });

        topNav.addEventListener("click", e => {
            e.stopPropagation();
        });

        topNav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeMobileNav);
        });

        document.addEventListener("click", () => {
            closeAllSubmenus();

            if (window.innerWidth <= 800 && topNav.classList.contains("open")) {
                closeMobileNav();
            }
        });

        window.addEventListener("resize", () => {
            closeAllSubmenus();

            if (window.innerWidth > 800) {
                closeMobileNav();
            } else {
                topNav.classList.remove("hide");
            }
        });
    }

    /* =========================
       手機：submenu 點擊展開
    ========================= */
    groups.forEach(group => {
        const span = group.querySelector(":scope > span");
        if (!span) return;

        span.addEventListener("click", e => {
            if (window.innerWidth > 800) return;

            e.preventDefault();
            e.stopPropagation();

            const isOpen = group.classList.contains("open");

            closeAllSubmenus();

            if (!isOpen) {
                group.classList.add("open");
            }
        });
    });

    /* =========================
       桌機：submenu hover 展開
    ========================= */
    let activeGroup = null;
    let timer = null;

    function openGroup(group) {
        if (window.innerWidth <= 800) return;

        closeAllSubmenus();
        activeGroup = group;
        group.classList.add("open");
    }

    function startCloseTimer() {
        if (window.innerWidth <= 800) return;

        clearTimeout(timer);

        timer = setTimeout(() => {
            if (activeGroup) {
                activeGroup.classList.remove("open");
                activeGroup = null;
            }
        }, 200);
    }

    function cancelTimer() {
        clearTimeout(timer);
    }

    groups.forEach(group => {
        group.addEventListener("mouseenter", () => {
            openGroup(group);
            cancelTimer();
        });

        group.addEventListener("mouseleave", () => {
            startCloseTimer();
        });
    });

    initDesktopTopNav();
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