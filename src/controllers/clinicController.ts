import { Request, Response, NextFunction } from 'express';
import { addClinic } from '../services/clinicService';
import { CreateClinicRequestDTO } from '../dtos/clinic.dto';
import { logInfo } from '../utils/logger';

export const createClinic = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const clinic: CreateClinicRequestDTO = req.body;
        const created = await addClinic(clinic);
        logInfo('Clinic created', 'Info', 'High', 'telehealth-platform', 'clinicController', 'createClinic', { clinicId: created.clinicId });
        res.status(201).json(created);
    } catch (err) {
        next(err);
    }
};