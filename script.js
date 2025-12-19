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
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
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
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to a server
        // For now, we'll just show an alert
        alert('Mulțumim pentru mesaj! Vă vom contacta în curând.');
        
        // Reset form
        contactForm.reset();
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
    document.getElementById('selected-date').value = date.toISOString().split('T')[0];
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
if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!selectedDate || !selectedTime) {
            alert('Te rugăm să selectezi o dată și o oră!');
            return;
        }

        const formData = new FormData(bookingForm);
        const data = Object.fromEntries(formData);
        
        // Here you would send to server
        alert(`Mulțumim! Ai programat consultația pentru ${selectedDate.toLocaleDateString('ro-RO')} la ${selectedTime}. Vă vom contacta în curând pentru confirmare!`);
        
        bookingForm.reset();
        selectedDate = null;
        selectedTime = null;
        renderTimeSlots();
        document.querySelectorAll('.calendar-day').forEach(day => {
            day.classList.remove('selected');
        });
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
    });
}

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
    'prezentare': 'Site Prezentare',
    'magazin': 'Magazin Online',
    'complex': 'Site Complex'
};

const planPrices = {
    'prezentare': 300,
    'magazin': 500,
    'complex': 1000
};

// Open wizard modal
document.querySelectorAll('.choose-plan').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        selectedPlan = btn.dataset.plan;
        siteConfig.plan = selectedPlan;
        siteConfig.price = btn.dataset.price;
        openWizard();
    });
});

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
    if (nextBtn) nextBtn.style.display = step < 4 ? 'block' : 'none';
    if (submitBtn) submitBtn.style.display = step === 4 ? 'block' : 'none';
}

// Wizard navigation
const wizardNext = document.getElementById('wizard-next');
const wizardPrev = document.getElementById('wizard-prev');
const wizardSubmit = document.getElementById('wizard-submit');

if (wizardNext) {
    wizardNext.addEventListener('click', () => {
        if (validateStep(currentWizardStep)) {
            if (currentWizardStep < 4) {
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
    if (step === 4) {
        const siteName = document.getElementById('site-name');
        const siteEmail = document.getElementById('site-email');
        if (!siteName.value || !siteEmail.value) {
            alert('Te rugăm să completezi toate câmpurile obligatorii!');
            return false;
        }
    }
    return true;
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
        if (!validateStep(4)) return;

        // Collect all data
        siteConfig.siteName = document.getElementById('site-name').value;
        siteConfig.siteEmail = document.getElementById('site-email').value;
        siteConfig.sitePhone = document.getElementById('site-phone').value;
        siteConfig.siteDescription = document.getElementById('site-description').value;
        siteConfig.timestamp = new Date().toISOString();

        // Plan 1 (Prezentare) - Generate automatically
        if (selectedPlan === 'prezentare') {
            generateSiteAutomatically(siteConfig);
        } else {
            // Plan 2 & 3 - Send email
            await sendSiteRequestEmail(siteConfig);
        }
    });
}

function generateSiteAutomatically(config) {
    // Generate HTML for simple presentation site
    const siteHTML = generateSiteHTML(config);
    
    // Create download link
    const blob = new Blob([siteHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.siteName.replace(/\s+/g, '-').toLowerCase()}-site.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert(`Site-ul tău a fost generat! Descarcă fișierul și urcă-l pe hosting. Vă vom contacta la ${config.siteEmail} pentru activare.`);
    closeWizard();
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

    // Option 1: Use EmailJS (you need to set it up)
    // Option 2: Use mailto (simple but limited)
    // Option 3: Send to Firebase and process with Cloud Functions
    
    // For now, let's use a mailto link as fallback
    const mailtoLink = `mailto:contact@programatorultau.com?subject=Cerere Site ${planNames[config.plan]}&body=${encodeURIComponent(emailBody)}`;
    
    // Try to use Firebase if available
    if (window.firebaseDb) {
        try {
            const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            await addDoc(collection(window.firebaseDb, 'site-requests'), {
                ...config,
                createdAt: new Date()
            });
            alert('Cererea ta a fost trimisă! Vă vom contacta în curând la ' + config.siteEmail);
            closeWizard();
            return;
        } catch (error) {
            console.error('Firebase error:', error);
        }
    }
    
    // Fallback to mailto
    window.location.href = mailtoLink;
    alert('Cererea ta a fost pregătită! Vă vom contacta în curând la ' + config.siteEmail);
    closeWizard();
}

// Firebase Calendar Integration
async function loadBookedSlots(date) {
    if (!window.firebaseDb) {
        // Fallback: no booked slots if Firebase not configured
        console.warn('Firebase not configured. Booked slots will not be displayed.');
        return [];
    }

    try {
        const { collection, getDocs, query, where, Timestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        // Get booked slots for this date
        // Normalize date to start of day for comparison
        const dateStart = new Date(date);
        dateStart.setHours(0, 0, 0, 0);
        const dateEnd = new Date(date);
        dateEnd.setHours(23, 59, 59, 999);

        const q = query(
            collection(window.firebaseDb, 'bookings'),
            where('date', '>=', Timestamp.fromDate(dateStart)),
            where('date', '<=', Timestamp.fromDate(dateEnd))
        );

        const snapshot = await getDocs(q);
        const bookedSlots = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.time) {
                bookedSlots.push(data.time);
            }
        });

        console.log(`Found ${bookedSlots.length} booked slots for ${date.toLocaleDateString('ro-RO')}:`, bookedSlots);
        return bookedSlots;
    } catch (error) {
        console.error('Error loading booked slots:', error);
        // If Firebase is not properly configured, return empty array
        if (error.code === 'failed-precondition' || error.code === 'permission-denied') {
            console.warn('Firebase permissions issue. Check your Firestore rules.');
        }
        return [];
    }
}

// Update renderTimeSlots to use Firebase and show booked slots
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
    
    // Get booked slots from Firebase
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

// Update booking form to save to Firebase
const originalBookingSubmit = bookingForm?.addEventListener;
if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!selectedDate || !selectedTime) {
            alert('Te rugăm să selectezi o dată și o oră!');
            return;
        }

        const formData = new FormData(bookingForm);
        const data = Object.fromEntries(formData);
        
        // Save to Firebase if available
        if (window.firebaseDb) {
            try {
                const { collection, addDoc, Timestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
                
                // Normalize date to start of day for consistent storage
                const bookingDate = new Date(selectedDate);
                bookingDate.setHours(0, 0, 0, 0);
                
                await addDoc(collection(window.firebaseDb, 'bookings'), {
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    date: Timestamp.fromDate(bookingDate),
                    time: selectedTime,
                    createdAt: Timestamp.now()
                });
                
                alert(`Mulțumim! Ai programat consultația pentru ${selectedDate.toLocaleDateString('ro-RO')} la ${selectedTime}. Vă vom contacta în curând pentru confirmare!`);
                
                // Refresh time slots to show the new booking
                await renderTimeSlots();
            } catch (error) {
                console.error('Error saving booking:', error);
                alert('Eroare la salvarea rezervării. Te rugăm să încerci din nou sau să ne contactezi direct.');
                return;
            }
        } else {
            alert('⚠️ Firebase nu este configurat. Rezervarea nu a fost salvată. Te rugăm să configurezi Firebase sau să ne contactezi direct.');
        }
        
        bookingForm.reset();
        selectedDate = null;
        selectedTime = null;
        await renderTimeSlots();
        document.querySelectorAll('.calendar-day').forEach(day => {
            day.classList.remove('selected');
        });
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
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
