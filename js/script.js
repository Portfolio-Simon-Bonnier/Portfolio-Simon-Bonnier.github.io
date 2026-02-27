document.addEventListener('DOMContentLoaded', () => {
    if (typeof AOS !== 'undefined') {
        AOS.init({ once: true, offset: 50, duration: 800 });
    }

    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) {
        copyrightYear.textContent = String(new Date().getFullYear());
    }

    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('shadow-md', window.scrollY > 20);
        });
    }

    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileBtn && mobileMenu) {
        const closeMenu = () => {
            mobileBtn.setAttribute('aria-expanded', 'false');
            mobileMenu.classList.add('max-h-0', 'opacity-0', '-translate-y-2', 'pointer-events-none');
            mobileMenu.classList.remove('max-h-96', 'opacity-100', 'translate-y-0', 'pointer-events-auto');
        };

        const openMenu = () => {
            mobileBtn.setAttribute('aria-expanded', 'true');
            mobileMenu.classList.remove('max-h-0', 'opacity-0', '-translate-y-2', 'pointer-events-none');
            mobileMenu.classList.add('max-h-96', 'opacity-100', 'translate-y-0', 'pointer-events-auto');
        };

        mobileBtn.setAttribute('aria-expanded', 'false');
        mobileBtn.addEventListener('click', () => {
            const isOpen = mobileBtn.getAttribute('aria-expanded') === 'true';
            if (isOpen) {
                closeMenu();
                return;
            }
            openMenu();
        });

        mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    }

    const isEnglish = window.location.pathname.startsWith('/en/');
    const langHref = isEnglish ? '/' : '/en/';
    const desktopToggle = document.getElementById('lang-toggle-desktop');
    const mobileToggle = document.getElementById('lang-toggle-mobile');
    if (desktopToggle) {
        desktopToggle.setAttribute('href', langHref);
    }
    if (mobileToggle) {
        mobileToggle.setAttribute('href', langHref);
    }

    const copyBtn = document.getElementById('copy-email-btn');
    if (copyBtn) {
        const emailText = copyBtn.parentElement?.querySelector('p')?.textContent?.trim() ?? '';
        const defaultText = copyBtn.getAttribute('data-copy-default') || 'Copy';
        const successText = copyBtn.getAttribute('data-copy-success') || 'Copied!';
        const label = copyBtn.querySelector('span');
        const icon = copyBtn.querySelector('i');

        copyBtn.addEventListener('click', async () => {
            if (!emailText) {
                return;
            }
            try {
                await navigator.clipboard.writeText(emailText);
                copyBtn.classList.remove('bg-white', 'text-accent');
                copyBtn.classList.add('bg-brand', 'text-white');
                if (label) {
                    label.textContent = successText;
                }
                if (icon) {
                    icon.classList.remove('fa-copy');
                    icon.classList.add('fa-check');
                }
                setTimeout(() => {
                    copyBtn.classList.add('bg-white', 'text-accent');
                    copyBtn.classList.remove('bg-brand', 'text-white');
                    if (label) {
                        label.textContent = defaultText;
                    }
                    if (icon) {
                        icon.classList.add('fa-copy');
                        icon.classList.remove('fa-check');
                    }
                }, 2000);
            } catch (error) {
                console.error(error);
            }
        });
    }

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
});
