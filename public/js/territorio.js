/* ============================================================
   territorio.js  –  Oleificio Cabriolu · Pagina Territorio
   Video scrubbing GSAP + Ken Burns steps + counters + scramble
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
        const hero = document.querySelector(".terr-hero");
        const video = document.getElementById("terrHeroVideo");
        if (!hero || !video) return;

        video.muted = true;
        video.playsInline = true;
        video.preload = "auto";

        const poster = hero.querySelector(".terr-hero__poster");
        const overlay = hero.querySelector(".terr-hero__overlay");
        const scroll = hero.querySelector(".terr-hero__scroll-hint");

        function setVideoTime(progress) {
            if (!isFinite(video.duration) || video.duration === 0) return;
            video.currentTime = Math.max(0, Math.min(video.duration, video.duration * progress));
        }

        function start() {
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

            // Overlay entrance
            if (overlay) {
                const eyebrow = overlay.querySelector(".terr-hero__eyebrow");
                const title = overlay.querySelector(".terr-hero__title");
                const desc = overlay.querySelector(".terr-hero__desc");

                const tl = gsap.timeline({ delay: 0.4 });
                if (eyebrow) tl.from(eyebrow, { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, 0);
                if (title) tl.from(title, { y: 40, opacity: 0, duration: 1, ease: "power3.out" }, 0.15);
                if (desc) tl.from(desc, { y: 30, opacity: 0, duration: 0.9, ease: "power3.out" }, 0.35);

                // Fade out on scroll
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

            // Scroll hint
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

            console.log("[territorio] ScrollTrigger active, video duration:", video.duration);
        }

        if (video.readyState >= 1) start();
        else video.addEventListener("loadedmetadata", start, { once: true });
    }

    /* ----------------------------------------------------------
       2 · INTRO SECTION
    ---------------------------------------------------------- */
    function initIntro() {
        const section = document.querySelector(".terr-intro");
        if (!section || prefersReduce) return;

        const inner = section.querySelector(".terr-intro__inner");
        if (!inner) return;

        // Stagger children
        gsap.from(inner.children, {
            y: 40,
            opacity: 0,
            stagger: 0.12,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
                trigger: section,
                start: "top 75%",
                toggleActions: "play none none reverse"
            }
        });
    }

    /* ----------------------------------------------------------
       3 · SCRAMBLE QUOTE
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

        ScrollTrigger.create({
            trigger: target,
            start: "top 80%",
            once: true,
            onEnter: () => scramble(finalText)
        });
    }

    /* ----------------------------------------------------------
       4 · STORIA HEADER
    ---------------------------------------------------------- */
    function initStoriaHeader() {
        const header = document.querySelector(".terr-storia__header");
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
       5 · TERRITORY STEPS — KEN BURNS + SLIDE
    ---------------------------------------------------------- */
    function initSteps() {
        const steps = gsap.utils.toArray(".terr-step");
        if (!steps.length || prefersReduce) return;

        steps.forEach((step) => {
            const bg = step.querySelector(".terr-step__bg img");
            const copy = step.querySelector(".terr-step__copy");
            const num = step.querySelector(".terr-step__num");
            const tags = step.querySelectorAll(".terr-step__tags li");

            const isLeft = step.classList.contains("terr-step--left");
            const dir = isLeft ? -1 : 1;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: step,
                    start: "top 82%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            });

            // Ken Burns on image
            if (bg) {
                gsap.fromTo(bg,
                    { scale: 1.15 },
                    {
                        scale: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: step,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true
                        }
                    }
                );
            }

            // Copy slide in
            if (copy) {
                tl.from(copy, {
                    x: dir * 80,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out"
                }, 0);
            }

            // Step number pop
            if (num) {
                const target = parseInt(num.textContent, 10);
                if (!isNaN(target)) {
                    const obj = { val: 0 };
                    tl.from(num, {
                        scale: 0.3,
                        opacity: 0,
                        duration: 0.6,
                        ease: "back.out(2)"
                    }, 0.1);

                    gsap.to(obj, {
                        val: target,
                        duration: 1.2,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: num,
                            start: "top 85%",
                            once: true
                        },
                        onUpdate: () => {
                            num.textContent = String(Math.round(obj.val)).padStart(2, "0");
                        }
                    });
                }
            }

            // Tags stagger
            if (tags.length) {
                tl.from(tags, {
                    y: 15,
                    opacity: 0,
                    stagger: 0.08,
                    duration: 0.5,
                    ease: "power2.out"
                }, 0.3);
            }

            // Mark visible
            tl.call(() => step.classList.add("is-visible"), null, 0);
        });
    }

    /* ----------------------------------------------------------
       6 · NUMERI — ANIMATED COUNTERS
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
                    const formatted = obj.val.toFixed(decimals)
                        .replace(".", ",")
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                    el.textContent = prefix + formatted + suffix;
                }
            });
        });

        // Numeri cards reveal
        const nums = gsap.utils.toArray(".terr-num");
        if (nums.length && !prefersReduce) {
            gsap.from(nums, {
                y: 50,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".terr-numeri",
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                }
            });
        }
    }

    /* ----------------------------------------------------------
       7 · CTA SECTION
    ---------------------------------------------------------- */
    function initCTA() {
        const section = document.querySelector(".terr-cta");
        if (!section || prefersReduce) return;

        const inner = section.querySelector(".terr-cta__inner");
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
        const btn = section.querySelector(".terr-cta__btn");
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
       8 · REDUCED MOTION FALLBACK
    ---------------------------------------------------------- */
    function reducedMotionFallback() {
        gsap.utils.toArray(
            ".terr-hero__overlay, .terr-intro__inner, .terr-storia__header, " +
            ".terr-step, .terr-num, .terr-cta__inner"
        ).forEach((el) => {
            el.style.opacity = "1";
            el.style.transform = "none";
        });

        document.querySelectorAll(".terr-step").forEach((s) => {
            s.classList.add("is-visible");
        });
    }

    /* ----------------------------------------------------------
       9 · RESIZE
    ---------------------------------------------------------- */
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
    });

    /* ----------------------------------------------------------
       10 · INIT
    ---------------------------------------------------------- */
    function init() {
        if (prefersReduce) {
            reducedMotionFallback();
            initHeroVideo();
            initCounters();
            return;
        }

        initHeroVideo();
        initIntro();
        initScrambleQuote();
        initStoriaHeader();
        initSteps();
        initCounters();
        initCTA();
    }

    /* ----------------------------------------------------------
       11 · BOOT
    ---------------------------------------------------------- */
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();
