```js
// ===== GLOBAL VARIABLES ===== 
let currentSlideIndex = 0; 
let autoSlideInterval; 
 
// ===== INITIALIZATION ===== 
document.addEventListener('DOMContentLoaded', function() { 
    initializeContent(); 
    setupEventListeners(); 
    startAutoSlide(); 
    setupScrollAnimations(); 
}); 
 
// ===== CONTENT INITIALIZATION ===== 
function initializeContent() { 
    // Update page title 
    document.title = `Happy Birthday, ${config.name}!`; 
     
    // Update name references 
    document.getElementById('nameDisplay').textContent = config.name; 
    document.getElementById('footerName').textContent = config.name; 
     
    // Update message content 
    const messageTitle = document.querySelector('.message-title'); 
    if (messageTitle) { 
        messageTitle.textContent = config.mainMessage; 
    } 
     
    const messageContent = document.querySelector('.message-content'); 
    if (messageContent) { 
        messageContent.textContent = config.messageText; 
    } 
     
    // Update age 
    const ageCounter = document.querySelector('.age-counter'); 
    if (ageCounter) { 
        ageCounter.textContent = config.age; 
    } 
     
    // Initialize photos 
    updateSlider(); 
     
    // Initialize memories 
    initializeMemories(); 
} 
 
// ===== EVENT LISTENERS ===== 
function setupEventListeners() { 
    // Open button 
    const openBtn = document.getElementById('openBtn'); 
    if (openBtn) { 
        openBtn.addEventListener('click', handleOpen); 
    } 
     
    // Slider buttons 
    const prevBtn = document.getElementById('prevBtn'); 
    const nextBtn = document.getElementById('nextBtn'); 
     
    if (prevBtn) { 
        prevBtn.addEventListener('click', () => changeSlide(-1)); 
    } 
    if (nextBtn) { 
        nextBtn.addEventListener('click', () => changeSlide(1)); 
    } 
     
    // Keyboard navigation 
    document.addEventListener('keydown', function(e) { 
        if (e.key === 'ArrowLeft') changeSlide(-1); 
        if (e.key === 'ArrowRight') changeSlide(1); 
    }); 
     
    // Navigation links 
    const navLinks = document.querySelectorAll('.nav-link'); 
    navLinks.forEach(link => { 
        link.addEventListener('click', function(e) { 
            e.preventDefault(); 
            const targetId = this.getAttribute('href'); 
            const targetSection = document.querySelector(targetId); 
            if (targetSection) { 
                targetSection.scrollIntoView({ behavior: 'smooth' }); 
            } 
        }); 
    }); 
} 
 
// ===== OPEN SURPRISE SECTION ===== 
function handleOpen() { 
    // Hide surprise section 
    const surpriseSection = document.querySelector('.surprise-section'); 
    surpriseSection.style.animation = 'fadeOut 0.6s ease-out forwards'; 
     
    // Show other sections 
    setTimeout(() => { 
        surpriseSection.style.display = 'none'; 
         
        // Show and animate sections 
        const hiddenSections = document.querySelectorAll('.hidden-section'); 
        hiddenSections.forEach((section, index) => { 
            setTimeout(() => { 
                section.classList.remove('hidden-section'); 
                section.classList.add('visible'); 
            }, index * 200); 
        }); 
         
        // Trigger confetti 
        createConfetti(); 
         
        // Scroll to hero 
        setTimeout(() => { 
            document.getElementById('hero').scrollIntoView({ behavior: 'smooth' }); 
        }, 500); 
    }, 600); 
} 
 
// Add fadeOut animation to CSS dynamically 
const style = document.createElement('style'); 
style.textContent = ` 
    @keyframes fadeOut { 
        from { 
            opacity: 1; 
        } 
        to { 
            opacity: 0; 
            transform: scale(0.95); 
        } 
    } 
