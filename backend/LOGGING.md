# Logging Guide

## Overview

The application uses Winston for structured logging. All logs are written to both console and files.

## Log Levels

- **error**: Error events that might still allow the app to continue
- **warn**: Warning messages
- **info**: Informational messages (default)
- **debug**: Debug messages (only in development)

Set log level in `.env`:
```env
LOG_LEVEL=debug  # or info, warn, error
```

## Log Files

Logs are stored in `backend/logs/`:

- **combined.log** - All logs (info, warn, error)
- **error.log** - Only error logs
- **exceptions.log** - Unhandled exceptions
- **rejections.log** - Unhandled promise rejections

## Usage

### In Controllers

```javascript
const logger = require('../config/logger');

// Info log
logger.info('Booking created', { bookingId: 1, date: '2024-12-20' });

// Warning log
logger.warn('Slot already booked', { date: '2024-12-20', time: '10:00' });

// Error log
logger.error('Database error', { error: error.message, stack: error.stack });
```

### In Models

```javascript
const logger = require('../config/logger');

logger.debug('Executing query', { sql: 'SELECT...', params: [...] });
```

## Log Format

### Console Output (Development)
```
2024-12-19 12:00:00 [info]: Booking created {"bookingId":1,"date":"2024-12-20"}
```

### File Output (JSON)
```json
{
  "timestamp": "2024-12-19T12:00:00.000Z",
  "level": "info",
  "message": "Booking created",
  "bookingId": 1,
  "date": "2024-12-20",
  "service": "programatorultau-api"
}
```

## Reading Logs

### View all logs:
```bash
tail -f backend/logs/combined.log
```

### View only errors:
```bash
tail -f backend/logs/error.log
```

### Search logs:
```bash
grep "Booking created" backend/logs/combined.log
```

### View last 100 lines:
```bash
tail -n 100 backend/logs/combined.log
```

## Log Rotation

For production, consider using a log rotation tool like `logrotate` or Winston's daily rotate file transport.

## Best Practices

1. **Use appropriate log levels** - Don't log everything as error
2. **Include context** - Add relevant data to logs
3. **Don't log sensitive data** - Passwords, tokens, etc.
4. **Structured logging** - Use objects for metadata
5. **Error logging** - Always include stack traces for errors

## Example Log Entries

### Successful Booking:
```
2024-12-19 12:00:00 [info]: Creating booking {"date":"2024-12-20","time":"10:00","email":"test@example.com"}
2024-12-19 12:00:01 [info]: Booking created successfully {"bookingId":1,"date":"2024-12-20","time":"10:00"}
```

### Error:
```
2024-12-19 12:00:00 [error]: Error creating booking {"error":"Duplicate entry","stack":"Error: ...","body":{"date":"2024-12-20"}}
```

### Database Error:
```
2024-12-19 12:00:00 [error]: Database query error {"error":"Connection lost","sql":"SELECT...","params":["2024-12-20"]}
```

