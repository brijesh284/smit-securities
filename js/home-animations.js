/* ============================================================
   SMIT SECURITIES - Home Page Interactive Animations Module
   
   Features:
   - Who We Help: GSAP ScrollTrigger card stack-and-unfold effect
   - Opportunities & Phone Mockup: Auto-cycle & scroll-driven group switcher
   - IntersectionObservers for section reveals (Equity, Pre-IPO, Trust, How We Work)
============================================================ */

/* ---------- 1. Who We Help: GSAP Stack-and-Unfold Animation ---------- */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const wwhSection = document.querySelector("#who-we-help");
    const gridEl = document.querySelector(".wwh-grid");
    const cards = gsap.utils.toArray(".wwh-card");

    if (wwhSection && gridEl && cards.length > 0) {
        // Badge + Heading intro (plays once when section enters)
        const introTl = gsap.timeline({
            scrollTrigger: {
                trigger: wwhSection,
                start: "top 75%",
                toggleActions: "play none none reverse"
            }
        });

        introTl.to(".wwh-badge", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
            .to(".wwh-heading .line span", {
                y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.12
            }, "-=0.3");

        // Cards: start folded together on desktop (stacked at center) then unfold as user scrolls
        let cardsTimeline;

        function buildStackAnimation() {
            if (cardsTimeline) {
                cardsTimeline.scrollTrigger && cardsTimeline.scrollTrigger.kill();
                cardsTimeline.kill();
            }
            gsap.set(cards, { clearProps: "all" });

            if (window.innerWidth < 992 || !gridEl || cards.length === 0) {
                return;
            }

            const gridW = gridEl.offsetWidth;
            const gridH = gridEl.offsetHeight;

            const offsets = cards.map(card => {
                const cx = card.offsetLeft + card.offsetWidth / 2;
                const cy = card.offsetTop + card.offsetHeight / 2;
                return {
                    x: (gridW / 2) - cx,
                    y: (gridH / 2) - cy
                };
            });

            // Initial "folded stack" state — all cards piled at grid center
            cards.forEach((card, i) => {
                gsap.set(card, {
                    x: offsets[i].x,
                    y: offsets[i].y,
                    scale: 0.78,
                    rotation: (i - (cards.length - 1) / 2) * 7,
                    zIndex: cards.length - i,
                    transformOrigin: "50% 50%"
                });
            });

            // Pinned scrub timeline
            cardsTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: ".wwh-stage",
                    start: "top 65%",
                    end: "+=55%",
                    scrub: 0.4,
                    pin: true,
                    pinSpacing: true,
                    anticipatePin: 1
                }
            });

            cards.forEach((card, i) => {
                cardsTimeline.to(card, {
                    x: 0,
                    y: 0,
                    rotation: 0,
                    scale: 1,
                    duration: 1,
                    ease: "power2.out"
                }, i * 0.35);
            });
        }

        window.addEventListener("load", () => {
            buildStackAnimation();
            ScrollTrigger.refresh();
        });

        let resizeTimer;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                buildStackAnimation();
                ScrollTrigger.refresh();
            }, 250);
        });
    }
}


/* ---------- 2. Financial Opportunities: Phone Mockup Interaction ---------- */
(function initPhoneMockup() {
    var section = document.querySelector("#secure-signup");
    if (!section) return;

    var features = Array.prototype.slice.call(section.querySelectorAll(".rsc-feature"));
    var states = Array.prototype.slice.call(section.querySelectorAll(".rsc-state"));
    var groupDots = Array.prototype.slice.call(section.querySelectorAll(".rsc-group-dot"));

    var GROUP_RANGES = { 0: [0, 1, 2, 3], 1: [4, 5, 6, 7] };

    var currentGroup = 0;
    var currentIndex = 0;
    var timer = null;
    var cycleStarted = false;

    function setActive(i) {
        currentIndex = i;
        features.forEach(function (f) {
            f.classList.toggle("active", parseInt(f.dataset.index, 10) === i);
        });
        states.forEach(function (s) {
            s.classList.toggle("active", parseInt(s.dataset.state, 10) === i);
        });
    }

    function nextInGroup() {
        var range = GROUP_RANGES[currentGroup];
        var pos = range.indexOf(currentIndex);
        var nextPos = (pos + 1) % range.length;
        setActive(range[nextPos]);
    }

    function startCycle() {
        stopCycle();
        cycleStarted = true;
        timer = setInterval(nextInGroup, 3200);
    }

    function stopCycle() {
        cycleStarted = false;
        clearInterval(timer);
    }

    function setGroup(g) {
        if (g === currentGroup) return;
        currentGroup = g;

        features.forEach(function (f) {
            f.classList.toggle("group-hidden", parseInt(f.dataset.group, 10) !== g);
        });

        groupDots.forEach(function (d) {
            d.classList.toggle("active", parseInt(d.dataset.groupDot, 10) === g);
        });

        setActive(GROUP_RANGES[g][0]);

        if (cycleStarted) startCycle();
    }

    if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    section.classList.add("in-view");
                    startCycle();
                } else {
                    stopCycle();
                }
            });
        }, { threshold: 0.35 });
        io.observe(section);
    } else {
        section.classList.add("in-view");
        startCycle();
    }

    var rafId = null;

    function updateFromScroll() {
        rafId = null;
        var rect = section.getBoundingClientRect();
        var sectionMid = rect.top + rect.height / 2;
        setGroup(sectionMid <= window.innerHeight / 2 ? 1 : 0);
    }

    function onScroll() {
        if (rafId) return;
        rafId = requestAnimationFrame(updateFromScroll);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("load", updateFromScroll);
    updateFromScroll();
})();


/* ---------- 3. Section Reveal Observers (Equity, Pre-IPO, Generational Trust, How We Work) ---------- */
(function initSectionReveals() {
    function observeGroup(selector, threshold, rootMargin) {
        var els = document.querySelectorAll(selector);
        if (!els.length) return;

        if ('IntersectionObserver' in window) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) entry.target.classList.add('in');
                });
            }, { threshold: threshold || 0.12, rootMargin: rootMargin || '0px 0px -40px 0px' });
            els.forEach(function (el) { io.observe(el); });
        } else {
            els.forEach(function (el) { el.classList.add('in'); });
        }
    }

    observeGroup('#equity .reveal', 0.12, '0px 0px -44px 0px');
    observeGroup('#pre-ipo-fundraising .reveal', 0.12, '0px 0px -44px 0px');
    observeGroup('#generational-trust .gt-visual, #generational-trust .gt-tag, #generational-trust h2, #generational-trust .gt-evolve, #generational-trust .gt-body, #generational-trust .gt-close, #generational-trust .gt-cta', 0.15, '0px 0px -40px 0px');
    observeGroup('#how-we-work .hww-tag, #how-we-work h2, #how-we-work .hww-step', 0.15, '0px 0px -40px 0px');
})();
