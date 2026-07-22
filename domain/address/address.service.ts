import * as addressRepository from "./address.repository";
import { createAddressSchema, updateAddressSchema } from "./address.validator";
import type { Address } from "./address.types";

export class AddressNotFoundError extends Error {
  constructor(id: string) {
    super(`Address ${id} not found`);
    this.name = "AddressNotFoundError";
  }
}

export class AddressForbiddenError extends Error {
  constructor() {
    super("You do not have access to this address");
    this.name = "AddressForbiddenError";
  }
}

export async function listAddresses(userId: string): Promise<Address[]> {
  return addressRepository.findManyByUserId(userId);
}

async function getOwnedAddress(id: string, userId: string): Promise<Address> {
  const address = await addressRepository.findById(id);

  if (!address) {
    throw new AddressNotFoundError(id);
  }

  if (address.userId !== userId) {
    throw new AddressForbiddenError();
  }

  return address;
}

export async function createAddress(userId: string, rawInput: unknown): Promise<Address> {
  const input = createAddressSchema.parse(rawInput);
  return addressRepository.createWithDefaultFlip(userId, input);
}

export async function updateAddress(
  id: string,
  userId: string,
  rawInput: unknown
): Promise<Address> {
  await getOwnedAddress(id, userId);
  const input = updateAddressSchema.parse(rawInput);
  return addressRepository.updateWithDefaultFlip(id, userId, input);
}

export async function deleteAddress(id: string, userId: string): Promise<void> {
  await getOwnedAddress(id, userId);
  await addressRepository.remove(id);
}
