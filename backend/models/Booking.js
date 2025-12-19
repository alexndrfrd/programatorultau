const { query } = require('../config/database');

/**
 * Booking Model
 * Handles all database operations for bookings
 */
class Booking {
    /**
     * Create a new booking
     * @param {Object} bookingData - { date, time, name, email, phone }
     * @returns {Promise<Object>} Created booking
     */
    static async create(bookingData) {
        const { date, time, name, email, phone } = bookingData;
        
        const sql = `
            INSERT INTO bookings (date, time, name, email, phone, created_at)
            VALUES (?, ?, ?, ?, ?, NOW())
        `;
        
        const result = await query(sql, [date, time, name, email, phone]);
        
        return {
            id: result.insertId,
            date,
            time,
            name,
            email,
            phone
        };
    }

    /**
     * Get all bookings for a specific date
     * @param {string} date - Date in YYYY-MM-DD format
     * @returns {Promise<Array>} Array of bookings
     */
    static async getByDate(date) {
        const sql = `
            SELECT id, date, time, name, email, phone, created_at
            FROM bookings
            WHERE date = ?
            ORDER BY time ASC
        `;
        
        return await query(sql, [date]);
    }

    /**
     * Get booked time slots for a specific date
     * @param {string} date - Date in YYYY-MM-DD format
     * @returns {Promise<Array>} Array of time strings (e.g., ['10:00', '14:00'])
     */
    static async getBookedSlots(date) {
        const bookings = await this.getByDate(date);
        return bookings.map(booking => booking.time);
    }

    /**
     * Check if a time slot is available
     * @param {string} date - Date in YYYY-MM-DD format
     * @param {string} time - Time in HH:MM format
     * @returns {Promise<boolean>} True if available
     */
    static async isSlotAvailable(date, time) {
        const sql = `
            SELECT COUNT(*) as count
            FROM bookings
            WHERE date = ? AND time = ?
        `;
        
        const [result] = await query(sql, [date, time]);
        return result.count === 0;
    }

    /**
     * Get all bookings (for admin purposes)
     * @param {number} limit - Limit results
     * @param {number} offset - Offset for pagination
     * @returns {Promise<Array>} Array of bookings
     */
    static async getAll(limit = 100, offset = 0) {
        const sql = `
            SELECT id, date, time, name, email, phone, created_at
            FROM bookings
            ORDER BY date DESC, time ASC
            LIMIT ? OFFSET ?
        `;
        
        return await query(sql, [limit, offset]);
    }
}

module.exports = Booking;

