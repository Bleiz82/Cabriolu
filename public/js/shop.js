/* ============================================================
   shop.js  –  Oleificio Cabriolu · Shop Catalogue
   GSAP animations + card interactions
   ============================================================ */

(function () {
    "use strict";

    /* ----------------------------------------------------------
       0 · SETUP
    ---------------------------------------------------------- */
    gsap.registerPlugin(ScrollTrigger);
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ----------------------------------------------------------
       1 · HERO REVEAL
    ---------------------------------------------------------- */
    function initHero() {
        const hero = document.querySelector(".shop-hero");
        if (!hero || prefersReduce) return;

        const eyebrow = hero.querySelector(".shop-hero__eyebrow");
        const title = hero.querySelector(".shop-hero__title");
        const sub = hero.querySelector(".shop-hero__sub");

        const tl = gsap.timeline({ delay: 0.3 });

        if (eyebrow) tl.from(eyebrow, { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, 0);
        if (title) tl.from(title, { y: 40, opacity: 0, duration: 1, ease: "power3.out" }, 0.1);
        if (sub) tl.from(sub, { y: 30, opacity: 0, duration: 0.9, ease: "power3.out" }, 0.25);
    }

    /* ----------------------------------------------------------
       2 · PRODUCT CARDS — STAGGER REVEAL
    ---------------------------------------------------------- */
    function initCards() {
        const cards = gsap.utils.toArray(".shop-card");
        if (!cards.length || prefersReduce) return;

        // Batch animation per row for a nice cascade
        ScrollTrigger.batch(cards, {
            start: "top 88%",
            onEnter: (batch) => {
                gsap.from(batch, {
                    y: 60,
                    opacity: 0,
                    scale: 0.95,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: "power3.out"
                });
            },
            once: true
        });
    }

    /* ----------------------------------------------------------
       3 · CARD HOVER — IMAGE SCALE + BORDER GLOW
    ---------------------------------------------------------- */
    function initCardHovers() {
        if (prefersReduce) return;

        const cards = document.querySelectorAll(".shop-card");
        cards.forEach((card) => {
            const img = card.querySelector(".shop-card__img img");

            card.addEventListener("mouseenter", () => {
                if (img) gsap.to(img, { scale: 1.06, duration: 0.4, ease: "power2.out" });
                gsap.to(card, {
                    y: -6,
                    boxShadow: "0 12px 40px rgba(201,168,76,.15)",
                    borderColor: "rgba(201,168,76,.5)",
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            card.addEventListener("mouseleave", () => {
                if (img) gsap.to(img, { scale: 1, duration: 0.4, ease: "power2.out" });
                gsap.to(card, {
                    y: 0,
                    boxShadow: "0 0 0 rgba(201,168,76,0)",
                    borderColor: "rgba(201,168,76,.12)",
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }

    /* ----------------------------------------------------------
       4 · BADGE POP ANIMATION
    ---------------------------------------------------------- */
    function initBadges() {
        if (prefersReduce) return;

        const badges = gsap.utils.toArray(".shop-card__badge");
        badges.forEach((badge) => {
            gsap.from(badge, {
                scale: 0,
                opacity: 0,
                duration: 0.5,
                ease: "back.out(2.5)",
                scrollTrigger: {
                    trigger: badge.closest(".shop-card"),
                    start: "top 85%",
                    once: true
                }
            });
        });
    }

    /* ----------------------------------------------------------
       5 · BANNER — STAGGER ITEMS
    ---------------------------------------------------------- */
    function initBanner() {
        const items = gsap.utils.toArray(".shop-banner__item");
        if (!items.length || prefersReduce) return;

        gsap.from(items, {
            y: 40,
            opacity: 0,
            stagger: 0.1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".shop-banner",
                start: "top 82%",
                toggleActions: "play none none reverse"
            }
        });

        // Icons bounce
        const icons = gsap.utils.toArray(".shop-banner__icon");
        icons.forEach((icon, i) => {
            gsap.from(icon, {
                scale: 0,
                rotation: -10,
                duration: 0.5,
                delay: i * 0.1 + 0.3,
                ease: "back.out(2)",
                scrollTrigger: {
                    trigger: ".shop-banner",
                    start: "top 82%",
                    once: true
                }
            });
        });
    }

    /* ----------------------------------------------------------
       6 · PRODUCT PRICE — COUNT-UP ON SCROLL
    ---------------------------------------------------------- */
    function initPriceCountUp() {
        if (prefersReduce) return;

        const prices = gsap.utils.toArray(".shop-card__price strong");
        prices.forEach((el) => {
            const text = el.textContent.trim();
            const match = text.match(/€([\d,.]+)/);
            if (!match) return;

            const target = parseFloat(match[1].replace(",", "."));
            if (isNaN(target)) return;

            const obj = { val: 0 };
            gsap.to(obj, {
                val: target,
                duration: 1.5,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el.closest(".shop-card"),
                    start: "top 85%",
                    once: true
                },
                onUpdate: () => {
                    el.textContent = "€" + obj.val.toFixed(2).replace(".", ",");
                }
            });
        });
    }

    /* ----------------------------------------------------------
       7 · REDUCED MOTION FALLBACK
    ---------------------------------------------------------- */
    function reducedMotionFallback() {
        gsap.utils.toArray(
            ".shop-hero__eyebrow, .shop-hero__title, .shop-hero__sub, " +
            ".shop-card, .shop-card__badge, .shop-banner__item"
        ).forEach((el) => {
            el.style.opacity = "1";
            el.style.transform = "none";
        });
    }

    /* ----------------------------------------------------------
       8 · RESIZE
    ---------------------------------------------------------- */
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
    });

    /* ----------------------------------------------------------
       9 · INIT
    ---------------------------------------------------------- */
    function init() {
        if (prefersReduce) {
            reducedMotionFallback();
            return;
        }

        initHero();
        initCards();
        initCardHovers();
        initBadges();
        initBanner();
        initPriceCountUp();
    }

    /* ----------------------------------------------------------
       10 · BOOT
    ---------------------------------------------------------- */
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();
