const express = require('express');
const router = express.Router();
const { submitContact, contactValidation } = require('../controllers/contactController');

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Submit contact form
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Ion Popescu"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "ion@example.com"
 *               subject:
 *                 type: string
 *                 example: "Întrebare despre servicii"
 *               message:
 *                 type: string
 *                 example: "Aș dori să discut despre un proiect..."
 *     responses:
 *       200:
 *         description: Contact form submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Mesajul tău a fost trimis cu succes!"
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/', contactValidation, submitContact);

module.exports = router;

