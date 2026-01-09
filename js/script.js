/* ========================================
   Brookview Kindergarten Website
   Interactive JavaScript Functionality
========================================= */

"use strict";

// DOM Elements
const navMenu = document.getElementById("nav-menu");
const navToggle = document.getElementById("nav-toggle");
const navClose = document.getElementById("nav-close");
const navLinks = document.querySelectorAll(".nav__link");
const header = document.getElementById("header");
const scrollUp = document.getElementById("scroll-up");
const contactForm = document.getElementById("contact-form");
const galleryItems = document.querySelectorAll(".gallery__item");

// ========================================
// MOBILE NAVIGATION MENU
// ========================================

// Show menu
const showMenu = () => {
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.add("show-menu");
      document.body.style.overflow = "hidden"; // Prevent body scroll when menu is open
    });
  }
};

// Hide menu
const hideMenu = () => {
  if (navClose) {
    navClose.addEventListener("click", () => {
      navMenu.classList.remove("show-menu");
      document.body.style.overflow = "auto"; // Restore body scroll
    });
  }
};

// Hide menu when clicking on nav links
const hideMobileMenu = () => {
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("show-menu");
      document.body.style.overflow = "auto";
    });
  });
};

// Hide menu when clicking outside
const hideMenuOutside = () => {
  document.addEventListener("click", (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      navMenu.classList.remove("show-menu");
      document.body.style.overflow = "auto";
    }
  });
};

// ========================================
// HEADER SCROLL EFFECT
// ========================================

const scrollHeader = () => {
  const scrollY = window.pageYOffset;

  if (scrollY >= 50) {
    header.classList.add("scroll-header");
    header.style.background = "rgba(255, 255, 255, 0.98)";
    header.style.boxShadow = "0 2px 20px rgba(44, 62, 80, 0.1)";
  } else {
    header.classList.remove("scroll-header");
    header.style.background = "rgba(255, 255, 255, 0.95)";
    header.style.boxShadow = "none";
  }
};

// ========================================
// SCROLL UP BUTTON
// ========================================

const scrollUpButton = () => {
  const scrollY = window.pageYOffset;

  if (scrollY >= 350) {
    scrollUp.classList.add("show-scroll");
  } else {
    scrollUp.classList.remove("show-scroll");
  }
};

// ========================================
// ACTIVE LINK HIGHLIGHTING
// ========================================

const sections = document.querySelectorAll("section[id]");

const scrollActive = () => {
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 100;
    const sectionId = current.getAttribute("id");
    const sectionsClass = document.querySelector(
      `.nav__menu a[href*=${sectionId}]`
    );

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      sectionsClass?.classList.add("active-link");
    } else {
      sectionsClass?.classList.remove("active-link");
    }
  });
};

// ========================================
// SMOOTH SCROLLING
// ========================================

const smoothScroll = () => {
  // Handle all anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
};

// ========================================
// FORM VALIDATION AND SUBMISSION
// ========================================

const initFormValidation = () => {
  if (!contactForm) return;

  // Form input animations
  const formInputs = document.querySelectorAll(".form__input");
  formInputs.forEach((input) => {
    // Handle placeholder behavior
    if (input.value.trim() !== "") {
      input.classList.add("has-value");
    }

    input.addEventListener("input", function () {
      if (this.value.trim() !== "") {
        this.classList.add("has-value");
      } else {
        this.classList.remove("has-value");
      }

      // Real-time validation
      validateField(this);
    });

    input.addEventListener("blur", function () {
      validateField(this);
    });

    input.addEventListener("focus", function () {
      this.classList.remove("error");
    });
  });

  // Form submission
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (validateForm()) {
      submitForm();
    }
  });
};

// Field validation
const validateField = (field) => {
  const value = field.value.trim();
  let isValid = true;

  // Remove previous error state
  field.classList.remove("error");
  removeErrorMessage(field);

  // Required field validation
  if (field.hasAttribute("required") && value === "") {
    showError(field, "This field is required");
    isValid = false;
  }

  // Email validation
  if (field.type === "email" && value !== "") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      showError(field, "Please enter a valid email address");
      isValid = false;
    }
  }

  // Phone validation
  if (field.type === "tel" && value !== "") {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ""))) {
      showError(field, "Please enter a valid phone number");
      isValid = false;
    }
  }

  return isValid;
};

// Form validation
const validateForm = () => {
  const formInputs = contactForm.querySelectorAll(".form__input[required]");
  let isValid = true;

  formInputs.forEach((input) => {
    if (!validateField(input)) {
      isValid = false;
    }
  });

  return isValid;
};

