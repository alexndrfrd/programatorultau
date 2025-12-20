// Feature Flags System
function initializeFeatureFlags() {
    // Check if FEATURE_FLAGS is defined
    if (typeof FEATURE_FLAGS === 'undefined') {
        console.warn('Feature flags not loaded. All sections will be visible.');
        return;
    }

    // Hide/show sections based on feature flags
    document.querySelectorAll('[data-feature]').forEach(section => {
        const featureName = section.getAttribute('data-feature');
        const isEnabled = FEATURE_FLAGS[featureName];
        
        if (!isEnabled) {
            section.style.display = 'none';
            section.setAttribute('data-feature-disabled', 'true');
        } else {
            section.style.display = '';
            section.removeAttribute('data-feature-disabled');
        }
    });

    // Hide/show navigation links based on feature flags
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === '#ai' && !FEATURE_FLAGS.aiSection) {
            link.closest('li')?.remove();
        } else if (href === '#site-la-click' && !FEATURE_FLAGS.siteLaClick) {
            link.closest('li')?.remove();
        } else if (href === '#consultatie' && !FEATURE_FLAGS.consultationBooking) {
            link.closest('li')?.remove();
        } else if (href === '#contact' && !FEATURE_FLAGS.contactForm) {
            link.closest('li')?.remove();
        }
    });

    // Hide/show hero buttons based on feature flags
    const heroButtons = document.querySelectorAll('.hero-buttons a');
    heroButtons.forEach(button => {
        const href = button.getAttribute('href');
        if (href === '#ai' && !FEATURE_FLAGS.aiSection) {
            button.style.display = 'none';
        } else if (href === '#site-la-click' && !FEATURE_FLAGS.siteLaClick) {
            button.style.display = 'none';
        } else if (href === '#consultatie' && !FEATURE_FLAGS.consultationBooking) {
            button.style.display = 'none';
        }
    });

    // Hide/show dashboard cards based on feature flags
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    dashboardCards.forEach(card => {
        const href = card.getAttribute('href');
        if (href === '#ai' && !FEATURE_FLAGS.aiSection) {
            card.style.display = 'none';
        } else if (href === '#site-la-click' && !FEATURE_FLAGS.siteLaClick) {
            card.style.display = 'none';
        }
    });

    console.log('✅ Feature flags initialized', FEATURE_FLAGS);
}

// Initialize feature flags on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFeatureFlags);
} else {
    initializeFeatureFlags();
}

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        
        // Special handling for ai-modules link
        if (href === '#ai-modules') {
            const target = document.querySelector('#ai-modules');
            if (target) {
                // Wait a bit for any animations to complete
                setTimeout(() => {
                    const navbar = document.querySelector('.navbar');
                    const navbarHeight = navbar ? navbar.offsetHeight : 80;
                    
                    // Use getBoundingClientRect for accurate position
                    const rect = target.getBoundingClientRect();
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const targetTop = rect.top + scrollTop - navbarHeight - 30;
                    
                    window.scrollTo({
                        top: Math.max(0, targetTop),
                        behavior: 'smooth'
                    });
                }, 100);
                
                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (mobileMenuToggle) {
                        mobileMenuToggle.classList.remove('active');
                    }
                }
            }
            return;
        }
        
        // Regular anchor links
        const target = document.querySelector(href);
        if (target) {
            // Get navbar height for offset
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 80;
            const offsetTop = target.offsetTop - navbarHeight - 20;
            window.scrollTo({
                top: Math.max(0, offsetTop),
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const navMenu = document.querySelector('.nav-menu');
            const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (mobileMenuToggle) {
                    mobileMenuToggle.classList.remove('active');
                }
            }
        }
    });
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

