// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
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

// Form submission handler
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);

    // Show success message (you can customize this)
    alert('Thank you for your message! I\'ll get back to you soon.');

    // Reset form
    contactForm.reset();
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

// Planet click handlers
const planets = document.querySelectorAll('.planet');
const modal = document.getElementById('project-modal');
const modalClose = document.querySelector('.modal-close');

planets.forEach(planet => {
    planet.addEventListener('click', (e) => {
        e.stopPropagation();
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
    });
});

// Close modal
function closeModal() {
    modal.classList.remove('active');
    // Remove active class from all planets after a short delay
    setTimeout(() => {
        planets.forEach(p => p.classList.remove('active'));
    }, 300);
}

modalClose.addEventListener('click', closeModal);

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
