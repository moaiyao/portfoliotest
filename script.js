// ==================== THEME TOGGLE ====================
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Load saved theme or use system preference
const currentTheme = localStorage.getItem('theme') ||
    (prefersDarkScheme.matches ? 'dark' : 'light');

if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);

    showToast('Theme Updated', `Switched to ${theme} mode`, 'success');
});

// ==================== SCROLL PROGRESS INDICATOR ====================
const scrollProgress = document.getElementById('scroll-progress');

function updateScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
}

window.addEventListener('scroll', updateScrollProgress);

// ==================== ACTIVE NAVIGATION INDICATOR ====================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', setActiveNav);

// ==================== MOBILE MENU TOGGLE ====================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

function toggleMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

hamburger.addEventListener('click', toggleMenu);

// Keyboard support for hamburger
hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
    }
});

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Account for fixed navbar
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        navbar.style.boxShadow = 'var(--shadow)';
        return;
    }

    if (currentScroll > lastScroll && currentScroll > 100) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
        navbar.style.boxShadow = 'var(--shadow-lg)';
    }

    lastScroll = currentScroll;
});

// ==================== TOAST NOTIFICATION SYSTEM ====================
const toastContainer = document.getElementById('toast-container');

function showToast(title, message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = type === 'success' ? '✓' :
        type === 'error' ? '✕' :
            type === 'warning' ? '⚠' : 'ℹ';

    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" aria-label="Close notification">&times;</button>
    `;

    toastContainer.appendChild(toast);

    // Close button functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    });

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }
    }, 3000);
}

// ==================== FORM VALIDATION ====================
const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

const validators = {
    name: (value) => {
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
    },
    email: (value) => {
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';
    },
    message: (value) => {
        if (!value.trim()) return 'Message is required';
        if (value.trim().length < 10) return 'Message must be at least 10 characters';
        return '';
    }
};

function showError(input, message) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.error-message');

    input.classList.add('error');
    input.classList.remove('success');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function showSuccess(input) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.error-message');

    input.classList.remove('error');
    input.classList.add('success');
    errorElement.textContent = '';
    errorElement.classList.remove('show');
}

function validateField(input) {
    const value = input.value;
    const fieldName = input.name;
    const error = validators[fieldName](value);

    if (error) {
        showError(input, error);
        return false;
    } else {
        showSuccess(input);
        return true;
    }
}

// Real-time validation
[nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
            validateField(input);
        }
    });
});

// Form submission handler
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    const isNameValid = validateField(nameInput);
    const isEmailValid = validateField(emailInput);
    const isMessageValid = validateField(messageInput);

    if (!isNameValid || !isEmailValid || !isMessageValid) {
        showToast('Validation Error', 'Please fix the errors in the form', 'error');
        return;
    }

    // Show loading state
    const submitButton = contactForm.querySelector('.submit-button');
    const buttonText = submitButton.querySelector('.button-text');
    submitButton.disabled = true;
    submitButton.classList.add('loading');
    buttonText.textContent = 'Sending...';

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Show success message
    showToast('Message Sent!', 'Thank you for your message. I\'ll get back to you soon.', 'success');

    // Reset form
    contactForm.reset();
    [nameInput, emailInput, messageInput].forEach(input => {
        input.classList.remove('success', 'error');
    });

    // Reset button
    submitButton.disabled = false;
    submitButton.classList.remove('loading');
    buttonText.textContent = 'Send Message';
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all planets, skill categories, and friend cards
document.querySelectorAll('.planet, .skill-category, .stat, .friend-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Add loading class to body when page loads
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Parallax effect for hero image
window.addEventListener('scroll', () => {
    const heroImage = document.querySelector('.placeholder-image');
    if (heroImage) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        heroImage.style.transform = `translateY(${rate}px)`;
    }
});

// Galaxy Planet Interactions
const projectData = {
    1: {
        title: 'E-Commerce Redesign',
        type: 'Mobile App • UX/UI Design',
        description: 'Redesigned the checkout flow resulting in a 45% increase in conversion rate and improved user satisfaction scores.',
        tags: ['User Research', 'Prototyping', 'A/B Testing']
    },
    2: {
        title: 'Healthcare Dashboard',
        type: 'Web Application • Data Visualization',
        description: 'Designed an intuitive dashboard for healthcare professionals to monitor patient data and streamline workflows.',
        tags: ['Information Architecture', 'Usability Testing', 'Wireframing']
    },
    3: {
        title: 'Financial Planning Tool',
        type: 'SaaS Platform • UX Strategy',
        description: 'Created a comprehensive budgeting and investment planning tool that simplifies complex financial decisions.',
        tags: ['Journey Mapping', 'Interaction Design', 'Design System']
    },
    4: {
        title: 'Learning Management System',
        type: 'Education Platform • Accessibility',
        description: 'Designed an accessible and engaging platform for online education with focus on inclusive design principles.',
        tags: ['Accessibility', 'User Personas', 'Responsive Design']
    }
};

// ==================== GALAXY KEYBOARD NAVIGATION ====================
const planets = document.querySelectorAll('.planet');
const modal = document.getElementById('project-modal');
const modalClose = document.querySelector('.modal-close');

// Make planets keyboard accessible
planets.forEach((planet, index) => {
    planet.setAttribute('tabindex', '0');
    planet.setAttribute('role', 'button');
    planet.setAttribute('aria-label', `View project ${index + 1}`);
});

function openProjectModal(planet) {
    const projectId = planet.getAttribute('data-project');
    const project = projectData[projectId];

    // Remove active class from all planets
    planets.forEach(p => p.classList.remove('active'));

    // Add active class to clicked planet
    planet.classList.add('active');

    // Populate modal with project data
    document.getElementById('modal-title').textContent = project.title;
    document.getElementById('modal-type').textContent = project.type;
    document.getElementById('modal-description').textContent = project.description;

    const tagsContainer = document.getElementById('modal-tags');
    tagsContainer.innerHTML = '';
    project.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
    });

    // Show modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    modalClose.focus(); // Focus close button for accessibility
}

// Planet click handlers
planets.forEach(planet => {
    planet.addEventListener('click', (e) => {
        e.stopPropagation();
        openProjectModal(planet);
    });

    // Keyboard support
    planet.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openProjectModal(planet);
        }
    });
});

// Close modal
function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');

    // Remove active class from all planets after a short delay
    setTimeout(() => {
        planets.forEach(p => p.classList.remove('active'));
    }, 300);
}

modalClose.addEventListener('click', closeModal);
modalClose.setAttribute('aria-label', 'Close modal');

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// Initialize modal aria-hidden
modal.setAttribute('aria-hidden', 'true');
modal.setAttribute('role', 'dialog');
modal.setAttribute('aria-modal', 'true');