// Observe elements for animation
const animateElements = document.querySelectorAll('.service-card, .service-done-card, .project-card, .ai-feature');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Form submission handler
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    const API_BASE_URL = 'http://localhost:3000/api';
    const messageDiv = document.getElementById('contact-form-message');
    const submitButton = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Disable submit button
        submitButton.disabled = true;
        submitButton.textContent = 'Se trimite...';
        messageDiv.style.display = 'none';
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject') || '',
            message: formData.get('message')
        };
        
        try {
            const response = await fetch(`${API_BASE_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                // Success message
                messageDiv.style.display = 'block';
                messageDiv.className = 'form-message success';
                messageDiv.textContent = result.message || 'Mulțumim pentru mesaj! Vă vom contacta în curând.';
                
                // Reset form
                contactForm.reset();
            } else {
                // Error message
                messageDiv.style.display = 'block';
                messageDiv.className = 'form-message error';
                messageDiv.textContent = result.message || 'Eroare la trimiterea mesajului. Te rugăm să încerci din nou.';
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            messageDiv.style.display = 'block';
            messageDiv.className = 'form-message error';
            messageDiv.textContent = 'Eroare de conexiune. Te rugăm să încerci din nou sau să ne contactezi direct la contact@programatorultau.com';
        } finally {
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.textContent = 'Trimite Mesaj';
        }
    });
}

// Counter animation for stats
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '+';
        }
    }, 16);
};

// Observe stats section
const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.textContent);
                    animateCounter(stat, target);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
}

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const orbs = document.querySelectorAll('.gradient-orb');
    
    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 0.5;
        orb.style.transform = `translate(${scrolled * speed * 0.1}px, ${scrolled * speed * 0.1}px)`;
    });
});

// Add active state to navigation links based on scroll position
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
});

// Add hover effect to service cards
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Lazy loading for images (if you add real images later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Scroll Progress Indicator
const scrollIndicator = document.createElement('div');
scrollIndicator.className = 'scroll-indicator';
document.body.appendChild(scrollIndicator);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    scrollIndicator.style.width = scrolled + '%';
});

// Particles Effect
const canvas = document.getElementById('particles-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 50;

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    animateParticles();
}

// Calendar Functionality
let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;

const monthNames = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 
                    'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];
const dayNames = ['Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm', 'Dum'];

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const calendarGrid = document.getElementById('calendar-grid');
    const monthYear = document.getElementById('current-month-year');
    
    if (!calendarGrid || !monthYear) return;

    monthYear.textContent = `${monthNames[month]} ${year}`;

    calendarGrid.innerHTML = '';

    // Day names
    dayNames.forEach(day => {
        const dayNameEl = document.createElement('div');
        dayNameEl.className = 'calendar-day-name';
        dayNameEl.textContent = day;
        calendarGrid.appendChild(dayNameEl);
    });

    // Empty cells for days before month starts
    const startDay = firstDay === 0 ? 6 : firstDay - 1; // Monday = 0
    for (let i = 0; i < startDay; i++) {
        const emptyDay = document.createElement('div');
        calendarGrid.appendChild(emptyDay);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.textContent = day;

        const cellDate = new Date(year, month, day);
        if (cellDate < today) {
            dayEl.classList.add('disabled');
        } else {
            if (cellDate.toDateString() === today.toDateString()) {
                dayEl.classList.add('today');
            }
            dayEl.addEventListener('click', () => selectDate(cellDate, dayEl));
        }

        calendarGrid.appendChild(dayEl);
    }
}

function selectDate(date, element) {
    if (element.classList.contains('disabled')) return;

    document.querySelectorAll('.calendar-day').forEach(day => {
        day.classList.remove('selected');
    });
    element.classList.add('selected');
    selectedDate = date;
    // Formatează data locală (nu UTC) pentru input hidden
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    document.getElementById('selected-date').value = `${year}-${month}-${day}`;
    renderTimeSlots();
}

function renderTimeSlots() {
    const timeSlotsContainer = document.getElementById('time-slots');
    if (!timeSlotsContainer) return;

    if (!selectedDate) {
        timeSlotsContainer.innerHTML = '<p class="time-slots-label">Selectează o dată pentru a vedea orele disponibile</p>';
        return;
    }

    const availableSlots = [
        '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
        '15:00', '16:00', '17:00', '18:00'
    ];

    timeSlotsContainer.innerHTML = '';
    timeSlotsContainer.classList.remove('time-slots-label');

    availableSlots.forEach(time => {
        const slotEl = document.createElement('div');
        slotEl.className = 'time-slot';
        slotEl.textContent = time;
        slotEl.addEventListener('click', () => selectTime(time, slotEl));
        timeSlotsContainer.appendChild(slotEl);
    });
}

function selectTime(time, element) {
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    element.classList.add('selected');
    selectedTime = time;
    document.getElementById('selected-time').value = time;
}

// Calendar Navigation
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');

if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
        selectedDate = null;
        selectedTime = null;
        renderTimeSlots();
    });
}

if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
        selectedDate = null;
        selectedTime = null;
        renderTimeSlots();
    });
}

// Initialize Calendar
if (document.getElementById('calendar-grid')) {
    renderCalendar();
}

// Booking Form Handler
const bookingForm = document.getElementById('booking-form');

// 3D Card Tilt Effect
const cards = document.querySelectorAll('.service-card, .pricing-card, .project-card');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Animate pricing cards on scroll
const pricingCards = document.querySelectorAll('.pricing-card');
pricingCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Animate consultație info cards
const infoCards = document.querySelectorAll('.info-card');
infoCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateX(-30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
    observer.observe(card);
});

// Magnetic Button Effect
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0)';
    });
});

// Site la Click Wizard
let currentWizardStep = 1;
let selectedPlan = null;
let siteConfig = {};

const planNames = {
    'basic': 'Basic',
    'pro': 'Pro',
    'premium': 'Premium'
};

const planPrices = {
    'basic': 300,
    'pro': 500,
    'premium': 800
};

const planFeatures = {
    'basic': {
        themes: ['modern', 'minimal'],
        logoUpload: false,
        imageUpload: false,
        sections: 5
    },
    'pro': {
        themes: ['modern', 'minimal', 'bold', 'corporate', 'creative'],
        logoUpload: true,
        imageUpload: true,
        sections: 8
    },
    'premium': {
        themes: ['modern', 'minimal', 'bold', 'corporate', 'creative'],
        logoUpload: true,
        imageUpload: true,
        sections: 12
    }
};

// Open wizard modal
document.querySelectorAll('.choose-plan').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const siteType = btn.dataset.type || 'prezentare';
        
        // Handle different site types
        if (siteType === 'prezentare') {
            selectedPlan = btn.dataset.plan;
            siteConfig.siteType = 'prezentare';
            siteConfig.plan = selectedPlan;
            siteConfig.price = btn.dataset.price;
            openWizard();
        } else if (siteType === 'magazin') {
            // For magazin online, show subscription info
            const plan = btn.dataset.plan;
            const price = btn.dataset.price;
            alert(`Plan ${plan} - ${price} RON/lună\n\n` +
                  `Pentru magazine online, prețurile sunt customizabile din database.\n` +
                  `Te rugăm să programezi o consultație pentru a discuta despre proiectul tău.`);
            // Scroll to consultation section
            document.querySelector('#consultatie')?.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Complex site form button
const complexSiteFormBtn = document.getElementById('complex-site-form-btn');
if (complexSiteFormBtn) {
    complexSiteFormBtn.addEventListener('click', () => {
        const modal = document.getElementById('complex-site-modal');
        if (modal) {
            modal.classList.add('active');
        }
    });
}

// Complex site form submission
const complexSiteForm = document.getElementById('complex-site-form');
if (complexSiteForm) {
    complexSiteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(complexSiteForm);
        const data = Object.fromEntries(formData);
        const messageDiv = document.getElementById('complex-form-message');
        
        try {
            const response = await fetch(`${API_BASE_URL}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    phone: data.phone || '',
                    subject: 'Cerere Site Complex',
                    message: `Cerere pentru Site Complex\n\n` +
                            `Descriere proiect:\n${data['project-description']}\n\n` +
                            `Funcționalități:\n${data.features || 'N/A'}\n\n` +
                            `Buget estimat: ${data.budget || 'N/A'}\n` +
                            `Termen limită: ${data.deadline || 'N/A'}`
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                messageDiv.style.display = 'block';
                messageDiv.className = 'form-message success';
                messageDiv.textContent = 'Mulțumim! Vă vom contacta în curând pentru o consultație și o ofertă personalizată.';
                complexSiteForm.reset();
                setTimeout(() => {
                    closeComplexModal();
                }, 3000);
            } else {
                throw new Error(result.message || 'Error submitting form');
            }
        } catch (error) {
            messageDiv.style.display = 'block';
            messageDiv.className = 'form-message error';
            messageDiv.textContent = 'Eroare la trimiterea formularului. Te rugăm să încerci din nou.';
        }
    });
}

