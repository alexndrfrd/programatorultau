const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const BookingController = require('../controllers/bookingController');

/**
 * Validation rules for booking creation
 */
const bookingValidation = [
    body('date')
        .notEmpty().withMessage('Data este obligatorie')
        .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Formatul datei trebuie să fie YYYY-MM-DD'),
    body('time')
        .notEmpty().withMessage('Ora este obligatorie')
        .matches(/^\d{2}:\d{2}$/).withMessage('Formatul orei trebuie să fie HH:MM'),
    body('name')
        .notEmpty().withMessage('Numele este obligatoriu')
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Numele trebuie să aibă între 2 și 100 de caractere'),
    body('email')
        .notEmpty().withMessage('Email-ul este obligatoriu')
        .isEmail().withMessage('Email-ul nu este valid')
        .normalizeEmail(),
    body('phone')
        .notEmpty().withMessage('Telefonul este obligatoriu')
        .trim()
        .isLength({ min: 5, max: 20 }).withMessage('Telefonul trebuie să aibă între 5 și 20 de caractere')
];

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *           example:
 *             date: "2024-12-20"
 *             time: "10:00"
 *             name: "Ion Popescu"
 *             email: "ion@example.com"
 *             phone: "+40 123 456 789"
 *     responses:
 *       201:
 *         description: Booking created successfully
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
 *                   example: "Rezervare creată cu succes"
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         description: Slot already booked
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', bookingValidation, BookingController.create);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get bookings for a specific date
 *     tags: [Bookings]
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-12-20"
 *         description: Date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: List of bookings for the date
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 date:
 *                   type: string
 *                   example: "2024-12-20"
 *                 bookedSlots:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["10:00", "14:00"]
 *                 bookings:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Missing or invalid date parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', BookingController.getByDate);

/**
 * @swagger
 * /api/bookings/all:
 *   get:
 *     summary: Get all bookings (admin endpoint)
 *     tags: [Bookings]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Number of results to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Pagination offset
 *     responses:
 *       200:
 *         description: List of all bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Booking'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/all', BookingController.getAll);

module.exports = router;

