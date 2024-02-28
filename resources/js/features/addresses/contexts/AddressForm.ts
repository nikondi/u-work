import {Address, Entrance} from "../types";
import {createContext, useContext} from "react";

type AddressContext = {
  address: Address, setAddress: (v: Address) => void,
  currentEntrance: Entrance, setCurrentEntrance: (v: Entrance) => void
}
export const AddressContext = createContext<AddressContext>(null);
export const useAddressContext = () => useContext(AddressContext);