function closeComplexModal() {
    const modal = document.getElementById('complex-site-modal');
    if (modal) {
        modal.classList.remove('active');
        const form = document.getElementById('complex-site-form');
        if (form) form.reset();
        const messageDiv = document.getElementById('complex-form-message');
        if (messageDiv) {
            messageDiv.style.display = 'none';
            messageDiv.textContent = '';
        }
    }
}

// Make it globally available
window.closeComplexModal = closeComplexModal;

// Close complex modal handlers
const complexModalClose = document.querySelector('#complex-site-modal .modal-close');
if (complexModalClose) {
    complexModalClose.addEventListener('click', closeComplexModal);
}

const complexModal = document.getElementById('complex-site-modal');
if (complexModal) {
    complexModal.addEventListener('click', (e) => {
        if (e.target === complexModal) {
            closeComplexModal();
        }
    });
}

function openWizard() {
    const modal = document.getElementById('site-wizard-modal');
    if (modal) {
        modal.classList.add('active');
        currentWizardStep = 1;
        updateWizardStep(1);
        updatePlanSelection();
    }
}

function closeWizard() {
    const modal = document.getElementById('site-wizard-modal');
    if (modal) {
        modal.classList.remove('active');
        currentWizardStep = 1;
        siteConfig = {};
    }
}

// Close modal handlers
const modalClose = document.querySelector('.modal-close');
if (modalClose) {
    modalClose.addEventListener('click', closeWizard);
}

const modal = document.getElementById('site-wizard-modal');
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeWizard();
        }
    });
}

function updatePlanSelection() {
    const planSelection = document.getElementById('plan-selection');
    if (planSelection && selectedPlan) {
        planSelection.innerHTML = `
            <h3>${planNames[selectedPlan]}</h3>
            <div class="price">${planPrices[selectedPlan]} RON/lună</div>
            <p>Ai selectat planul <strong>${planNames[selectedPlan]}</strong>. Continuă pentru a configura site-ul.</p>
        `;
    }
}

function updateWizardStep(step) {
    // Update progress indicators
    document.querySelectorAll('.progress-step').forEach((stepEl, index) => {
        const stepNum = index + 1;
        stepEl.classList.remove('active', 'completed');
        if (stepNum < step) {
            stepEl.classList.add('completed');
        } else if (stepNum === step) {
            stepEl.classList.add('active');
        }
    });

    // Update wizard steps
    document.querySelectorAll('.wizard-step').forEach((stepEl, index) => {
        stepEl.classList.remove('active');
        if (index + 1 === step) {
            stepEl.classList.add('active');
        }
    });

    // Update buttons
    const prevBtn = document.getElementById('wizard-prev');
    const nextBtn = document.getElementById('wizard-next');
    const submitBtn = document.getElementById('wizard-submit');

    if (prevBtn) prevBtn.style.display = step > 1 ? 'block' : 'none';
    if (nextBtn) nextBtn.style.display = step < 5 ? 'block' : 'none';
    if (submitBtn) submitBtn.style.display = step === 5 ? 'block' : 'none';
    
    // Special handling for step 2 (theme selection)
    if (step === 2) {
        updateThemeSelection();
    }
    
    // Special handling for step 4 (design)
    if (step === 4) {
        updateDesignOptions();
    }
    
    // Special handling for step 5 (preview)
    if (step === 5) {
        generatePreview();
    }
}

