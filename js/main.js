// Main JavaScript for La Satarah Limited Website

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileMenu();
    initCarousel();
    initDropdowns();
    initScrollAnimations();
    initHeroSlider();
    setActiveNavLink();
    initContactForm();
});

// Mobile Menu Toggle Functionality
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileToggle && navMenu) {
        // Toggle menu on hamburger click
        mobileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !mobileToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
        
        // Close mobile menu when clicking on a non-dropdown link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Only close menu if not a dropdown parent and if it's an anchor tag
                if (!link.parentElement.classList.contains('dropdown') && link.tagName === 'A') {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                }
            });
        });
        
        // Close menu on dropdown item click
        const dropdownLinks = document.querySelectorAll('.dropdown-menu a');
        dropdownLinks.forEach(link => {
            // Skip submenu parent links
            if (!link.parentElement.classList.contains('dropdown-submenu')) {
                link.addEventListener('click', function() {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                });
            }
        });
        
        // Close menu when clicking on mobile Get In Touch button
        const mobileGetInTouchBtn = document.querySelector('.btn-get-in-touch-mobile');
        if (mobileGetInTouchBtn) {
            mobileGetInTouchBtn.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        }
    }
}

// Dropdown Menu Functionality for Mobile
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        
        // Check if dropdown has menu items (not empty)
        const hasMenuItems = dropdownMenu && dropdownMenu.querySelectorAll('li').length > 0;
        
        if (link) {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 991) {
                    // Only prevent default and toggle dropdown if menu has items
                    // If no menu items, allow normal navigation
                    if (hasMenuItems && link.tagName === 'A') {
                        e.preventDefault();
                        dropdown.classList.toggle('active');
                        
                        // Close other dropdowns
                        dropdowns.forEach(otherDropdown => {
                            if (otherDropdown !== dropdown) {
                                otherDropdown.classList.remove('active');
                            }
                        });
                    }
                    // If no menu items or not an anchor tag, allow normal behavior
                    // (link will navigate normally)
                }
            });
        }
    });
    
    // Handle nested submenu dropdowns for mobile
    const submenus = document.querySelectorAll('.dropdown-submenu');
    
    submenus.forEach(submenu => {
        const link = submenu.querySelector('a');
        
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 991) {
                e.preventDefault();
                e.stopPropagation(); // Prevent parent dropdown from toggling
                submenu.classList.toggle('active');
                
                // Close other submenus
                submenus.forEach(otherSubmenu => {
                    if (otherSubmenu !== submenu) {
                        otherSubmenu.classList.remove('active');
                    }
                });
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.matches('.dropdown, .dropdown *')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
            submenus.forEach(submenu => {
                submenu.classList.remove('active');
            });
        }
    });
    
    // Close menu on submenu item click
    const submenuLinks = document.querySelectorAll('.submenu a');
    submenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            const navMenu = document.getElementById('nav-menu');
            const mobileToggle = document.getElementById('mobile-toggle');
            if (navMenu && mobileToggle) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    });
}