`; 
document.head.appendChild(style); 
 
// ===== CONFETTI EFFECT ===== 
function createConfetti() { 
    const container = document.getElementById('confettiContainer'); 
    if (!container) return; 
     
    const confettiCount = 50; 
    const colors = ['#C9A961', '#D4AF37', '#F5E6E3', '#E8D4C4', '#A78B7F']; 
    const emojis = ['✨', '💝', '🎉', '💕', '⭐', '🌸', '💖']; 
     
    for (let i = 0; i < confettiCount; i++) { 
        const confetti = document.createElement('div'); 
        confetti.className = 'confetti particle'; 
         
        // Random emoji or shape 
        const isEmoji = Math.random() > 0.5; 
        if (isEmoji) { 
            confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)]; 
        } else { 
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]; 
            confetti.style.width = Math.random() * 10 + 5 + 'px'; 
            confetti.style.height = confetti.style.width; 
            confetti.style.borderRadius = '50%'; 
        } 
         
        // Random starting position 
        confetti.style.left = Math.random() * 100 + '%'; 
        confetti.style.top = '-20px'; 
         
        // Random animation properties 
        const duration = Math.random() * 2 + 2.5; 
        const delay = Math.random() * 0.5; 
        const xOffset = (Math.random() - 0.5) * 200; 
         
        confetti.style.setProperty('--x-offset', xOffset + 'px'); 
        confetti.style.animation = `confettiFall ${duration}s ease-out ${delay}s forwards`; 
         
        container.appendChild(confetti); 
         
        // Remove after animation completes 
        setTimeout(() => { 
            confetti.remove(); 
        }, (duration + delay) * 1000); 
    } 
} 
 
// Update confetti animation to include horizontal movement 
const confettiStyle = document.createElement('style'); 
confettiStyle.textContent = ` 
    @keyframes confettiFall { 
        to { 
            transform: translateY(100vh) translateX(var(--x-offset)) rotate(720deg); 
            opacity: 0; 
        } 
    } 
