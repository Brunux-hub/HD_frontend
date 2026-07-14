// Enums del backend (api_healthy_pet). Se mandan/reciben tal cual (mayúsculas).

export type UserType = "ADMIN" | "WORKER";

export type AppointmentStatus = "PROGRAMADA" | "EN_CURSO" | "FINALIZADA" | "CANCELADA";

export const USER_TYPES: UserType[] = ["ADMIN", "WORKER"];
