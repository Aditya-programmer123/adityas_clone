/**
 * The Ordinary Clone - JavaScript Interactivity
 * Features: Button Interactions, Form Validation, Theme Toggle, Expandable Sections
 */

// ============================================
// 1. BUTTON CLICK INTERACTION
// ============================================

/**
 * Initialize all button click handlers
 * Shows modal feedback for CTA buttons, Add to Cart, and Subscribe
 */
function initializeButtonHandlers() {
    // Build Regimen Button
    const buildRegimenBtn = document.querySelector('.hero .cta-button');
    if (buildRegimenBtn) {
        buildRegimenBtn.addEventListener('click', () => {
            showModal('Skincare Routine Builder', 'Start building your personalized skincare routine. Our experts will help you find the perfect products for your skin type!');
        });
    }

    // Lab Button
    const labBtn = document.querySelector('.about .cta-button.secondary');
    if (labBtn) {
        labBtn.addEventListener('click', () => {
            showModal('Our Lab', 'Discover how our products are scientifically formulated. Each ingredient is carefully selected for maximum efficacy and safety.');
        });
    }

    // Add to Cart Buttons
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    addToCartBtns.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productName = btn.parentElement.querySelector('h4').textContent;
            showModal('Added to Cart', `${productName} has been added to your cart!`);
        });
    });
}

/**
 * Display modal dialog with message
 * @param {string} title - Modal title
 * @param {string} message - Modal message content
 */
function showModal(title, message) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) existingModal.remove();

    // Create modal structure
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    modalContent.innerHTML = `
        <div class="modal-header">
            <h2>${title}</h2>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <p>${message}</p>
        </div>
        <div class="modal-footer">
            <button class="modal-btn-close">Close</button>
        </div>
    `;

    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // Close button handlers
    const closeBtn = modalContent.querySelector('.modal-close');
    const closeBtnFooter = modalContent.querySelector('.modal-btn-close');

    const closeModal = () => modalOverlay.remove();

    closeBtn.addEventListener('click', closeModal);
    closeBtnFooter.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // Fade in animation
    setTimeout(() => modalOverlay.classList.add('show'), 10);
}

// ============================================
// 2. FORM VALIDATION
// ============================================

/**
 * Initialize newsletter form validation
 * Validates email format and non-empty fields
 */
function initializeFormValidation() {
    const newsletterForm = document.querySelector('.newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            // Clear previous error messages
            clearFormErrors();

            // Validation checks
            let errors = [];

            if (!email) {
                errors.push('Email address is required');
                highlightField(emailInput);
            } else if (!isValidEmail(email)) {
                errors.push('Please enter a valid email address');
                highlightField(emailInput);
            }

            // Display errors or submit
            if (errors.length > 0) {
                displayFormErrors(errors);
            } else {
                // Success
                emailInput.value = '';
                showModal('Subscription Successful!', `Thank you for subscribing! We'll send science-backed skincare tips to ${email}`);
            }
        });
    }
}

/**
 * Validate email format using regex
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Display form validation errors
 * @param {array} errors - Array of error messages
 */
function displayFormErrors(errors) {
    const form = document.querySelector('.newsletter-form');
    
    // Create error container
    const errorContainer = document.createElement('div');
    errorContainer.className = 'form-errors';
    errorContainer.innerHTML = '<strong>Please fix the following errors:</strong><ul>';

    errors.forEach(error => {
        errorContainer.innerHTML += `<li>${error}</li>`;
    });

    errorContainer.innerHTML += '</ul>';

    // Insert before form
    form.insertBefore(errorContainer, form.firstChild);
}

/**
 * Clear all form error messages
 */
function clearFormErrors() {
    const errorContainer = document.querySelector('.form-errors');
    if (errorContainer) errorContainer.remove();

    // Remove highlight from fields
    const fields = document.querySelectorAll('.form-field-error');
    fields.forEach(field => field.classList.remove('form-field-error'));
}

/**
 * Highlight form field with error
 * @param {HTMLElement} field - Form field to highlight
 */
function highlightField(field) {
    field.classList.add('form-field-error');
}

// ============================================
// 3. DYNAMIC CONTENT CHANGE - THEME TOGGLE
// ============================================

/**
 * Initialize theme toggle functionality
 * Toggles between light and dark mode with persistent storage
 */
function initializeThemeToggle() {
    // Create theme toggle button in header
    const header = document.querySelector('.header-container');
    
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle theme');
    themeToggle.innerHTML = '🌙'; // Moon icon for dark mode
    
    header.appendChild(themeToggle);

    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '☀️'; // Sun icon for light mode
    }

    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Update button icon
        themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
    });
}

// ============================================
// 4. SHOW/HIDE SECTIONS - EXPANDABLE FAQ
// ============================================

/**
 * Initialize FAQ section with expandable items
 * Allows users to toggle visibility of FAQ answers
 */
