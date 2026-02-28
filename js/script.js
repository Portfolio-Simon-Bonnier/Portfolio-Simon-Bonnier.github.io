document.addEventListener('DOMContentLoaded', () => {
    // Initialize Animate On Scroll when available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            once: true,
            offset: 50,
            duration: 800,
        });
    }

    // Keep copyright year in sync with current year
    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) {
        copyrightYear.textContent = String(new Date().getFullYear());
    }

    // Navbar blur on scroll
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('shadow-md', 'bg-white/95');
                navbar.classList.remove('bg-white/0');
            } else {
                navbar.classList.remove('shadow-md', 'bg-white/95');
                navbar.classList.add('bg-white/0');
            }
        });
    }

    // Mobile menu toggle
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (btn && menu) {
        const closeMenu = () => {
            btn.setAttribute('aria-expanded', 'false');
            menu.classList.add('max-h-0', 'opacity-0', '-translate-y-2', 'pointer-events-none');
            menu.classList.remove('max-h-96', 'opacity-100', 'translate-y-0', 'pointer-events-auto');
        };

        const openMenu = () => {
            btn.setAttribute('aria-expanded', 'true');
            menu.classList.remove('max-h-0', 'opacity-0', '-translate-y-2', 'pointer-events-none');
            menu.classList.add('max-h-96', 'opacity-100', 'translate-y-0', 'pointer-events-auto');
        };

        btn.setAttribute('aria-expanded', 'false');

        btn.addEventListener('click', () => {
            const isOpen = btn.getAttribute('aria-expanded') === 'true';
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close mobile menu when a link is clicked
        const mobileLinks = menu.querySelectorAll('a');
        mobileLinks.forEach((link) => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });
    }

    // Shared obfuscated email decoder
    const getDecodedEmail = () => {
        const rotor = [19, 7, 23, 11, 5];
        const obfuscatedEmail = [96, 110, 122, 100, 107, 61, 101, 120, 101, 107, 122, 98, 101, 62, 69, 116, 106, 118, 98, 105, 61, 100, 120, 102];
        return obfuscatedEmail
            .map((value, index) => String.fromCharCode(value ^ rotor[index % rotor.length]))
            .join('');
    };

    const getDecodedPhoneDisplay = () => {
        const rotor = [19, 7, 23, 11, 5];
        const obfuscatedPhone = [35, 48, 55, 61, 60, 51, 51, 47, 43, 54, 37, 39, 46, 51];
        return obfuscatedPhone
            .map((value, index) => String.fromCharCode(value ^ rotor[index % rotor.length]))
            .join('');
    };

    const getDecodedPhoneHref = () => {
        const rotor = [19, 7, 23, 11, 5];
        const obfuscatedPhoneHref = [35, 48, 33, 50, 49, 43, 52, 33, 50, 61];
        return obfuscatedPhoneHref
            .map((value, index) => String.fromCharCode(value ^ rotor[index % rotor.length]))
            .join('');
    };

    // Hydrate all static email links/text from obfuscated source
    function initObfuscatedEmailLinks() {
        const decodedEmail = getDecodedEmail();
        document.querySelectorAll('[data-email-link]').forEach((link) => {
            link.setAttribute('href', `mailto:${decodedEmail}`);
        });
        document.querySelectorAll('[data-email-text]').forEach((node) => {
            node.textContent = decodedEmail;
        });
    }

    function initObfuscatedPhoneLinks() {
        const decodedPhoneDisplay = getDecodedPhoneDisplay();
        const decodedPhoneHref = getDecodedPhoneHref();
        document.querySelectorAll('[data-phone-link]').forEach((link) => {
            link.setAttribute('href', `tel:${decodedPhoneHref}`);
        });
        document.querySelectorAll('[data-phone-text]').forEach((node) => {
            node.textContent = decodedPhoneDisplay;
        });
    }

    // Hybrid Email Logic (Obfuscation)
    function initHybridEmail() {
        const container = document.getElementById('email-hybrid-container');
        if (!container) return;

        const decodedEmail = getDecodedEmail();

        const copyLabel = container.getAttribute('data-copy-label') || 'Copier';
        const copiedLabel = container.getAttribute('data-copied-label') || 'Copie !';
        const sendLabel = container.getAttribute('data-send-label') || 'Envoyer email';

        container.innerHTML = `
            <div class="inline-flex rounded-md shadow-lg isolate bg-white/10 backdrop-blur-sm border border-white/20">
                <button type="button" id="btn-copy-action"
                    class="relative inline-flex items-center gap-x-2 rounded-l-md bg-transparent px-5 py-3 text-sm font-bold text-white hover:bg-white/20 focus:z-10 focus:outline-none transition-all">
                    <svg class="w-4 h-4" aria-hidden="true" focusable="false"><use href="#icon-copy"></use></svg>
                    <span>${decodedEmail}</span>
                </button>
                <a href="mailto:${decodedEmail}"
                    class="relative -ml-px inline-flex items-center rounded-r-md bg-transparent px-4 py-3 text-white hover:bg-white/20 focus:z-10 focus:outline-none transition-all border-l border-white/20"
                    aria-label="${sendLabel}">
                    <svg class="w-4 h-4" aria-hidden="true" focusable="false"><use href="#icon-send"></use></svg>
                </a>
            </div>
            <div id="copy-toast" class="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded opacity-0 transition-opacity duration-300 pointer-events-none">
                ${copiedLabel}
            </div>
        `;

        const copyBtn = document.getElementById('btn-copy-action');
        const toast = document.getElementById('copy-toast');
        if (!copyBtn || !toast) return;

        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(decodedEmail);
                toast.classList.remove('opacity-0', 'translate-y-2');
                const textSpan = copyBtn.querySelector('span');
                const originalText = textSpan ? textSpan.innerText : decodedEmail;
                if (textSpan) textSpan.innerText = copiedLabel;

                setTimeout(() => {
                    toast.classList.add('opacity-0', 'translate-y-2');
                    if (textSpan) textSpan.innerText = originalText;
                }, 2000);
            } catch (error) {
                console.error('Copy failed', error);
            }
        });
    }

    initObfuscatedEmailLinks();
    initObfuscatedPhoneLinks();
    initHybridEmail();

    // Experience modals
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const modalCloseButtons = document.querySelectorAll('[data-modal-close]');

    const closeModal = (modal) => {
        if (modal && typeof modal.close === 'function') {
            modal.close();
        }
    };

    modalTriggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
            const targetId = trigger.getAttribute('data-modal-target');
            const modal = targetId ? document.getElementById(targetId) : null;
            if (modal && typeof modal.showModal === 'function') {
                modal.showModal();
            }
        });
    });

    modalCloseButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const modal = button.closest('dialog');
            closeModal(modal);
        });
    });

    const experienceModals = document.querySelectorAll('dialog.experience-modal');
    experienceModals.forEach((modal) => {
        modal.addEventListener('click', (event) => {
            const rect = modal.getBoundingClientRect();
            const isClickOutside =
                event.clientX < rect.left ||
                event.clientX > rect.right ||
                event.clientY < rect.top ||
                event.clientY > rect.bottom;

            if (isClickOutside) {
                closeModal(modal);
            }
        });
    });

    // Active nav link on scroll (Scroll Spy)
    const navLinks = document.querySelectorAll('nav a[href^="#"], #mobile-menu a[href^="#"]');
    const sectionTargets = document.querySelectorAll('section[id]');

    const setActiveLink = (sectionId) => {
        if (!sectionId) return;
        navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            const isActive = href === `#${sectionId}`;

            if (isActive) {
                // Active link style
                link.classList.add('text-brand', 'font-bold');
                link.classList.remove('text-slate-600', 'text-slate-700', 'font-medium');
            } else {
                // Default link style
                link.classList.remove('text-brand', 'font-bold');
                link.classList.add('font-medium');

                if (link.closest('#mobile-menu')) {
                    link.classList.add('text-slate-700');
                } else {
                    link.classList.add('text-slate-600');
                }
            }
        });
    };

    const navObserver = new IntersectionObserver(
        (entries) => {
            const visibleEntries = entries.filter((entry) => entry.isIntersecting);
            if (!visibleEntries.length) return;

            visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
            const mostVisible = visibleEntries[0];
            setActiveLink(mostVisible.target.id);
        },
        {
            rootMargin: '-20% 0px -60% 0px',
            threshold: [0.1, 0.25, 0.5, 0.75],
        }
    );

    sectionTargets.forEach((section) => navObserver.observe(section));
});
