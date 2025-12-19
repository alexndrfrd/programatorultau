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
 * Routes
 */
router.post('/', bookingValidation, BookingController.create);
router.get('/', BookingController.getByDate);
router.get('/all', BookingController.getAll);

module.exports = router;

