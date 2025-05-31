document.addEventListener('DOMContentLoaded', () => {
    const translateBtn = document.getElementById('translateBtn');
    const translatableElements = document.querySelectorAll('[data-en]');
    let currentLang = document.documentElement.lang || 'en';

    function setLanguage(lang) {
        document.documentElement.lang = lang;
        // No need to set body.dir, CSS handles it with html[lang="ar"] body
        currentLang = lang;

        translatableElements.forEach(el => {
            const translation = el.dataset[lang];
            if (translation) {
                if (el.tagName === 'INPUT' && el.placeholder) {
                    el.placeholder = translation;
                } else if (el.tagName === 'META' && el.name === 'description') {
                    el.content = translation;
                } else if (el.tagName === 'IMG' && el.hasAttribute('alt')) {
                    el.alt = translation; // For alt text on images if you add data-ar for them
                } else {
                    el.innerHTML = translation; // Use innerHTML to correctly render potential HTML in translations (e.g., in footer)
                }
            }
        });

        if (lang === 'en') {
            translateBtn.textContent = translateBtn.dataset.en; // "Switch to Arabic"
        } else {
            translateBtn.textContent = translateBtn.dataset.ar; // "التحويل إلى الإنجليزية"
        }
        localStorage.setItem('preferredLang', lang);
    }

    translateBtn.addEventListener('click', () => {
        const newLang = currentLang === 'en' ? 'ar' : 'en';
        setLanguage(newLang);
    });

    const navLinks = document.querySelectorAll('header nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    // Calculate offset for fixed header
                    const headerOffset = document.querySelector('header').offsetHeight + 20; // 20px buffer
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });

    const sections = document.querySelectorAll('main section');
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const headerHeight = document.querySelector('header').offsetHeight + 40; //Consider header height + buffer

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight; // Adjust for fixed header
            const sectionBottom = sectionTop + section.offsetHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionBottom) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // Update copyright year and name
    const footerParagraph = document.querySelector('footer p');
    if (footerParagraph) {
        const currentYear = new Date().getFullYear();
        const nameEn = "Abdulrahman Elsayed"; // Your name in English
        const nameAr = "عبد الرحمن السيد";   // Your name in Arabic

        // Update the data attributes first
        footerParagraph.dataset.en = `&copy; ${currentYear} ${nameEn}. All rights reserved.`;
        footerParagraph.dataset.ar = `&copy; ${currentYear} ${nameAr}. جميع الحقوق محفوظة.`;
    }

    // Initialize with default or stored language
    const storedLang = localStorage.getItem('preferredLang');
    if (storedLang) {
        setLanguage(storedLang);
    } else {
        setLanguage(currentLang); // Initial set based on HTML lang or default 'en'
    }
});