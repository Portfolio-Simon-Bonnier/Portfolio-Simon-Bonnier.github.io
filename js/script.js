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

    // Form submission behavior (prevent default for demo)
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            alert("Merci ! Dans une version finale, ce formulaire sera reli\u00e9 \u00e0 une adresse email ou une base de donn\u00e9es.");
            this.reset();
        });
    }
});
