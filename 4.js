// ===== VISUAL EFFECTS, MEMORIES & SCROLL ANIMATIONS =====

function createConfetti() {
    const container = document.getElementById('confettiContainer');
    if (!container) return;

    const confettiCount = 50;
    const colors = ['#C9A961', '#D4AF37', '#F5E6E3', '#E8D4C4', '#A78B7F'];
    const emojis = ['✨', '💝', '🎉', '💕', '⭐', '🌸', '💖'];

    for (let i = 0; i < confettiCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'confetti particle';

        if (Math.random() > 0.5) {
            particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        } else {
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.width = `${Math.random() * 10 + 5}px`;
            particle.style.height = particle.style.width;
            particle.style.borderRadius = '50%';
        }

        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = '-20px';

        const duration = Math.random() * 2 + 2.5;
        const delay = Math.random() * 0.5;
        const xOffset = (Math.random() - 0.5) * 200;

        particle.style.setProperty('--x-offset', `${xOffset}px`);
        particle.style.animation = `confettiFall ${duration}s ease-out ${delay}s forwards`;
        container.appendChild(particle);

        setTimeout(() => particle.remove(), (duration + delay) * 1000);
    }
}

function addConfettiAnimation() {
    if (document.getElementById('confettiAnimationStyle')) return;

    const style = document.createElement('style');
    style.id = 'confettiAnimationStyle';
    style.textContent = `
        @keyframes confettiFall {
            to {
                transform: translateY(100vh) translateX(var(--x-offset)) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

function initializeMemories() {
    const grid = document.querySelector('.memories-grid');
    if (!grid || !Array.isArray(config.memories)) return;
    if (config.memories.length === 0) return;

    grid.innerHTML = '';

    config.memories.forEach(memory => {
        const card = document.createElement('div');
        card.className = 'memory-card fade-in-element';
        card.innerHTML = `
            <div class="memory-image">
                <img src="${memory.image}" alt="${memory.title}" loading="lazy">
            </div>
            <div class="memory-content">
                <h3 class="memory-title">${memory.title}</h3>
                <p class="memory-text">${memory.text}</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            if (entry.target.classList.contains('fade-in-element')) {
                entry.target.style.animation = 'slideUp 0.8s ease-out forwards';
            }

            observer.unobserve(entry.target);
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-element').forEach(element => {
        observer.observe(element);
    });

    window.addEventListener('scroll', animateOnScroll, { passive: true });
}

function animateOnScroll() {
    document.querySelectorAll('section').forEach(section => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            section.querySelectorAll('.fade-in-element').forEach(element => {
                if (!element.style.animation) {
                    element.style.animation = 'slideUp 0.8s ease-out forwards';
                }
            });
        }
    });
}

function initializeVisualEffects() {
    addConfettiAnimation();
}

document.addEventListener('DOMContentLoaded', initializeVisualEffects);
