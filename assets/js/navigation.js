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