import {
  httpDeleteOwnerAPI,
  httpGetMyOwnerAPI,
  httpGetOwnerByIdAPI,
  httpGetOwnersAPI,
  httpPostOwnerAPI,
  httpPutOwnerAPI,
} from "@/api/ownerHttp";
import type { Owner, OwnerRequest, RawOwner } from "@/types/owner";

function normalizeOwner(owner: RawOwner): Owner {
  if ("id_owner" in owner) {
    return {
      idOwner: owner.id_owner,
      names: owner.names,
      lastNames: owner.last_names,
      email: owner.email,
      phoneNumber: owner.phone_number,
      address: owner.address,
    };
  }

  return owner;
}

export const getOwners = async (): Promise<Owner[]> => {
  const data = await httpGetOwnersAPI();
  return data.map(normalizeOwner);
};

export const getOwnerById = async (id: number): Promise<Owner> => {
  const data = await httpGetOwnerByIdAPI(id);
  return normalizeOwner(data);
};

export const createOwner = async (payload: OwnerRequest): Promise<Owner> => {
  const data = await httpPostOwnerAPI(payload);
  return normalizeOwner(data);
};

export const updateOwner = async (id: number, payload: OwnerRequest): Promise<Owner> => {
  const data = await httpPutOwnerAPI(id, payload);
  return normalizeOwner(data);
};

export const deleteOwner = async (id: number): Promise<void> => {
  await httpDeleteOwnerAPI(id);
};

export const getMyOwner = async (): Promise<Owner | null> => {
  const data = await httpGetMyOwnerAPI();
  return data ? normalizeOwner(data) : null;
};
