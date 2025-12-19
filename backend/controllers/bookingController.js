const Booking = require('../models/Booking');
const { validationResult } = require('express-validator');

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
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { date, time, name, email, phone } = req.body;

            // Check if slot is available
            const isAvailable = await Booking.isSlotAvailable(date, time);
            if (!isAvailable) {
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

            res.status(201).json({
                success: true,
                message: 'Rezervare creată cu succes',
                data: booking
            });
        } catch (error) {
            console.error('Error creating booking:', error);
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
                return res.status(400).json({
                    success: false,
                    message: 'Parametrul date este obligatoriu'
                });
            }

            // Validate date format (YYYY-MM-DD)
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(date)) {
                return res.status(400).json({
                    success: false,
                    message: 'Formatul datei este invalid. Folosește YYYY-MM-DD'
                });
            }

            const bookings = await Booking.getByDate(date);
            const bookedSlots = bookings.map(b => b.time);

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
            console.error('Error fetching bookings:', error);
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

            const bookings = await Booking.getAll(limit, offset);

            res.json({
                success: true,
                count: bookings.length,
                data: bookings
            });
        } catch (error) {
            console.error('Error fetching all bookings:', error);
            res.status(500).json({
                success: false,
                message: 'Eroare la încărcarea rezervărilor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}

module.exports = BookingController;