// Show error message
const showError = (field, message) => {
  field.classList.add("error");

  const errorDiv = document.createElement("div");
  errorDiv.className = "form__error";
  errorDiv.textContent = message;

  field.parentNode.appendChild(errorDiv);

  // Add error styles if not already in CSS
  if (!document.querySelector(".form__error-style")) {
    const style = document.createElement("style");
    style.className = "form__error-style";
    style.textContent = `
            .form__input.error {
                border-color: #F44336 !important;
                background-color: #FFEBEE !important;
            }
            .form__error {
                color: #F44336;
                font-size: 0.875rem;
                margin-top: 0.25rem;
                display: flex;
                align-items: center;
                gap: 0.25rem;
            }
            .form__error::before {
                content: '⚠';
                font-size: 1rem;
            }
        `;
    document.head.appendChild(style);
  }
};

// Remove error message
const removeErrorMessage = (field) => {
  const errorDiv = field.parentNode.querySelector(".form__error");
  if (errorDiv) {
    errorDiv.remove();
  }
};

// Form submission
const submitForm = () => {
  // Show loading state
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;

  // Simulate form submission (replace with actual form submission logic)
  setTimeout(() => {
    // Show success message
    showSuccessMessage();

    // Reset form
    contactForm.reset();

    // Reset button
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;

    // Remove has-value classes
    const formInputs = contactForm.querySelectorAll(".form__input");
    formInputs.forEach((input) => {
      input.classList.remove("has-value");
    });
  }, 2000);
};

// Show success message
const showSuccessMessage = () => {
  // Create success modal
  const modal = document.createElement("div");
  modal.className = "success-modal";
  modal.innerHTML = `
        <div class="success-modal__content">
            <div class="success-modal__icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Message Sent Successfully!</h3>
            <p>Thank you for your interest in Brookview Kindergarten. We'll get back to you within 24 hours.</p>
            <button class="btn btn--primary" onclick="closeSuccessModal()">Close</button>
        </div>
    `;

  // Add styles
  if (!document.querySelector(".success-modal-style")) {
    const style = document.createElement("style");
    style.className = "success-modal-style";
    style.textContent = `
            .success-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                padding: 1rem;
            }
            .success-modal__content {
                background: white;
                padding: 2rem;
                border-radius: 1rem;
                text-align: center;
                max-width: 400px;
                animation: modalSlideIn 0.3s ease;
            }
            .success-modal__icon i {
                font-size: 4rem;
                color: #4CAF50;
                margin-bottom: 1rem;
            }
            .success-modal__content h3 {
                color: #2C3E50;
                margin-bottom: 1rem;
            }
            .success-modal__content p {
                color: #607D8B;
                margin-bottom: 1.5rem;
                line-height: 1.6;
            }
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-50px) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
        `;
    document.head.appendChild(style);
  }

  document.body.appendChild(modal);

  // Close modal after 3 seconds
  setTimeout(closeSuccessModal, 3000);
};

// Close success modal
window.closeSuccessModal = () => {
  const modal = document.querySelector(".success-modal");
  if (modal) {
    modal.remove();
  }
};

// ========================================
// GALLERY FUNCTIONALITY
// ========================================

const initGallery = () => {
  // Gallery lightbox functionality
  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      const title = item.querySelector(".gallery__overlay h4").textContent;
      const description = item.querySelector(".gallery__overlay p").textContent;

      openLightbox(img.src, title, description);
    });
  });
};

