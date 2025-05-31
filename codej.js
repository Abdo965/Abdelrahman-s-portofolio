document.addEventListener('DOMContentLoaded', () => {
    const translateBtn = document.getElementById('translateBtn');
    const translatableElements = document.querySelectorAll('[data-en]');
    let currentLang = document.documentElement.lang || 'en';

    function setLanguage(lang) {
        document.documentElement.lang = lang;
        // CSS handles body.dir with html[lang="ar"] body
        currentLang = lang;

        translatableElements.forEach(el => {
            const translation = el.dataset[lang];
            if (translation) {
                if (el.tagName === 'INPUT' && el.placeholder) {
                    el.placeholder = translation;
                } else if (el.tagName === 'META' && el.name === 'description') {
                    el.content = translation;
                } else if (el.tagName === 'IMG' && el.hasAttribute('alt')) {
                    el.alt = translation;
                } else {
                    el.innerHTML = translation;
                }
            }
        });

        if (lang === 'en') {
            translateBtn.textContent = translateBtn.dataset.en;
        } else {
            translateBtn.textContent = translateBtn.dataset.ar;
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
                    const headerOffset = document.querySelector('header').offsetHeight + 20;
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
        const headerHeight = document.querySelector('header').offsetHeight + 40;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight;
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

    const footerParagraph = document.querySelector('footer p');
    if (footerParagraph) {
        const currentYear = new Date().getFullYear();
        const nameEn = "Abdulrahman Elsayed";
        const nameAr = "عبد الرحمن السيد";

        footerParagraph.dataset.en = `&copy; ${currentYear} ${nameEn}. All rights reserved.`;
        footerParagraph.dataset.ar = `&copy; ${currentYear} ${nameAr}. جميع الحقوق محفوظة.`;
    }

    const storedLang = localStorage.getItem('preferredLang');
    if (storedLang) {
        setLanguage(storedLang);
    } else {
        setLanguage(currentLang);
    }
});