/**
 * Feature Flags Configuration
 * 
 * INSTRUCȚIUNI:
 * - Setează true pentru a activa o secțiune
 * - Setează false pentru a dezactiva o secțiune
 * 
 * Când dezactivezi o secțiune:
 * - Secțiunea va fi ascunsă complet
 * - Linkurile din navbar vor fi eliminate
 * - Butoanele din hero care duc la secțiunea respectivă vor fi ascunse
 * 
 * EXEMPLE:
 * - aiSection: false → Ascunde întreaga secțiune AI
 * - siteLaClick: false → Ascunde secțiunea "Site la Click"
 * - consultationBooking: false → Ascunde calendarul de rezervări
 */
const FEATURE_FLAGS = {
    // AI Section - Secțiunea completă AI Tools
    aiSection: true,
    aiTools: true,        // Modulele AI individuale (opțional)
    mcpSection: true,     // Secțiunea MCP (opțional)
    
    // Site la Click - Secțiunea completă Site la Click
    siteLaClick: true,
    siteWizard: true,     // Wizard-ul de configurare (opțional)
    
    // Dashboard - Dashboard-ul "Ce Oferim"
    dashboardOffer: true,
    
    // Services - Secțiunea Servicii
    servicesSection: true,
    
    // Projects - Secțiunea Proiecte
    projectsSection: true,
    
    // Pricing - Secțiunea Prețuri (dacă există)
    pricingSection: true,
    
    // Consultation Booking - Calendarul de rezervări
    consultationBooking: true,
    
    // Contact Form - Formularul de contact
    contactForm: true,
    
    // Footer - Footer-ul site-ului
    footer: true
};

// Export pentru Node.js (dacă e nevoie)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FEATURE_FLAGS;
}

