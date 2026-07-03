export interface Service {
  id_service: number;
  name: string;
  description: string;
  price: number;
}

export interface ServiceRequest {
  name: string;
  description: string;
  price: number;
}