`; 
document.head.appendChild(confettiStyle); 
 
// ===== SLIDER FUNCTIONALITY ===== 
function updateSlider() { 
    const wrapper = document.querySelector('.slider-wrapper'); 
    if (!wrapper) return; 
     
    // Clear existing slides 
    wrapper.innerHTML = ''; 
     
    // Create slides from config 
    config.photos.forEach((photo) => { 
        const slide = document.createElement('div'); 
        slide.className = 'slide'; 
        slide.innerHTML = ` 
            <img src="${photo.url}" alt="${photo.caption}" loading="lazy"> 
            <div class="slide-caption">${photo.caption}</div> 
        `; 
        wrapper.appendChild(slide); 
    }); 
     
    showSlide(0); 
} 
 
function currentSlide(n) { 
    clearInterval(autoSlideInterval); 
    showSlide(currentSlideIndex = n); 
    startAutoSlide(); 
} 
 
function changeSlide(n) { 
    clearInterval(autoSlideInterval); 
    showSlide(currentSlideIndex += n); 
    startAutoSlide(); 
} 
 
function showSlide(n) { 
    const wrapper = document.querySelector('.slider-wrapper'); 
    const slides = document.querySelectorAll('.slide'); 
    const dots = document.querySelectorAll('.dot'); 
     
    if (!slides.length) return; 
     
    // Wrap around 
    if (n >= slides.length) { 
        currentSlideIndex = 0; 
    } 
    if (n < 0) { 
        currentSlideIndex = slides.length - 1; 
    } 
     
    // Update slider position 
    if (wrapper) { 
        wrapper.style.transform = `translateX(-${currentSlideIndex * 100}%)`; 
    } 
     
    // Update dots 
    dots.forEach((dot, index) => { 
        dot.classList.toggle('active', index === currentSlideIndex); 
    }); 
} 
 
function startAutoSlide() { 
    clearInterval(autoSlideInterval); 
    autoSlideInterval = setInterval(() => { 
        changeSlide(1); 
    }, 5000); 
} 
 
// ===== MEMORIES SECTION ===== 
function initializeMemories() { 
    const grid = document.querySelector('.memories-grid'); 
    if (!grid || !config.memories) return; 
     
    // Only override if there are custom memories 
    if (config.memories.length > 0) { 
        grid.innerHTML = ''; 
         
        config.memories.forEach((memory) => { 
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
} 
 
// ===== SCROLL ANIMATIONS ===== 
function setupScrollAnimations() { 
    // Observe elements for fade-in animations 
    const observerOptions = { 
        threshold: 0.1, 
        rootMargin: '0px 0px -50px 0px' 
    }; 
     
    const observer = new IntersectionObserver(function(entries) { 
        entries.forEach(entry => { 
            if (entry.isIntersecting) { 
                if (entry.target.classList.contains('fade-in-element')) { 
                    entry.target.style.animation = 'slideUp 0.8s ease-out forwards'; 
                } 
                observer.unobserve(entry.target); 
            } 
        }); 
    }, observerOptions); 
     
    // Observe all fade-in elements 
    const fadeElements = document.querySelectorAll('.fade-in-element'); 
    fadeElements.forEach(el => { 
        observer.observe(el); 
    }); 
     
    // Animate on scroll - update continuously 
    window.addEventListener('scroll', animateOnScroll, { passive: true }); 
} 
 
function animateOnScroll() { 
    const sections = document.querySelectorAll('section'); 
     
    sections.forEach(section => { 
        const rect = section.getBoundingClientRect(); 
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0; 
         
        if (isVisible && !section.classList.contains('animated')) { 
            // Add animation classes as sections come into view 
            section.querySelectorAll('.fade-in-element').forEach(el => { 
                if (!el.style.animation) { 
                    el.style.animation = 'slideUp 0.8s ease-out forwards'; 
                } 
            }); 
        } 
    }); 
} 
 
// ===== SMOOTH SCROLL BEHAVIOR ===== 
document.querySelectorAll('a[href^="#"]').forEach(anchor => { 
    anchor.addEventListener('click', function (e) { 
        e.preventDefault(); 
        const target = document.querySelector(this.getAttribute('href')); 
        if (target) { 
            target.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            }); 
        } 
    }); 
}); 
 
// ===== LAZY LOADING FOR IMAGES ===== 
if ('IntersectionObserver' in window) { 
    const imageObserver = new IntersectionObserver((entries, observer) => { 
        entries.forEach(entry => { 
            if (entry.isIntersecting) { 
                const img = entry.target; 
                if (img.dataset.src) { 
                    img.src = img.dataset.src; 
                    img.removeAttribute('data-src'); 
                } 
                imageObserver.unobserve(img); 
            } 
        }); 
    }); 
     
    document.querySelectorAll('img[data-src]').forEach(img => { 
        imageObserver.observe(img); 
    }); 
} 
 
// ===== HOVER EFFECTS ===== 
document.querySelectorAll('.nav-link').forEach(link => { 
    link.addEventListener('mouseenter', function() { 
        this.style.color = 'var(--primary-color)'; 
    }); 
    link.addEventListener('mouseleave', function() { 
        this.style.color = ''; 
    }); 
}); 
 
// ===== PAGE PERFORMANCE OPTIMIZATION ===== 
// Throttle scroll events for better performance 
function throttle(func, limit) { 
    let inThrottle; 
    return function() { 
        const args = arguments; 
        const context = this; 
        if (!inThrottle) { 
            func.apply(context, args); 
            inThrottle = true; 
            setTimeout(() => inThrottle = false, limit); 
        } 
    }; 
} 
 
window.addEventListener('scroll', throttle(animateOnScroll, 100), { passive: true }); 
 
// ===== ACCESSIBILITY: KEYBOARD NAVIGATION ===== 
document.addEventListener('keydown', function(e) { 
    if (e.key === 'Escape') { 
        // Could be used for future modal dismissals 
    } 
     
    // Tab through buttons 
    if (e.key === 'Tab') { 
        // Native behavior - let it work 
    } 
}); 
 
// ===== UTILITY FUNCTIONS FOR CUSTOMIZATION ===== 
// Function to easily update configuration 
window.updateBirthdayConfig = function(newConfig) { 
    Object.assign(config, newConfig); 
    initializeContent(); 
}; 
 
// Function to change specific values 
window.setBirthdayName = function(name) { 
    config.name = name; 
    document.getElementById('nameDisplay').textContent = name; 
    document.getElementById('footerName').textContent = name; 
    document.title = `Happy Birthday, ${name}!`; 
}; 
 
window.setBirthdayAge = function(age) { 
    config.age = age; 
    const ageCounter = document.querySelector('.age-counter'); 
    if (ageCounter) { 
        ageCounter.textContent = age; 
    } 
}; 
 
window.setPhotos = function(photos) { 
    config.photos = photos; 
    currentSlideIndex = 0; 
    updateSlider(); 
}; 
 
window.setMemories = function(memories) { 
    config.memories = memories; 
    initializeMemories(); 
}; 
 
// ===== READY STATE ===== 
console.log('Birthday website loaded and ready!'); 
console.log('Configuration:', config); 
```
