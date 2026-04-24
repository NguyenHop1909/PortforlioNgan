// Reveal elements on scroll
const reveal = () => {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            el.classList.add('active');
        }
    });
};

const getSavedLanguage = () => localStorage.getItem('portfolioLang') || 'vi';

const translateElement = (element, locale) => {
    const htmlKey = `${locale}Html`;
    const textKey = locale;
    if (element.dataset[htmlKey] !== undefined) {
        element.innerHTML = element.dataset[htmlKey];
    } else if (element.dataset[textKey] !== undefined) {
        element.textContent = element.dataset[textKey];
    }
};

const setLanguage = (locale) => {
    document.documentElement.lang = locale;
    document.querySelectorAll('[data-vi]').forEach(el => translateElement(el, locale));
    const langToggleBtn = document.getElementById('lang-toggle');
    if (langToggleBtn) {
        langToggleBtn.textContent = locale === 'en' ? 'VI' : 'EN';
    }
    const showMoreBtn = document.getElementById('show-more-btn');
    if (showMoreBtn) {
        const hiddenProjects = document.querySelectorAll('.project-card.hidden');
        const isHidden = hiddenProjects.length > 0;
        showMoreBtn.textContent = isHidden ? (locale === 'en' ? 'Show more projects' : 'Xem thêm dự án') : (locale === 'en' ? 'Show less projects' : 'Ẩn bớt dự án');
    }
    localStorage.setItem('portfolioLang', locale);
};

const initLanguageToggle = () => {
    const langToggleBtn = document.getElementById('lang-toggle');
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            const nextLang = document.documentElement.lang === 'en' ? 'vi' : 'en';
            setLanguage(nextLang);
        });
    }
    setLanguage(getSavedLanguage());
};

const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
};

const initLeafMotion = () => {
    window.addEventListener('scroll', () => {
        const leaves = document.querySelectorAll('.leaf-decoration');
        if (!leaves.length) return;
        const value = window.scrollY;
        leaves.forEach((leaf, index) => {
            const speed = index === 0 ? 0.45 : 0.25;
            leaf.style.top = `${value * speed + (index === 0 ? 120 : 220)}px`;
        });
    });
};

window.addEventListener('scroll', reveal);

const initShowMore = () => {
    const showMoreBtn = document.getElementById('show-more-btn');
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', () => {
            const hiddenProjects = document.querySelectorAll('.project-card.hidden');
            const isHidden = hiddenProjects.length > 0;
            if (isHidden) {
                hiddenProjects.forEach(card => card.classList.remove('hidden'));
                showMoreBtn.textContent = document.documentElement.lang === 'en' ? 'Show less projects' : 'Ẩn bớt dự án';
            } else {
                const allProjects = document.querySelectorAll('.project-card');
                allProjects.forEach((card, index) => {
                    if (index >= 4) card.classList.add('hidden');
                });
                showMoreBtn.textContent = document.documentElement.lang === 'en' ? 'Show more projects' : 'Xem thêm dự án';
            }
        });
    }
};

window.addEventListener('DOMContentLoaded', () => {
    initLanguageToggle();
    initSmoothScroll();
    initLeafMotion();
    initShowMore();
    reveal();
});