function updateThemeSelection() {
    const features = planFeatures[selectedPlan] || planFeatures.basic;
    const themeCards = document.querySelectorAll('.theme-card');
    
    themeCards.forEach(card => {
        const theme = card.dataset.theme;
        const isAvailable = features.themes.includes(theme);
        
        if (!isAvailable) {
            card.style.opacity = '0.5';
            card.style.pointerEvents = 'none';
            card.classList.add('disabled');
        } else {
            card.style.opacity = '1';
            card.style.pointerEvents = 'auto';
            card.classList.remove('disabled');
        }
    });
    
    // Update note
    const themeNote = document.getElementById('theme-note');
    if (selectedPlan === 'basic') {
        themeNote.innerHTML = '<p>💡 Planul <strong>Basic</strong> include doar temele Modern și Minimal. Upgrade la Pro pentru toate temele!</p>';
    } else {
        themeNote.innerHTML = '<p>✅ Toate temele sunt disponibile pentru planul tău!</p>';
    }
}

function updateDesignOptions() {
    const features = planFeatures[selectedPlan] || planFeatures.basic;
    
    // Show/hide logo upload
    const logoUploadOption = document.getElementById('logo-upload-option');
    const logoUpload = document.getElementById('logo-upload');
    if (logoUploadOption && logoUpload) {
        if (features.logoUpload) {
            logoUploadOption.style.display = 'block';
        } else {
            logoUploadOption.style.display = 'none';
            const uploadRadio = document.querySelector('input[name="logo-type"][value="upload"]');
            const autoRadio = document.querySelector('input[name="logo-type"][value="auto"]');
            if (uploadRadio) uploadRadio.checked = false;
            if (autoRadio) autoRadio.checked = true;
            logoUpload.style.display = 'none';
        }
    }
    
    // Show/hide image upload
    const imagesSection = document.getElementById('images-section');
    if (imagesSection) {
        if (features.imageUpload) {
            imagesSection.style.display = 'block';
        } else {
            imagesSection.style.display = 'none';
        }
    }
}

// Wizard navigation
const wizardNext = document.getElementById('wizard-next');
const wizardPrev = document.getElementById('wizard-prev');
const wizardSubmit = document.getElementById('wizard-submit');

if (wizardNext) {
    wizardNext.addEventListener('click', () => {
        if (validateStep(currentWizardStep)) {
            if (currentWizardStep < 5) {
                currentWizardStep++;
                updateWizardStep(currentWizardStep);
            }
        }
    });
}

if (wizardPrev) {
    wizardPrev.addEventListener('click', () => {
        if (currentWizardStep > 1) {
            currentWizardStep--;
            updateWizardStep(currentWizardStep);
        }
    });
}

function validateStep(step) {
    if (step === 2) {
        // Validate theme selection
        const selectedTheme = document.querySelector('.theme-card.selected');
        if (!selectedTheme) {
            alert('Te rugăm să selectezi o temă!');
            return false;
        }
        siteConfig.theme = selectedTheme.dataset.theme;
    }
    if (step === 3) {
        // Validate content
        const siteName = document.getElementById('site-name');
        const siteEmail = document.getElementById('site-email');
        if (!siteName.value || !siteEmail.value) {
            alert('Te rugăm să completezi toate câmpurile obligatorii!');
            return false;
        }
    }
    if (step === 5) {
        // All data should be collected by now
        collectAllData();
    }
    return true;
}

// Theme selection
document.querySelectorAll('.theme-card').forEach(card => {
    card.addEventListener('click', function() {
        if (this.classList.contains('disabled')) return;
        
        document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        siteConfig.theme = this.dataset.theme;
        
        // Set default colors for theme
        if (typeof SITE_TEMPLATES !== 'undefined' && SITE_TEMPLATES[siteConfig.theme]) {
            const themeDefaults = SITE_TEMPLATES[siteConfig.theme].defaultColors;
            if (themeDefaults) {
                siteConfig.primaryColor = themeDefaults.primary;
                siteConfig.secondaryColor = themeDefaults.secondary;
                const primaryColorInput = document.getElementById('primary-color');
                const secondaryColorInput = document.getElementById('secondary-color');
                if (primaryColorInput) primaryColorInput.value = themeDefaults.primary;
                if (secondaryColorInput) secondaryColorInput.value = themeDefaults.secondary;
                const primaryHex = document.getElementById('primary-color-hex');
                const secondaryHex = document.getElementById('secondary-color-hex');
                if (primaryHex) primaryHex.value = themeDefaults.primary;
                if (secondaryHex) secondaryHex.value = themeDefaults.secondary;
            }
        }
    });
});

// Logo upload handling
document.querySelectorAll('input[name="logo-type"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const logoUpload = document.getElementById('logo-upload');
        if (e.target.value === 'upload') {
            logoUpload.style.display = 'block';
            siteConfig.logoType = 'upload';
        } else {
            logoUpload.style.display = 'none';
            siteConfig.logoType = 'auto';
            siteConfig.logoBase64 = null;
        }
    });
});

