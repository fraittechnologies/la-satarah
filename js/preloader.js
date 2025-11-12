// Preloader Script - Lightweight and Performance Optimized
// Hides preloader as soon as DOM is ready (doesn't wait for all resources)

(function() {
    'use strict';
    
    // Get preloader element
    const preloader = document.getElementById('preloader');
    
    if (!preloader) return;
    
    // Add active class to body to prevent scroll
    document.body.classList.add('preloader-active');
    
    // Function to hide preloader
    function hidePreloader() {
        if (!preloader) return;
        
        // Add fade-out class for smooth transition
        preloader.classList.add('fade-out');
        
        // Remove preloader from DOM after animation completes
        setTimeout(function() {
            preloader.classList.add('hidden');
            document.body.classList.remove('preloader-active');
            
            // Remove from DOM after a short delay to ensure smooth transition
            setTimeout(function() {
                if (preloader.parentNode) {
                    preloader.style.display = 'none';
                }
            }, 300);
        }, 300);
    }
    
    // Hide preloader when DOM is ready (fastest method)
    // This doesn't wait for images or other resources to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hidePreloader);
    } else {
        // DOM is already ready
        hidePreloader();
    }
    
    // Fallback: Hide preloader after a maximum delay (prevents stuck preloader)
    // This ensures the preloader never stays visible for more than 2 seconds
    setTimeout(function() {
        if (!preloader.classList.contains('hidden')) {
            hidePreloader();
        }
    }, 2000);
    
    // Optional: Hide preloader when page is fully loaded (images, etc.)
    // This is a backup in case DOMContentLoaded doesn't fire for some reason
    window.addEventListener('load', function() {
        // Only hide if not already hidden
        if (!preloader.classList.contains('hidden') && !preloader.classList.contains('fade-out')) {
            hidePreloader();
        }
    });
})();