// Open lightbox
const openLightbox = (src, title, description) => {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
        <div class="lightbox__content">
            <button class="lightbox__close">&times;</button>
            <img src="${src}" alt="${title}" class="lightbox__image">
            <div class="lightbox__info">
                <h3>${title}</h3>
                <p>${description}</p>
            </div>
        </div>
    `;

  // Add lightbox styles
  if (!document.querySelector(".lightbox-style")) {
    const style = document.createElement("style");
    style.className = "lightbox-style";
    style.textContent = `
            .lightbox {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                padding: 1rem;
                animation: fadeIn 0.3s ease;
            }
            .lightbox__content {
                position: relative;
                max-width: 90%;
                max-height: 90%;
                background: white;
                border-radius: 1rem;
                overflow: hidden;
                animation: lightboxSlideIn 0.3s ease;
            }
            .lightbox__close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                border: none;
                width: 3rem;
                height: 3rem;
                border-radius: 50%;
                font-size: 1.5rem;
                cursor: pointer;
                z-index: 1;
                transition: background 0.3s ease;
            }
            .lightbox__close:hover {
                background: rgba(0, 0, 0, 0.9);
            }
            .lightbox__image {
                width: 100%;
                max-height: 70vh;
                object-fit: contain;
                display: block;
            }
            .lightbox__info {
                padding: 1.5rem;
                text-align: center;
            }
            .lightbox__info h3 {
                color: #2C3E50;
                margin-bottom: 0.5rem;
            }
            .lightbox__info p {
                color: #607D8B;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes lightboxSlideIn {
                from {
                    opacity: 0;
                    transform: scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
    document.head.appendChild(style);
  }

  document.body.appendChild(lightbox);
  document.body.style.overflow = "hidden";

  // Close lightbox events
  const closeBtn = lightbox.querySelector(".lightbox__close");
  closeBtn.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Close with Escape key
  const handleEscape = (e) => {
    if (e.key === "Escape") {
      closeLightbox();
    }
  };

  document.addEventListener("keydown", handleEscape);

  function closeLightbox() {
    lightbox.remove();
    document.body.style.overflow = "auto";
    document.removeEventListener("keydown", handleEscape);
  }
};

// Load more gallery images
window.loadMoreImages = () => {
  // This would typically load more images from a server
  // For now, we'll just show a message
  const button = event.target;
  const originalText = button.textContent;

  button.textContent = "Loading...";
  button.disabled = true;

  setTimeout(() => {
    button.textContent = "All Photos Loaded";
    button.disabled = true;
    button.style.opacity = "0.7";
  }, 1500);
};

// ========================================
// SCROLL ANIMATIONS
// ========================================

const initScrollAnimations = () => {
  // Create intersection observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, observerOptions);

  // Add animation classes and observe elements
  const animateElements = [
    { selector: ".section__header", animation: "fade-in" },
    { selector: ".about__feature", animation: "slide-in-left" },
    { selector: ".program__card", animation: "fade-in" },
    { selector: ".facility__card", animation: "fade-in" },
    { selector: ".gallery__item", animation: "fade-in" },
    { selector: ".testimonial__card", animation: "slide-in-right" },
    { selector: ".hero__stat", animation: "fade-in" },
  ];

  animateElements.forEach(({ selector, animation }) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
      el.classList.add(animation);
      el.style.animationDelay = `${index * 0.1}s`;
      observer.observe(el);
    });
  });
};

// ========================================
// COUNTER ANIMATION
// ========================================

const initCounters = () => {
  const counters = document.querySelectorAll(".hero__stat h3");
  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach((counter) => {
    observer.observe(counter);
  });
};

const animateCounter = (element) => {
  const target = element.textContent;
  const isPercent = target.includes("%");
  const isPlus = target.includes("+");
  const number = parseInt(target.replace(/[^\d]/g, ""));

  let current = 0;
  const increment = number / 50;
  const duration = 2000;
  const stepTime = duration / 50;

  const timer = setInterval(() => {
    current += increment;
    if (current >= number) {
      current = number;
      clearInterval(timer);
    }

    let displayValue = Math.floor(current);
    if (isPercent) displayValue += "%";
    if (isPlus) displayValue += "+";

    element.textContent = displayValue;
  }, stepTime);
};

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

// Debounce function for scroll events
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll events
const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// ========================================
// PAGE LOADING
// ========================================

const initPageLoading = () => {
  // Show loading screen
  const loader = document.createElement("div");
  loader.className = "page-loader";
  loader.innerHTML = `
        <div class="loader-content">
            <img src="assets/images/logo.jpeg" alt="Brookview Kindergarten" class="loader-logo">
            <div class="loader-spinner"></div>
            <p>Loading Brookview Kindergarten...</p>
        </div>
    `;

  // Add loader styles
  const loaderStyles = `
        .page-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #FFE5E5, #E0F7FA);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            transition: opacity 0.5s ease;
        }
        .loader-content {
            text-align: center;
        }
        .loader-logo {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            margin-bottom: 1rem;
            animation: logoSpin 2s linear infinite;
        }
        .loader-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #FFE5E5;
            border-top: 3px solid #FF6B6B;
            border-radius: 50%;
            margin: 1rem auto;
            animation: spin 1s linear infinite;
        }
        .loader-content p {
            color: #2C3E50;
            font-weight: 500;
            margin: 0;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes logoSpin {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(1.1); }
            100% { transform: rotate(360deg) scale(1); }
        }
    `;

  const style = document.createElement("style");
  style.textContent = loaderStyles;
  document.head.appendChild(style);
  document.body.appendChild(loader);

  // Hide loader when page is fully loaded
  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.style.opacity = "0";
      setTimeout(() => {
        loader.remove();
      }, 500);
    }, 1000);
  });
};

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

