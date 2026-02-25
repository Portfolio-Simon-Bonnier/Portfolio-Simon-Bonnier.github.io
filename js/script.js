// Initialize Animate On Scroll
AOS.init({
    once: true,
    offset: 50,
    duration: 800,
});

// Keep copyright year in sync with current year
const copyrightYear = document.getElementById('copyright-year');
if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
}

// Navbar blur on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        navbar.classList.add('shadow-md', 'bg-white/95');
        navbar.classList.remove('bg-white/0');
    } else {
        navbar.classList.remove('shadow-md', 'bg-white/95');
        navbar.classList.add('bg-white/0');
    }
});

// Mobile menu toggle
const btn = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');

btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
});

// Close mobile menu when a link is clicked
const mobileLinks = menu.querySelectorAll('a');
mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
        menu.classList.add('hidden');
    });
});

// Form submission behavior (prevent default for demo)
document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();
    alert("Merci ! Dans une version finale, ce formulaire sera relié à une adresse email ou une base de données.");
    this.reset();
});
