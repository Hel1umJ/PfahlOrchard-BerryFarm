
let slideIndex = 1;

// Global functions for slideshow
function changeSlide(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (slides.length === 0) return;
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    
    for (i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }
    
    slides[slideIndex - 1].classList.add("active");
    dots[slideIndex - 1].classList.add("active");
}

document.addEventListener("DOMContentLoaded", function() {
    const isPagesDir = window.location.pathname.includes('/pages/');
    const prefix = isPagesDir ? '../' : '';

    // Function to initialize dropdown menus with horizontal-exit behavior
    function initDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const dropdownContent = dropdown.querySelector('.dropdown-content');
            const dropdownButton = dropdown.querySelector('.dropbtn');
            let showTimeout;
            let hideTimeout;
            let isMenuOpen = false;
            
            // Show dropdown on button hover
            dropdownButton.addEventListener('mouseenter', function() {
                clearTimeout(hideTimeout);
                showTimeout = setTimeout(() => {
                    dropdownContent.classList.add('show');
                    isMenuOpen = true;
                }, 150);
            });
            
            
            // Handle mouse leave from dropdown container
            dropdown.addEventListener('mouseleave', function(e) {
                if (!isMenuOpen) return;
                
                clearTimeout(showTimeout);
                
                // Get dropdown boundaries
                const rect = dropdown.getBoundingClientRect();
                const contentRect = dropdownContent.getBoundingClientRect();
                
                // Check if mouse is leaving horizontally (left or right)
                const isLeavingHorizontally = 
                    e.clientX < Math.min(rect.left, contentRect.left) || 
                    e.clientX > Math.max(rect.right, contentRect.right);
                
                if (isLeavingHorizontally) {
                    // Hide immediately when leaving horizontally
                    dropdownContent.classList.remove('show');
                    isMenuOpen = false;
                } else {
                    // Small delay for vertical movement (more forgiving)
                    hideTimeout = setTimeout(() => {
                        dropdownContent.classList.remove('show');
                        isMenuOpen = false;
                    }, 200);
                }
            });
            
            // Keep menu open when hovering over dropdown content
            dropdownContent.addEventListener('mouseenter', function() {
                clearTimeout(hideTimeout);
            });
            
            // Handle leaving dropdown content
            dropdownContent.addEventListener('mouseleave', function(e) {
                const rect = dropdownContent.getBoundingClientRect();
                const isLeavingHorizontally = 
                    e.clientX < rect.left || e.clientX > rect.right;
                
                if (isLeavingHorizontally) {
                    dropdownContent.classList.remove('show');
                    isMenuOpen = false;
                } else {
                    hideTimeout = setTimeout(() => {
                        dropdownContent.classList.remove('show');
                        isMenuOpen = false;
                    }, 200);
                }
            });
        });
    }

    // Function to initialize the slideshow
    function initSlideshow() {
        showSlides(slideIndex);
        
        // Add event listeners for navigation
        const prevButton = document.querySelector('.prev');
        const nextButton = document.querySelector('.next');
        if (prevButton && nextButton) {
            prevButton.onclick = () => changeSlide(-1);
            nextButton.onclick = () => changeSlide(1);
        }

        // Add event listeners for dots
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.onclick = () => currentSlide(index + 1);
        });
    }

    // Initialize dropdowns for static header content
    initDropdowns();

    // Initialize the slideshow after a short delay to ensure the DOM is updated
    setTimeout(initSlideshow, 100);
});