const logoFile = document.getElementById('logo-file');
if (logoFile) {
    logoFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                siteConfig.logoBase64 = event.target.result;
                const preview = document.getElementById('logo-preview');
                if (preview) {
                    preview.innerHTML = `<img src="${event.target.result}" alt="Logo" style="max-width: 200px; max-height: 100px;">`;
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

// Image upload handling
const heroImageFile = document.getElementById('hero-image-file');
if (heroImageFile) {
    heroImageFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                siteConfig.heroImageBase64 = event.target.result;
                const preview = document.getElementById('hero-image-preview');
                if (preview) {
                    preview.innerHTML = `<img src="${event.target.result}" alt="Hero" style="max-width: 100%; max-height: 200px; border-radius: 8px;">`;
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

const aboutImageFile = document.getElementById('about-image-file');
if (aboutImageFile) {
    aboutImageFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                siteConfig.aboutImageBase64 = event.target.result;
                const preview = document.getElementById('about-image-preview');
                if (preview) {
                    preview.innerHTML = `<img src="${event.target.result}" alt="About" style="max-width: 100%; max-height: 200px; border-radius: 8px;">`;
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

function collectAllData() {
    // Collect all form data
    siteConfig.siteName = document.getElementById('site-name')?.value || '';
    siteConfig.heroTitle = document.getElementById('hero-title')?.value || '';
    siteConfig.heroSubtitle = document.getElementById('hero-subtitle')?.value || '';
    siteConfig.ctaButtonText = document.getElementById('cta-button-text')?.value || 'Contactează-ne';
    siteConfig.aboutText = document.getElementById('about-text')?.value || '';
    siteConfig.siteEmail = document.getElementById('site-email')?.value || '';
    siteConfig.sitePhone = document.getElementById('site-phone')?.value || '';
    siteConfig.siteAddress = document.getElementById('site-address')?.value || '';
    siteConfig.primaryColor = document.getElementById('primary-color')?.value || '#6366F1';
    siteConfig.secondaryColor = document.getElementById('secondary-color')?.value || '#8B5CF6';
    const logoTypeRadio = document.querySelector('input[name="logo-type"]:checked');
    siteConfig.logoType = logoTypeRadio ? logoTypeRadio.value : 'auto';
}

function generatePreview() {
    collectAllData();
    const previewContainer = document.getElementById('site-preview');
    if (!previewContainer) return;
    
    if (typeof generateSiteHTML === 'function') {
        const previewHTML = generateSiteHTML(siteConfig);
        previewContainer.innerHTML = `<iframe srcdoc="${previewHTML.replace(/"/g, '&quot;')}" style="width: 100%; height: 600px; border: 1px solid #e5e7eb; border-radius: 12px;"></iframe>`;
    } else {
        previewContainer.innerHTML = '<p>Preview-ul va fi generat după ce completezi toate datele.</p>';
    }
}

// Color picker updates
const primaryColor = document.getElementById('primary-color');
const secondaryColor = document.getElementById('secondary-color');
const primaryHex = document.getElementById('primary-color-hex');
const secondaryHex = document.getElementById('secondary-color-hex');

if (primaryColor && primaryHex) {
    primaryColor.addEventListener('input', (e) => {
        const color = e.target.value;
        primaryHex.value = color;
        siteConfig.primaryColor = color;
        updateColorPreview();
    });

    primaryHex.addEventListener('input', (e) => {
        const color = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(color)) {
            primaryColor.value = color;
            siteConfig.primaryColor = color;
            updateColorPreview();
        }
    });
}

if (secondaryColor && secondaryHex) {
    secondaryColor.addEventListener('input', (e) => {
        const color = e.target.value;
        secondaryHex.value = color;
        siteConfig.secondaryColor = color;
        updateColorPreview();
    });

    secondaryHex.addEventListener('input', (e) => {
        const color = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(color)) {
            secondaryColor.value = color;
            siteConfig.secondaryColor = color;
            updateColorPreview();
        }
    });
}

function updateColorPreview() {
    const previewHeader = document.querySelector('.preview-header');
    const previewBtn = document.querySelector('.preview-btn');
    const previewAccent = document.querySelector('.preview-accent');

    if (previewHeader && siteConfig.primaryColor) {
        previewHeader.style.background = siteConfig.primaryColor;
    }
    if (previewBtn && siteConfig.primaryColor) {
        previewBtn.style.background = siteConfig.primaryColor;
    }
    if (previewAccent && siteConfig.secondaryColor) {
        previewAccent.style.background = siteConfig.secondaryColor;
    }
}

// Layout options
document.querySelectorAll('input[name="header-position"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        siteConfig.headerPosition = e.target.value;
    });
});

document.querySelectorAll('input[name="footer-visible"]').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
        siteConfig.footerVisible = e.target.checked;
    });
});

document.querySelectorAll('input[name="sidebar-visible"]').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
        siteConfig.sidebarVisible = e.target.checked;
    });
});

// Submit wizard
if (wizardSubmit) {
    wizardSubmit.addEventListener('click', async () => {
        collectAllData();
        
        if (!siteConfig.siteName || !siteConfig.siteEmail) {
            alert('Te rugăm să completezi toate câmpurile obligatorii!');
            return;
        }

        // Generate site for all plans (all are presentation sites now)
        generateSiteAutomatically(siteConfig);
    });
}

