const express = require('express');
const cors = require('cors');
require('dotenv').config();

const logger = require('./config/logger');
const { testConnection } = require('./config/database');
const bookingsRouter = require('./routes/bookings');
const logsRouter = require('./routes/logs');
const contactRouter = require('./routes/contact');
const templatesRouter = require('./routes/templates');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const emailService = require('./services/emailService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:8000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (before routes)
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('user-agent')
    });
    next();
});

// Health check endpoint
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Programatorul Tău API Docs'
}));

// API Routes
app.use('/api/bookings', bookingsRouter);
app.use('/api/logs', logsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/templates', templatesRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    logger.error('Unhandled error', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip
    });
    
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Start server
async function startServer() {
    try {
        // Test database connection
        logger.info('Testing database connection...');
        const dbConnected = await testConnection();
        
        if (!dbConnected) {
            logger.error('Cannot start server without database connection');
            logger.info('Make sure MySQL is running and .env is configured correctly');
            process.exit(1);
        }

        app.listen(PORT, async () => {
            logger.info(`Server started successfully`, {
                port: PORT,
                environment: process.env.NODE_ENV || 'development',
                apiUrl: `http://localhost:${PORT}/api`,
                healthCheck: `http://localhost:${PORT}/health`
            });

            // Verify email service configuration
            const emailConfigured = await emailService.verify();
            if (!emailConfigured) {
                logger.warn('Email service not configured. Email notifications will be disabled.');
                logger.info('To enable emails, configure SMTP settings in .env file');
            }
        });
    } catch (error) {
        logger.error('Failed to start server', { error: error.message, stack: error.stack });
        process.exit(1);
    }
}

// Export app for testing
module.exports = app;

// Start server only if not in test environment
if (require.main === module) {
    startServer();
}

