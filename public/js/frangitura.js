/* ============================================================
   frangitura.js  –  Oleificio Cabriolu · Pagina Frangitura
   Video scrubbing GSAP + step animations + counter + scramble
   ============================================================ */

(function () {
    "use strict";

    /* ----------------------------------------------------------
       0 · SETUP
    ---------------------------------------------------------- */
    gsap.registerPlugin(ScrollTrigger);
    if (typeof TextPlugin !== "undefined") gsap.registerPlugin(TextPlugin);

    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.add("js-ready");

    /* ----------------------------------------------------------
       1 · HERO VIDEO SCRUBBING
    ---------------------------------------------------------- */
    function initHeroVideo() {
        const hero = document.querySelector(".frang-hero");
        const video = document.getElementById("frangHeroVideo");
        if (!hero || !video) return;

        // Ensure muted + inline
        video.muted = true;
        video.playsInline = true;
        video.preload = "auto";

        const poster = hero.querySelector(".frang-hero__poster");
        const overlay = hero.querySelector(".frang-hero__overlay");
        const scroll = hero.querySelector(".frang-hero__scroll-hint");

        function setVideoTime(progress) {
            if (!isFinite(video.duration) || video.duration === 0) return;
            video.currentTime = Math.max(0, Math.min(video.duration, video.duration * progress));
        }

        function start() {
            // Hide poster once video is ready
            if (poster) poster.style.display = "none";

            if (prefersReduce) {
                setVideoTime(0);
                if (overlay) overlay.style.opacity = "1";
                return;
            }

            // Scrub video to scroll
            ScrollTrigger.create({
                trigger: hero,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.5,
                onUpdate: (self) => setVideoTime(self.progress)
            });

            // Overlay content entrance
            if (overlay) {
                const eyebrow = overlay.querySelector(".frang-hero__eyebrow");
                const title = overlay.querySelector(".frang-hero__title");
                const desc = overlay.querySelector(".frang-hero__desc");

                const tl = gsap.timeline({ delay: 0.4 });

                if (eyebrow) tl.from(eyebrow, { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, 0);
                if (title) tl.from(title, { y: 40, opacity: 0, duration: 1, ease: "power3.out" }, 0.15);
                if (desc) tl.from(desc, { y: 30, opacity: 0, duration: 0.9, ease: "power3.out" }, 0.35);

                // Fade out content on scroll
                gsap.to(overlay, {
                    opacity: 0,
                    y: -50,
                    ease: "none",
                    scrollTrigger: {
                        trigger: hero,
                        start: "30% top",
                        end: "60% top",
                        scrub: true
                    }
                });
            }

            // Scroll hint fade
            if (scroll) {
                gsap.from(scroll, { opacity: 0, duration: 0.8, delay: 1.2, ease: "power2.out" });
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

        // Wait for video metadata
        if (video.readyState >= 1) start();
        else video.addEventListener("loadedmetadata", start, { once: true });
    }

    /* ----------------------------------------------------------
       2 · SCRAMBLE QUOTE
    ---------------------------------------------------------- */
    function initScrambleQuote() {
        const target = document.querySelector("[data-scramble]");
        if (!target || prefersReduce) return;

        const finalText = target.dataset.scramble || target.textContent.trim();
        const chars = "!<>-_/[]{}=+*^?#·«»";
        let frame = 0;
        let queue = [];
        let frameReq;

        function update() {
            let output = "";
            let complete = 0;

            for (let i = 0; i < queue.length; i++) {
                const item = queue[i];
                if (frame >= item.end) {
                    complete++;
                    output += item.to;
                } else if (frame >= item.start) {
                    if (!item.char || Math.random() < 0.28) {
                        item.char = chars[Math.floor(Math.random() * chars.length)];
                    }
                    output += '<span class="scramble-char">' + item.char + "</span>";
                } else {
                    output += item.from;
                }
            }

            target.innerHTML = output;
            if (complete !== queue.length) {
                frameReq = requestAnimationFrame(update);
                frame++;
            }
        }

        function scramble(newText) {
            const oldText = target.textContent;
            const length = Math.max(oldText.length, newText.length);
            queue = [];

            for (let i = 0; i < length; i++) {
                const s = Math.floor(Math.random() * 40);
                queue.push({
                    from: oldText[i] || "",
                    to: newText[i] || "",
                    start: s,
                    end: s + Math.floor(Math.random() * 40),
                    char: ""
                });
            }

            cancelAnimationFrame(frameReq);
            frame = 0;
            update();
        }

        // Trigger on scroll into view
        ScrollTrigger.create({
            trigger: target,
            start: "top 80%",
            once: true,
            onEnter: () => scramble(finalText)
        });
    }

    /* ----------------------------------------------------------
       3 · PROCESSO HEADER
    ---------------------------------------------------------- */
    function initProcessoHeader() {
        const header = document.querySelector(".frang-processo__header");
        if (!header || prefersReduce) return;

        gsap.from(header.children, {
            y: 40,
            opacity: 0,
            stagger: 0.12,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
                trigger: header,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    }

    /* ----------------------------------------------------------
       4 · STEP ANIMATIONS (alternating slide + image reveal)
    ---------------------------------------------------------- */
    function initSteps() {
        const steps = gsap.utils.toArray(".frang-step");
        if (!steps.length || prefersReduce) return;

        steps.forEach((step, i) => {
            const media = step.querySelector(".frang-step__media");
            const body = step.querySelector(".frang-step__body");
            const img = step.querySelector(".frang-step__media img");
            const num = step.querySelector(".frang-step__num");
            const badge = step.querySelector(".frang-step__badge");

            const dir = i % 2 === 0 ? -1 : 1;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: step,
                    start: "top 82%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            });

            // Image slide + scale
            if (media) {
                tl.from(media, {
                    x: dir * 80,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out"
                }, 0);
            }

            // Image Ken Burns parallax on scrub
            if (img) {
                gsap.from(img, {
                    scale: 1.12,
                    y: 40,
                    ease: "none",
                    scrollTrigger: {
                        trigger: step,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                });
            }

            // Body content slide from opposite direction
            if (body) {
                tl.from(body, {
                    x: -dir * 60,
                    opacity: 0,
                    duration: 0.9,
                    ease: "power3.out"
                }, 0.15);
            }

            // Step number scale in
            if (num) {
                tl.from(num, {
                    scale: 0.3,
                    opacity: 0,
                    duration: 0.6,
                    ease: "back.out(2)"
                }, 0.1);
            }

            // Badge pop
            if (badge) {
                tl.from(badge, {
                    scale: 0,
                    opacity: 0,
                    duration: 0.5,
                    ease: "back.out(2.5)"
                }, 0.4);
            }

            // Tags stagger
            const tags = step.querySelectorAll(".frang-step__tags li");
            if (tags.length) {
                tl.from(tags, {
                    y: 15,
                    opacity: 0,
                    stagger: 0.08,
                    duration: 0.5,
                    ease: "power2.out"
                }, 0.35);
            }
        });
    }

    /* ----------------------------------------------------------
       5 · NUMERI — ANIMATED COUNTERS
    ---------------------------------------------------------- */
    function initCounters() {
        const nodes = gsap.utils.toArray("[data-count]");
        if (!nodes.length) return;

        nodes.forEach((el) => {
            const target = parseFloat(el.dataset.value || 0);
            const prefix = el.dataset.prefix || "";
            const suffix = el.dataset.suffix || "";
            const decimals = parseInt(el.dataset.decimals || "0", 10);

            if (prefersReduce) {
                el.textContent = prefix + target.toFixed(decimals).replace(".", ",") + suffix;
                return;
            }

            const obj = { val: 0 };

            gsap.to(obj, {
                val: target,
                duration: 2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    once: true
                },
                onUpdate: () => {
                    el.textContent = prefix + obj.val.toFixed(decimals).replace(".", ",") + suffix;
                }
            });
        });

        // Numeri section title + grid reveal
        const section = document.querySelector(".frang-numeri");
        if (section && !prefersReduce) {
            const items = gsap.utils.toArray(".frang-numero");
            gsap.from(items, {
                y: 50,
                opacity: 0,
                stagger: 0.12,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                }
            });
        }
    }

    /* ----------------------------------------------------------
       6 · CTA SECTION
    ---------------------------------------------------------- */
    function initCTA() {
        const section = document.querySelector(".frang-cta");
        if (!section || prefersReduce) return;

        const inner = section.querySelector(".frang-cta__inner");
        if (!inner) return;

        gsap.from(inner.children, {
            y: 40,
            opacity: 0,
            stagger: 0.15,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
                trigger: section,
                start: "top 75%",
                toggleActions: "play none none reverse"
            }
        });

        // Button glow
        const btn = section.querySelector(".frang-cta__btn");
        if (btn) {
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
       7 · STEP NUMBER COUNTER (01→06)
    ---------------------------------------------------------- */
    function initStepNumCounters() {
        if (prefersReduce) return;

        const nums = gsap.utils.toArray(".frang-step__num");
        nums.forEach((el) => {
            const target = parseInt(el.textContent, 10);
            if (isNaN(target)) return;

            const obj = { val: 0 };
            gsap.to(obj, {
                val: target,
                duration: 1.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    once: true
                },
                onUpdate: () => {
                    el.textContent = String(Math.round(obj.val)).padStart(2, "0");
                }
            });
        });
    }

    /* ----------------------------------------------------------
       8 · QUOTE AUTHOR FADE
    ---------------------------------------------------------- */
    function initQuoteAuthor() {
        const cite = document.querySelector(".frang-quote__author");
        if (!cite || prefersReduce) return;

        gsap.from(cite, {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: cite,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    }

    /* ----------------------------------------------------------
       9 · REDUCED MOTION FALLBACK
    ---------------------------------------------------------- */
    function reducedMotionFallback() {
        // Show all elements immediately
        gsap.utils.toArray(
            ".frang-hero__overlay, .frang-step, .frang-numero, .frang-cta__inner, " +
            ".frang-quote__text, .frang-quote__author, .frang-processo__header"
        ).forEach((el) => {
            el.style.opacity = "1";
            el.style.transform = "none";
        });

        // Steps visible
        document.querySelectorAll(".frang-step").forEach((s) => {
            s.classList.add("is-visible");
        });
    }

    /* ----------------------------------------------------------
       10 · RESIZE
    ---------------------------------------------------------- */
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
    });

    /* ----------------------------------------------------------
       11 · INIT
    ---------------------------------------------------------- */
    function init() {
        if (prefersReduce) {
            reducedMotionFallback();
            // Still init video at frame 0 and counters with final values
            initHeroVideo();
            initCounters();
            return;
        }

        initHeroVideo();
        initScrambleQuote();
        initProcessoHeader();
        initSteps();
        initStepNumCounters();
        initCounters();
        initQuoteAuthor();
        initCTA();
    }

    /* ----------------------------------------------------------
       12 · BOOT
    ---------------------------------------------------------- */
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();
