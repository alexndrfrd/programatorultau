# API Documentation - Programatorul Tău

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, the API does not require authentication. For production, consider adding API keys or JWT tokens.

## Endpoints

### Health Check

#### GET /health

Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-12-19T12:00:00.000Z"
}
```

---

### Bookings

#### POST /api/bookings

Create a new booking.

**Request Body:**
```json
{
  "date": "2024-12-20",
  "time": "10:00",
  "name": "Ion Popescu",
  "email": "ion@example.com",
  "phone": "+40 123 456 789"
}
```

**Validation Rules:**
- `date`: Required, format `YYYY-MM-DD`
- `time`: Required, format `HH:MM`
- `name`: Required, 2-100 characters
- `email`: Required, valid email format
- `phone`: Required, 5-20 characters

**Success Response (201):**
```json
{
  "success": true,
  "message": "Rezervare creată cu succes",
  "data": {
    "id": 1,
    "date": "2024-12-20",
    "time": "10:00",
    "name": "Ion Popescu",
    "email": "ion@example.com",
    "phone": "+40 123 456 789"
  }
}
```

**Error Responses:**

**400 Bad Request** - Validation errors:
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Data este obligatorie",
      "param": "date",
      "location": "body"
    }
  ]
}
```

**409 Conflict** - Slot already booked:
```json
{
  "success": false,
  "message": "Acest slot este deja rezervat"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Eroare la crearea rezervării",
  "error": "Error details (only in development)"
}
```

---

#### GET /api/bookings

Get bookings for a specific date.

**Query Parameters:**
- `date` (required): Date in format `YYYY-MM-DD`

**Example Request:**
```
GET /api/bookings?date=2024-12-20
```

**Success Response (200):**
```json
{
  "success": true,
  "date": "2024-12-20",
  "bookedSlots": ["10:00", "14:00"],
  "bookings": [
    {
      "id": 1,
      "date": "2024-12-20",
      "time": "10:00",
      "name": "Ion Popescu",
      "email": "ion@example.com",
      "phone": "+40 123 456 789",
      "createdAt": "2024-12-19T12:00:00.000Z"
    }
  ]
}
```

**Error Responses:**

**400 Bad Request** - Missing or invalid date:
```json
{
  "success": false,
  "message": "Parametrul date este obligatoriu"
}
```

or

```json
{
  "success": false,
  "message": "Formatul datei este invalid. Folosește YYYY-MM-DD"
}
```

---

#### GET /api/bookings/all

Get all bookings (admin endpoint).

**Query Parameters:**
- `limit` (optional): Number of results (default: 100)
- `offset` (optional): Pagination offset (default: 0)

**Example Request:**
```
GET /api/bookings/all?limit=50&offset=0
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "date": "2024-12-20",
      "time": "10:00",
      "name": "Ion Popescu",
      "email": "ion@example.com",
      "phone": "+40 123 456 789",
      "created_at": "2024-12-19 12:00:00"
    }
  ]
}
```

---

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (only in development mode)"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `409` - Conflict (slot already booked)
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

Currently, there is no rate limiting. For production, consider adding rate limiting middleware.

## CORS

CORS is configured to allow requests from:
- `http://localhost:8000` (development)

For production, update `CORS_ORIGIN` in `.env`.

## Examples

### cURL Examples

**Create Booking:**
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-12-20",
    "time": "10:00",
    "name": "Ion Popescu",
    "email": "ion@example.com",
    "phone": "+40 123 456 789"
  }'
```

**Get Bookings for Date:**
```bash
curl "http://localhost:3000/api/bookings?date=2024-12-20"
```

**Get All Bookings:**
```bash
curl "http://localhost:3000/api/bookings/all?limit=10&offset=0"
```

### JavaScript Examples

**Create Booking:**
```javascript
const response = await fetch('http://localhost:3000/api/bookings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    date: '2024-12-20',
    time: '10:00',
    name: 'Ion Popescu',
    email: 'ion@example.com',
    phone: '+40 123 456 789'
  })
});

const data = await response.json();
```

**Get Bookings:**
```javascript
const response = await fetch('http://localhost:3000/api/bookings?date=2024-12-20');
const data = await response.json();
console.log(data.bookedSlots); // ['10:00', '14:00']
```

## Database Schema

### Table: bookings

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto increment |
| date | DATE | Booking date (YYYY-MM-DD) |
| time | VARCHAR(5) | Booking time (HH:MM) |
| name | VARCHAR(100) | Client name |
| email | VARCHAR(255) | Client email |
| phone | VARCHAR(20) | Client phone |
| created_at | TIMESTAMP | Creation timestamp |

**Constraints:**
- `UNIQUE KEY unique_booking (date, time)` - Prevents duplicate bookings

## Logging

All API requests and errors are logged. Check:
- Console output (development)
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only
- `logs/exceptions.log` - Unhandled exceptions
- `logs/rejections.log` - Unhandled promise rejections

## Version

Current API version: `1.0.0`

