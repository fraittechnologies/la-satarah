// Animation JavaScript for La Satarah Limited Website

// Fade-in animation for elements
document.addEventListener('DOMContentLoaded', function() {
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.stat-card, .product-card, .section-header');
    
    animatedElements.forEach(element => {
        element.classList.add('fade-in-up');
    });
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize counter animation
    initCounterAnimation();
});

// Enhanced scroll animations with Intersection Observer
function initScrollAnimations() {
    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
                
                // Add staggered animation for stats
                if (entry.target.classList.contains('stat-card')) {
                    const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements
    const elementsToAnimate = document.querySelectorAll(
        '.stat-card, .product-card, .section-header, .intro-content'
    );
    
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

// Counter Animation Function
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    
    // Store original text to extract suffix
    const originalText = element.getAttribute('data-original') || element.textContent;
    element.setAttribute('data-original', originalText);
    
    // Extract suffix (everything that's not a number or comma)
    const suffix = originalText.replace(/[\d,]/g, '').trim();
    
    // Extract numeric value (remove commas and parse)
    const numericTarget = parseFloat(target.replace(/,/g, ''));
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (numericTarget - start) * easeOutQuart);
        
        // Format number with commas if it's large
        let formatted;
        if (numericTarget >= 1000) {
            formatted = current.toLocaleString();
        } else {
            formatted = current.toString();
        }
        
        // Update the element text with proper spacing
        if (suffix) {
            // Handle percentage sign (no space before %)
            if (suffix === '%') {
                element.textContent = formatted + suffix;
            } else {
                element.textContent = formatted + ' ' + suffix;
            }
        } else {
            element.textContent = formatted;
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            // Ensure final value is set correctly
            let finalFormatted;
            if (numericTarget >= 1000) {
                finalFormatted = numericTarget.toLocaleString();
            } else {
                finalFormatted = numericTarget.toString();
            }
            
            if (suffix) {
                if (suffix === '%') {
                    element.textContent = finalFormatted + suffix;
                } else {
                    element.textContent = finalFormatted + ' ' + suffix;
                }
            } else {
                element.textContent = finalFormatted;
            }
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Initialize Counter Animation
function initCounterAnimation() {
    const glanceSection = document.querySelector('.glance-section');
    if (!glanceSection) return;
    
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length === 0) return;
    
    // Create observer for the glance section
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate each stat number
                statNumbers.forEach((statNumber, index) => {
                    const originalText = statNumber.textContent;
                    const numericValue = originalText.replace(/[^\d,]/g, ''); // Extract numbers and commas
                    
                    // Delay each counter slightly for staggered effect
                    setTimeout(() => {
                        animateCounter(statNumber, numericValue, 2000);
                    }, index * 200);
                });
                
                // Unobserve after animation starts to prevent re-triggering
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px'
    });
    
    observer.observe(glanceSection);
}


// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    /* Fade In Up Animation */
    .fade-in-up {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Staggered animation for stats */
    .stat-card {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .stat-card.animate-visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Hero text slide-in animation */
    .hero-content {
        opacity: 0;
        transform: translateX(-100px);
        animation: slideInLeft 1s ease 0.5s forwards;
    }
    
    .hero-title {
        opacity: 0;
        transform: translateX(-80px);
        animation: slideInLeft 0.8s ease 0.7s forwards;
    }
    
    .hero-subtitle {
        opacity: 0;
        transform: translateX(-80px);
        animation: slideInLeft 0.8s ease 0.9s forwards;
    }
    
    .hero-buttons {
        opacity: 0;
        transform: translateX(-80px);
        animation: slideInLeft 0.8s ease 1.1s forwards;
    }
    
    @keyframes slideInLeft {
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    /* Button hover effects */
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .btn::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
    }
    
    .btn:hover::after {
        width: 300px;
        height: 300px;
    }
`;
document.head.appendChild(style);