// Product Carousel Functionality
function initCarousel() {
    const carouselTrack = document.getElementById('carousel-track');
    const carouselContainer = document.getElementById('carousel-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    // Sample product data - in a real implementation, this would come from a database or API
    const products = [
        {
            id: 1,
            name: 'Basil',
            category: 'greenhouse',
            description: 'Fresh, aromatic basil with a sweet, slightly peppery flavor.',
            image: 'images/basil.jpg'
        },
        {
            id: 2,
            name: 'Rosemary',
            category: 'open-field',
            description: 'Fragrant rosemary with needle-like leaves and woody stems.',
            image: 'images/rosemary.jpg'
        },
        {
            id: 3,
            name: 'Mint',
            category: 'open-field',
            description: 'Refreshing mint with a cool, sweet flavor and aroma.',
            image: 'images/mint.jpg'
        },
        {
            id: 4,
            name: 'Thyme',
            category: 'open-field',
            description: 'Aromatic thyme with small, grey-green leaves and earthy flavor.',
            image: 'images/thyme.jpg'
        },
        {
            id: 5,
            name: 'Oregano',
            category: 'open-field',
            description: 'Pungent oregano with a robust, slightly bitter flavor.',
            image: 'images/oregano.jpg'
        },
        {
            id: 6,
            name: 'Parsley',
            category: 'open-field',
            description: 'Fresh parsley with a clean, slightly peppery taste.',
            image: 'images/parsley.jpg'
        },
        {
            id: 7,
            name: 'Chives',
            category: 'open-field',
            description: 'Delicate chives with a mild onion-like flavor and subtle garlic notes.',
            image: 'images/chives.jpg'
        },
        {
            id: 8,
            name: 'Tarragon',
            category: 'greenhouse',
            description: 'Aromatic tarragon with a distinctive anise-like flavor and sweet aroma.',
            image: 'images/tarragon.jpg'
        },
        {
            id: 9,
            name: 'Dill',
            category: 'open-field',
            description: 'Feathery dill with a fresh, tangy flavor and delicate aroma.',
            image: 'images/dill.jpg'
        },
        {
            id: 10,
            name: 'Coriander',
            category: 'open-field',
            description: 'Fresh coriander with citrusy, slightly sweet leaves and aromatic seeds.',
            image: 'images/Coriander.jpg'
        },
        {
            id: 11,
            name: 'Sage',
            category: 'open-field',
            description: 'Earthy sage with velvety leaves and a warm, slightly peppery flavor.',
            image: 'images/Sage.jpg'
        },
        {
            id: 12,
            name: 'Marjoram',
            category: 'open-field',
            description: 'Sweet marjoram with a delicate, floral flavor and mild oregano-like taste.',
            image: 'images/Marjoram.jpg'
        }
    ];
    
    // Populate carousel with product cards
    if (carouselTrack && carouselContainer) {
        // Clear existing content
        carouselTrack.innerHTML = '';
        
        // Duplicate products for infinite loop (create 3 sets: original + duplicate + duplicate)
        const duplicatedProducts = [...products, ...products, ...products];
        
        duplicatedProducts.forEach(product => {
            const productCard = createProductCard(product);
            carouselTrack.appendChild(productCard);
        });
        
        // Add smooth transition to carousel track
        carouselTrack.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Carousel navigation variables
        let currentIndex = products.length; // Start at the beginning of the second set (middle set)
        let autoScrollInterval = null;
        let isPaused = false;
        let isTransitioning = false;
        
        // Function to calculate card width based on viewport
        function getCardWidth() {
            // Get computed style of first product card
            const firstCard = carouselTrack.querySelector('.product-card');
            if (firstCard) {
                const cardStyle = window.getComputedStyle(firstCard);
                const cardWidth = firstCard.offsetWidth;
                const marginLeft = parseFloat(cardStyle.marginLeft) || 0;
                const marginRight = parseFloat(cardStyle.marginRight) || 0;
                return cardWidth + marginLeft + marginRight;
            }
            // Fallback values based on viewport
            return window.innerWidth <= 767 ? 250 + 32 : 300 + 32; // card width + margins
        }
        
        // Function to calculate visible cards
        function getCarouselMetrics() {
            const cardWidth = getCardWidth();
            const containerWidth = carouselContainer.offsetWidth;
            const visibleCards = Math.floor(containerWidth / cardWidth);
            return { cardWidth, visibleCards };
        }
        
        // Update carousel position with smooth transition
        function updateCarousel(instant = false) {
            const { cardWidth } = getCarouselMetrics();
            
            if (instant) {
                // Disable transition for instant jump
                carouselTrack.style.transition = 'none';
                carouselTrack.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
                // Re-enable transition after a brief moment
                setTimeout(() => {
                    carouselTrack.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                }, 50);
            } else {
                carouselTrack.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            }
        }
        
        // Check if we need to reset position (seamless loop)
        function checkLoop() {
            // If we've scrolled past the end of the second set, jump to equivalent position in first set
            if (currentIndex >= products.length * 2) {
                currentIndex = currentIndex - products.length;
                updateCarousel(true);
            }
            // If we've scrolled before the start of the second set, jump to equivalent position in third set
            else if (currentIndex < products.length) {
                currentIndex = currentIndex + products.length;
                updateCarousel(true);
            }
        }
        
        // Auto-scroll function
        function autoScroll() {
            if (isPaused || isTransitioning) return;
            
            const { visibleCards } = getCarouselMetrics();
            currentIndex++;
            
            updateCarousel();
            
            // Check for loop reset after transition completes
            setTimeout(() => {
                checkLoop();
            }, 600); // Match transition duration
        }
        
        // Start auto-scroll
        function startAutoScroll() {
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
            }
            autoScrollInterval = setInterval(autoScroll, 3000); // Scroll every 3 seconds
        }
        
        // Stop auto-scroll
        function stopAutoScroll() {
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
                autoScrollInterval = null;
            }
        }
        
        // Next button event
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                if (isTransitioning) return;
                isTransitioning = true;
                
                const { visibleCards } = getCarouselMetrics();
                currentIndex++;
                
                updateCarousel();
                
                setTimeout(() => {
                    checkLoop();
                    isTransitioning = false;
                }, 600);
            });
        }
        
        // Previous button event
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                if (isTransitioning) return;
                isTransitioning = true;
                
                const { visibleCards } = getCarouselMetrics();
                currentIndex--;
                
                updateCarousel();
                
                setTimeout(() => {
                    checkLoop();
                    isTransitioning = false;
                }, 600);
            });
        }
        
        // Hover events to pause/resume auto-scroll
        // Pause on hover over the entire carousel section
        const carouselSection = carouselContainer.closest('.products-carousel');
        
        if (carouselSection) {
            carouselSection.addEventListener('mouseenter', function() {
                isPaused = true;
                stopAutoScroll();
            });
            
            carouselSection.addEventListener('mouseleave', function() {
                isPaused = false;
                startAutoScroll();
            });
        }
        
        // Handle window resize to recalculate card width
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                updateCarousel(true); // Instant update on resize
                checkLoop(); // Ensure we're still in the correct range
                if (!isPaused) {
                    stopAutoScroll();
                    startAutoScroll();
                }
            }, 250);
        });
        
        // Initialize carousel position (set instantly to middle set)
        updateCarousel(true);
        
        // Start auto-scroll on load
        startAutoScroll();
    }
}

