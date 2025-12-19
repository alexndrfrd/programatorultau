const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * Setup database script
 * Creates database and tables if they don't exist
 */
async function setupDatabase() {
    let connection;

    try {
        // Connect without database first
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD
        });

        console.log('✅ Connected to MySQL server');

        const dbName = process.env.DB_NAME || 'programatorultau';

        // Create database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        console.log(`✅ Database '${dbName}' ready`);

        // Use the database
        await connection.query(`USE \`${dbName}\``);

        // Create bookings table
        const createBookingsTable = `
            CREATE TABLE IF NOT EXISTS bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                date DATE NOT NULL,
                time VARCHAR(5) NOT NULL,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_booking (date, time),
                INDEX idx_date (date),
                INDEX idx_date_time (date, time)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;

        await connection.query(createBookingsTable);
        console.log('✅ Table "bookings" created/verified');

        console.log('\n🎉 Database setup completed successfully!');
        console.log('\n📝 Next steps:');
        console.log('   1. Update .env with your database credentials');
        console.log('   2. Run: npm start');

    } catch (error) {
        console.error('❌ Error setting up database:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

setupDatabase();

