const nodemailer = require('nodemailer');
const logger = require('../config/logger');

/**
 * Email Service
 * Handles sending emails for bookings
 */
class EmailService {
    constructor() {
        // Create transporter from environment variables
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });

        // Admin email (where notifications are sent)
        this.adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    }

    /**
     * Verify email configuration
     */
    async verify() {
        try {
            await this.transporter.verify();
            logger.info('Email service configured successfully');
            return true;
        } catch (error) {
            logger.warn('Email service not configured', { error: error.message });
            return false;
        }
    }

    /**
     * Send confirmation email to client
     */
    async sendClientConfirmation(booking) {
        if (!this.transporter || !process.env.SMTP_USER) {
            logger.warn('Email not configured, skipping client confirmation');
            return false;
        }

        try {
            const mailOptions = {
                from: `"Programatorul Tău" <${process.env.SMTP_USER}>`,
                to: booking.email,
                subject: 'Confirmare Rezervare - Consultație Gratuită',
                html: this.getClientEmailTemplate(booking)
            };

            const info = await this.transporter.sendMail(mailOptions);
            logger.info('Client confirmation email sent', {
                to: booking.email,
                messageId: info.messageId
            });
            return true;
        } catch (error) {
            logger.error('Error sending client confirmation email', {
                error: error.message,
                to: booking.email
            });
            return false;
        }
    }

    /**
     * Send notification email to admin
     */
    async sendAdminNotification(booking) {
        if (!this.transporter || !process.env.SMTP_USER) {
            logger.warn('Email not configured, skipping admin notification');
            return false;
        }

        try {
            const mailOptions = {
                from: `"Programatorul Tău" <${process.env.SMTP_USER}>`,
                to: this.adminEmail,
                subject: `Nouă Rezervare - ${booking.name} - ${booking.date} la ${booking.time}`,
                html: this.getAdminEmailTemplate(booking)
            };

            const info = await this.transporter.sendMail(mailOptions);
            logger.info('Admin notification email sent', {
                to: this.adminEmail,
                messageId: info.messageId
            });
            return true;
        } catch (error) {
            logger.error('Error sending admin notification email', {
                error: error.message,
                to: this.adminEmail
            });
            return false;
        }
    }

    /**
     * Get client confirmation email template
     */
    getClientEmailTemplate(booking) {
        const formattedDate = new Date(booking.date).toLocaleDateString('ro-RO', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6366F1, #8B5CF6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #6366F1; }
        .info-row { margin: 10px 0; }
        .label { font-weight: bold; color: #6366F1; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Rezervare Confirmată!</h1>
        </div>
        <div class="content">
            <p>Bună ziua, <strong>${booking.name}</strong>!</p>
            
            <p>Mulțumim pentru rezervarea ta! Consultația ta gratuită a fost programată cu succes.</p>
            
            <div class="info-box">
                <div class="info-row">
                    <span class="label">📅 Data:</span> ${formattedDate}
                </div>
                <div class="info-row">
                    <span class="label">⏰ Ora:</span> ${booking.time}
                </div>
                <div class="info-row">
                    <span class="label">👤 Nume:</span> ${booking.name}
                </div>
                <div class="info-row">
                    <span class="label">📧 Email:</span> ${booking.email}
                </div>
                <div class="info-row">
                    <span class="label">📱 Telefon:</span> ${booking.phone}
                </div>
            </div>
            
            <p><strong>Ce urmează?</strong></p>
            <p>Vă vom contacta în curând pentru a confirma detaliile și a trimite link-ul pentru întâlnirea online (Zoom sau Google Meet).</p>
            
            <p>Dacă ai întrebări sau dorești să modifici rezervarea, te rugăm să ne contactezi.</p>
            
            <div class="footer">
                <p>Cu respect,<br><strong>Echipa Programatorul Tău</strong></p>
                <p>📧 contact@programatorultau.com</p>
            </div>
        </div>
    </div>
</body>
</html>
        `;
    }

    /**
     * Send contact form email to admin
     */
    async sendContactEmail(contactData) {
        if (!this.transporter || !process.env.SMTP_USER) {
            logger.warn('Email not configured, skipping contact email');
            return false;
        }

        try {
            const mailOptions = {
                from: `"${contactData.name}" <${process.env.SMTP_USER}>`,
                to: this.adminEmail,
                replyTo: contactData.email,
                subject: contactData.subject || `Mesaj nou de la ${contactData.name}`,
                html: this.getContactEmailTemplate(contactData)
            };

            const info = await this.transporter.sendMail(mailOptions);
            logger.info('Contact email sent', {
                from: contactData.email,
                to: this.adminEmail,
                messageId: info.messageId
            });
            return true;
        } catch (error) {
            logger.error('Error sending contact email', {
                error: error.message,
                from: contactData.email
            });
            return false;
        }
    }

    /**
     * Get contact form email template
     */
    getContactEmailTemplate(contactData) {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6366F1, #8B5CF6); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #6366F1; }
        .info-row { margin: 10px 0; }
        .label { font-weight: bold; color: #6366F1; display: inline-block; min-width: 100px; }
        .message-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #e0e0e0; }
        .action-btn { display: inline-block; padding: 12px 24px; background: #6366F1; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 Mesaj Nou de pe Site</h1>
        </div>
        <div class="content">
            <p><strong>Ai primit un mesaj nou prin formularul de contact.</strong></p>
            
            <div class="info-box">
                <h3>Detalii Contact</h3>
                <div class="info-row">
                    <span class="label">👤 Nume:</span> ${contactData.name}
                </div>
                <div class="info-row">
                    <span class="label">📧 Email:</span> <a href="mailto:${contactData.email}">${contactData.email}</a>
                </div>
                ${contactData.subject ? `<div class="info-row"><span class="label">📌 Subiect:</span> ${contactData.subject}</div>` : ''}
            </div>
            
            <div class="message-box">
                <h3>Mesaj:</h3>
                <p>${contactData.message.replace(/\n/g, '<br>')}</p>
            </div>
            
            <a href="mailto:${contactData.email}?subject=Re: ${encodeURIComponent(contactData.subject || 'Mesaj de pe site')}" class="action-btn">
                📧 Răspunde
            </a>
        </div>
    </div>
</body>
</html>
        `;
    }

    /**
     * Send template access email to client
     */
    async sendTemplateAccessEmail(templateData) {
        if (!this.transporter) {
            logger.warn('Email not configured, skipping template access email');
            return false;
        }

        try {
            await this.transporter.sendMail({
                from: `"Programatorul Tău" <${process.env.SMTP_USER}>`,
                to: templateData.to,
                subject: `Site-ul tău este gata! - ${templateData.siteName}`,
                html: this.getTemplateAccessEmailTemplate(templateData)
            });

            logger.info('Template access email sent', {
                to: templateData.to,
                siteName: templateData.siteName
            });
            return true;
        } catch (error) {
            logger.error('Error sending template access email', {
                error: error.message,
                to: templateData.to
            });
            return false;
        }
    }

    /**
     * Get template access email template
     */
    getTemplateAccessEmailTemplate(templateData) {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6366F1, #8B5CF6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #6366F1; }
        .access-btn { display: inline-block; padding: 15px 30px; background: #6366F1; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: 600; }
        .token-info { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffc107; }
        .token-code { font-family: 'Courier New', monospace; background: #f8f9fa; padding: 10px; border-radius: 4px; word-break: break-all; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Site-ul tău este gata!</h1>
        </div>
        <div class="content">
            <p>Bună ${templateData.clientName || 'Client'},</p>
            
            <p>Site-ul <strong>${templateData.siteName}</strong> a fost generat cu succes!</p>
            
            <div class="info-box">
                <h3>Accesează site-ul tău:</h3>
                <a href="${templateData.accessUrl}" class="access-btn">
                    Vezi Site-ul Meu →
                </a>
                <p style="margin-top: 15px; font-size: 0.9em; color: #666;">
                    Sau copiază link-ul: <br>
                    <span style="word-break: break-all;">${templateData.accessUrl}</span>
                </p>
            </div>
            
            <div class="token-info">
                <p><strong>🔐 Token de acces:</strong></p>
                <div class="token-code">${templateData.token}</div>
                <p style="font-size: 0.9em; margin-top: 10px; color: #666;">
                    Păstrează acest token în siguranță. Vei avea nevoie de el pentru a accesa site-ul.
                </p>
            </div>
            
            <p><strong>Următorii pași:</strong></p>
            <ul>
                <li>Accesează site-ul folosind link-ul de mai sus</li>
                <li>Verifică cum arată și dacă totul este în regulă</li>
                <li>Vă vom contacta pentru mutarea pe hosting și cumpărarea domeniului</li>
            </ul>
            
            <p>Dacă ai întrebări sau dorești modificări, te rugăm să ne contactezi.</p>
            
            <p>Cu respect,<br><strong>Echipa Programatorul Tău</strong></p>
        </div>
    </div>
</body>
</html>
        `;
    }

    /**
     * Get admin notification email template
     */
    getAdminEmailTemplate(booking) {
        const formattedDate = new Date(booking.date).toLocaleDateString('ro-RO', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #dc2626; }
        .info-row { margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 4px; }
        .label { font-weight: bold; color: #dc2626; display: inline-block; min-width: 120px; }
        .action-btn { display: inline-block; padding: 12px 24px; background: #6366F1; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔔 Nouă Rezervare!</h1>
        </div>
        <div class="content">
            <p><strong>Ai primit o nouă rezervare pentru consultație gratuită.</strong></p>
            
            <div class="info-box">
                <h3>Detalii Rezervare</h3>
                <div class="info-row">
                    <span class="label">📅 Data:</span> ${formattedDate}
                </div>
                <div class="info-row">
                    <span class="label">⏰ Ora:</span> ${booking.time}
                </div>
                <div class="info-row">
                    <span class="label">👤 Nume:</span> ${booking.name}
                </div>
                <div class="info-row">
                    <span class="label">📧 Email:</span> <a href="mailto:${booking.email}">${booking.email}</a>
                </div>
                <div class="info-row">
                    <span class="label">📱 Telefon:</span> <a href="tel:${booking.phone}">${booking.phone}</a>
                </div>
                <div class="info-row">
                    <span class="label">🆔 ID Rezervare:</span> #${booking.id}
                </div>
            </div>
            
            <p><strong>Acțiuni:</strong></p>
            <ul>
                <li>Contactează clientul pentru confirmare</li>
                <li>Trimite link-ul pentru întâlnirea online</li>
                <li>Verifică disponibilitatea în calendar</li>
            </ul>
            
            <a href="mailto:${booking.email}?subject=Confirmare%20Consultație&body=Bună%20${encodeURIComponent(booking.name)}%2C%0A%0AConfirmăm%20rezervarea%20ta%20pentru%20${encodeURIComponent(formattedDate)}%20la%20${booking.time}." class="action-btn">
                📧 Răspunde Clientului
            </a>
        </div>
    </div>
</body>
</html>
        `;
    }
}

// Export singleton instance
module.exports = new EmailService();

