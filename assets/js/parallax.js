document.addEventListener("DOMContentLoaded", () => {
    const isMobile = () => window.innerWidth <= 800;

    const layers = [
        {
            el: document.querySelector(".bg1 img"),
            start: 0,
            end: 100,
            mobileStart: 0,
            mobileEnd: 100,
            scale: 1,
            mobileScale: 1,
            x: "-50%",
            mobileX: "-50%"
        },
        {
            el: document.querySelector(".bg2 img"),
            start: -15,
            end: 105,
            mobileStart: -5,
            mobileEnd: 90,
            scale: 1,
            mobileScale: 1.1,
            x: "-50%",
            mobileX: "-50%"
        },
        {
            el: document.querySelector(".bg3 img"),
            start: 40,
            end: 90,
            mobileStart: 25,
            mobileEnd: 80,
            scale: 1,
            mobileScale: 1,
            x: "-50%",
            mobileX: "0"
        }
    ].filter(layer => layer.el);

    function setupSizes() {
        const mobile = isMobile();
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        layers.forEach(layer => {
            const img = layer.el;
            const scale = mobile ? layer.mobileScale : layer.scale;
            const ratio = img.naturalHeight / img.naturalWidth || 1;

            let w = vw * scale;
            let h = w * ratio;

            if (h < vh) {
                h = vh * scale;
                w = h / ratio;
            }

            img._movable = Math.max(0, h - vh);
            img.style.width = `${w}px`;
            img.style.height = `${h}px`;
            img.style.willChange = "transform";
        });
    }

    function updateParallax() {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
        const mobile = isMobile();

        layers.forEach(layer => {
            const img = layer.el;

            const start = mobile ? layer.mobileStart : layer.start;
            const end = mobile ? layer.mobileEnd : layer.end;
            const x = mobile ? layer.mobileX : layer.x;

            const percent = start + (end - start) * progress;
            const y = -img._movable * (percent / 100);

            img.style.transform = `translate3d(${x}, ${y}px, 0)`;
        });
    }

    let scrollTicking = false;
    let resizeTimer = null;

    function requestUpdate() {
        if (scrollTicking) return;

        scrollTicking = true;

        requestAnimationFrame(() => {
            updateParallax();
            scrollTicking = false;
        });
    }

    function requestResizeUpdate() {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {
            setupSizes();
            updateParallax();
        }, 120);
    }

    function initParallax() {
        setupSizes();
        updateParallax();
    }

    Promise.all(
        layers.map(layer => {
            const img = layer.el;

            if (img.complete && img.naturalWidth > 0) {
                return Promise.resolve();
            }

            return new Promise(resolve => {
                img.addEventListener("load", resolve, { once: true });
                img.addEventListener("error", resolve, { once: true });
            });
        })
    ).then(initParallax);

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestResizeUpdate);

    initParallax();
});