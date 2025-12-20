const db = require('../config/database');
const logger = require('../config/logger');
const crypto = require('crypto');

/**
 * Template Model - Manages generated site templates
 */
class Template {
    /**
     * Create a new template
     */
    static async create(templateData) {
        try {
            // Generate unique token
            const token = crypto.randomBytes(32).toString('hex');
            
            const query = `
                INSERT INTO templates (
                    site_name, site_type, plan, theme, html_content, 
                    config_data, client_email, client_name, token, 
                    created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `;
            
            const values = [
                templateData.siteName,
                templateData.siteType || 'prezentare',
                templateData.plan,
                templateData.theme,
                templateData.htmlContent,
                JSON.stringify(templateData.config || {}),
                templateData.clientEmail,
                templateData.clientName || '',
                token
            ];
            
            const [result] = await db.query(query, values);
            
            logger.info('Template created', {
                id: result.insertId,
                siteName: templateData.siteName,
                token: token.substring(0, 8) + '...'
            });
            
            return {
                id: result.insertId,
                token,
                ...templateData
            };
        } catch (error) {
            logger.error('Error creating template', { error: error.message });
            throw error;
        }
    }
    
    /**
     * Get template by ID and token
     */
    static async getByIdAndToken(id, token) {
        try {
            const query = `
                SELECT * FROM templates 
                WHERE id = ? AND token = ?
            `;
            
            const [rows] = await db.query(query, [id, token]);
            
            if (rows.length === 0) {
                return null;
            }
            
            const template = rows[0];
            template.config = JSON.parse(template.config_data || '{}');
            
            return template;
        } catch (error) {
            logger.error('Error getting template', { error: error.message });
            throw error;
        }
    }
    
    /**
     * Get all templates (for admin)
     */
    static async getAll() {
        try {
            const query = `
                SELECT id, site_name, site_type, plan, theme, 
                       client_email, client_name, created_at, 
                       token
                FROM templates 
                ORDER BY created_at DESC
            `;
            
            const [rows] = await db.query(query);
            return rows;
        } catch (error) {
            logger.error('Error getting all templates', { error: error.message });
            throw error;
        }
    }
    
    /**
     * Delete template
     */
    static async delete(id) {
        try {
            const query = `DELETE FROM templates WHERE id = ?`;
            await db.query(query, [id]);
            
            logger.info('Template deleted', { id });
            return true;
        } catch (error) {
            logger.error('Error deleting template', { error: error.message });
            throw error;
        }
    }
}

module.exports = Template;

