import {Address, Entrance} from "../types";
import {defaultObject} from "@/features/objects";

export const defaultAddress: Address = {
  id: null,
  city: null,
  street: null,
  house: null,
  full: '',
  entrances: [],
  object: defaultObject
};

export const defaultEntrance: Entrance = {
  id: null,
  entrance: 1,
  object: null,
  clients: [],
  per_floor: 6,
  floors: null,
  address_id: null,
  worker: null
}
