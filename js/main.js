
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

            // Toggle dropdown on click (for mobile devices)
            dropdownButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (dropdownContent.classList.contains('show')) {
                    dropdownContent.classList.remove('show');
                    isMenuOpen = false;
                } else {
                    dropdownContent.classList.add('show');
                    isMenuOpen = true;
                }
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

        // Close dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            dropdowns.forEach(dd => {
                if (!dd.contains(e.target)) {
                    const content = dd.querySelector('.dropdown-content');
                    content.classList.remove('show');
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

        // Auto advance slides every 5 seconds
        setInterval(() => changeSlide(1), 5000);
    }

    // Initialize dropdowns for static header content
    initDropdowns();

    // Initialize the slideshow after a short delay to ensure the DOM is updated
    setTimeout(initSlideshow, 100);
    
    // Initialize cart functionality
    initCart();
    
    // Initialize shop functionality
    initShop();
});

// Cart functionality
function initCart() {
    let cartCount = 0;
    
    // Update cart quantity display
    function updateCartDisplay() {
        const cartQuantity = document.getElementById('cart-quantity');
        if (cartQuantity) {
            cartQuantity.textContent = cartCount;
            cartQuantity.style.display = 'block';
        }
    }
    
    // Add to cart function (can be called from product pages)
    window.addToCart = function(quantity = 1) {
        cartCount += quantity;
        updateCartDisplay();
        
        // Store cart count in localStorage
        localStorage.setItem('cartCount', cartCount);
    };
    
    // Remove from cart function
    window.removeFromCart = function(quantity = 1) {
        cartCount = Math.max(0, cartCount - quantity);
        updateCartDisplay();
        
        // Store cart count in localStorage
        localStorage.setItem('cartCount', cartCount);
    };
    
    // Clear cart function
    window.clearCart = function() {
        cartCount = 0;
        updateCartDisplay();
        
        // Clear cart count from localStorage
        localStorage.removeItem('cartCount');
    };
    
    // Load cart count from localStorage
    const savedCartCount = localStorage.getItem('cartCount');
    if (savedCartCount) {
        cartCount = parseInt(savedCartCount, 10);
    }
    
    // Initial display update
    updateCartDisplay();
}

// Shop functionality
function initShop() {
    // Initialize quantity selectors
    const quantitySelectors = document.querySelectorAll('.quantity-selector');
    
    quantitySelectors.forEach(selector => {
        const radioButtons = selector.querySelectorAll('input[type="radio"]');
        
        radioButtons.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.checked) {
                    updatePriceDisplay(this.name, this.value);
                }
            });
        });
    });
    
    // Initialize price displays
    updateAllPrices();
}

// Update price display for a specific product
function updatePriceDisplay(productName, value) {
    const [size, price] = value.split('-');
    const priceDisplay = document.getElementById(productName.replace('-qty', '-price'));
    
    if (priceDisplay) {
        priceDisplay.textContent = `$${price}`;
    }
}

// Update all price displays on page load
function updateAllPrices() {
    const quantitySelectors = document.querySelectorAll('.quantity-selector');
    
    quantitySelectors.forEach(selector => {
        const checkedRadio = selector.querySelector('input[type="radio"]:checked');
        if (checkedRadio) {
            updatePriceDisplay(checkedRadio.name, checkedRadio.value);
        }
    });
}

// Enhanced addToCart function for shop items
window.addToCart = function(productId) {
    const quantitySelector = document.querySelector(`input[name="${productId}-qty"]:checked`);
    
    if (quantitySelector) {
        const [size, price] = quantitySelector.value.split('-');
        const productName = productId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        // Add to cart logic here
        console.log(`Added to cart: ${productName} - ${size} for $${price}`);
        
        // Update cart count
        const cartCount = parseInt(localStorage.getItem('cartCount') || '0') + 1;
        localStorage.setItem('cartCount', cartCount);
        
        // Update cart display
        const cartQuantity = document.getElementById('cart-quantity');
        if (cartQuantity) {
            cartQuantity.textContent = cartCount;
        }
        
        // Visual feedback
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Added!';
        button.style.background = '#28a745';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 1000);
    }
};
