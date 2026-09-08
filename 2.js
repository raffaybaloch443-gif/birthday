// ===== MAIN PAGE INITIALIZATION & EVENT HANDLERS =====

function loadSupportingScripts() {
    const scripts = ['3.js', '4.js', '5.js'];

    return Promise.all(scripts.map(src => new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Unable to load ${src}`));
        document.body.appendChild(script);
    })));
}

function initializeBirthdayWebsite() {
    initializeContent();
    setupEventListeners();
    startAutoSlide();
    setupScrollAnimations();

    if (typeof setupSliderTouchControls === 'function') setupSliderTouchControls();
    if (typeof initializeVisualEffects === 'function') initializeVisualEffects();
    if (typeof initializeCelebrationAudio === 'function') initializeCelebrationAudio();
}

function initializeContent() {
    document.title = `Happy Birthday, ${config.name}!`;

    const nameDisplay = document.getElementById('nameDisplay');
    const footerName = document.getElementById('footerName');
    const messageTitle = document.querySelector('.message-title');
    const messageContent = document.querySelector('.message-content');
    const ageCounter = document.querySelector('.age-counter');

    if (nameDisplay) nameDisplay.textContent = config.name;
    if (footerName) footerName.textContent = config.name;
    if (messageTitle) messageTitle.textContent = config.mainMessage;
    if (messageContent) messageContent.textContent = config.messageText;
    if (ageCounter) ageCounter.textContent = config.age;

    updateSlider();
    initializeMemories();
}

function setupEventListeners() {
    const openBtn = document.getElementById('openBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const celebrationBtn = document.getElementById('celebrationBtn');

    if (openBtn) openBtn.addEventListener('click', handleOpen);
    if (prevBtn) prevBtn.addEventListener('click', () => changeSlide(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => changeSlide(1));
    if (celebrationBtn) celebrationBtn.addEventListener('click', triggerCelebration);

    setupKeyboardNavigation();
    setupNavigationLinks();
    setupHoverEffects();
}

function setupKeyboardNavigation() {
    document.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft') changeSlide(-1);
        if (event.key === 'ArrowRight') changeSlide(1);
    });
}

function setupNavigationLinks() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

function setupHoverEffects() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('mouseenter', function () {
            this.style.color = 'var(--primary-color)';
        });
        link.addEventListener('mouseleave', function () {
            this.style.color = '';
        });
    });
}

function handleOpen() {
    const surpriseSection = document.querySelector('.surprise-section');
    if (!surpriseSection) return;

    surpriseSection.style.animation = 'fadeOut 0.6s ease-out forwards';

    setTimeout(() => {
        surpriseSection.style.display = 'none';

        document.querySelectorAll('.hidden-section').forEach((section, index) => {
            setTimeout(() => {
                section.classList.remove('hidden-section');
                section.classList.add('visible');
            }, index * 200);
        });

        createConfetti();

        setTimeout(() => {
            const hero = document.getElementById('hero');
            if (hero) hero.scrollIntoView({ behavior: 'smooth' });
        }, 500);
    }, 600);
}

function triggerCelebration() {
    createConfetti();

    const celebrationSection = document.getElementById('celebration');
    if (celebrationSection) {
        celebrationSection.style.animation = 'pulse 1s ease-out';
    }

    playCelebrationAudio();

    setTimeout(() => {
        const footer = document.querySelector('.footer');
        if (footer) footer.scrollIntoView({ behavior: 'smooth' });
    }, 500);
}

function addDynamicAnimations() {
    if (document.getElementById('birthdayAnimationStyle')) return;

    const style = document.createElement('style');
    style.id = 'birthdayAnimationStyle';
    style.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; transform: scale(0.95); }
        }
    `;
    document.head.appendChild(style);
}

function setupSmoothScrollBehavior() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (event) {
            event.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

function setupLazyLoading() {
    if (!('IntersectionObserver' in window)) return;

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const image = entry.target;
            if (image.dataset.src) {
                image.src = image.dataset.src;
                image.removeAttribute('data-src');
            }
            observer.unobserve(image);
        });
    });

    document.querySelectorAll('img[data-src]').forEach(image => imageObserver.observe(image));
}

function setupAccessibility() {
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') return;
        if (event.key === 'Tab') return;
    });
}

function throttle(func, limit) {
    let inThrottle = false;

    return function (...args) {
        if (inThrottle) return;

        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => {
            inThrottle = false;
        }, limit);
    };
}

function updateBirthdayConfig(newConfig) {
    Object.assign(config, newConfig);
    initializeContent();
    if (typeof initializeCelebrationAudio === 'function') initializeCelebrationAudio();
}

function setBirthdayName(name) {
    config.name = name;
    const nameDisplay = document.getElementById('nameDisplay');
    const footerName = document.getElementById('footerName');

    if (nameDisplay) nameDisplay.textContent = name;
    if (footerName) footerName.textContent = name;
    document.title = `Happy Birthday, ${name}!`;
}

function setBirthdayAge(age) {
    config.age = age;
    const ageCounter = document.querySelector('.age-counter');
    if (ageCounter) ageCounter.textContent = age;
}

function setPhotos(photos) {
    config.photos = photos;
    currentSlideIndex = 0;
    updateSlider();
}

function setMemories(memories) {
    config.memories = memories;
    initializeMemories();
}

window.updateBirthdayConfig = updateBirthdayConfig;
window.setBirthdayName = setBirthdayName;
window.setBirthdayAge = setBirthdayAge;
window.setPhotos = setPhotos;
window.setMemories = setMemories;

function initializePageFeatures() {
    addDynamicAnimations();
    setupSmoothScrollBehavior();
    setupLazyLoading();
    setupAccessibility();
}

function startApplication() {
    initializePageFeatures();

    loadSupportingScripts()
        .then(() => initializeBirthdayWebsite())
        .catch(error => console.error('Birthday website modules failed to load:', error));
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApplication);
} else {
    startApplication();
}

console.log('Birthday website main module loaded.');
