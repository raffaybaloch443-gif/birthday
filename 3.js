// ===== PHOTO SLIDER =====

let currentSlideIndex = 0;
let autoSlideInterval;

function updateSlider() {
    const wrapper = document.querySelector('.slider-wrapper');
    if (!wrapper || !Array.isArray(config.photos)) return;

    wrapper.innerHTML = '';

    config.photos.forEach(photo => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.innerHTML = `
            <img src="${photo.url}" alt="${photo.caption || ''}" loading="lazy">
            <div class="slide-caption">${photo.caption || ''}</div>
        `;
        wrapper.appendChild(slide);
    });

    showSlide(0);
}

function currentSlide(index) {
    clearInterval(autoSlideInterval);
    currentSlideIndex = index;
    showSlide(currentSlideIndex);
    startAutoSlide();
}

function changeSlide(step) {
    clearInterval(autoSlideInterval);
    currentSlideIndex += step;
    showSlide(currentSlideIndex);
    startAutoSlide();
}

function showSlide(index) {
    const wrapper = document.querySelector('.slider-wrapper');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    if (!slides.length) return;

    if (index >= slides.length) currentSlideIndex = 0;
    if (index < 0) currentSlideIndex = slides.length - 1;

    if (wrapper) {
        wrapper.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    }

    dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === currentSlideIndex);
    });
}

function startAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => changeSlide(1), 5000);
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = null;
}

function setupSliderTouchControls() {
    const container = document.querySelector('.slider-container');
    if (!container) return;

    let startX = 0;
    let endX = 0;

    container.addEventListener('touchstart', event => {
        startX = event.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', event => {
        endX = event.changedTouches[0].screenX;
        const distance = endX - startX;

        if (Math.abs(distance) > 50) {
            changeSlide(distance < 0 ? 1 : -1);
        }
    }, { passive: true });
}

window.currentSlide = currentSlide;
window.changeSlide = changeSlide;

// Keep slider swipe support independent from the main page logic.
document.addEventListener('DOMContentLoaded', setupSliderTouchControls);
