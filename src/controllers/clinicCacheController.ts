import { Request, Response, NextFunction } from 'express';
import { getClinicsByCityService, getClinicByIdService } from '../services/clinicService';
import { logInfo } from '../utils/logger';

export const getClinicsByCityHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { city } = req.params;
        const clinics = await getClinicsByCityService(city);
        
        logInfo(
            `Clinics retrieved for city: ${city}`, 
            'Info', 
            'Low', 
            'telehealth-platform', 
            'clinicCacheController', 
            'getClinicsByCityHandler', 
            { city, count: clinics.length }
        );
        
        res.json(clinics);
    } catch (err) {
        next(err);
    }
};

export const getClinicByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const clinic = await getClinicByIdService(id);
        
        if (!clinic) {
            logInfo(
                `Clinic not found: ${id}`, 
                'Warning', 
                'Medium', 
                'telehealth-platform', 
                'clinicCacheController', 
                'getClinicByIdHandler', 
                { clinicId: id }
            );
            return res.status(404).json({ error: 'Clinic not found' });
        }
        
        logInfo(
            `Clinic retrieved: ${id}`, 
            'Info', 
            'Low', 
            'telehealth-platform', 
            'clinicCacheController', 
            'getClinicByIdHandler', 
            { clinicId: id }
        );
        
        res.json(clinic);
    } catch (err) {
        next(err);
    }
};