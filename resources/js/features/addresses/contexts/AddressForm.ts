import {Address, Entrance} from "../types";
import {createContext, useContext} from "react";
import {stateFunction} from "@/types";

type AddressContext = {
  address: Address, setAddress: (v: Address) => void,
  currentEntrance: Entrance, setCurrentEntrance: stateFunction<Entrance>
  fetchAddress: () => void
}
export const AddressContext = createContext<AddressContext>(null);
export const useAddressContext = () => useContext(AddressContext);
