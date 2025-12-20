/**
 * Site Templates - 5 teme pentru Site la Click
 */

const SITE_TEMPLATES = {
    modern: {
        name: 'Modern',
        description: 'Design modern cu gradient-uri și animații',
        defaultColors: {
            primary: '#667eea',
            secondary: '#764ba2'
        }
    },
    minimal: {
        name: 'Minimal',
        description: 'Design minimalist și elegant',
        defaultColors: {
            primary: '#1f2937',
            secondary: '#6b7280'
        }
    },
    bold: {
        name: 'Bold',
        description: 'Culori vibrante și design îndrăzneț',
        defaultColors: {
            primary: '#f093fb',
            secondary: '#f5576c'
        }
    },
    corporate: {
        name: 'Corporate',
        description: 'Design profesional pentru business',
        defaultColors: {
            primary: '#4facfe',
            secondary: '#00f2fe'
        }
    },
    creative: {
        name: 'Creative',
        description: 'Design creativ și unic',
        defaultColors: {
            primary: '#fa709a',
            secondary: '#fee140'
        }
    }
};

/**
 * Generate HTML for a site template
 */
function generateSiteHTML(config) {
    const template = SITE_TEMPLATES[config.theme] || SITE_TEMPLATES.modern;
    const primaryColor = config.primaryColor || template.defaultColors.primary;
    const secondaryColor = config.secondaryColor || template.defaultColors.secondary;
    
    // Get logo - either uploaded or generated
    const logoHTML = config.logoType === 'upload' && config.logoBase64 
        ? `<img src="${config.logoBase64}" alt="${config.siteName}" class="logo-img">`
        : `<div class="logo-text">${config.siteName}</div>`;
    
    // Get hero image
    const heroImageHTML = config.heroImageBase64 
        ? `<img src="${config.heroImageBase64}" alt="Hero" class="hero-image">`
        : '';
    
    // Get about image
    const aboutImageHTML = config.aboutImageBase64 
        ? `<img src="${config.aboutImageBase64}" alt="About" class="about-image">`
        : '';

    return generateTemplateHTML(config.theme, {
        siteName: config.siteName,
        heroTitle: config.heroTitle || `Bun venit la ${config.siteName}`,
        heroSubtitle: config.heroSubtitle || '',
        ctaButtonText: config.ctaButtonText || 'Contactează-ne',
        aboutText: config.aboutText || '',
        email: config.siteEmail,
        phone: config.sitePhone || '',
        address: config.siteAddress || '',
        primaryColor,
        secondaryColor,
        logoHTML,
        heroImageHTML,
        aboutImageHTML
    });
}

/**
 * Generate template-specific HTML
 */
function generateTemplateHTML(theme, data) {
    const templates = {
        modern: generateModernTemplate(data),
        minimal: generateMinimalTemplate(data),
        bold: generateBoldTemplate(data),
        corporate: generateCorporateTemplate(data),
        creative: generateCreativeTemplate(data)
    };
    
    return templates[theme] || templates.modern;
}

/**
 * Modern Template
 */
function generateModernTemplate(data) {
    return `<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.siteName}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #333; }
        .header { background: ${data.primaryColor}; color: white; padding: 1rem 0; position: sticky; top: 0; z-index: 1000; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .header-content { display: flex; justify-content: space-between; align-items: center; }
        .logo-text { font-size: 1.5rem; font-weight: 700; }
        .logo-img { height: 40px; }
        .nav { display: flex; gap: 2rem; }
        .nav a { color: white; text-decoration: none; transition: opacity 0.3s; }
        .nav a:hover { opacity: 0.8; }
        .hero { padding: 6rem 0; text-align: center; background: linear-gradient(135deg, ${data.primaryColor} 0%, ${data.secondaryColor} 100%); color: white; position: relative; overflow: hidden; }
        .hero::before { content: ''; position: absolute; top: -50%; right: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); animation: rotate 20s linear infinite; }
        @keyframes rotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .hero-content { position: relative; z-index: 1; }
        .hero h1 { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 800; margin-bottom: 1.5rem; }
        .hero p { font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.95; }
        .btn { display: inline-block; padding: 1rem 2.5rem; background: white; color: ${data.primaryColor}; text-decoration: none; border-radius: 12px; font-weight: 600; transition: transform 0.3s, box-shadow 0.3s; }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
        .hero-image { max-width: 100%; height: auto; border-radius: 20px; margin-top: 2rem; }
        .section { padding: 5rem 0; }
        .section-title { font-size: 2.5rem; font-weight: 700; margin-bottom: 2rem; text-align: center; }
        .about-content { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
        .about-image { max-width: 100%; border-radius: 20px; }
        .contact-section { background: #f9fafb; }
        .contact-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; }
        .contact-item { text-align: center; }
        .contact-item h3 { color: ${data.primaryColor}; margin-bottom: 0.5rem; }
        .footer { background: #1f2937; color: white; padding: 2rem 0; text-align: center; }
        @media (max-width: 768px) {
            .about-content { grid-template-columns: 1fr; }
            .nav { display: none; }
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="header-content">
                ${data.logoHTML}
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
            <div class="hero-content">
                <h1>${data.heroTitle}</h1>
                ${data.heroSubtitle ? `<p>${data.heroSubtitle}</p>` : ''}
                <a href="#contact" class="btn">${data.ctaButtonText}</a>
                ${data.heroImageHTML ? `<div style="margin-top: 2rem;">${data.heroImageHTML}</div>` : ''}
            </div>
        </div>
    </section>
    ${data.aboutText ? `
    <section class="section" id="despre">
        <div class="container">
            <h2 class="section-title">Despre Noi</h2>
            <div class="about-content">
                <div>
                    <p style="font-size: 1.125rem; line-height: 1.8;">${data.aboutText}</p>
                </div>
                ${data.aboutImageHTML ? `<div>${data.aboutImageHTML}</div>` : ''}
            </div>
        </div>
    </section>
    ` : ''}
    <section class="section contact-section" id="contact">
        <div class="container">
            <h2 class="section-title">Contact</h2>
            <div class="contact-info">
                ${data.email ? `<div class="contact-item"><h3>Email</h3><p>${data.email}</p></div>` : ''}
                ${data.phone ? `<div class="contact-item"><h3>Telefon</h3><p>${data.phone}</p></div>` : ''}
                ${data.address ? `<div class="contact-item"><h3>Adresă</h3><p>${data.address}</p></div>` : ''}
            </div>
        </div>
    </section>
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${data.siteName}. Toate drepturile rezervate.</p>
        </div>
    </footer>
</body>
</html>`;
}

