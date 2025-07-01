import { Request, Response, NextFunction } from 'express';
import { getAllServices } from '../repositories/serviceRepository';
import { logInfo } from '../utils/logger';

export const getAllServicesHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const services = await getAllServices();
        logInfo('Services retrieved', 'Info', 'Low', 'telehealth-platform', 'serviceController', 'getAllServicesHandler', { count: services.length });
        res.json(services);
    } catch (err) {
        next(err);
    }
};