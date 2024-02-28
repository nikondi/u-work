import {user} from "@/features/auth";
import {Client} from "@/features/clients";
import {Objects} from "@/features/objects/types";

export type Address = {
  id: number,
  full: string,
  city: string,
  street: string,
  house: string,
  entrances: Entrance[],
  object: Objects
}

export type Entrance = {
  id: number,
  address_id: number,
  entrance: number,
  per_floor: number,
  floors: number,
  clients: Client[],
  worker: user,
  object: Objects
}
export type AddressWithEntrance = Address & {
  entrances: Entrance[]
}
