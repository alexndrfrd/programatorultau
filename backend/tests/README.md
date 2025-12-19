# Testing Guide

## Setup

Install dependencies:
```bash
npm install
```

## Running Tests

### Run all tests:
```bash
npm test
```

### Run tests in watch mode:
```bash
npm run test:watch
```

### Run only unit tests:
```bash
npm run test:unit
```

### Run only integration tests:
```bash
npm run test:integration
```

### Run with coverage:
```bash
npm test -- --coverage
```

## Test Structure

```
tests/
├── unit/           # Unit tests (isolated, fast)
│   └── Booking.test.js
└── integration/    # Integration tests (with API)
    └── bookings.test.js
```

## Writing Tests

### Unit Tests

Test individual functions/methods in isolation:

```javascript
describe('Booking Model', () => {
    it('should create a new booking', async () => {
        // Test implementation
    });
});
```

### Integration Tests

Test API endpoints end-to-end:

```javascript
describe('POST /api/bookings', () => {
    it('should create a booking successfully', async () => {
        const response = await request(app)
            .post('/api/bookings')
            .send(bookingData)
            .expect(201);
    });
});
```

## Coverage

Coverage reports are generated in the `coverage/` directory after running tests with coverage.

## Best Practices

1. **Isolate tests** - Each test should be independent
2. **Mock external dependencies** - Database, APIs, etc.
3. **Test edge cases** - Invalid input, error conditions
4. **Keep tests fast** - Unit tests should be very fast
5. **Use descriptive names** - Test names should explain what they test

