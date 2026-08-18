/* ============================================================
   ABOUT SECTION - Scroll Animation Module
   
   Handles staggered animations for the About section:
   - Wraps heading text for line-by-line animations
   - Applies cascading transition delays to elements
   - Triggers animations when section enters viewport
   - Animates statistic counters with easing
   - Reveals decorative lines with sequential timing
============================================================ */

(function () {

    var section = document.querySelector('.about');
    var left = document.querySelector('.about-left');
    var right = document.querySelector('.about-right');

    if (!section) return;

    var headingLines = document.querySelectorAll('.about-heading-line');
    var stats = document.querySelectorAll('.about-stat');
    var lines = document.querySelectorAll('.about-line');
    var divider = document.querySelector('.about-divider');
    var paras = document.querySelectorAll('.about-para');
    var closing = document.querySelector('.about-closing');

    /* Wrap each heading line in a span for animation */
    function wrapHeadingLines() {
        headingLines.forEach(function (lineEl) {
            var text = lineEl.innerHTML;
            lineEl.innerHTML = '<span class="about-heading-line-inner">' + text + '</span>';
        });
    }

    wrapHeadingLines();

    /* Apply staggered delays to create cascading animation effect */
    function applyStaggerDelays() {
        var LINE_STAGGER = 80;
        var STAT_STAGGER = 100;
        var PARA_STAGGER = 90;
        var HEAD_STAGGER = 95;

        headingLines.forEach(function (el, i) {
            var inner = el.querySelector('.about-heading-line-inner');
            if (inner) inner.style.transitionDelay = (i * HEAD_STAGGER + 80) + 'ms';
        });

        stats.forEach(function (el, i) {
            el.style.transitionDelay = (i * STAT_STAGGER + 480) + 'ms';
        });

        lines.forEach(function (el, i) {
            el.style.transitionDelay = (i * LINE_STAGGER + 60) + 'ms';
        });

        paras.forEach(function (el, i) {
            el.style.transitionDelay = (i * PARA_STAGGER + 240) + 'ms';
        });

        if (closing) closing.style.transitionDelay = '400ms';
        if (divider) divider.style.transitionDelay = '160ms';
    }

    applyStaggerDelays();

    var triggered = false;

    /* Detect when section enters viewport and trigger animations */
    var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && !triggered) {
                triggered = true;
                section.classList.add('about-in');
                sectionObserver.disconnect();

                startCounters();
                highlightLines();
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -60px 0px'
    });

    sectionObserver.observe(section);

    /* Animate number counters from 0 to target value */
    function startCounters() {
        var nums = document.querySelectorAll('.about-stat-num[data-target]');

        nums.forEach(function (el) {
            var target = parseInt(el.getAttribute('data-target'), 10);
            var duration = 1800;
            var start = null;

            function easeOut(t) {
                return 1 - Math.pow(1 - t, 3);
            }

            function step(ts) {
                if (!start) start = ts;
                var elapsed = ts - start;
                var progress = Math.min(elapsed / duration, 1);
                var val = Math.round(easeOut(progress) * target);
                el.textContent = val.toLocaleString();
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = target.toLocaleString();
                }
            }

            setTimeout(function () {
                requestAnimationFrame(step);
            }, 600);
        });
    }

    /* Sequentially reveal decorative lines with timing delay */
    function highlightLines() {
        var lineEls = document.querySelectorAll('.about-line');
        var delay = 400;
        var interval = 160;

        lineEls.forEach(function (el, i) {
            setTimeout(function () {
                el.classList.add('about-line-visible');
            }, delay + i * interval);
        });
    }

})();
