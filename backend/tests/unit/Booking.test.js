const Booking = require('../../models/Booking');
const { query } = require('../../config/database');

// Mock database
jest.mock('../../config/database', () => ({
    query: jest.fn(),
    pool: {}
}));

describe('Booking Model', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new booking', async () => {
            const bookingData = {
                date: '2024-12-20',
                time: '10:00',
                name: 'Test User',
                email: 'test@example.com',
                phone: '+40 123 456 789'
            };

            query.mockResolvedValueOnce([{ insertId: 1 }]);

            const result = await Booking.create(bookingData);

            expect(query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO bookings'),
                ['2024-12-20', '10:00', 'Test User', 'test@example.com', '+40 123 456 789']
            );
            expect(result).toMatchObject({
                id: 1,
                ...bookingData
            });
        });
    });

    describe('getByDate', () => {
        it('should get bookings for a specific date', async () => {
            const mockBookings = [
                {
                    id: 1,
                    date: '2024-12-20',
                    time: '10:00',
                    name: 'Test User',
                    email: 'test@example.com',
                    phone: '+40 123 456 789',
                    created_at: '2024-12-19 12:00:00'
                }
            ];

            query.mockResolvedValueOnce(mockBookings);

            const result = await Booking.getByDate('2024-12-20');

            expect(query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT'),
                ['2024-12-20']
            );
            expect(result).toEqual(mockBookings);
        });
    });

    describe('getBookedSlots', () => {
        it('should return array of booked time slots', async () => {
            const mockBookings = [
                { time: '10:00' },
                { time: '14:00' }
            ];

            query.mockResolvedValueOnce(mockBookings);

            const result = await Booking.getBookedSlots('2024-12-20');

            expect(result).toEqual(['10:00', '14:00']);
        });
    });

    describe('isSlotAvailable', () => {
        it('should return true if slot is available', async () => {
            query.mockResolvedValueOnce([{ count: 0 }]);

            const result = await Booking.isSlotAvailable('2024-12-20', '10:00');

            expect(result).toBe(true);
            expect(query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT COUNT'),
                ['2024-12-20', '10:00']
            );
        });

        it('should return false if slot is booked', async () => {
            query.mockResolvedValueOnce([{ count: 1 }]);

            const result = await Booking.isSlotAvailable('2024-12-20', '10:00');

            expect(result).toBe(false);
        });
    });

    describe('getAll', () => {
        it('should get all bookings with default pagination', async () => {
            const mockBookings = [
                { id: 1, date: '2024-12-20', time: '10:00' }
            ];

            query.mockResolvedValueOnce(mockBookings);

            const result = await Booking.getAll();

            expect(query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT'),
                [100, 0]
            );
            expect(result).toEqual(mockBookings);
        });

        it('should get all bookings with custom pagination', async () => {
            const mockBookings = [];
            query.mockResolvedValueOnce(mockBookings);

            await Booking.getAll(50, 10);

            expect(query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT'),
                [50, 10]
            );
        });
    });
});

