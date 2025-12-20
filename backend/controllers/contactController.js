const { body, validationResult } = require('express-validator');
const logger = require('../config/logger');
const emailService = require('../services/emailService');

/**
 * Validation rules for contact form
 */
const contactValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Numele este obligatoriu')
        .isLength({ min: 2, max: 100 })
        .withMessage('Numele trebuie să aibă între 2 și 100 de caractere'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email-ul este obligatoriu')
        .isEmail()
        .withMessage('Email-ul nu este valid')
        .normalizeEmail(),
    body('message')
        .trim()
        .notEmpty()
        .withMessage('Mesajul este obligatoriu')
        .isLength({ min: 10, max: 2000 })
        .withMessage('Mesajul trebuie să aibă între 10 și 2000 de caractere'),
    body('subject')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Subiectul nu poate depăși 200 de caractere')
];

/**
 * Handle contact form submission
 */
const submitContact = async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn('Contact form validation failed', { errors: errors.array() });
            return res.status(400).json({
                success: false,
                message: 'Datele introduse nu sunt valide',
                errors: errors.array()
            });
        }

        const { name, email, subject, message } = req.body;

        logger.info('New contact form submission', {
            name,
            email,
            subject: subject || 'N/A'
        });

        // Send email to admin
        const emailSent = await emailService.sendContactEmail({
            name,
            email,
            subject: subject || 'Mesaj nou de pe site',
            message
        });

        if (!emailSent) {
            logger.error('Failed to send contact email', { email });
            return res.status(500).json({
                success: false,
                message: 'Eroare la trimiterea mesajului. Te rugăm să încerci din nou sau să ne contactezi direct.'
            });
        }

        logger.info('Contact form submitted successfully', { email });

        res.status(200).json({
            success: true,
            message: 'Mesajul tău a fost trimis cu succes! Vă vom contacta în curând.'
        });
    } catch (error) {
        logger.error('Error processing contact form', {
            error: error.message,
            stack: error.stack
        });

        res.status(500).json({
            success: false,
            message: 'Eroare la procesarea mesajului. Te rugăm să încerci din nou.'
        });
    }
};

module.exports = {
    submitContact,
    contactValidation
};

