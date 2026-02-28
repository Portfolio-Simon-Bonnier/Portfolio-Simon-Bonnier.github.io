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

    // Hybrid Email Logic (Obfuscation)
    function initHybridEmail() {
        const container = document.getElementById('email-hybrid-container');
        if (!container) return;

        const rotor = [19, 7, 23, 11, 5];
        // "simon.bonnier5@gmail.com" obfuscated
        const obfuscatedEmail = [100, 110, 122, 100, 107, 61, 101, 104, 101, 107, 122, 98, 101, 62, 69, 116, 106, 118, 98, 105, 61, 100, 104, 102];
        const decodedEmail = obfuscatedEmail
            .map((value, index) => String.fromCharCode(value ^ rotor[index % rotor.length]))
            .join('');

        const copyLabel = container.getAttribute('data-copy-label') || 'Copy';
        const copiedLabel = container.getAttribute('data-copied-label') || 'Copied!';
        const sendLabel = container.getAttribute('data-send-label') || 'Send email';

        container.innerHTML = `
            <div class="inline-flex rounded-md shadow-lg isolate">
                <button type="button" id="btn-copy-action"
                    class="relative inline-flex items-center gap-x-2 rounded-l-md bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-dark focus:z-10 focus:outline-none transition-all">
                    <svg class="w-4 h-4" aria-hidden="true" focusable="false"><use href="#icon-copy"></use></svg>
                    <span>${decodedEmail}</span>
                </button>
                <a href="mailto:${decodedEmail}"
                    class="relative -ml-px inline-flex items-center rounded-r-md bg-brand px-4 py-3 text-white hover:bg-brand-dark focus:z-10 focus:outline-none transition-all border-l border-white/20"
                    aria-label="${sendLabel}">
                    <svg class="w-4 h-4" aria-hidden="true" focusable="false"><use href="#icon-send"></use></svg>
                </a>
            </div>
            <div id="copy-toast" class="absolute -top-10 left-1/2 -translate-x-1/2 translate-y-2 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded opacity-0 transition-all duration-300 pointer-events-none">
                ${copiedLabel}
            </div>
        `;

        const copyBtn = document.getElementById('btn-copy-action');
        const toast = document.getElementById('copy-toast');
        if (!copyBtn || !toast) return;

        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(decodedEmail);
                const textSpan = copyBtn.querySelector('span');
                const originalText = textSpan ? textSpan.innerText : decodedEmail;
                if (textSpan) textSpan.innerText = copiedLabel;
                copyBtn.classList.add('bg-green-500');
                copyBtn.classList.remove('bg-brand');
                toast.classList.remove('opacity-0', 'translate-y-2');

                setTimeout(() => {
                    toast.classList.add('opacity-0', 'translate-y-2');
                    copyBtn.classList.remove('bg-green-500');
                    copyBtn.classList.add('bg-brand');
                    if (textSpan) textSpan.innerText = originalText;
                }, 2000);
            } catch (error) {
                const textSpan = copyBtn.querySelector('span');
                if (textSpan) textSpan.innerText = copyLabel;
            }
        });
    }

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
                link.classList.add('text-brand');
                link.classList.remove('text-slate-600', 'text-slate-700');
            } else {
                link.classList.remove('text-brand');
                link.classList.add(link.closest('#mobile-menu') ? 'text-slate-700' : 'text-slate-600');
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
