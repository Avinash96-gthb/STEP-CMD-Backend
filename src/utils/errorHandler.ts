import { Request, Response, NextFunction } from 'express';
import { logError } from './logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    logError(err.message, 'Error', 'Critical', 'telehealth-platform', 'errorHandler', req.method);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
};