/**
 * Minimal Template
 */
function generateMinimalTemplate(data) {
    return `<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.siteName}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.8; color: #1f2937; background: #ffffff; }
        .header { background: #ffffff; border-bottom: 1px solid #e5e7eb; padding: 1.5rem 0; position: sticky; top: 0; z-index: 1000; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .header-content { display: flex; justify-content: space-between; align-items: center; }
        .logo-text { font-size: 1.5rem; font-weight: 700; color: ${data.primaryColor}; }
        .logo-img { height: 40px; }
        .nav { display: flex; gap: 2rem; }
        .nav a { color: #1f2937; text-decoration: none; font-weight: 500; transition: color 0.3s; }
        .nav a:hover { color: ${data.primaryColor}; }
        .hero { padding: 8rem 0; text-align: center; background: #f9fafb; }
        .hero h1 { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 700; margin-bottom: 1.5rem; color: #1f2937; }
        .hero p { font-size: 1.25rem; color: #6b7280; margin-bottom: 2rem; }
        .btn { display: inline-block; padding: 1rem 2.5rem; background: ${data.primaryColor}; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; transition: background 0.3s; }
        .btn:hover { background: ${data.secondaryColor}; }
        .section { padding: 5rem 0; }
        .section-title { font-size: 2.5rem; font-weight: 700; margin-bottom: 2rem; text-align: center; color: #1f2937; }
        .about-content { max-width: 800px; margin: 0 auto; }
        .about-content p { font-size: 1.125rem; color: #4b5563; line-height: 1.8; }
        .contact-section { background: #f9fafb; }
        .contact-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; max-width: 800px; margin: 0 auto; }
        .contact-item { text-align: center; padding: 2rem; background: white; border-radius: 12px; }
        .contact-item h3 { color: ${data.primaryColor}; margin-bottom: 0.5rem; }
        .footer { background: #1f2937; color: white; padding: 2rem 0; text-align: center; }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <div class="header-content">
                ${data.logoHTML}
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
            <h1>${data.heroTitle}</h1>
            ${data.heroSubtitle ? `<p>${data.heroSubtitle}</p>` : ''}
            <a href="#contact" class="btn">${data.ctaButtonText}</a>
        </div>
    </section>
    ${data.aboutText ? `
    <section class="section" id="despre">
        <div class="container">
            <h2 class="section-title">Despre Noi</h2>
            <div class="about-content">
                <p>${data.aboutText}</p>
            </div>
        </div>
    </section>
    ` : ''}
    <section class="section contact-section" id="contact">
        <div class="container">
            <h2 class="section-title">Contact</h2>
            <div class="contact-info">
                ${data.email ? `<div class="contact-item"><h3>Email</h3><p>${data.email}</p></div>` : ''}
                ${data.phone ? `<div class="contact-item"><h3>Telefon</h3><p>${data.phone}</p></div>` : ''}
                ${data.address ? `<div class="contact-item"><h3>Adresă</h3><p>${data.address}</p></div>` : ''}
            </div>
        </div>
    </section>
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${data.siteName}. Toate drepturile rezervate.</p>
        </div>
    </footer>
</body>
</html>`;
}

/**
 * Bold Template
 */
function generateBoldTemplate(data) {
    return generateModernTemplate(data); // Similar to modern but with bold colors
}

/**
 * Corporate Template
 */
function generateCorporateTemplate(data) {
    return generateMinimalTemplate(data); // Professional and clean
}

/**
 * Creative Template
 */
function generateCreativeTemplate(data) {
    return generateModernTemplate(data); // Similar to modern with creative touches
}

// Export for use in script.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SITE_TEMPLATES, generateSiteHTML };
}

