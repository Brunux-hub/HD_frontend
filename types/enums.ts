// Enums del backend (api_healthy_pet). Se mandan/reciben tal cual (mayúsculas).

export type UserType = "ADMIN" | "WORKER";

export type PetGender = "MALE" | "FEMALE";

export type AppointmentStatus = "OPENED" | "CLOSED" | "CANCELED" | "RESCHEDULED";

export const USER_TYPES: UserType[] = ["ADMIN", "WORKER"];

export const PET_GENDERS: PetGender[] = ["MALE", "FEMALE"];

export const APPOINTMENT_STATUSES: AppointmentStatus[] = [
  "OPENED",
  "CLOSED",
  "CANCELED",
  "RESCHEDULED",
];
