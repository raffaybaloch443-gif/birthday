// ===== PHOTO SLIDER =====

let currentSlideIndex = 0;
let autoSlideInterval;
let celebrationMp4 = null;

function updateSlider() {
    const wrapper = document.querySelector('.slider-wrapper');
    if (!wrapper || !Array.isArray(config.photos)) return;
    wrapper.innerHTML = '';
    config.photos.forEach(photo => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.innerHTML = `<img src="${photo.url}" alt="${photo.caption || ''}" loading="lazy"><div class="slide-caption">${photo.caption || ''}</div>`;
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
    if (wrapper) wrapper.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === currentSlideIndex));
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
    container.addEventListener('touchstart', event => {
        startX = event.changedTouches[0].screenX;
    }, { passive: true });
    container.addEventListener('touchend', event => {
        const distance = event.changedTouches[0].screenX - startX;
        if (Math.abs(distance) > 50) changeSlide(distance < 0 ? 1 : -1);
    }, { passive: true });
}

// ===== MP4 AUDIO SYSTEM =====
function getMp4Source() {
    if (config.celebrationMedia?.type === 'mp4' && config.celebrationMedia.src) return config.celebrationMedia.src;
    if (config.mp4Audio) return config.mp4Audio;
    return 'audio/birthday.mp4';
}

function initializeMp4Audio() {
    const src = getMp4Source();
    if (!src) return;
    if (!celebrationMp4) {
        celebrationMp4 = document.createElement('video');
        celebrationMp4.id = 'birthdayMp4Audio';
        celebrationMp4.preload = 'auto';
        celebrationMp4.playsInline = true;
        celebrationMp4.controls = false;
        celebrationMp4.style.display = 'none';
        document.body.appendChild(celebrationMp4);
    }
    celebrationMp4.src = src;
    celebrationMp4.loop = Boolean(config.celebrationMedia?.loop);
    celebrationMp4.volume = Math.min(1, Math.max(0, Number(config.celebrationMedia?.volume ?? 1)));
    celebrationMp4.load();
}

function playMp4Audio() {
    initializeMp4Audio();
    if (!celebrationMp4) return;
    celebrationMp4.currentTime = 0;
    celebrationMp4.play().catch(error => console.warn('MP4 audio could not be played:', error));
}

function stopMp4Audio() {
    if (!celebrationMp4) return;
    celebrationMp4.pause();
    celebrationMp4.currentTime = 0;
}

window.currentSlide = currentSlide;
window.changeSlide = changeSlide;
window.playMp4Audio = playMp4Audio;
window.stopMp4Audio = stopMp4Audio;

document.addEventListener('DOMContentLoaded', setupSliderTouchControls);
