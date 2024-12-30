import {Objects} from "@/features/objects/types";
import {Client} from "@/features/clients/types";

export type Address = {
  id: number,
  full: string,
  city: string,
  street: string,
  house: string,
  entrances: Entrance[],
  object: Objects
}

export type Intercom = {
  id: number,
  model: string,
  version: string,
  calling_panel: string,
  door_type: 'builders' | 'uniphone',
}

export type Entrance = {
  id: number,
  address_id: number,
  entrance: number,
  per_floor: number,
  floors: number,
  intercoms: Intercom[],
  clients: Client[],
  object: Objects
}
export type AddressWithEntrance = Address & {
  entrances: Entrance[]
}
