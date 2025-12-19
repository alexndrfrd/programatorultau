const mysql = require('mysql2/promise');
require('dotenv').config();
const logger = require('./logger');

/**
 * Database configuration and connection pool
 */
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'programatorultau',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

/**
 * Test database connection
 */
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        logger.info('Database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        logger.error('Database connection error', {
            error: error.message,
            stack: error.stack,
            code: error.code
        });
        return false;
    }
}

/**
 * Execute a query
 */
async function query(sql, params = []) {
    try {
        logger.debug('Executing database query', { sql: sql.substring(0, 100), params });
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (error) {
        logger.error('Database query error', {
            error: error.message,
            stack: error.stack,
            sql: sql.substring(0, 100),
            params
        });
        throw error;
    }
}

module.exports = {
    pool,
    query,
    testConnection
};

