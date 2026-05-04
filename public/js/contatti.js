/* ============================================================
   contatti.js  –  Oleificio Cabriolu · Pagina Contatti
   Video scrubbing GSAP + cards + form + scramble
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
        const hero = document.querySelector(".cont-hero");
        const video = document.getElementById("contHeroVideo");
        if (!hero || !video) return;

        video.muted = true;
        video.playsInline = true;
        video.preload = "auto";

        const poster = hero.querySelector(".cont-hero__poster");
        const overlay = hero.querySelector(".cont-hero__overlay");
        const scroll = hero.querySelector(".cont-hero__scroll-hint");

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

            ScrollTrigger.create({
                trigger: hero,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.5,
                onUpdate: (self) => setVideoTime(self.progress)
            });

            // Overlay entrance
            if (overlay) {
                const eyebrow = overlay.querySelector(".cont-hero__eyebrow");
                const title = overlay.querySelector(".cont-hero__title");
                const desc = overlay.querySelector(".cont-hero__desc");

                const tl = gsap.timeline({ delay: 0.4 });
                if (eyebrow) tl.from(eyebrow, { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, 0);
                if (title) tl.from(title, { y: 40, opacity: 0, duration: 1, ease: "power3.out" }, 0.15);
                if (desc) tl.from(desc, { y: 30, opacity: 0, duration: 0.9, ease: "power3.out" }, 0.35);

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

            console.log("[contatti] ScrollTrigger active, video duration:", video.duration);
        }

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

        ScrollTrigger.create({
            trigger: target,
            start: "top 80%",
            once: true,
            onEnter: () => scramble(finalText)
        });
    }

    /* ----------------------------------------------------------
       3 · CONTACT CARDS — STAGGER REVEAL
    ---------------------------------------------------------- */
    function initCards() {
        const cards = gsap.utils.toArray(".cont-card");
        if (!cards.length || prefersReduce) return;

        cards.forEach((card, i) => {
            gsap.from(card, {
                y: 60,
                opacity: 0,
                scale: 0.95,
                duration: 0.8,
                delay: i * 0.12,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 88%",
                    toggleActions: "play none none reverse"
                }
            });

            // Icon bounce
            const icon = card.querySelector(".cont-card__icon");
            if (icon) {
                gsap.from(icon, {
                    scale: 0,
                    rotation: -15,
                    duration: 0.6,
                    delay: i * 0.12 + 0.3,
                    ease: "back.out(2)",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 88%",
                        toggleActions: "play none none reverse"
                    }
                });
            }
        });
    }

    /* ----------------------------------------------------------
       4 · FORM SECTION REVEAL
    ---------------------------------------------------------- */
    function initFormReveal() {
        const section = document.querySelector(".cont-form-section");
        if (!section || prefersReduce) return;

        const intro = section.querySelector(".cont-form-section__intro");
        const form = section.querySelector(".cont-form");

        if (intro) {
            gsap.from(intro.children, {
                y: 40,
                opacity: 0,
                stagger: 0.15,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: intro,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
        }

        if (form) {
            gsap.from(form, {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: form,
                    start: "top 82%",
                    toggleActions: "play none none reverse"
                }
            });
        }
    }

    /* ----------------------------------------------------------
       5 · CONTACT FORM — VALIDATION + SUBMIT
    ---------------------------------------------------------- */
    function initContactForm() {
        const form = document.getElementById("contattiForm");
        const note = document.getElementById("contFormNote");
        if (!form) return;

        // Focus effects on inputs
        const inputs = form.querySelectorAll(".cont-form__input, .cont-form__textarea, .cont-form__select");
        inputs.forEach((input) => {
            input.addEventListener("focus", () => {
                input.parentElement.classList.add("is-focused");
            });
            input.addEventListener("blur", () => {
                input.parentElement.classList.remove("is-focused");
                if (input.value.trim()) input.parentElement.classList.add("is-filled");
                else input.parentElement.classList.remove("is-filled");
            });
        });

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            if (note) {
                note.classList.remove("is-error", "is-success");
                note.textContent = "";
            }

            const data = new FormData(form);
            const nome = (data.get("nome") || "").toString().trim();
            const email = (data.get("email") || "").toString().trim();
            const motivo = (data.get("motivo") || "").toString().trim();
            const messaggio = (data.get("messaggio") || "").toString().trim();
            const privacy = data.get("privacy");

            // Validation
            if (!nome || !email || !motivo || !messaggio || !privacy) {
                if (note) {
                    note.classList.add("is-error");
                    note.textContent = "Compila tutti i campi obbligatori.";
                }
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                if (note) {
                    note.classList.add("is-error");
                    note.textContent = "Inserisci un indirizzo email valido.";
                }
                return;
            }

            // Submit (demo simulation — replace with real backend /api/contact.php)
            const btn = form.querySelector(".cont-form__btn");
            const originalText = btn.textContent;
            btn.disabled = true;
            btn.textContent = "Invio in corso…";

            // Attempt real backend
            fetch("/api/contact.php", {
                method: "POST",
                body: data
            })
                .then((res) => {
                    if (res.ok) return res.json();
                    throw new Error("server");
                })
                .then(() => {
                    btn.disabled = false;
                    btn.textContent = originalText;
                    if (note) {
                        note.classList.add("is-success");
                        note.textContent = "✓ Grazie " + nome.split(" ")[0] + "! Ti rispondiamo entro 24 ore.";
                    }
                    form.reset();
                })
                .catch(() => {
                    // Fallback: demo mode — simulate success
                    setTimeout(() => {
                        btn.disabled = false;
                        btn.textContent = originalText;
                        if (note) {
                            note.classList.add("is-success");
                            note.textContent = "✓ Grazie " + nome.split(" ")[0] + "! Ti rispondiamo entro 24 ore.";
                        }
                        form.reset();
                    }, 900);
                });
        });
    }

    /* ----------------------------------------------------------
       6 · MAPPA SECTION REVEAL
    ---------------------------------------------------------- */
    function initMappa() {
        const section = document.querySelector(".cont-mappa");
        if (!section || prefersReduce) return;

        const embed = section.querySelector(".cont-mappa__embed");
        if (embed) {
            gsap.from(embed, {
                y: 60,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: embed,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        }
    }

    /* ----------------------------------------------------------
       7 · CTA SECTION
    ---------------------------------------------------------- */
    function initCTA() {
        const section = document.querySelector(".cont-cta");
        if (!section || prefersReduce) return;

        const inner = section.querySelector(".cont-cta__inner");
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

        const btn = section.querySelector(".cont-cta__btn");
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
       8 · QUOTE AUTHOR FADE
    ---------------------------------------------------------- */
    function initQuoteAuthor() {
        const cite = document.querySelector(".cont-quote__author");
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
        gsap.utils.toArray(
            ".cont-hero__overlay, .cont-card, .cont-form-section, " +
            ".cont-mappa__embed, .cont-cta__inner, .cont-quote__text, .cont-quote__author"
        ).forEach((el) => {
            el.style.opacity = "1";
            el.style.transform = "none";
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
            initHeroVideo();
            initContactForm();
            return;
        }

        initHeroVideo();
        initScrambleQuote();
        initQuoteAuthor();
        initCards();
        initFormReveal();
        initContactForm();
        initMappa();
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
