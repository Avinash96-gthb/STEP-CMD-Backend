import * as dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
});

const connectDB = async () => {
    try {
        await pool.connect();
        console.log('Connected to PostgreSQL database');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

export { pool, connectDB };