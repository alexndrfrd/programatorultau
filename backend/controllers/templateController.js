const Template = require('../models/Template');
const logger = require('../config/logger');
const emailService = require('../services/emailService');

/**
 * Create a new template
 */
const createTemplate = async (req, res) => {
    try {
        const {
            siteName,
            siteType,
            plan,
            theme,
            htmlContent,
            config,
            clientEmail,
            clientName
        } = req.body;
        
        // Validation
        if (!siteName || !htmlContent || !clientEmail) {
            return res.status(400).json({
                success: false,
                message: 'Lipsește siteName, htmlContent sau clientEmail'
            });
        }
        
        const templateData = {
            siteName,
            siteType: siteType || 'prezentare',
            plan: plan || 'basic',
            theme: theme || 'modern',
            htmlContent,
            config: config || {},
            clientEmail,
            clientName: clientName || ''
        };
        
        const template = await Template.create(templateData);
        
        // Send email to client with access link
        const accessUrl = `${process.env.FRONTEND_URL || 'http://localhost:8000'}/templates/${template.id}?token=${template.token}`;
        
        try {
            await emailService.sendTemplateAccessEmail({
                to: clientEmail,
                clientName: clientName || siteName,
                siteName,
                accessUrl,
                token: template.token
            });
        } catch (emailError) {
            logger.warn('Failed to send template access email', { error: emailError.message });
        }
        
        logger.info('Template created successfully', { id: template.id });
        
        res.status(201).json({
            success: true,
            data: {
                id: template.id,
                token: template.token,
                accessUrl
            },
            message: 'Template creat cu succes! Vei primi un email cu link-ul de acces.'
        });
    } catch (error) {
        logger.error('Error creating template', { error: error.message });
        res.status(500).json({
            success: false,
            message: 'Eroare la crearea template-ului'
        });
    }
};

/**
 * Get template by ID and token
 */
const getTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const { token } = req.query;
        
        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token-ul este obligatoriu'
            });
        }
        
        const template = await Template.getByIdAndToken(id, token);
        
        if (!template) {
            return res.status(404).json({
                success: false,
                message: 'Template-ul nu a fost găsit sau token-ul este invalid'
            });
        }
        
        res.json({
            success: true,
            data: template
        });
    } catch (error) {
        logger.error('Error getting template', { error: error.message });
        res.status(500).json({
            success: false,
            message: 'Eroare la obținerea template-ului'
        });
    }
};

/**
 * Get all templates (admin only - add auth later)
 */
const getAllTemplates = async (req, res) => {
    try {
        const templates = await Template.getAll();
        
        res.json({
            success: true,
            data: templates
        });
    } catch (error) {
        logger.error('Error getting all templates', { error: error.message });
        res.status(500).json({
            success: false,
            message: 'Eroare la obținerea template-urilor'
        });
    }
};

/**
 * Delete template
 */
const deleteTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        
        await Template.delete(id);
        
        res.json({
            success: true,
            message: 'Template șters cu succes'
        });
    } catch (error) {
        logger.error('Error deleting template', { error: error.message });
        res.status(500).json({
            success: false,
            message: 'Eroare la ștergerea template-ului'
        });
    }
};

module.exports = {
    createTemplate,
    getTemplate,
    getAllTemplates,
    deleteTemplate
};

