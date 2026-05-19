/* ========================================
   ELABORE — SCRIPT.JS
   Landing Page de Alta Conversão
   ======================================== */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initHeaderScroll();
        initScrollReveal();
        initCounterAnimation();
        initSmoothScroll();
        initPhoneMasks();
        initFAQ();
        initLeadForms();
        initParallax();
    });

    // ========================================
    // HEADER SCROLL EFFECT
    // ========================================

    function initHeaderScroll() {
        const header = document.getElementById('header');
        if (!header) return;

        let lastScroll = 0;
        let ticking = false;

        function updateHeader() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                header.style.background = 'rgba(239, 239, 239, 0.98)';
                header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.08)';
            } else {
                header.style.background = 'rgba(239, 239, 239, 0.92)';
                header.style.boxShadow = 'none';
            }

            // Hide/show on scroll direction
            if (currentScroll > lastScroll && currentScroll > 300) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScroll = currentScroll;
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });
    }

    // ========================================
    // SCROLL REVEAL
    // ========================================

    function initScrollReveal() {
        const revealElements = document.querySelectorAll('[data-reveal]');
        if (!revealElements.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -60px 0px',
            threshold: 0.1
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const parent = entry.target.parentElement;
                    if (parent) {
                        const siblings = Array.from(parent.querySelectorAll('[data-reveal]'));
                        const index = siblings.indexOf(entry.target);
                        entry.target.style.transitionDelay = `${index * 0.08}s`;
                    }
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // ========================================
    // COUNTER ANIMATION
    // ========================================

    function initCounterAnimation() {
        const counters = document.querySelectorAll('[data-count]');
        if (!counters.length) return;

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = parseInt(target.getAttribute('data-count'));
                    animateCounter(target, finalValue);
                    counterObserver.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    function animateCounter(element, target) {
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(eased * target);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // ========================================
    // SMOOTH SCROLL
    // ========================================

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                const headerHeight = document.getElementById('header')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }

    // ========================================
    // PHONE MASKS
    // ========================================

    function initPhoneMasks() {
        const phoneInputs = [
            document.getElementById('leadBarPhone'),
            document.getElementById('whatsapp')
        ];

        phoneInputs.forEach(input => {
            if (!input) return;

            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 11) value = value.slice(0, 11);

                if (value.length >= 2) {
                    value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                }
                if (value.length >= 10) {
                    const parts = value.split(' ');
                    if (parts[1] && parts[1].length > 5) {
                        value = `${parts[0]} ${parts[1].slice(0, 5)}-${parts[1].slice(5)}`;
                    }
                }

                e.target.value = value;
            });
        });
    }

    // ========================================
    // FAQ ACCORDION
    // ========================================

    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (!question) return;

            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all
                faqItems.forEach(i => i.classList.remove('active'));

                // Open clicked if wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // ========================================
    // LEAD FORMS
    // ========================================

    function initLeadForms() {
        // Form principal
        const leadForm = document.getElementById('leadForm');
        if (leadForm) {
            leadForm.addEventListener('submit', handleLeadFormSubmit);
        }

        // Lead bar form
        const leadBarForm = document.getElementById('leadBarForm');
        if (leadBarForm) {
            leadBarForm.addEventListener('submit', handleLeadBarSubmit);
        }
    }

    window.handleLeadFormSubmit = function(e) {
        e.preventDefault();
        submitForm(e.target, 'Análise solicitada com sucesso!');
    };

    window.handleLeadBarSubmit = function(e) {
        e.preventDefault();
        submitForm(e.target, 'Dados enviados! Entraremos em contato em breve.');
    };

    function submitForm(form, successMessage) {
        const btn = form.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;

        // Loading state
        btn.disabled = true;
        btn.innerHTML = '<span>Enviando...</span>';
        btn.style.opacity = '0.7';

        // Simulate API call
        setTimeout(() => {
            btn.innerHTML = `<span>${successMessage}</span>`;
            btn.style.background = '#22c55e';

            // Reset
            setTimeout(() => {
                form.reset();
                btn.disabled = false;
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.style.opacity = '1';
            }, 2500);
        }, 1500);
    }

    // ========================================
    // PARALLAX HERO
    // ========================================

    function initParallax() {
        const hero = document.querySelector('.hero');
        const heroGrid = document.querySelector('.hero-grid');
        const heroGradient = document.querySelector('.hero-gradient');

        if (!hero) return;

        let mouseX = 0, mouseY = 0;
        let currentX = 0, currentY = 0;
        let isHeroVisible = true;
        let rafId = null;

        const heroObserver = new IntersectionObserver((entries) => {
            isHeroVisible = entries[0].isIntersecting;
        }, { threshold: 0 });

        heroObserver.observe(hero);

        if (window.matchMedia('(pointer: fine)').matches) {
            hero.addEventListener('mousemove', function(e) {
                const rect = hero.getBoundingClientRect();
                mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
                mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            }, { passive: true });

            function animateParallax() {
                if (!isHeroVisible) {
                    rafId = requestAnimationFrame(animateParallax);
                    return;
                }

                currentX += (mouseX - currentX) * 0.05;
                currentY += (mouseY - currentY) * 0.05;

                if (heroGrid) {
                    heroGrid.style.transform = `translate(${currentX * 8}px, ${currentY * 8}px)`;
                }
                if (heroGradient) {
                    heroGradient.style.transform = `translate(${currentX * 15}px, ${currentY * 15}px)`;
                }

                rafId = requestAnimationFrame(animateParallax);
            }

            rafId = requestAnimationFrame(animateParallax);
        }
    }

    // ========================================
    // TRACKING DE EVENTOS (Analytics-ready)
    // ========================================

    const trackEvent = (eventName, params = {}) => {
        console.log(`[TRACK] ${eventName}`, params);
        if (typeof gtag !== 'undefined') gtag('event', eventName, params);
        if (typeof fbq !== 'undefined') fbq('track', eventName, params);
    };

    // Track CTA clicks
    document.querySelectorAll('.btn-primary, .btn-outline, .btn-header, .btn-lead-bar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const text = btn.textContent.trim().substring(0, 50);
            const section = btn.closest('section');
            trackEvent('click_cta', {
                button_text: text,
                location: section ? section.className || section.id : 'header'
            });
        });
    });

    // Scroll depth tracking
    const scrollDepths = [25, 50, 75, 100];
    let trackedDepths = [];

    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        scrollDepths.forEach(depth => {
            if (scrollPercent >= depth && !trackedDepths.includes(depth)) {
                trackedDepths.push(depth);
                trackEvent('scroll_depth', { percent: depth });
            }
        });
    }, { passive: true });

    // Time on page
    [30, 60, 120, 180].forEach(seconds => {
        setTimeout(() => {
            trackEvent('time_on_page', { seconds: seconds });
        }, seconds * 1000);
    });

    // ========================================
    // PREFERS REDUCED MOTION
    // ========================================

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('[data-reveal]').forEach(el => {
            el.classList.add('revealed');
        });
    }

})();