function initializeExpandableSections() {
    // Create FAQ section if it doesn't exist
    createFAQSection();

    // Attach click handlers to FAQ items
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            toggleFAQItem(item);
        });
    });
}

/**
 * Create FAQ section dynamically
 */
function createFAQSection() {
    // Check if FAQ section already exists
    if (document.querySelector('.faq-section')) return;

    const faqSection = document.createElement('section');
    faqSection.className = 'faq-section';
    faqSection.id = 'faq';

    faqSection.innerHTML = `
        <div class="container">
            <h3>Frequently Asked Questions</h3>
            <div class="faq-list">
                <div class="faq-item">
                    <div class="faq-question">
                        <h4>What makes The Ordinary products different?</h4>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p>Our products feature research-backed formulations with minimal ingredients. We prioritize transparent labeling and effective concentrations of active ingredients at affordable prices.</p>
                    </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">
                        <h4>How long does shipping take?</h4>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p>Standard shipping typically takes 5-7 business days. Express shipping options are available at checkout for faster delivery to most locations.</p>
                    </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">
                        <h4>Can I return products?</h4>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p>Yes, we offer a 60-day money-back guarantee on all unopened products. Simply contact our customer service team for return instructions.</p>
                    </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">
                        <h4>Are your products suitable for all skin types?</h4>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p>We offer specialized products for various skin types and concerns. Each product includes detailed information about suitable skin types and usage instructions.</p>
                    </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">
                        <h4>Do you offer international shipping?</h4>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p>Yes, we ship to over 180 countries worldwide. Shipping costs and delivery times vary by location. Check our store locator for more information.</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Insert FAQ section before footer
    const footer = document.querySelector('footer');
    footer.parentElement.insertBefore(faqSection, footer);
}

/**
 * Toggle FAQ item visibility
 * @param {HTMLElement} item - FAQ item to toggle
 */
function toggleFAQItem(item) {
    const answer = item.querySelector('.faq-answer');
    const toggle = item.querySelector('.faq-toggle');
    const isOpen = item.classList.contains('open');

    // Close all other items
    document.querySelectorAll('.faq-item').forEach(faqItem => {
        if (faqItem !== item && faqItem.classList.contains('open')) {
            faqItem.classList.remove('open');
            faqItem.querySelector('.faq-toggle').textContent = '+';
        }
    });

    // Toggle current item
    if (isOpen) {
        item.classList.remove('open');
        toggle.textContent = '+';
    } else {
        item.classList.add('open');
        toggle.textContent = '−';
    }
}

// ============================================
// 5. CAROUSEL/SLIDER FUNCTIONALITY
// ============================================

/**
 * Initialize carousel with all features:
 * - Auto-rotation every 5 seconds
 * - Manual navigation (prev/next buttons)
 * - Dot indicators for jumping to slides
 * - Pause on hover
 * - Keyboard controls (left/right arrow keys)
 * - Smooth fade transitions
 * - Loop functionality
 */
function initializeCarousel() {
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    const carouselTrack = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    const carouselSection = document.querySelector('.carousel-section');

    if (!carouselWrapper || slides.length === 0) return;

    let currentSlide = 0;
    let autoPlayInterval;
    const autoPlayDelay = 5000; // 5 seconds

    /**
     * Go to specific slide with fade animation
     * @param {number} slideIndex - Index of slide to show
     */
    function goToSlide(slideIndex) {
        // Handle loop - wrap around if necessary
        if (slideIndex >= slides.length) {
            currentSlide = 0;
        } else if (slideIndex < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = slideIndex;
        }

        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Show current slide
        slides[currentSlide].classList.add('active');

        // Update dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        dots[currentSlide].classList.add('active');

        // Update track position for fade effect
        carouselTrack.style.opacity = '0';
        setTimeout(() => {
            carouselTrack.style.opacity = '1';
        }, 50);
    }

    /**
     * Move to next slide
     */
    function nextSlide() {
        goToSlide(currentSlide + 1);
        resetAutoPlay();
    }

    /**
     * Move to previous slide
     */
    function prevSlide() {
        goToSlide(currentSlide - 1);
        resetAutoPlay();
    }

    /**
     * Start auto-play rotation
     */
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, autoPlayDelay);
    }

    /**
     * Stop auto-play rotation
     */
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }

    /**
     * Reset auto-play timer (used when manually navigating)
     */
    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // Previous button click
    prevBtn.addEventListener('click', prevSlide);

    // Next button click
    nextBtn.addEventListener('click', nextSlide);

    // Dot indicators click
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoPlay();
        });
    });

    // Pause on hover
    carouselSection.addEventListener('mouseenter', stopAutoPlay);
    carouselSection.addEventListener('mouseleave', startAutoPlay);

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });

    // Initialize
    goToSlide(0);
    startAutoPlay();
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize all interactive features when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeButtonHandlers();
    initializeFormValidation();
    initializeThemeToggle();
    initializeExpandableSections();
    initializeCarousel();

    console.log('✓ The Ordinary - Interactive features initialized');
});
