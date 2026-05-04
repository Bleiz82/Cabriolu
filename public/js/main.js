/* ============================================================
   main.js  –  Oleificio Cabriolu · Home animations
   Stack: GSAP 3 + ScrollTrigger + TextPlugin (CDN)
   Canvas frame‑scrubbing  ·  960 desktop / 879 mobile
   ============================================================ */

(function () {
    "use strict";

    /* ----------------------------------------------------------
       0 · GSAP plugins
    ---------------------------------------------------------- */
    gsap.registerPlugin(ScrollTrigger);

    /* ----------------------------------------------------------
       1 · CONSTANTS & HELPERS
    ---------------------------------------------------------- */
    const MOBILE_BP = 768;
    const isMobile = () => window.innerWidth <= MOBILE_BP;
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Frame config
    const FRAMES = {
        desktop: { total: 960, start: 1, path: "/img/frames/desktop/frame_", ext: ".webp" },
        mobile: { total: 879, start: 2, path: "/img/frames/mobile/frame_", ext: ".webp" }
    };

    function frameSrc(index) {
        const cfg = isMobile() ? FRAMES.mobile : FRAMES.desktop;
        const num = String(Math.max(cfg.start, Math.min(index + cfg.start, cfg.total + cfg.start - 1))).padStart(4, "0");
        return cfg.path + num + cfg.ext;
    }

    function totalFrames() {
        return isMobile() ? FRAMES.mobile.total : FRAMES.desktop.total;
    }

    /* ----------------------------------------------------------
       2 · CANVAS FRAME SCRUBBING
    ---------------------------------------------------------- */
    const canvas = document.getElementById("bc");
    const ctx = canvas ? canvas.getContext("2d") : null;
    const images = [];
    let loaded = 0;
    let current = { frame: 0 };

    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function drawFrame(idx) {
        if (!ctx || !images[idx]) return;
        const img = images[idx];
        const cw = canvas.width;
        const ch = canvas.height;
        const scale = Math.max(cw / img.width, ch / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    }

    function preloadFrames(onDone) {
        const total = totalFrames();
        images.length = 0;
        loaded = 0;

        for (let i = 0; i < total; i++) {
            const img = new Image();
            img.onload = img.onerror = () => {
                loaded++;
                if (loaded === total && typeof onDone === "function") onDone();
            };
            img.src = frameSrc(i);
            images[i] = img;
        }
    }

    /* ----------------------------------------------------------
       3 · SCROLL‑DRIVEN FRAME ANIMATION
    ---------------------------------------------------------- */
    function initFrameScrub() {
        if (!canvas || prefersReduce) return;
        resizeCanvas();

        const total = totalFrames();

        gsap.to(current, {
            frame: total - 1,
            snap: "frame",
            ease: "none",
            scrollTrigger: {
                trigger: "#hero",
                start: "top top",
                end: () => `+=${window.innerHeight * 6}`,
                pin: true,
                scrub: 0.5,
                invalidateOnRefresh: true,
                onUpdate: () => drawFrame(Math.round(current.frame))
            }
        });

        drawFrame(0);
    }

    /* ----------------------------------------------------------
       4 · HERO SECTION
    ---------------------------------------------------------- */
    function initHero() {
        const hero = document.querySelector(".hero");
        if (!hero) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "+=200%",
                scrub: 1,
                pin: false
            }
        });

        // Title reveal
        const title = hero.querySelector(".hero__title");
        if (title) {
            gsap.from(title, {
                y: 60,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
                delay: 0.3
            });
        }

        // Subtitle
        const subtitle = hero.querySelector(".hero__subtitle");
        if (subtitle) {
            gsap.from(subtitle, {
                y: 40,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                delay: 0.6
            });
        }

        // CTA buttons
        const ctas = hero.querySelectorAll(".hero__cta .btn");
        if (ctas.length) {
            gsap.from(ctas, {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
                stagger: 0.15,
                delay: 0.9
            });
        }

        // Stars + reviews
        const stars = hero.querySelector(".hero__stars");
        if (stars) {
            gsap.from(stars, {
                y: 20,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
                delay: 1.1
            });
        }

        // Hero content fade on scroll
        const content = hero.querySelector(".hero__content");
        if (content) {
            tl.to(content, { opacity: 0, y: -80, ease: "none" }, 0);
        }
    }

    /* ----------------------------------------------------------
       5 · PRODUCT SCENES (horizontal parallax cards)
    ---------------------------------------------------------- */
    function initProductScenes() {
        const section = document.querySelector(".product-scenes");
        if (!section) return;

        const panels = gsap.utils.toArray(".product-scenes__panel");
        if (!panels.length) return;

        // Horizontal scroll
        gsap.to(panels, {
            xPercent: -100 * (panels.length - 1),
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${section.scrollWidth - window.innerWidth}`,
                pin: true,
                scrub: 0.8,
                snap: {
                    snapTo: 1 / (panels.length - 1),
                    duration: { min: 0.2, max: 0.5 },
                    ease: "power1.inOut"
                },
                invalidateOnRefresh: true
            }
        });

        // Per‑panel content reveal
        panels.forEach((panel) => {
            const img = panel.querySelector(".product-scenes__img");
            const info = panel.querySelector(".product-scenes__info");

            if (img) {
                gsap.from(img, {
                    scale: 0.85,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: panel,
                        start: "left 80%",
                        containerAnimation: ScrollTrigger.getById("productScroll") || undefined,
                        toggleActions: "play none none reverse"
                    }
                });
            }

            if (info) {
                gsap.from(info.children, {
                    y: 40,
                    opacity: 0,
                    stagger: 0.1,
                    duration: 0.7,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: panel,
                        start: "left 70%",
                        containerAnimation: ScrollTrigger.getById("productScroll") || undefined,
                        toggleActions: "play none none reverse"
                    }
                });
            }
        });
    }

    /* ----------------------------------------------------------
       6 · STORIA TIMELINE
    ---------------------------------------------------------- */
    function initStoria() {
        const section = document.querySelector(".storia");
        if (!section) return;

        const nodes = gsap.utils.toArray(".storia__node");
        nodes.forEach((node, i) => {
            const img = node.querySelector(".storia__img");
            const text = node.querySelector(".storia__text");
            const year = node.querySelector(".storia__year");

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: node,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            });

            // Alternate direction
            const dir = i % 2 === 0 ? -60 : 60;

            if (year) tl.from(year, { scale: 0.5, opacity: 0, duration: 0.6, ease: "back.out(1.7)" }, 0);
            if (img) tl.from(img, { x: dir, opacity: 0, duration: 0.8, ease: "power3.out" }, 0.15);
            if (text) tl.from(text, { x: -dir, opacity: 0, duration: 0.8, ease: "power3.out" }, 0.25);
        });

        // Line draw
        const line = section.querySelector(".storia__line");
        if (line) {
            gsap.from(line, {
                scaleY: 0,
                transformOrigin: "top center",
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top 60%",
                    end: "bottom 40%",
                    scrub: true
                }
            });
        }
    }

    /* ----------------------------------------------------------
       7 · FRANGITURA SECTION
    ---------------------------------------------------------- */
    function initFrangitura() {
        const section = document.querySelector(".frangitura-preview");
        if (!section) return;

        // Background Ken Burns
        const bg = section.querySelector(".frangitura-preview__bg");
        if (bg) {
            gsap.to(bg, {
                scale: 1.15,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        }

        // Content reveal
        const content = section.querySelector(".frangitura-preview__content");
        if (content) {
            gsap.from(content.children, {
                y: 50,
                opacity: 0,
                stagger: 0.12,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 65%",
                    toggleActions: "play none none reverse"
                }
            });
        }

        // Steps
        const steps = gsap.utils.toArray(".frangitura-preview__step");
        steps.forEach((step, i) => {
            gsap.from(step, {
                x: i % 2 === 0 ? -40 : 40,
                opacity: 0,
                duration: 0.7,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: step,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    }

    /* ----------------------------------------------------------
       8 · TERRITORIO — ANIMATED COUNTERS
    ---------------------------------------------------------- */
    function initTerritorio() {
        const section = document.querySelector(".territorio");
        if (!section) return;

        const counters = gsap.utils.toArray(".territorio__counter-value");
        counters.forEach((el) => {
            const target = parseInt(el.dataset.target, 10) || 0;
            const prefix = el.dataset.prefix || "";
            const suffix = el.dataset.suffix || "";
            const obj = { val: 0 };

            gsap.to(obj, {
                val: target,
                duration: 2.5,
                ease: "power1.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                onUpdate: () => {
                    el.textContent = prefix + Math.round(obj.val).toLocaleString("it-IT") + suffix;
                }
            });
        });

        // Background parallax
        const bg = section.querySelector(".territorio__bg");
        if (bg) {
            gsap.to(bg, {
                yPercent: -15,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        }
    }

    /* ----------------------------------------------------------
       9 · RECENSIONI (sticky scroll / carousel)
    ---------------------------------------------------------- */
    function initRecensioni() {
        const section = document.querySelector(".recensioni");
        if (!section) return;

        const cards = gsap.utils.toArray(".recensioni__card");
        if (!cards.length) return;

        // Stacked sticky cards
        cards.forEach((card, i) => {
            gsap.from(card, {
                y: 100,
                opacity: 0,
                scale: 0.92,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        // Star fill animation
        const starGroups = gsap.utils.toArray(".recensioni__stars");
        starGroups.forEach((group) => {
            const stars = group.querySelectorAll(".star");
            gsap.from(stars, {
                scale: 0,
                opacity: 0,
                stagger: 0.08,
                duration: 0.4,
                ease: "back.out(2)",
                scrollTrigger: {
                    trigger: group,
                    start: "top 90%",
                    toggleActions: "play none none none"
                }
            });
        });

        // Aggregate bar width
        const bars = gsap.utils.toArray(".recensioni__bar-fill");
        bars.forEach((bar) => {
            const w = bar.dataset.width || "0%";
            gsap.from(bar, {
                width: "0%",
                duration: 1.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: bar,
                    start: "top 90%",
                    toggleActions: "play none none none"
                },
                onComplete: () => { bar.style.width = w; }
            });
        });
    }

    /* ----------------------------------------------------------
       10 · FAQ ACCORDION
    ---------------------------------------------------------- */
    function initFAQ() {
        const items = document.querySelectorAll(".faq__item");
        if (!items.length) return;

        items.forEach((item) => {
            const question = item.querySelector(".faq__question");
            const answer = item.querySelector(".faq__answer");
            if (!question || !answer) return;

            // Set initial closed state
            gsap.set(answer, { height: 0, overflow: "hidden", opacity: 0 });

            question.addEventListener("click", () => {
                const isOpen = item.classList.contains("is-open");

                // Close all others
                items.forEach((other) => {
                    if (other !== item && other.classList.contains("is-open")) {
                        other.classList.remove("is-open");
                        gsap.to(other.querySelector(".faq__answer"), {
                            height: 0,
                            opacity: 0,
                            duration: 0.4,
                            ease: "power2.inOut"
                        });
                    }
                });

                if (isOpen) {
                    item.classList.remove("is-open");
                    gsap.to(answer, { height: 0, opacity: 0, duration: 0.4, ease: "power2.inOut" });
                } else {
                    item.classList.add("is-open");
                    gsap.set(answer, { height: "auto", opacity: 1 });
                    const h = answer.offsetHeight;
                    gsap.from(answer, { height: 0, opacity: 0, duration: 0.5, ease: "power2.out" });
                }
            });
        });

        // Scroll reveal
        gsap.from(".faq__item", {
            y: 30,
            opacity: 0,
            stagger: 0.08,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".faq",
                start: "top 75%",
                toggleActions: "play none none reverse"
            }
        });
    }

    /* ----------------------------------------------------------
       11 · BLOG PREVIEW
    ---------------------------------------------------------- */
    function initBlogPreview() {
        const cards = gsap.utils.toArray(".blog-preview__card");
        if (!cards.length) return;

        gsap.from(cards, {
            y: 60,
            opacity: 0,
            stagger: 0.12,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".blog-preview",
                start: "top 75%",
                toggleActions: "play none none reverse"
            }
        });
    }

    /* ----------------------------------------------------------
       12 · CTA FINALE
    ---------------------------------------------------------- */
    function initCTAFinale() {
        const section = document.querySelector(".cta-finale");
        if (!section) return;

        // Drip animation
        const drips = gsap.utils.toArray(".cta-finale__drip");
        drips.forEach((drip, i) => {
            gsap.to(drip, {
                y: "110vh",
                duration: gsap.utils.random(3, 6),
                ease: "power1.in",
                repeat: -1,
                delay: i * 0.4,
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    toggleActions: "play pause resume pause"
                }
            });
        });

        // Headline words reveal
        const words = gsap.utils.toArray(".cta-finale__word");
        if (words.length) {
            gsap.from(words, {
                y: 80,
                opacity: 0,
                rotateX: -45,
                stagger: 0.15,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 60%",
                    toggleActions: "play none none reverse"
                }
            });
        }

        // CTA button glow pulse
        const btn = section.querySelector(".cta-finale__btn");
        if (btn) {
            gsap.from(btn, {
                scale: 0.8,
                opacity: 0,
                duration: 0.8,
                ease: "back.out(1.5)",
                scrollTrigger: {
                    trigger: btn,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                }
            });

            gsap.to(btn, {
                boxShadow: "0 0 40px rgba(201,168,76,0.6), 0 0 80px rgba(201,168,76,0.3)",
                repeat: -1,
                yoyo: true,
                duration: 1.5,
                ease: "sine.inOut"
            });
        }
    }

    /* ----------------------------------------------------------
       13 · SECTION REVEALS (generic)
    ---------------------------------------------------------- */
    function initSectionReveals() {
        const sections = gsap.utils.toArray("[data-reveal]");
        sections.forEach((sec) => {
            const direction = sec.dataset.reveal || "up";
            const props = { opacity: 0, duration: 1, ease: "power3.out" };

            switch (direction) {
                case "up": props.y = 60; break;
                case "down": props.y = -60; break;
                case "left": props.x = 60; break;
                case "right": props.x = -60; break;
            }

            gsap.from(sec, {
                ...props,
                scrollTrigger: {
                    trigger: sec,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    }

    /* ----------------------------------------------------------
       14 · GOLD HEADING UNDERLINE
    ---------------------------------------------------------- */
    function initHeadingLines() {
        const lines = gsap.utils.toArray(".section-heading__line");
        lines.forEach((line) => {
            gsap.from(line, {
                scaleX: 0,
                transformOrigin: "left center",
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: line,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    }

    /* ----------------------------------------------------------
       15 · IMAGE LAZY REVEAL
    ---------------------------------------------------------- */
    function initImageReveals() {
        const imgs = gsap.utils.toArray("[data-img-reveal]");
        imgs.forEach((img) => {
            gsap.from(img, {
                clipPath: "inset(100% 0 0 0)",
                duration: 1,
                ease: "power3.inOut",
                scrollTrigger: {
                    trigger: img,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    }

    /* ----------------------------------------------------------
       16 · BLACK CURTAIN TRANSITIONS
    ---------------------------------------------------------- */
    function initCurtains() {
        const curtains = gsap.utils.toArray(".curtain");
        curtains.forEach((curtain) => {
            gsap.to(curtain, {
                yPercent: -100,
                ease: "power2.inOut",
                scrollTrigger: {
                    trigger: curtain,
                    start: "top bottom",
                    end: "top top",
                    scrub: true
                }
            });
        });
    }

    /* ----------------------------------------------------------
       17 · PARALLAX LAYERS
    ---------------------------------------------------------- */
    function initParallax() {
        const layers = gsap.utils.toArray("[data-parallax]");
        layers.forEach((layer) => {
            const speed = parseFloat(layer.dataset.parallax) || 0.2;
            gsap.to(layer, {
                yPercent: speed * -100,
                ease: "none",
                scrollTrigger: {
                    trigger: layer.parentElement || layer,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });
    }

    /* ----------------------------------------------------------
       18 · SCRAMBLE TEXT (via GSAP TextPlugin)
    ---------------------------------------------------------- */
    function initScrambleText() {
        if (typeof TextPlugin === "undefined") return;
        gsap.registerPlugin(TextPlugin);

        const els = gsap.utils.toArray("[data-scramble]");
        els.forEach((el) => {
            const finalText = el.dataset.scramble || el.textContent;
            gsap.to(el, {
                duration: 1.5,
                text: {
                    value: finalText,
                    delimiter: "",
                    newClass: "scramble-done"
                },
                ease: "none",
                scrollTrigger: {
                    trigger: el,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            });
        });
    }

    /* ----------------------------------------------------------
       19 · PERFORMANCE — REDUCED MOTION FALLBACK
    ---------------------------------------------------------- */
    function reducedMotionFallback() {
        // Show all elements immediately
        gsap.utils.toArray("[data-reveal], .hero__title, .hero__subtitle, .hero__cta .btn, .hero__stars, .storia__node, .faq__item, .blog-preview__card, .cta-finale__word, .cta-finale__btn").forEach((el) => {
            gsap.set(el, { clearProps: "all" });
        });

        // Show hero fallback image instead of canvas
        if (canvas) canvas.style.display = "none";
        const fallback = document.querySelector(".hero__fallback");
        if (fallback) fallback.style.display = "block";
    }

    /* ----------------------------------------------------------
       20 · RESIZE HANDLER
    ---------------------------------------------------------- */
    let resizeTimer;
    function onResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            resizeCanvas();
            ScrollTrigger.refresh();
        }, 250);
    }

    /* ----------------------------------------------------------
       21 · INIT
    ---------------------------------------------------------- */
    function init() {
        if (prefersReduce) {
            reducedMotionFallback();
            return;
        }

        // Frame scrubbing
        if (canvas) {
            preloadFrames(() => {
                console.log("[Cabriolu] Frames loaded:", totalFrames());
                drawFrame(0);
                initFrameScrub();
            });
        }

        // Section animations
        initHero();
        initProductScenes();
        initStoria();
        initFrangitura();
        initTerritorio();
        initRecensioni();
        initFAQ();
        initBlogPreview();
        initCTAFinale();

        // Generic enhancements
        initSectionReveals();
        initHeadingLines();
        initImageReveals();
        initCurtains();
        initParallax();
        initScrambleText();

        // Events
        window.addEventListener("resize", onResize);
    }

    /* ----------------------------------------------------------
       22 · BOOT
    ---------------------------------------------------------- */
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();
