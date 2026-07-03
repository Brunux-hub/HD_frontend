// OwnerResponse del backend: { id_owner, names, last_names, email, phone_number, address }
// (El "Cliente" del front es el "Owner" del backend; no tiene usuario/login.)
export type DocumentType = "DNI" | "CE";

export interface Owner {
  id_owner: number;
  document_type: DocumentType;
  dni: string;
  names: string;
  last_names: string;
  email: string;
  phone_number: string;
  address: string;
}

export interface OwnerRequest {
  document_type: DocumentType;
  dni: string;
  names: string;
  last_names: string;
  email: string;
  phone_number: string;
  address: string;
}