async function generateSiteAutomatically(config) {
    // Generate HTML using template system
    let siteHTML;
    if (typeof generateSiteHTML === 'function') {
        siteHTML = generateSiteHTML(config);
    } else {
        // Fallback to simple template
        siteHTML = generateSimpleSiteHTML(config);
    }
    
    // Save template to backend
    try {
        const response = await fetch(`${API_BASE_URL}/templates`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                siteName: config.siteName,
                siteType: config.siteType || 'prezentare',
                plan: config.plan || 'basic',
                theme: config.theme || 'modern',
                htmlContent: siteHTML,
                config: {
                    primaryColor: config.primaryColor,
                    secondaryColor: config.secondaryColor,
                    heroTitle: config.heroTitle,
                    heroSubtitle: config.heroSubtitle,
                    ctaButtonText: config.ctaButtonText,
                    aboutText: config.aboutText
                },
                clientEmail: config.siteEmail,
                clientName: config.siteName
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Show success with access link
            alert(`✅ Site-ul tău a fost generat cu succes!\n\n` +
                  `ID Template: ${result.data.id}\n` +
                  `Token: ${result.data.token}\n\n` +
                  `Link acces: ${result.data.accessUrl}\n\n` +
                  `Vei primi un email la ${config.siteEmail} cu link-ul de acces.\n\n` +
                  `Vă vom contacta pentru mutarea pe hosting și cumpărarea domeniului.`);
            
            // Also create download link as backup
            const blob = new Blob([siteHTML], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${config.siteName.replace(/\s+/g, '-').toLowerCase()}-site.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            throw new Error(result.message || 'Failed to save template');
        }
    } catch (error) {
        console.error('Error saving template:', error);
        // Fallback: just download
        const blob = new Blob([siteHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${config.siteName.replace(/\s+/g, '-').toLowerCase()}-site.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert(`✅ Site-ul a fost generat și descărcat!\n\n` +
              `⚠️ Nu s-a putut salva în sistem (eroare: ${error.message}).\n` +
              `Vă vom contacta la ${config.siteEmail} pentru mutarea pe hosting.`);
    }
    
    closeWizard();
}

function generateSimpleSiteHTML(config) {
    return `<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.siteName}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; line-height: 1.6; }
        .header { background: ${config.primaryColor || '#6366F1'}; color: white; padding: 1rem 0; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .header-content { display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.5rem; font-weight: 700; }
        .nav a { color: white; text-decoration: none; margin-left: 2rem; }
        .hero { padding: 4rem 0; text-align: center; background: linear-gradient(135deg, ${config.primaryColor || '#6366F1'}, ${config.secondaryColor || '#8B5CF6'}); color: white; }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
        .content { padding: 4rem 0; }
        .btn { display: inline-block; padding: 1rem 2rem; background: white; color: ${config.primaryColor || '#6366F1'}; text-decoration: none; border-radius: 8px; margin-top: 1rem; }
        .footer { background: #111; color: white; padding: 2rem 0; text-align: center; }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="logo">${config.siteName}</div>
                <nav class="nav">
                    <a href="#home">Acasă</a>
                    <a href="#despre">Despre</a>
                    <a href="#contact">Contact</a>
                </nav>
            </div>
        </div>
    </header>
    <section class="hero" id="home">
        <div class="container">
            <h1>${config.heroTitle || `Bun venit la ${config.siteName}`}</h1>
            ${config.heroSubtitle ? `<p>${config.heroSubtitle}</p>` : ''}
            <a href="#contact" class="btn">${config.ctaButtonText || 'Contactează-ne'}</a>
        </div>
    </section>
    ${config.aboutText ? `
    <section class="content" id="despre">
        <div class="container">
            <h2>Despre Noi</h2>
            <p>${config.aboutText}</p>
        </div>
    </section>
    ` : ''}
    <section class="content" id="contact">
        <div class="container">
            <h2>Contact</h2>
            ${config.siteEmail ? `<p>Email: ${config.siteEmail}</p>` : ''}
            ${config.sitePhone ? `<p>Telefon: ${config.sitePhone}</p>` : ''}
            ${config.siteAddress ? `<p>Adresă: ${config.siteAddress}</p>` : ''}
        </div>
    </section>
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${config.siteName}. Toate drepturile rezervate.</p>
        </div>
    </footer>
</body>
</html>`;
}

async function sendSiteGeneratedEmail(config) {
    // Send notification email to admin about generated site
    try {
        const response = await fetch(`${API_BASE_URL}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: config.siteName,
                email: config.siteEmail,
                subject: `Site generat - ${config.siteName} (${planNames[config.plan]})`,
                message: `Un site nou a fost generat prin Site la Click.\n\nPlan: ${planNames[config.plan]} (${planPrices[config.plan]} RON/lună)\nTemă: ${config.theme}\nEmail client: ${config.siteEmail}\nTelefon: ${config.sitePhone || 'N/A'}`
            })
        });
    } catch (error) {
        console.log('Email notification failed (non-critical)', error);
    }
}

function generateSiteHTML(config) {
    return `<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.siteName}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; line-height: 1.6; }
        .header { background: ${config.primaryColor || '#6366F1'}; color: white; padding: 1rem 0; ${config.headerPosition === 'sticky' ? 'position: sticky; top: 0; z-index: 1000;' : ''} }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .header-content { display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.5rem; font-weight: 700; }
        .nav a { color: white; text-decoration: none; margin-left: 2rem; }
        .hero { padding: 4rem 0; text-align: center; background: linear-gradient(135deg, ${config.primaryColor || '#6366F1'}, ${config.secondaryColor || '#8B5CF6'}); color: white; }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
        .content { padding: 4rem 0; }
        .btn { display: inline-block; padding: 1rem 2rem; background: ${config.primaryColor || '#6366F1'}; color: white; text-decoration: none; border-radius: 8px; margin-top: 1rem; }
        ${config.footerVisible !== false ? `.footer { background: #111; color: white; padding: 2rem 0; text-align: center; }` : ''}
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="logo">${config.siteName}</div>
                <nav class="nav">
                    <a href="#home">Acasă</a>
                    <a href="#despre">Despre</a>
                    <a href="#contact">Contact</a>
                </nav>
            </div>
        </div>
    </header>
    <section class="hero">
        <div class="container">
            <h1>Bun venit la ${config.siteName}</h1>
            <p>${config.siteDescription || 'Site generat automat de Programatorul Tău'}</p>
            <a href="#contact" class="btn">Contactează-ne</a>
        </div>
    </section>
    <section class="content">
        <div class="container">
            <h2>Despre Noi</h2>
            <p>${config.siteDescription || 'Adaugă conținut aici...'}</p>
            <h2>Contact</h2>
            <p>Email: ${config.siteEmail}</p>
            ${config.sitePhone ? `<p>Telefon: ${config.sitePhone}</p>` : ''}
        </div>
    </section>
    ${config.footerVisible !== false ? `<footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${config.siteName}. Toate drepturile rezervate.</p>
        </div>
    </footer>` : ''}
</body>
</html>`;
}

async function sendSiteRequestEmail(config) {
    // Use EmailJS or similar service, or send to your backend
    // For now, we'll use a simple approach with a mailto link or console log
    
    const emailBody = `
Plan: ${planNames[config.plan]} (${config.price} RON/lună)
Culori: Primary ${config.primaryColor}, Secondary ${config.secondaryColor}
Layout: Header ${config.headerPosition}, Footer ${config.footerVisible ? 'vizibil' : 'ascuns'}, Sidebar ${config.sidebarVisible ? 'vizibil' : 'ascuns'}
Nume Site: ${config.siteName}
Email: ${config.siteEmail}
Telefon: ${config.sitePhone || 'N/A'}
Descriere: ${config.siteDescription || 'N/A'}
    `.trim();

    // Send site request via email (mailto)
    const mailtoLink = `mailto:contact@programatorultau.com?subject=Cerere Site ${planNames[config.plan]}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
    alert('Cererea ta a fost pregătită! Vă vom contacta în curând la ' + config.siteEmail);
    closeWizard();
}

// Backend API Configuration
// Configurează URL-ul backend-ului aici
const API_BASE_URL = 'http://localhost:3000/api'; // Schimbă pentru producție

/**
 * Încarcă sloturile ocupate pentru o dată specifică din backend
 */
async function loadBookedSlots(date) {
    try {
        // Formatează data ca YYYY-MM-DD (folosind data locală, nu UTC)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        console.log('📅 Loading booked slots for date:', dateStr, '(local date)');
        
        // Face request la backend API
        const response = await fetch(`${API_BASE_URL}/bookings?date=${dateStr}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            console.log(`✅ Found ${result.bookedSlots.length} booked slots for ${dateStr}:`, result.bookedSlots);
            return result.bookedSlots || [];
        } else {
            console.error('❌ Error from API:', result.message);
            return [];
        }
    } catch (error) {
        console.error('❌ Error loading booked slots:', error);
        // Dacă backend-ul nu e disponibil, returnează array gol (toate sloturile disponibile)
        return [];
    }
}

// Update renderTimeSlots to show booked slots from backend
const originalRenderTimeSlots = renderTimeSlots;
renderTimeSlots = async function() {
    const timeSlotsContainer = document.getElementById('time-slots');
    if (!timeSlotsContainer) return;

    if (!selectedDate) {
        timeSlotsContainer.innerHTML = '<p class="time-slots-label">Selectează o dată pentru a vedea orele disponibile</p>';
        return;
    }

    // Show loading state
    timeSlotsContainer.innerHTML = '<p class="time-slots-label">Se încarcă sloturile...</p>';
    
    // Get booked slots from backend API
    const bookedSlots = await loadBookedSlots(selectedDate);
    
    // All possible slots
    const allSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
    
    timeSlotsContainer.innerHTML = '';
    timeSlotsContainer.classList.remove('time-slots-label');

    // Render all slots, marking booked ones as disabled
    allSlots.forEach(time => {
        const slotEl = document.createElement('div');
        const isBooked = bookedSlots.includes(time);
        
        slotEl.className = 'time-slot' + (isBooked ? ' booked' : '');
        slotEl.textContent = time;
        
        if (isBooked) {
            slotEl.title = 'Acest slot este deja rezervat';
            slotEl.style.cursor = 'not-allowed';
            slotEl.style.opacity = '0.5';
        } else {
            slotEl.addEventListener('click', () => selectTime(time, slotEl));
        }
        
        timeSlotsContainer.appendChild(slotEl);
    });
    
    // If all slots are booked
    if (bookedSlots.length === allSlots.length) {
        timeSlotsContainer.innerHTML = '<p class="time-slots-label">Nu sunt sloturi disponibile pentru această dată</p>';
    }
};

// Update booking form to save to backend
let isSubmitting = false; // Flag pentru a preveni double submit
if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Previne double submit
        if (isSubmitting) {
            console.log('⚠️ Submit already in progress, ignoring...');
            return;
        }
        
        if (!selectedDate || !selectedTime) {
            alert('Te rugăm să selectezi o dată și o oră!');
            return;
        }
        
        isSubmitting = true; // Marchează că submit-ul e în progres

        const formData = new FormData(bookingForm);
        const data = Object.fromEntries(formData);
        
        // Save to backend API
        try {
            console.log('💾 Attempting to save booking to backend...');
            
            // Formatează data ca YYYY-MM-DD (folosind data locală, nu UTC)
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            
            const bookingData = {
                date: dateStr,
                time: selectedTime,
                name: data.name,
                email: data.email,
                phone: data.phone
            };
            
            console.log('📝 Booking data:', bookingData);
            
            // Trimite datele la backend API
            const response = await fetch(`${API_BASE_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                console.log('✅ Booking saved successfully:', result.data);
                
                // Salvează datele înainte de reset (pentru mesaj)
                const savedDate = selectedDate;
                const savedTime = selectedTime;
                
                // Reset form și selecții
                bookingForm.reset();
                selectedDate = null;
                selectedTime = null;
                
                // Reset UI
                document.querySelectorAll('.calendar-day').forEach(day => {
                    day.classList.remove('selected');
                });
                document.querySelectorAll('.time-slot').forEach(slot => {
                    slot.classList.remove('selected');
                });
                
                // Reset time slots display
                const timeSlotsContainer = document.getElementById('time-slots');
                if (timeSlotsContainer) {
                    timeSlotsContainer.innerHTML = '<p class="time-slots-label">Selectează o dată pentru a vedea orele disponibile</p>';
                }
                
                // Afișează mesajul de succes
                alert(`Mulțumim! Ai programat consultația pentru ${savedDate.toLocaleDateString('ro-RO')} la ${savedTime}. Vă vom contacta în curând pentru confirmare!`);
                
                isSubmitting = false; // Reset flag după succes
                return; // Ieșim din funcție după succes
            } else {
                // Handle specific error messages
                isSubmitting = false; // Reset flag la eroare
                if (response.status === 409) {
                    alert('⚠️ Acest slot este deja rezervat. Te rugăm să alegi alt slot.');
                } else {
                    throw new Error(result.message || 'Unknown error');
                }
                return;
            }
        } catch (error) {
            console.error('❌ Error saving booking:', error);
            isSubmitting = false; // Reset flag la eroare
            
            // Fallback: trimite prin mailto dacă backend-ul nu e disponibil
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                console.warn('⚠️ Backend not available, using mailto fallback');
                const mailtoLink = `mailto:contact@programatorultau.com?subject=Rezervare Consultație&body=Nume: ${data.name}%0AEmail: ${data.email}%0ATelefon: ${data.phone}%0AData: ${selectedDate.toLocaleDateString('ro-RO')}%0AOra: ${selectedTime}`;
                window.location.href = mailtoLink;
                alert(`Mulțumim! Ai programat consultația pentru ${selectedDate.toLocaleDateString('ro-RO')} la ${selectedTime}. Vă vom contacta în curând pentru confirmare!`);
            } else {
                alert('⚠️ Eroare la salvarea rezervării: ' + error.message + '\n\nTe rugăm să încerci din nou sau să ne contactezi direct.');
            }
            return;
        }
    });
}

// Services Done Carousel
const carouselTrack = document.querySelector('.carousel-track');
const carouselCards = document.querySelectorAll('.service-done-card');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');
const dotsContainer = document.querySelector('.carousel-dots');

let currentSlide = 0;
const totalSlides = carouselCards.length;

// Get number of visible cards based on screen size
function getVisibleCards() {
    const width = window.innerWidth;
    if (width >= 1200) return 3; // Desktop: 3 cards
    if (width >= 768) return 2;  // Tablet: 2 cards
    return 1; // Mobile: 1 card
}

// Calculate total slides (groups)
function getTotalSlideGroups() {
    const visible = getVisibleCards();
    return Math.ceil(totalSlides / visible);
}

// Create dots based on slide groups
if (dotsContainer && carouselCards.length > 0) {
    function updateDots() {
        dotsContainer.innerHTML = '';
        const totalGroups = getTotalSlideGroups();
        for (let i = 0; i < totalGroups; i++) {
            const dot = document.createElement('div');
            dot.className = 'carousel-dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    updateDots();
    
    // Update dots on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateDots();
            updateCarousel();
        }, 250);
    });
}

