/* ============================================================
   blog.js  –  Oleificio Cabriolu · Blog listing + article pages
   GSAP animations for cards, hero, article body
   ============================================================ */

(function () {
    "use strict";

    gsap.registerPlugin(ScrollTrigger);
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ----------------------------------------------------------
       1 · BLOG LISTING — HERO
    ---------------------------------------------------------- */
    function initBlogHero() {
        const hero = document.querySelector(".blog-hero");
        if (!hero || prefersReduce) return;

        const eyebrow = hero.querySelector(".blog-hero__eyebrow");
        const title = hero.querySelector(".blog-hero__title");
        const sub = hero.querySelector(".blog-hero__sub");

        const tl = gsap.timeline({ delay: 0.3 });
        if (eyebrow) tl.from(eyebrow, { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, 0);
        if (title) tl.from(title, { y: 40, opacity: 0, duration: 1, ease: "power3.out" }, 0.1);
        if (sub) tl.from(sub, { y: 30, opacity: 0, duration: 0.9, ease: "power3.out" }, 0.25);
    }

    /* ----------------------------------------------------------
       2 · BLOG CARDS — STAGGER BATCH
    ---------------------------------------------------------- */
    function initBlogCards() {
        const cards = gsap.utils.toArray(".blog-card");
        if (!cards.length || prefersReduce) return;

        ScrollTrigger.batch(cards, {
            start: "top 88%",
            onEnter: (batch) => {
                gsap.from(batch, {
                    y: 60,
                    opacity: 0,
                    scale: 0.97,
                    stagger: 0.08,
                    duration: 0.8,
                    ease: "power3.out"
                });
            },
            once: true
        });
    }

    /* ----------------------------------------------------------
       3 · BLOG CARD HOVER
    ---------------------------------------------------------- */
    function initCardHovers() {
        if (prefersReduce) return;

        document.querySelectorAll(".blog-card").forEach((card) => {
            const img = card.querySelector(".blog-card__img img");

            card.addEventListener("mouseenter", () => {
                if (img) gsap.to(img, { scale: 1.05, duration: 0.4, ease: "power2.out" });
                gsap.to(card, {
                    y: -4,
                    borderColor: "rgba(201,168,76,.4)",
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            card.addEventListener("mouseleave", () => {
                if (img) gsap.to(img, { scale: 1, duration: 0.4, ease: "power2.out" });
                gsap.to(card, {
                    y: 0,
                    borderColor: "rgba(255,255,255,.06)",
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }

    /* ----------------------------------------------------------
       4 · ARTICLE HERO (single article pages)
    ---------------------------------------------------------- */
    function initArticleHero() {
        const hero = document.querySelector(".art-hero");
        if (!hero || prefersReduce) return;

        const bg = hero.querySelector(".art-hero__bg img");
        const content = hero.querySelector(".art-hero__content");

        // Ken Burns on background
        if (bg) {
            gsap.from(bg, { scale: 1.1, duration: 2, ease: "power2.out" });
        }

        // Content entrance
        if (content) {
            const breadcrumb = content.querySelector(".art-hero__breadcrumb");
            const cat = content.querySelector(".art-hero__cat");
            const title = content.querySelector(".art-hero__title");
            const meta = content.querySelector(".art-hero__meta");

            const tl = gsap.timeline({ delay: 0.3 });
            if (breadcrumb) tl.from(breadcrumb, { y: 15, opacity: 0, duration: 0.6, ease: "power3.out" }, 0);
            if (cat) tl.from(cat, { y: 15, opacity: 0, duration: 0.6, ease: "power3.out" }, 0.1);
            if (title) tl.from(title, { y: 40, opacity: 0, duration: 1, ease: "power3.out" }, 0.2);
            if (meta) tl.from(meta, { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, 0.45);
        }
    }

    /* ----------------------------------------------------------
       5 · ARTICLE BODY — PROGRESSIVE REVEALS
    ---------------------------------------------------------- */
    function initArticleBody() {
        const body = document.querySelector(".art-body");
        if (!body || prefersReduce) return;

        // H2 headings
        gsap.utils.toArray(".art-body h2").forEach((h2) => {
            gsap.from(h2, {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: h2,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        // Highlight boxes
        gsap.utils.toArray(".art-highlight").forEach((box) => {
            gsap.from(box, {
                x: -40,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: box,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        // Stats
        const stats = gsap.utils.toArray(".art-stat");
        if (stats.length) {
            gsap.from(stats, {
                y: 40,
                opacity: 0,
                scale: 0.95,
                stagger: 0.1,
                duration: 0.7,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".art-stats",
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        }

        // Figures
        gsap.utils.toArray(".art-img").forEach((fig) => {
            gsap.from(fig, {
                y: 40,
                opacity: 0,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: fig,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        // CTA box
        const cta = document.querySelector(".art-cta");
        if (cta) {
            gsap.from(cta, {
                y: 50,
                opacity: 0,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: cta,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });

            const btn = cta.querySelector(".art-cta__btn");
            if (btn) {
                gsap.to(btn, {
                    boxShadow: "0 0 25px 6px rgba(201,168,76,.3)",
                    repeat: -1,
                    yoyo: true,
                    duration: 1.5,
                    ease: "sine.inOut"
                });
            }
        }

        // Tags
        const tags = gsap.utils.toArray(".art-tag");
        if (tags.length) {
            gsap.from(tags, {
                y: 15,
                opacity: 0,
                stagger: 0.05,
                duration: 0.5,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".art-tags",
                    start: "top 90%",
                    once: true
                }
            });
        }
    }

    /* ----------------------------------------------------------
       6 · RELATED ARTICLES — STAGGER
    ---------------------------------------------------------- */
    function initRelated() {
        const cards = gsap.utils.toArray(".art-related-card");
        if (!cards.length || prefersReduce) return;

        gsap.from(cards, {
            y: 50,
            opacity: 0,
            stagger: 0.12,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".art-related",
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });

        // Hover
        cards.forEach((card) => {
            const img = card.querySelector(".art-related-card__img img");
            card.addEventListener("mouseenter", () => {
                if (img) gsap.to(img, { scale: 1.05, duration: 0.4, ease: "power2.out" });
            });
            card.addEventListener("mouseleave", () => {
                if (img) gsap.to(img, { scale: 1, duration: 0.4, ease: "power2.out" });
            });
        });
    }

    /* ----------------------------------------------------------
       7 · REDUCED MOTION
    ---------------------------------------------------------- */
    function reducedMotionFallback() {
        gsap.utils.toArray(
            ".blog-hero__eyebrow, .blog-hero__title, .blog-hero__sub, .blog-card, " +
            ".art-hero__content, .art-body h2, .art-highlight, .art-stat, .art-img, " +
            ".art-cta, .art-tag, .art-related-card"
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

        // Blog listing
        initBlogHero();
        initBlogCards();
        initCardHovers();

        // Article pages
        initArticleHero();
        initArticleBody();
        initRelated();
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
