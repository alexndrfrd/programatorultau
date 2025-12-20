const Booking = require('../models/Booking');
const { validationResult } = require('express-validator');
const logger = require('../config/logger');
const emailService = require('../services/emailService');

/**
 * Booking Controller
 * Handles HTTP requests for bookings
 */
class BookingController {
    /**
     * Create a new booking
     * POST /api/bookings
     */
    static async create(req, res) {
        try {
            // Check validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                logger.warn('Validation errors in booking creation', { errors: errors.array() });
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { date, time, name, email, phone } = req.body;
            
            logger.info('Creating booking', { date, time, email });

            // Check if slot is available
            const isAvailable = await Booking.isSlotAvailable(date, time);
            if (!isAvailable) {
                logger.warn('Booking attempt for already booked slot', { date, time });
                return res.status(409).json({
                    success: false,
                    message: 'Acest slot este deja rezervat'
                });
            }

            // Create booking
            const booking = await Booking.create({
                date,
                time,
                name,
                email,
                phone
            });

            logger.info('Booking created successfully', { bookingId: booking.id, date, time });

            // Send emails asynchronously (don't wait for them)
            emailService.sendClientConfirmation(booking).catch(err => {
                logger.error('Failed to send client confirmation email', { error: err.message });
            });
            
            emailService.sendAdminNotification(booking).catch(err => {
                logger.error('Failed to send admin notification email', { error: err.message });
            });

            res.status(201).json({
                success: true,
                message: 'Rezervare creată cu succes',
                data: booking
            });
        } catch (error) {
            logger.error('Error creating booking', {
                error: error.message,
                stack: error.stack,
                body: req.body
            });
            res.status(500).json({
                success: false,
                message: 'Eroare la crearea rezervării',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    /**
     * Get bookings for a specific date
     * GET /api/bookings?date=2024-01-15
     */
    static async getByDate(req, res) {
        try {
            const { date } = req.query;

            if (!date) {
                logger.warn('Missing date parameter in getByDate');
                return res.status(400).json({
                    success: false,
                    message: 'Parametrul date este obligatoriu'
                });
            }

            // Validate date format (YYYY-MM-DD)
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(date)) {
                logger.warn('Invalid date format', { date });
                return res.status(400).json({
                    success: false,
                    message: 'Formatul datei este invalid. Folosește YYYY-MM-DD'
                });
            }

            logger.debug('Fetching bookings for date', { date });
            const bookings = await Booking.getByDate(date);
            const bookedSlots = bookings.map(b => b.time);

            logger.info('Bookings fetched', { date, count: bookings.length });

            res.json({
                success: true,
                date,
                bookedSlots,
                bookings: bookings.map(b => ({
                    id: b.id,
                    date: b.date,
                    time: b.time,
                    name: b.name,
                    email: b.email,
                    phone: b.phone,
                    createdAt: b.created_at
                }))
            });
        } catch (error) {
            logger.error('Error fetching bookings', {
                error: error.message,
                stack: error.stack,
                date: req.query.date
            });
            res.status(500).json({
                success: false,
                message: 'Eroare la încărcarea rezervărilor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    /**
     * Get all bookings (admin endpoint)
     * GET /api/bookings/all
     */
    static async getAll(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 100;
            const offset = parseInt(req.query.offset) || 0;

            logger.debug('Fetching all bookings', { limit, offset });
            const bookings = await Booking.getAll(limit, offset);

            logger.info('All bookings fetched', { count: bookings.length });

            res.json({
                success: true,
                count: bookings.length,
                data: bookings
            });
        } catch (error) {
            logger.error('Error fetching all bookings', {
                error: error.message,
                stack: error.stack
            });
            res.status(500).json({
                success: false,
                message: 'Eroare la încărcarea rezervărilor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}

module.exports = BookingController;

