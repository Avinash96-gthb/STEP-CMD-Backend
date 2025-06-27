import { Request, Response, NextFunction } from 'express';
import { addClinic } from '../services/clinicService';
import { ClinicDTO } from '../dtos/clinic.dto';
import { logInfo } from '../utils/logger';

export const createClinic = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const clinic: ClinicDTO = req.body;
        const created = await addClinic(clinic);
        logInfo('Clinic created', 'Info', 'High', 'telehealth-platform', 'clinicController', 'createClinic');
        res.status(201).json(created);
    } catch (err) {
        next(err);
    }
};
