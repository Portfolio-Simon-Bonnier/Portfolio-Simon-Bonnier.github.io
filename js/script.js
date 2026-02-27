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

    // Click-to-copy contact email
    const copyEmailBtn = document.getElementById('copy-email-btn');
    if (copyEmailBtn) {
        let feedbackTimeout = null;

        const copyIcon = copyEmailBtn.querySelector('[data-copy-icon]');
        const checkIcon = copyEmailBtn.querySelector('[data-check-icon]');
        const labelEl = copyEmailBtn.querySelector('[data-copy-label]');
        const defaultLabel = copyEmailBtn.getAttribute('data-label-copy') || 'Copy';
        const copiedLabel = copyEmailBtn.getAttribute('data-label-copied') || 'Copied!';
        const copyText = copyEmailBtn.getAttribute('data-copy-text') || '';

        const setDefaultState = () => {
            copyEmailBtn.classList.remove('bg-emerald-600', 'hover:bg-emerald-700');
            copyEmailBtn.classList.add('bg-brand', 'hover:bg-brand-dark');
            if (copyIcon) copyIcon.classList.remove('hidden');
            if (checkIcon) checkIcon.classList.add('hidden');
            if (labelEl) labelEl.textContent = defaultLabel;
        };

        const setCopiedState = () => {
            copyEmailBtn.classList.remove('bg-brand', 'hover:bg-brand-dark');
            copyEmailBtn.classList.add('bg-emerald-600', 'hover:bg-emerald-700');
            if (copyIcon) copyIcon.classList.add('hidden');
            if (checkIcon) checkIcon.classList.remove('hidden');
            if (labelEl) labelEl.textContent = copiedLabel;
        };

        setDefaultState();

        copyEmailBtn.addEventListener('click', async () => {
            if (!copyText) return;

            try {
                await navigator.clipboard.writeText(copyText);
                setCopiedState();
                if (feedbackTimeout) clearTimeout(feedbackTimeout);
                feedbackTimeout = setTimeout(() => {
                    setDefaultState();
                }, 2000);
            } catch (error) {
                setDefaultState();
            }
        });
    }

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
});
