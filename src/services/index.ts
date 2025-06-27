export class ClinicService {
    private clinics: any[] = [];

    public createClinic(clinicData: any): any {
        const newClinic = { id: this.clinics.length + 1, ...clinicData };
        this.clinics.push(newClinic);
        return newClinic;
    }

    public getClinics(): any[] {
        return this.clinics;
    }

    public getClinicById(clinicId: number): any | undefined {
        return this.clinics.find(clinic => clinic.id === clinicId);
    }
}