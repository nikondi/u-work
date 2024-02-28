import {Address} from "../types";
import {defaultObject} from "@/features/objects";

export const defaultAddress: Address = {
  id: 0,
  city: null,
  street: null,
  house: null,
  full: '',
  entrances: [],
  object: defaultObject
};
