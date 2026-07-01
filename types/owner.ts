// OwnerResponse del backend: { id_owner, names, last_names, email, phone_number, address }
// (El "Cliente" del front es el "Owner" del backend; no tiene usuario/login.)
export interface Owner {
  id_owner: number;
  names: string;
  last_names: string;
  email: string;
  phone_number: string;
  address: string;
}

// OwnerRequest del backend: { names, last_names, email, phone_number, address }
export interface OwnerRequest {
  names: string;
  last_names: string;
  email: string;
  phone_number: string;
  address: string;
}
