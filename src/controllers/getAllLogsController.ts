import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { logInfo } from '../utils/logger';

const LOG_FILE_PATH = path.join(__dirname, '../../logs/app.log');

export const getAllLogsHandler = (req: Request, res: Response, next: NextFunction) => {
    fs.readFile(LOG_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                logInfo('Logs retrieved (empty)', 'Info', 'Low', 'telehealth-platform', 'getAllLogsController', 'getAllLogsHandler');
                return res.json([]);
            }
            return next(err);
        }
        // Each line is a JSON log entry
        const logs = data
            .split('\n')
            .filter(Boolean)
            .map(line => {
                try {
                    return JSON.parse(line);
                } catch (e) {
                    return { message: 'Malformed log entry', raw: line };
                }
            });
        logInfo('Logs retrieved', 'Info', 'Low', 'telehealth-platform', 'getAllLogsController', 'getAllLogsHandler', { count: logs.length });
        res.json(logs);
    });
};
