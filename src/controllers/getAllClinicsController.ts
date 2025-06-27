import { Request, Response, NextFunction } from 'express';
import { getAllClinics } from '../repositories/clinicRepository';

export const getAllClinicsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const clinics = await getAllClinics();
        res.json(clinics);
    } catch (err) {
        next(err);
    }
};
