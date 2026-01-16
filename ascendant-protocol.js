/**
 * ASCENDANT PROTOCOL - Scroll Reveal Animations
 * Handles vertical beam hero section scroll-based text reveal
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        doorOpenThreshold: 100, // pixels to scroll before opening
        contentReleaseThreshold: 300, // pixels to scroll before content becomes scrollable
        observerOptions: {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        }
    };

    // State
    let doorOpened = false;
    let contentReleased = false;

    /**
     * Initialize all animations
     */
    function init() {
        initDoorOpening();
        initIntersectionObserver();
    }

    /**
     * Door opening effect on scroll
     */
    function initDoorOpening() {
        const doorLeft = document.querySelector('.door-left');
        const doorRight = document.querySelector('.door-right');
        const initialBranding = document.querySelector('.initial-branding');
        const revealedContent = document.querySelector('.revealed-content');
        const heroSection = document.querySelector('.hero-beam');

        if (!doorLeft || !doorRight || !initialBranding || !revealedContent) return;

        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

            // Open doors
            if (!doorOpened && scrollPosition > CONFIG.doorOpenThreshold) {
                doorLeft.classList.add('open');
                doorRight.classList.add('open');
                initialBranding.classList.add('fade-out');
                revealedContent.classList.add('visible');
                doorOpened = true;
            }

            // Release content to scroll naturally
            if (!contentReleased && scrollPosition > CONFIG.contentReleaseThreshold) {
                revealedContent.style.position = 'absolute';
                revealedContent.style.top = '0';
                doorLeft.style.position = 'absolute';
                doorRight.style.position = 'absolute';
                contentReleased = true;
            }
        });
    }

    /**
     * Intersection Observer for other sections
     * Animates elements as they come into viewport
     */
    function initIntersectionObserver() {
        // Elements to observe
        const observeElements = document.querySelectorAll(
            '.qual-point, .protocol-phase, .framework-content, .cta-content'
        );

        if (!observeElements.length) return;

        // Set initial state for qual-points
        document.querySelectorAll('.qual-point').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
        });

        // Create observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Trigger animation
                    requestAnimationFrame(() => {
                        entry.target.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    });

                    // Unobserve after animation
                    observer.unobserve(entry.target);
                }
            });
        }, CONFIG.observerOptions);

        // Observe all elements
        observeElements.forEach(el => observer.observe(el));
    }

    /**
     * Smooth scroll for anchor links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                // Don't prevent default for empty hash
                if (href === '#') return;

                e.preventDefault();

                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Parallax effect for beam glow (subtle)
     */
    function initBeamParallax() {
        const beamGlow = document.querySelector('.beam-glow');
        if (!beamGlow) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.15;

            // Subtle parallax movement (very gentle)
            beamGlow.style.transform = `translate(-50%, ${scrolled * parallaxSpeed}px)`;
        });
    }

    /**
     * Performance optimization: Throttle scroll events
     */
    function throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Add performance monitoring (optional - for debugging)
     */
    function addPerformanceMonitoring() {
        if (window.location.search.includes('debug')) {
            console.log('Ascendant Protocol - Debug Mode Enabled');
        }
    }

    /**
     * Initialize everything when DOM is ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Initialize additional features
    initSmoothScroll();
    initBeamParallax();
    addPerformanceMonitoring();

})();