// Create Product Card Element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-category', product.category);
    
    const imageUrl = product.image || `images/${product.name.toLowerCase()}.jpg`;
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${imageUrl}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-content">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <a href="products.html#${product.name.toLowerCase()}" class="btn btn-primary mt-1">Learn More</a>
        </div>
    `;
    
    return card;
}

// Scroll Animations
function initScrollAnimations() {
    // Create Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements with animation class
    const animatedElements = document.querySelectorAll('.stat-card, .product-card, .section-header');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Hero Slider Functionality
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    // Function to show next slide
    function showNextSlide() {
        // Remove active class from current slide
        slides[currentSlide].classList.remove('active');
        
        // Move to next slide
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Add active class to new slide
        slides[currentSlide].classList.add('active');
    }
    
    // Auto-advance slides every 5 seconds
    setInterval(showNextSlide, 5000);
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navContainer = document.querySelector('.nav-container');
    if (navContainer) {
        if (window.scrollY > 100) {
            navContainer.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
        } else {
            navContainer.style.boxShadow = 'var(--shadow-medium)';
        }
    }
});

// Set active navigation link based on current page
function setActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        const linkPage = linkHref.split('/').pop();
        
        // Remove active class from all links
        link.classList.remove('active');
        
        // Add active class if it matches current page
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Contact Form Submission Handler
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form elements
        const submitButton = contactForm.querySelector('.btn-submit');
        const originalButtonText = submitButton.innerHTML;
        
        // Get form data
        const formData = {
            'first-name': document.getElementById('first-name').value.trim(),
            'last-name': document.getElementById('last-name').value.trim(),
            'email': document.getElementById('email').value.trim(),
            'phone': document.getElementById('phone').value.trim(),
            'subject': document.getElementById('subject').value,
            'message': document.getElementById('message').value.trim()
        };
        
        // Validate required fields
        if (!formData['first-name'] || !formData['last-name'] || !formData['email'] || !formData['subject'] || !formData['message']) {
            showFormMessage('Please fill in all required fields.', 'error');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Disable submit button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = 'Sending...';
        
        try {
            // Send form data to PHP backend
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });
            
            const response = await fetch('send-email.php', {
                method: 'POST',
                body: formDataToSend
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Show success message
                showFormMessage(result.message, 'success');
                
                // Reset form
                contactForm.reset();
            } else {
                // Show error message
                showFormMessage(result.message || 'Sorry, there was an error sending your message. Please try again later or contact us directly at info@lasatarah.co.ke', 'error');
            }
            
        } catch (error) {
            console.error('Form submission failed:', error);
            showFormMessage('Sorry, there was an error sending your message. Please try again later or contact us directly at info@lasatarah.co.ke', 'error');
        } finally {
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
}

// Show form message (success or error)
function showFormMessage(message, type) {
    // Remove any existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.textContent = message;
    
    // Insert message before submit button
    const contactForm = document.getElementById('contact-form');
    const submitButton = contactForm.querySelector('.btn-submit');
    contactForm.insertBefore(messageDiv, submitButton);
    
    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Auto-remove success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}