import {user} from "@/features/auth";
import {Client} from "@/features/clients";

export type Address = {
  id: number,
  full: string,
  city: string,
  street: string,
  house: string,
  entrances: Entrance[],
}

export type Entrance = {
  id: number,
  address_id: number,
  entrance: number,
  per_floor: number,
  floors: number,
  clients: Client[],
  worker: user
}
export type AddressWithEntrance = Address & {
  entrances: Entrance[]
}
