const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');

/**
 * @swagger
 * /api/logs:
 *   get:
 *     summary: Get recent logs (admin endpoint)
 *     tags: [Logs]
 *     parameters:
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [error, warn, info, debug]
 *         description: Filter by log level
 *       - in: query
 *         name: lines
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Number of lines to return
 *       - in: query
 *         name: file
 *         schema:
 *           type: string
 *           enum: [combined, error]
 *           default: combined
 *         description: Log file to read
 *     responses:
 *       200:
 *         description: Recent log entries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 logs:
 *                   type: array
 *                   items:
 *                     type: string
 *                 count:
 *                   type: integer
 *       500:
 *         description: Error reading logs
 */
router.get('/', (req, res) => {
    try {
        const { level, lines = 100, file = 'combined' } = req.query;
        const logFile = file === 'error' ? 'error.log' : 'combined.log';
        const logPath = path.join(__dirname, '../logs', logFile);

        if (!fs.existsSync(logPath)) {
            return res.status(404).json({
                success: false,
                message: 'Log file not found'
            });
        }

        // Read log file
        const logContent = fs.readFileSync(logPath, 'utf8');
        let logLines = logContent.split('\n').filter(line => line.trim());

        // Filter by level if specified
        if (level) {
            logLines = logLines.filter(line => {
                try {
                    const logEntry = JSON.parse(line);
                    return logEntry.level === level;
                } catch {
                    return false;
                }
            });
        }

        // Get last N lines
        const recentLogs = logLines.slice(-parseInt(lines));

        logger.info('Logs accessed', { level, lines, file, count: recentLogs.length });

        res.json({
            success: true,
            logs: recentLogs.map(line => {
                try {
                    return JSON.parse(line);
                } catch {
                    return { message: line };
                }
            }),
            count: recentLogs.length
        });
    } catch (error) {
        logger.error('Error reading logs', { error: error.message });
        res.status(500).json({
            success: false,
            message: 'Error reading logs',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;

