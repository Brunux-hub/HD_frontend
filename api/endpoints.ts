import api from './client';
import type {
  User, Owner, Pet, Veterinarian, Receptionist,
  Appointment, MedicalHistory, Vaccine, Vaccination, Services,
  AppointmentStatus, UserType,
} from '@/types/api';

export const userApi = {
  getAll: () => api.get<User[]>('/user'),
  getById: (id: number) => api.get<User>(`/user/${id}`),
  create: (data: { username: string; type: UserType; password: string }) => api.post<User>('/user', data),
  update: (id: number, data: { username?: string; type?: UserType; password?: string }) => api.put<User>(`/user/${id}`, data),
  delete: (id: number) => api.delete(`/user/${id}`),
};

export const ownerApi = {
  getAll: () => api.get<Owner[]>('/owner'),
  getById: (id: number) => api.get<Owner>(`/owner/${id}`),
  create: (data: Partial<Owner>) => api.post<Owner>('/owner', data),
  update: (id: number, data: Partial<Owner>) => api.put<Owner>(`/owner/${id}`, data),
  delete: (id: number) => api.delete(`/owner/${id}`),
};

export const petApi = {
  getAll: () => api.get<Pet[]>('/pet'),
  getById: (id: number) => api.get<Pet>(`/pet/${id}`),
  create: (data: Partial<Pet>) => api.post<Pet>('/pet', data),
  update: (id: number, data: Partial<Pet>) => api.put<Pet>(`/pet/${id}`, data),
  delete: (id: number) => api.delete(`/pet/${id}`),
};

export const veterinarianApi = {
  getAll: () => api.get<Veterinarian[]>('/veterinarian'),
  getById: (id: number) => api.get<Veterinarian>(`/veterinarian/${id}`),
  getAvailable: (date: string) => api.get<Veterinarian[]>(`/veterinarian/available?date=${date}`),
  create: (data: Partial<Veterinarian>) => api.post<Veterinarian>('/veterinarian', data),
  update: (id: number, data: Partial<Veterinarian>) => api.put<Veterinarian>(`/veterinarian/${id}`, data),
  delete: (id: number) => api.delete(`/veterinarian/${id}`),
};

export const receptionistApi = {
  getAll: () => api.get<Receptionist[]>('/receptionist'),
  getById: (id: number) => api.get<Receptionist>(`/receptionist/${id}`),
  create: (data: Partial<Receptionist>) => api.post<Receptionist>('/receptionist', data),
  update: (id: number, data: Partial<Receptionist>) => api.put<Receptionist>(`/receptionist/${id}`, data),
  delete: (id: number) => api.delete(`/receptionist/${id}`),
};

export const appointmentApi = {
  getAll: () => api.get<Appointment[]>('/appointment'),
  getById: (id: number) => api.get<Appointment>(`/appointment/${id}`),
  create: (data: Partial<Appointment>) => api.post<Appointment>('/appointment', data),
  update: (id: number, data: Partial<Appointment>) => api.put<Appointment>(`/appointment/${id}`, data),
  delete: (id: number) => api.delete(`/appointment/${id}`),
};

export const serviceApi = {
  getAll: () => api.get<Services[]>('/services'),
  getById: (id: number) => api.get<Services>(`/services/${id}`),
  create: (data: Partial<Services>) => api.post<Services>('/services', data),
  update: (id: number, data: Partial<Services>) => api.put<Services>(`/services/${id}`, data),
  delete: (id: number) => api.delete(`/services/${id}`),
};

export const medicalHistoryApi = {
  getAll: () => api.get<MedicalHistory[]>('/medical_history'),
  getById: (id: number) => api.get<MedicalHistory>(`/medical_history/${id}`),
  create: (data: Partial<MedicalHistory>) => api.post<MedicalHistory>('/medical_history', data),
  update: (id: number, data: Partial<MedicalHistory>) => api.put<MedicalHistory>(`/medical_history/${id}`, data),
  delete: (id: number) => api.delete(`/medical_history/${id}`),
};

export const vaccineApi = {
  getAll: () => api.get<Vaccine[]>('/vaccine'),
  getById: (id: number) => api.get<Vaccine>(`/vaccine/${id}`),
  create: (data: Partial<Vaccine>) => api.post<Vaccine>('/vaccine', data),
  update: (id: number, data: Partial<Vaccine>) => api.put<Vaccine>(`/vaccine/${id}`, data),
  delete: (id: number) => api.delete(`/vaccine/${id}`),
};

export const vaccinationApi = {
  getAll: () => api.get<Vaccination[]>('/vaccination'),
  getById: (id: number) => api.get<Vaccination>(`/vaccination/${id}`),
  create: (data: Partial<Vaccination>) => api.post<Vaccination>('/vaccination', data),
  update: (id: number, data: Partial<Vaccination>) => api.put<Vaccination>(`/vaccination/${id}`, data),
  delete: (id: number) => api.delete(`/vaccination/${id}`),
};

export const reportApi = {
  completedServices: () => api.get<MedicalHistory[]>('/reports/completed-services'),
  appointmentsByStatus: (status?: AppointmentStatus) =>
    api.get<Appointment[]>(`/reports/appointments${status ? `?status=${status}` : ''}`),
};
