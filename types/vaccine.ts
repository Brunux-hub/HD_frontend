export interface Vaccine {
  id_vaccine: number;
  name: string;
  description: string;
  manufacturer: string;
  required_dose: number;
}

export interface VaccineRequest {
  name: string;
  description: string;
  manufacturer: string;
  required_dose: number;
}
