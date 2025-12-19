const request = require('supertest');
const app = require('../../server');
const { query } = require('../../config/database');

// Suppress console logs during tests
jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});

// Mock database for integration tests
jest.mock('../../config/database', () => ({
    query: jest.fn(),
    pool: {},
    testConnection: jest.fn().mockResolvedValue(true)
}));

describe('Bookings API Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/bookings', () => {
        it('should create a booking successfully', async () => {
            query
                .mockResolvedValueOnce([{ count: 0 }]) // isSlotAvailable
                .mockResolvedValueOnce([{ insertId: 1 }]); // create

            const bookingData = {
                date: '2024-12-20',
                time: '10:00',
                name: 'Test User',
                email: 'test@example.com',
                phone: '+40 123 456 789'
            };

            const response = await request(app)
                .post('/api/bookings')
                .send(bookingData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toMatchObject({
                id: 1,
                ...bookingData
            });
        });

        it('should return 409 if slot is already booked', async () => {
            query.mockResolvedValueOnce([{ count: 1 }]); // isSlotAvailable

            const bookingData = {
                date: '2024-12-20',
                time: '10:00',
                name: 'Test User',
                email: 'test@example.com',
                phone: '+40 123 456 789'
            };

            const response = await request(app)
                .post('/api/bookings')
                .send(bookingData)
                .expect(409);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('deja rezervat');
        });

        it('should return 400 for invalid data', async () => {
            const invalidData = {
                date: 'invalid-date',
                time: '10:00',
                name: 'Test',
                email: 'invalid-email',
                phone: '123'
            };

            const response = await request(app)
                .post('/api/bookings')
                .send(invalidData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toBeDefined();
        });
    });

    describe('GET /api/bookings', () => {
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

            const response = await request(app)
                .get('/api/bookings?date=2024-12-20')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.date).toBe('2024-12-20');
            expect(response.body.bookedSlots).toContain('10:00');
            expect(response.body.bookings).toHaveLength(1);
        });

        it('should return 400 if date parameter is missing', async () => {
            const response = await request(app)
                .get('/api/bookings')
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('obligatoriu');
        });

        it('should return 400 for invalid date format', async () => {
            const response = await request(app)
                .get('/api/bookings?date=invalid-date')
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Formatul datei');
        });
    });

    describe('GET /api/bookings/all', () => {
        it('should get all bookings with default pagination', async () => {
            const mockBookings = [
                { id: 1, date: '2024-12-20', time: '10:00' }
            ];

            query.mockResolvedValueOnce(mockBookings);

            const response = await request(app)
                .get('/api/bookings/all')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.count).toBe(1);
            expect(response.body.data).toHaveLength(1);
        });

        it('should get all bookings with custom pagination', async () => {
            query.mockResolvedValueOnce([]);

            const response = await request(app)
                .get('/api/bookings/all?limit=50&offset=10')
                .expect(200);

            expect(response.body.success).toBe(true);
        });
    });
});

