/* ============================================================
   SIBONELO SIHLE — PORTFOLIO SCRIPT v2.0
   Features: Role switcher, particles, stat counter, filter, scroll
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── 1. FOOTER YEAR ─────────────────────────────────────────
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();


    // ─── 2. THEME TOGGLE ────────────────────────────────────────
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const saved = localStorage.getItem('theme');
    if (saved === 'light') body.classList.add('light-mode');
    updateIcon(saved || 'dark');

    themeToggle?.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const theme = body.classList.contains('light-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', theme);
        updateIcon(theme);
    });

    function updateIcon(theme) {
        const sun  = themeToggle.querySelector('[data-mode="light"]');
        const moon = themeToggle.querySelector('[data-mode="dark"]');
        if (!sun || !moon) return;
        sun.style.display  = theme === 'light' ? 'inline-block' : 'none';
        moon.style.display = theme === 'dark'  ? 'inline-block' : 'none';
    }


    // ─── 3. ROLE SWITCHER ────────────────────────────────────────
    const roles = [
        'Full-Stack Developer',
        'Cloud DevOps Engineer',
        'AWS Architect',
    
        'AI/MLOps Enthusiast',
        'Cloud Native Builder',
    ];
    const roleEl = document.getElementById('role-switcher');
    if (roleEl) {
        let roleIndex = 0;
        let charIndex  = 0;
        let deleting   = false;
        let pauseTimer = null;

        function type() {
            const current = roles[roleIndex];

            if (!deleting) {
                roleEl.textContent = current.slice(0, charIndex + 1);
                charIndex++;
                if (charIndex === current.length) {
                    deleting = true;
                    pauseTimer = setTimeout(type, 1800);
                    return;
                }
                setTimeout(type, 60 + Math.random() * 40);
            } else {
                roleEl.textContent = current.slice(0, charIndex - 1);
                charIndex--;
                if (charIndex === 0) {
                    deleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                }
                setTimeout(type, 35);
            }
        }
        setTimeout(type, 800);
    }


    // ─── 4. ANIMATED STAT COUNTERS ──────────────────────────────
    const statEls = document.querySelectorAll('.stat-number[data-target]');
    let countersStarted = false;

    function startCounters() {
        if (countersStarted) return;
        countersStarted = true;
        statEls.forEach(el => {
            const target = parseInt(el.dataset.target, 10);
            let current  = 0;
            const step   = Math.ceil(target / 40);
            const timer  = setInterval(() => {
                current = Math.min(current + step, target);
                el.textContent = current;
                if (current >= target) clearInterval(timer);
            }, 40);
        });
    }

    // Trigger counters when hero is visible
    const heroObs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) startCounters();
    }, { threshold: 0.3 });
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) heroObs.observe(heroStats);


    // ─── 5. SMOOTH SCROLL + ACTIVE NAV ──────────────────────────
    const navLinks = document.querySelectorAll('.sidebar-link');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const id = link.getAttribute('href')?.substring(1);
            const target = id && document.getElementById(id);
            if (target) {
                window.scrollTo({ top: target.offsetTop - 40, behavior: 'smooth' });
            }
        });
    });

    const sectionObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(l => l.classList.remove('active'));
                const active = document.querySelector(`.sidebar-link[href="#${entry.target.id}"]`);
                active?.classList.add('active');
            }
        });
    }, { rootMargin: '0px 0px -55% 0px', threshold: 0 });

    sections.forEach(s => sectionObs.observe(s));


    // ─── 6. PROJECT FILTER ──────────────────────────────────────
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            projectCards.forEach(card => {
                const cat = card.dataset.category;
                const show = filter === 'all' || cat === filter;
                if (show) {
                    card.style.display = 'flex';
                    card.style.animation = 'none';
                    requestAnimationFrame(() => {
                        card.style.animation = 'fade-in-up 0.35s ease forwards';
                    });
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Show all by default
    projectCards.forEach(c => { c.style.display = 'flex'; });


    // ─── 7. CURSOR GLOW (desktop only) ──────────────────────────
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow && window.innerWidth > 1024) {
        document.addEventListener('mousemove', e => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top  = e.clientY + 'px';
        });
    } else if (cursorGlow) {
        cursorGlow.style.display = 'none';
    }


    // ─── 8. FLOATING PARTICLES ──────────────────────────────────
    const particleBg = document.getElementById('particle-bg');
    if (particleBg && window.innerWidth > 768) {
        const COLORS = ['rgba(99,240,198,', 'rgba(124,111,247,', 'rgba(245,166,35,'];
        for (let i = 0; i < 18; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = 2 + Math.random() * 3;
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];
            p.style.cssText = `
                width:${size}px;
                height:${size}px;
                left:${Math.random() * 100}%;
                background:${color}0.6);
                animation-duration:${10 + Math.random() * 15}s;
                animation-delay:${Math.random() * 12}s;
            `;
            particleBg.appendChild(p);
        }
    }


    // ─── 9. CARD ENTRANCE ANIMATION (IntersectionObserver) ──────
    const allCards = document.querySelectorAll('.card, .experience-card, .project-card');
    const cardObs  = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                cardObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    allCards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${i * 0.04}s, transform 0.5s ease ${i * 0.04}s`;
        cardObs.observe(card);
    });

});
