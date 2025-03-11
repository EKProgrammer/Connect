document.addEventListener('DOMContentLoaded', function() {
    // FAQ functionality with optimized animations
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other open items first
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // Optimize animations on scroll
    const fadeElements = document.querySelectorAll('.fade-in');
    let scrollTimeout;
    let isScrolling = false;
    
    // Add reduce-animations class while scrolling
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            document.body.classList.add('reduce-animations');
            isScrolling = true;
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            document.body.classList.remove('reduce-animations');
            isScrolling = false;
            
            // Check for elements to animate
            fadeElements.forEach(element => {
                if (isElementInViewport(element)) {
                    element.classList.add('visible');
                }
            });
        }, 100);
    });
    
    // Initial check for visible elements
    fadeElements.forEach(element => {
        if (isElementInViewport(element)) {
            element.classList.add('visible');
        }
    });
    
    // Helper function to check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    // Optimize testimonial slider
    const slider = document.querySelector('.testimonials-slider');
    const prevBtn = document.querySelector('.testimonial-control.prev');
    const nextBtn = document.querySelector('.testimonial-control.next');
    
    if (slider && prevBtn && nextBtn) {
        let currentSlide = 0;
        const slides = slider.querySelectorAll('.testimonial');
        const totalSlides = slides.length;
        
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        });
        
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        });
        
        function updateSlider() {
            slider.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
        
        // Auto-advance slides every 5 seconds
        let autoSlideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        }, 5000);
        
        // Pause auto-advance when user interacts with slider
        [prevBtn, nextBtn].forEach(btn => {
            btn.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
            btn.addEventListener('mouseleave', () => {
                autoSlideInterval = setInterval(() => {
                    currentSlide = (currentSlide + 1) % totalSlides;
                    updateSlider();
                }, 5000);
            });
        });
        
        // Initialize slider position
        updateSlider();
    }
});
