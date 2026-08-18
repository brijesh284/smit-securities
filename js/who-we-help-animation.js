/* ============================================================
   WHO WE HELP SECTION - Scroll Animation Module
   
   Handles staggered card reveal animations:
   - Applies cascading transition delays to cards
   - Observes each card's viewport intersection
   - Reveals cards with sequential timing on scroll
   - Removes observer after animation is triggered
============================================================ */

(function () {
    'use strict';

    const STAGGER_DELAY = 130;
    const cards = document.querySelectorAll('.wwh-card');

    if (!cards.length) return;

    /* Set transition delay on each card before animation triggers */
    cards.forEach(function (card, i) {
        card.style.transitionDelay = (i * STAGGER_DELAY) + 'ms';
    });

    /* Detect when each card enters viewport and add visibility class */
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('wwh-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    cards.forEach(function (card) {
        observer.observe(card);
    });

})();