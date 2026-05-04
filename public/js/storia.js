/* ============================================================
   storia.js  –  Oleificio Cabriolu · Pagina Storia
   Canvas 200‑frame scrubbing + GSAP timeline animations
   ============================================================ */

(function () {
    "use strict";

    /* ----------------------------------------------------------
       0 · GSAP SETUP
    ---------------------------------------------------------- */
    gsap.registerPlugin(ScrollTrigger);
    if (typeof TextPlugin !== "undefined") gsap.registerPlugin(TextPlugin);

    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ----------------------------------------------------------
       1 · CANVAS — 200 FRAME SCRUBBING
    ---------------------------------------------------------- */
    const TOTAL_FRAMES = 200;
    const BASE_PATH = "/img/frames/storia/frame_";
    const EXT = ".webp";

    const canvas = document.getElementById("storiaCanvas");
    const ctx = canvas ? canvas.getContext("2d") : null;
    const frames = [];
    let loaded = 0;
    let currentFrame = 0;

    function pad(n) {
        return String(n).padStart(4, "0");
    }

    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawFrame(currentFrame);
    }

    function drawFrame(idx) {
        if (!ctx) return;
        const img = frames[idx];
        if (!img || !img.complete || !img.naturalWidth) return;

        const cW = canvas.width;
        const cH = canvas.height;
        const iR = img.naturalWidth / img.naturalHeight;
        const cR = cW / cH;
        let dW, dH;

        if (cR > iR) { dW = cW; dH = cW / iR; }
        else { dH = cH; dW = cH * iR; }

        ctx.clearRect(0, 0, cW, cH);
        ctx.drawImage(img, (cW - dW) / 2, (cH - dH) / 2, dW, dH);
    }

    function preloadFrames() {
        return new Promise((resolve) => {
            loaded = 0;

            // Load frame 1 first for instant display
            const first = new Image();
            first.onload = () => {
                frames[0] = first;
                drawFrame(0);
            };
            first.src = BASE_PATH + "0001" + EXT;
            frames[0] = first;

            for (let i = 1; i < TOTAL_FRAMES; i++) {
                const img = new Image();
                img.onload = img.onerror = () => {
                    loaded++;
                    if (loaded >= TOTAL_FRAMES - 1) resolve();
                };
                img.src = BASE_PATH + pad(i + 1) + EXT;
                frames[i] = img;
            }
        });
    }

    /* ----------------------------------------------------------
       2 · HERO ANIMATIONS
    ---------------------------------------------------------- */
    function initHero() {
        const hero = document.getElementById("storia-hero");
        const content = document.querySelector(".storia-hero__content");
        const scroll = document.querySelector(".storia-hero__scroll");
        if (!hero) return;

        // Eyebrow, title, subtitle entrance
        const eyebrow = hero.querySelector(".storia-hero__eyebrow");
        const title = hero.querySelector(".storia-hero__title");
        const subtitle = hero.querySelector(".storia-hero__sub");

        const tlEntry = gsap.timeline({ delay: 0.3 });

        if (eyebrow) {
            tlEntry.to(eyebrow, {
                opacity: 1, y: 0, duration: 0.8, ease: "power3.out"
            }, 0);
        }
        if (title) {
            tlEntry.to(title, {
                opacity: 1, y: 0, duration: 1, ease: "power3.out"
            }, 0.2);
        }
        if (subtitle) {
            tlEntry.to(subtitle, {
                opacity: 1, y: 0, duration: 0.9, ease: "power3.out"
            }, 0.5);
        }
        if (scroll) {
            tlEntry.to(scroll, {
                opacity: 1, duration: 0.8, ease: "power2.out"
            }, 0.8);
        }

        // Hero content fade on scroll
        if (content) {
            gsap.to(content, {
                opacity: 0,
                y: -60,
                ease: "none",
                scrollTrigger: {
                    trigger: hero,
                    start: "top top",
                    end: "40% top",
                    scrub: true
                }
            });
        }

        // Scroll indicator fade
        if (scroll) {
            gsap.to(scroll, {
                opacity: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: hero,
                    start: "5% top",
                    end: "15% top",
                    scrub: true
                }
            });
        }
    }

    /* ----------------------------------------------------------
       3 · FRAME SCRUB — TIED TO HERO SCROLL
    ---------------------------------------------------------- */
    function initFrameScrub() {
        if (!canvas) return;

        const hero = document.getElementById("storia-hero");
        const timeline = document.getElementById("storia-timeline");
        if (!hero || !timeline) return;

        ScrollTrigger.create({
            trigger: hero,
            start: "top top",
            endTrigger: timeline,
            end: "top top",
            scrub: 0.5,
            onUpdate: (self) => {
                const f = Math.round(self.progress * (TOTAL_FRAMES - 1));
                if (f !== currentFrame) {
                    currentFrame = f;
                    drawFrame(f);
                }
            }
        });
    }

    /* ----------------------------------------------------------
       4 · TIMELINE — ITEMS SLIDE + PARALLAX
    ---------------------------------------------------------- */
    function initTimeline() {
        const items = gsap.utils.toArray(".timeline__item");

        // Clear CSS transitions (let GSAP handle everything)
        items.forEach((item) => {
            item.style.transition = "none";
            item.style.opacity = "1";
            item.style.transform = "none";
        });

        items.forEach((item, i) => {
            const img = item.querySelector(".timeline__item__img");
            const fromX = i % 2 === 0 ? -60 : 60;

            // Slide in from alternating sides
            gsap.from(item, {
                x: fromX,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });

            // Image parallax
            if (img) {
                gsap.from(img, {
                    y: 80,
                    scale: 1.08,
                    duration: 1.4,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 90%",
                        end: "top 30%",
                        scrub: 1
                    }
                });
            }
        });
    }

    /* ----------------------------------------------------------
       5 · TIMELINE LINE — PROGRESSIVE DRAW
    ---------------------------------------------------------- */
    function initTimelineLine() {
        const line = document.querySelector(".timeline__line");
        if (!line) return;

        // Create gold overlay that shrinks to reveal the line
        const overlay = document.createElement("div");
        overlay.style.cssText =
            "position:absolute;left:16px;top:0;bottom:0;width:1px;" +
            "background:var(--black,#0a0a0a);z-index:1;transform-origin:top center;";
        line.appendChild(overlay);

        gsap.to(overlay, {
            scaleY: 0,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: {
                trigger: line,
                start: "top 80%",
                end: "bottom 50%",
                scrub: true
            }
        });
    }

    /* ----------------------------------------------------------
       6 · IMAGE REVEAL — GOLD CURTAIN
    ---------------------------------------------------------- */
    function initImageCurtains() {
        const images = gsap.utils.toArray(".timeline__item__img");

        images.forEach((img) => {
            // Wrap image
            const wrapper = document.createElement("div");
            wrapper.style.cssText =
                "position:relative;overflow:hidden;border-radius:4px;margin-bottom:24px;";
            img.parentNode.insertBefore(wrapper, img);
            wrapper.appendChild(img);
            img.style.marginBottom = "0";

            // Gold curtain
            const curtain = document.createElement("div");
            curtain.style.cssText =
                "position:absolute;top:0;left:0;width:100%;height:100%;" +
                "background:var(--gold,#c9a84c);z-index:2;transform-origin:left center;";
            wrapper.appendChild(curtain);

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: wrapper,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                }
            });

            tl.from(img, {
                scale: 1.3,
                duration: 1.4,
                ease: "power3.out"
            }, 0);

            tl.to(curtain, {
                scaleX: 0,
                transformOrigin: "right center",
                duration: 1,
                ease: "power3.inOut"
            }, 0.1);
        });
    }

    /* ----------------------------------------------------------
       7 · SPLIT TEXT — LETTER‑BY‑LETTER HEADINGS
    ---------------------------------------------------------- */
    function initSplitText() {
        const headings = document.querySelectorAll(
            ".timeline__intro h2, .valori__header h2, .storia-cta h2"
        );

        headings.forEach((h) => {
            const text = h.textContent;
            h.innerHTML = "";
            h.style.overflow = "hidden";

            for (let c = 0; c < text.length; c++) {
                const span = document.createElement("span");
                span.textContent = text[c] === " " ? "\u00A0" : text[c];
                span.style.cssText = "display:inline-block;opacity:0;transform:translateY(100%);";
                h.appendChild(span);
            }

            gsap.to(h.querySelectorAll("span"), {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.03,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: h,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    }

    /* ----------------------------------------------------------
       8 · VALORI CARDS — 3D FLIP STAGGER
    ---------------------------------------------------------- */
    function initValori() {
        const grid = document.querySelector(".valori__grid");
        if (grid) grid.style.perspective = "1000px";

        const cards = gsap.utils.toArray(".valori__card");

        // Reset CSS transitions
        cards.forEach((card) => {
            card.style.transition = "none";
            card.style.opacity = "1";
            card.style.transform = "none";
        });

        cards.forEach((card, i) => {
            card.style.transformStyle = "preserve-3d";

            gsap.from(card, {
                rotateX: 15,
                rotateY: i % 2 === 0 ? -10 : 10,
                y: 80,
                opacity: 0,
                duration: 1,
                delay: i * 0.12,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        // Animate card numbers (01, 02, 03…)
        document.querySelectorAll(".valori__card__num").forEach((el) => {
            const target = parseInt(el.textContent, 10);
            if (isNaN(target)) return;
            const obj = { val: 0 };

            gsap.to(obj, {
                val: target,
                duration: 1.5,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none reset"
                },
                onUpdate: () => {
                    el.textContent = String(Math.round(obj.val)).padStart(2, "0");
                }
            });
        });
    }

    /* ----------------------------------------------------------
       9 · YEAR COUNTER + GLOW
    ---------------------------------------------------------- */
    function initYearCounters() {
        document.querySelectorAll(".timeline__year").forEach((el) => {
            const target = parseInt(el.dataset.count || el.textContent, 10);
            if (isNaN(target)) return;

            // Count up
            const obj = { val: 0 };
            gsap.to(obj, {
                val: target,
                duration: 2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 80%",
                    toggleActions: "play none none reset"
                },
                onUpdate: () => {
                    el.textContent = Math.round(obj.val);
                }
            });

            // Gold glow
            gsap.fromTo(el,
                { textShadow: "0 0 0 rgba(201,168,76,0)" },
                {
                    textShadow: "0 0 40px rgba(201,168,76,.4)",
                    duration: 1.5,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    }

    /* ----------------------------------------------------------
       10 · TEXT FADE‑UPS (intro, timeline texts)
    ---------------------------------------------------------- */
    function initTextFades() {
        const targets = gsap.utils.toArray(
            ".timeline__intro p, .valori__header p, .timeline__text"
        );

        targets.forEach((el) => {
            gsap.from(el, {
                y: 30,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    }

    /* ----------------------------------------------------------
       11 · CTA — GLOW PULSE + FADE
    ---------------------------------------------------------- */
    function initCTA() {
        const section = document.querySelector(".storia-cta");
        const btn = section ? section.querySelector(".storia-cta__btn") : null;

        if (section) {
            gsap.from(section.querySelectorAll("h2, p"), {
                y: 40,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                }
            });
        }

        if (btn) {
            gsap.from(btn, {
                scale: 0.8,
                opacity: 0,
                duration: 0.8,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: btn,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });

            gsap.to(btn, {
                boxShadow: "0 0 30px 8px rgba(201,168,76,.35)",
                repeat: -1,
                yoyo: true,
                duration: 1.5,
                ease: "sine.inOut"
            });
        }
    }

    /* ----------------------------------------------------------
       12 · REDUCED MOTION FALLBACK
    ---------------------------------------------------------- */
    function reducedMotionFallback() {
        // Show everything instantly
        gsap.utils.toArray(
            ".storia-hero__eyebrow, .storia-hero__title, .storia-hero__sub, " +
            ".storia-hero__scroll, .timeline__item, .valori__card"
        ).forEach((el) => {
            el.style.opacity = "1";
            el.style.transform = "none";
        });

        // Hide canvas, show fallback if present
        if (canvas) canvas.style.display = "none";
    }

    /* ----------------------------------------------------------
       13 · RESIZE
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
       14 · INIT
    ---------------------------------------------------------- */
    function init() {
        if (prefersReduce) {
            reducedMotionFallback();
            return;
        }

        // Canvas
        if (canvas && ctx) {
            resizeCanvas();
            preloadFrames().then(() => {
                console.log("[Cabriolu] Storia: " + TOTAL_FRAMES + " frame caricati");
                drawFrame(0);
                initFrameScrub();
            });
        }

        // Animations
        initHero();
        initTimeline();
        initTimelineLine();
        initImageCurtains();
        initSplitText();
        initValori();
        initYearCounters();
        initTextFades();
        initCTA();

        // Events
        window.addEventListener("resize", onResize);
    }

    /* ----------------------------------------------------------
       15 · BOOT
    ---------------------------------------------------------- */
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();