function updateCarousel() {
    if (carouselTrack && carouselCards.length > 0) {
        const visible = getVisibleCards();
        const cardWidth = carouselCards[0].offsetWidth;
        const gap = 32; // 2rem gap
        const translateX = currentSlide * (cardWidth + gap) * visible;
        carouselTrack.style.transform = `translateX(-${translateX}px)`;
    }
    
    // Update dots
    const dots = document.querySelectorAll('.carousel-dot');
    const totalGroups = getTotalSlideGroups();
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
    
    // Update button states
    if (prevBtn) {
        prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
        prevBtn.style.cursor = currentSlide === 0 ? 'not-allowed' : 'pointer';
    }
    if (nextBtn) {
        nextBtn.style.opacity = currentSlide >= totalGroups - 1 ? '0.5' : '1';
        nextBtn.style.cursor = currentSlide >= totalGroups - 1 ? 'not-allowed' : 'pointer';
    }
}

function goToSlide(index) {
    const totalGroups = getTotalSlideGroups();
    if (index >= 0 && index < totalGroups) {
        currentSlide = index;
        updateCarousel();
    }
}

function nextSlide() {
    const totalGroups = getTotalSlideGroups();
    if (currentSlide < totalGroups - 1) {
        currentSlide++;
        updateCarousel();
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        updateCarousel();
    }
}

if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
}

if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide);
}

// Initialize carousel
if (carouselTrack && carouselCards.length > 0) {
    updateCarousel();
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (carouselTrack) {
        carouselTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        carouselTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            nextSlide();
        }
        if (touchEndX > touchStartX + 50) {
            prevSlide();
        }
    }
}
