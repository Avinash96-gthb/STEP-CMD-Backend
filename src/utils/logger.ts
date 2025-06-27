import fs from 'fs';
import path from 'path';

const LOG_FILE_PATH = path.join(__dirname, '../../logs/app.log');

export const logInfo = (
    message: string,
    messageType: 'Info' | 'Warning' | 'Error',
    priority: 'Critical' | 'High' | 'Medium' | 'Low',
    project: string,
    className: string,
    method: string,
    meta?: Record<string, any>
) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        level: messageType,
        priority,
        project,
        className,
        method,
        message,
        meta: meta || {}
    };
    // Log to console
    console.log(`[${logEntry.timestamp}] [${priority}] [${messageType}] [${project}] [${className}] [${method}] ${message}`);
    // Ensure logs directory exists
    const dir = path.dirname(LOG_FILE_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    // Append log entry as JSON line
    fs.appendFile(LOG_FILE_PATH, JSON.stringify(logEntry) + '\n', err => {
        if (err) console.error('Failed to write log:', err);
    });
};

export const logError = logInfo;