const initAccessibility = () => {
  // Add skip link
  const skipLink = document.createElement("a");
  skipLink.href = "#main";
  skipLink.textContent = "Skip to main content";
  skipLink.className = "skip-link";

  const skipStyles = `
        .skip-link {
            position: absolute;
            top: -100px;
            left: 0;
            background: #2C3E50;
            color: white;
            padding: 1rem;
            text-decoration: none;
            z-index: 10000;
            transition: top 0.3s ease;
        }
        .skip-link:focus {
            top: 0;
        }
    `;

  const style = document.createElement("style");
  style.textContent = skipStyles;
  document.head.appendChild(style);
  document.body.insertBefore(skipLink, document.body.firstChild);

  // Add main landmark to main element
  const main = document.querySelector(".main");
  if (main) {
    main.id = "main";
    main.setAttribute("role", "main");
  }

  // Keyboard navigation for gallery
  galleryItems.forEach((item, index) => {
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", `View image ${index + 1} in gallery`);

    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        item.click();
      }
    });
  });
};

// ========================================
// MOBILE TOUCH ENHANCEMENTS
// ========================================

const initTouchEnhancements = () => {
  // Add touch feedback to buttons
  const buttons = document.querySelectorAll(".btn, .nav__link, .gallery__item");

  buttons.forEach((button) => {
    button.addEventListener("touchstart", function () {
      this.classList.add("touch-active");
    });

    button.addEventListener("touchend", function () {
      setTimeout(() => {
        this.classList.remove("touch-active");
      }, 100);
    });
  });

  // Add touch styles
  const touchStyles = `
        .touch-active {
            transform: scale(0.95);
            transition: transform 0.1s ease;
        }
    `;

  const style = document.createElement("style");
  style.textContent = touchStyles;
  document.head.appendChild(style);
};

// ========================================
// ERROR HANDLING
// ========================================

const initErrorHandling = () => {
  // Global error handler
  window.addEventListener("error", (e) => {
    console.error("JavaScript Error:", e.error);
    // You could send this to an error reporting service
  });

  // Unhandled promise rejection handler
  window.addEventListener("unhandledrejection", (e) => {
    console.error("Unhandled Promise Rejection:", e.reason);
    e.preventDefault();
  });
};

// ========================================
// INITIALIZATION
// ========================================

// DOM Content Loaded Event
document.addEventListener("DOMContentLoaded", () => {
  // Initialize page loading
  initPageLoading();

  // Initialize navigation
  showMenu();
  hideMenu();
  hideMobileMenu();
  hideMenuOutside();

  // Initialize smooth scrolling
  smoothScroll();

  // Initialize form validation
  initFormValidation();

  // Initialize gallery
  initGallery();

  // Initialize scroll animations
  initScrollAnimations();

  // Initialize counters
  initCounters();

  // Initialize accessibility
  initAccessibility();

  // Initialize touch enhancements
  initTouchEnhancements();

  // Initialize error handling
  initErrorHandling();
});

// Window Load Event
window.addEventListener("load", () => {
  // Initialize performance-heavy features after load
  console.log("Brookview Kindergarten website loaded successfully!");
});

// Scroll Events (throttled for performance)
window.addEventListener(
  "scroll",
  throttle(() => {
    scrollHeader();
    scrollUpButton();
    scrollActive();
  }, 16)
); // ~60fps

// Resize Event (debounced for performance)
window.addEventListener(
  "resize",
  debounce(() => {
    // Handle responsive adjustments if needed
    if (window.innerWidth > 968 && navMenu.classList.contains("show-menu")) {
      navMenu.classList.remove("show-menu");
      document.body.style.overflow = "auto";
    }
  }, 250)
);

// ========================================
// SERVICE WORKER REGISTRATION
// ========================================

// Register service worker for PWA capabilities (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

// Export functions for potential external use
window.BrookviewKindergarten = {
  showMenu,
  hideMenu,
  openLightbox,
  loadMoreImages,
  closeSuccessModal,
};

console.log("Brookview Kindergarten JavaScript initialized successfully!");
