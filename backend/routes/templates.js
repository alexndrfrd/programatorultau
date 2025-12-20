const express = require('express');
const router = express.Router();
const {
    createTemplate,
    getTemplate,
    getAllTemplates,
    deleteTemplate
} = require('../controllers/templateController');

/**
 * @swagger
 * /api/templates:
 *   post:
 *     summary: Create a new template
 *     tags: [Templates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - siteName
 *               - htmlContent
 *               - clientEmail
 *             properties:
 *               siteName:
 *                 type: string
 *               siteType:
 *                 type: string
 *               plan:
 *                 type: string
 *               theme:
 *                 type: string
 *               htmlContent:
 *                 type: string
 *               config:
 *                 type: object
 *               clientEmail:
 *                 type: string
 *               clientName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Template created successfully
 */
router.post('/', createTemplate);

/**
 * @swagger
 * /api/templates/{id}:
 *   get:
 *     summary: Get template by ID and token
 *     tags: [Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Template retrieved successfully
 */
router.get('/:id', getTemplate);

/**
 * @swagger
 * /api/templates:
 *   get:
 *     summary: Get all templates (admin)
 *     tags: [Templates]
 *     responses:
 *       200:
 *         description: List of templates
 */
router.get('/', getAllTemplates);

/**
 * @swagger
 * /api/templates/{id}:
 *   delete:
 *     summary: Delete template
 *     tags: [Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Template deleted successfully
 */
router.delete('/:id', deleteTemplate);

module.exports = router;

