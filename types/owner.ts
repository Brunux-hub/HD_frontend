export interface Owner {
  idOwner: number;
  names: string;
  lastNames: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export type OwnerResponse = Owner[];

export interface OwnerRequest {
  names: string;
  lastNames: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export interface OwnerApiSnake {
  id_owner: number;
  names: string;
  last_names: string;
  email: string;
  phone_number: string;
  address: string;
}

export interface OwnerApiCamel {
  idOwner: number;
  names: string;
  lastNames: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export type RawOwner = OwnerApiSnake | OwnerApiCamel;
