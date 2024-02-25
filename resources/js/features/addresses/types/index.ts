import {user} from "@/features/auth";

export type Address = {
  id: number,
  full: string,
  city: string,
  street: string,
  house: string,
}

export type Entrance = {
  id: number,
  address_id: number,
  entrance: number,
  per_floor: number,
  floors: number,
  worker: user
}
export type AddressWithEntrance = Address & {
  entrances: Entrance[]
}
