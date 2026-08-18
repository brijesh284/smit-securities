/* ============================================================
   SMIT SECURITIES - Main JavaScript Module
   
   Features:
   - Navbar scroll behavior and styling
   - Mobile navigation menu management
   - Scroll-triggered element reveal animations
   - Animated number counters for statistics
   - Animated particle background effect
   - Service card mouse-follow glow effect
   - Smooth anchor link scrolling
   - Active navigation link highlighting on scroll
============================================================ */

/* NAVBAR SCROLL EFFECT: Apply styling when page is scrolled */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


/* MOBILE MENU: Open/Close functionality and keyboard support */
function openMob() {
    document.getElementById('mobMenu').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeMob() {
    document.getElementById('mobMenu').classList.remove('open');
    document.body.style.overflow = '';
}

// Close mobile menu when ESC key is pressed
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMob();
});


/* SCROLL REVEAL: Animate elements when they enter viewport */
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -44px 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


/* ANIMATED COUNTERS: Number animation with easing effect */
function animateCounter(el) {
    const target = +el.dataset.to;
    const decimals = +(el.dataset.dec || 0);
    const duration = 2000;
    const startTime = performance.now();

    const tick = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Apply ease-out cubic easing for smooth animation
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = eased * target;

        if (decimals) {
            el.textContent = (value / 10).toFixed(1);
        } else {
            el.textContent = Math.floor(value).toLocaleString('en-IN');
        }

        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            // Set exact final value
            el.textContent = decimals
                ? (target / 10).toFixed(1)
                : target.toLocaleString('en-IN');
        }
    };

    requestAnimationFrame(tick);
}

const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.6 });

document.querySelectorAll('.ctr').forEach(el => counterObs.observe(el));


/* PARTICLE CANVAS: Floating particle animation effect */
(function initParticles() {
    const canvas = document.getElementById('ptCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
        const parent = canvas.parentElement || document.body;
        W = canvas.width = parent.clientWidth || window.innerWidth;
        H = canvas.height = parent.clientHeight || 500;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Create 22 particles with random properties
    for (let i = 0; i < 22; i++) {
        particles.push({
            x: rand(0, W || window.innerWidth),
            y: rand(0, H || window.innerHeight),
            r: rand(1, 2.5),
            vx: rand(-0.2, 0.2),
            vy: rand(-0.5, -0.15),
            alpha: rand(0.2, 0.55)
        });
    }

    function drawFrame() {
        ctx.clearRect(0, 0, W, H);

        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(126, 200, 240, ${p.alpha})`;
            ctx.fill();

            // Update particle position
            p.x += p.vx;
            p.y += p.vy;

            // Reset particle when it exits top of canvas
            if (p.y < -10) {
                p.y = H + 10;
                p.x = rand(0, W);
            }
            if (p.x < -10) p.x = W + 10;
            if (p.x > W + 10) p.x = -10;
        });

        requestAnimationFrame(drawFrame);
    }

    drawFrame();
})();


/* SERVICE CARD GLOW: Mouse-follow gradient effect on hover */
document.querySelectorAll('.svc-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const glow = card.querySelector('.svc-glow');
        if (!glow) return;
        glow.style.left = (e.clientX - rect.left) + 'px';
        glow.style.top = (e.clientY - rect.top) + 'px';
    });
});


/* SMOOTH ANCHOR SCROLL: Navigate to page sections smoothly with nav offset */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
            e.preventDefault();
            const navEl = document.getElementById('nav');
            const navHeight = navEl ? navEl.offsetHeight : 80;
            const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});


/* ACTIVE NAV LINK: Highlight current section in navigation menu */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.toggle(
                    'active-link',
                    link.getAttribute('href') === `#${id}`
                );
            });
        }
    });
}, { threshold: 0.4 });

sections.forEach(sec => sectionObs.observe(sec));


/* SCROLL TO TOP BUTTON */
const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

