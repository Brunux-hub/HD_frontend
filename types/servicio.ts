export interface ServiceItem {
  idService: number;
  name: string;
  description: string;
  price: number;
}

export type ServiceResponse = ServiceItem[];

export interface CreateServiceRequest {
  name: string;
  description: string;
  price: number;
}

export type UpdateServiceRequest = CreateServiceRequest;
