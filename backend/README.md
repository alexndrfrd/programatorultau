# Backend API - Programatorul Tău

Backend Node.js + Express + MySQL pentru sistemul de rezervări.

## 🚀 Quick Start

### 1. Instalează dependențele

```bash
cd backend
npm install
```

### 2. Configurează MySQL

1. Asigură-te că ai MySQL instalat și pornit
2. Copiază `.env.example` ca `.env`:
   ```bash
   cp .env.example .env
   ```
3. Editează `.env` cu datele tale MySQL:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=programatorultau
   ```

### 3. Setup Database

```bash
npm run setup-db
```

Această comandă va:
- Crea database-ul `programatorultau` (dacă nu există)
- Crea tabelul `bookings` cu structura corectă

### 4. Configurează Email (Opțional)

Pentru notificări email când se face o rezervare:
- **[EMAIL_SETUP_SIMPLE.md](./EMAIL_SETUP_SIMPLE.md)** - Setup simplu cu Outlook/SendGrid (recomandat)
- **[EMAIL_SETUP.md](./EMAIL_SETUP.md)** - Setup Gmail (dacă App Passwords e disponibil)

### 5. Pornește serverul

```bash
# Development (cu auto-reload)
npm run dev

# Production
npm start
```

Serverul va rula pe `http://localhost:3000`

**Swagger UI** va fi disponibil la: `http://localhost:3000/api-docs`

## 📚 Documentation

- **[API Documentation](./API_DOCS.md)** - Complete API reference
- **[Swagger UI](http://localhost:3000/api-docs)** - Interactive API documentation
- **[Logging Guide](./LOGGING.md)** - How to read and use logs
- **[Monitoring Guide](./MONITORING.md)** - Logs API și vizualizare loguri
- **[Testing Guide](./tests/README.md)** - How to run and write tests

## 📡 API Endpoints

### POST /api/bookings
Creează o rezervare nouă

**Request:**
```json
{
  "date": "2024-01-15",
  "time": "10:00",
  "name": "Ion Popescu",
  "email": "ion@example.com",
  "phone": "+40 123 456 789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Rezervare creată cu succes",
  "data": {
    "id": 1,
    "date": "2024-01-15",
    "time": "10:00",
    "name": "Ion Popescu",
    "email": "ion@example.com",
    "phone": "+40 123 456 789"
  }
}
```

### GET /api/bookings?date=2024-01-15
Obține rezervările pentru o dată specifică

**Response:**
```json
{
  "success": true,
  "date": "2024-01-15",
  "bookedSlots": ["10:00", "14:00"],
  "bookings": [
    {
      "id": 1,
      "date": "2024-01-15",
      "time": "10:00",
      "name": "Ion Popescu",
      "email": "ion@example.com",
      "phone": "+40 123 456 789",
      "createdAt": "2024-01-14T12:30:00.000Z"
    }
  ]
}
```

### GET /api/bookings/all
Obține toate rezervările (pentru admin)

**Query params:**
- `limit` (default: 100)
- `offset` (default: 0)

### GET /health
Health check endpoint

## 🗄️ Database Schema

### Table: bookings

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto increment |
| date | DATE | Data rezervării (YYYY-MM-DD) |
| time | VARCHAR(5) | Ora rezervării (HH:MM) |
| name | VARCHAR(100) | Numele clientului |
| email | VARCHAR(255) | Email client |
| phone | VARCHAR(20) | Telefon client |
| created_at | TIMESTAMP | Când s-a creat rezervarea |

**Indexes:**
- `unique_booking (date, time)` - Previne rezervări duplicate
- `idx_date (date)` - Optimizează căutările pe dată
- `idx_date_time (date, time)` - Optimizează căutările pe dată și oră

## 🔧 Configuration

Variabile de mediu (`.env`):

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=programatorultau

CORS_ORIGIN=http://localhost:8000
```

## 📁 Structura Proiectului

```
backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   └── bookingController.js  # Business logic
├── models/
│   └── Booking.js           # Database operations
├── routes/
│   └── bookings.js          # API routes
├── scripts/
│   └── setup-database.js    # Database setup script
├── server.js                # Main server file
├── package.json
└── .env                     # Environment variables (not in git)
```

## 🛠️ Development

### Auto-reload cu nodemon

```bash
npm run dev
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm run test:watch
```

### Testare API

Poți testa API-ul cu:
- **Postman**
- **curl**:
  ```bash
  curl -X POST http://localhost:3000/api/bookings \
    -H "Content-Type: application/json" \
    -d '{"date":"2024-01-15","time":"10:00","name":"Test","email":"test@example.com","phone":"+40123456789"}'
  ```

### Viewing Logs

```bash
# View all logs
tail -f logs/combined.log

# View only errors
tail -f logs/error.log
```

## 🚨 Troubleshooting

### Eroare: "Cannot connect to MySQL"
- Verifică că MySQL este pornit
- Verifică credențialele din `.env`
- Verifică că portul 3306 este deschis

### Eroare: "Database doesn't exist"
- Rulează `npm run setup-db`

### Eroare: "Table doesn't exist"
- Rulează `npm run setup-db`

## 🔒 Security Notes

- Nu commita `.env` în Git (e deja în `.gitignore`)
- Pentru producție, folosește variabile de mediu sigure
- Consideră adăugarea autentificării pentru endpoint-ul `/api/bookings/all`

