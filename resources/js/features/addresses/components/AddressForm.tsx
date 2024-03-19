import React from "react";
import {AddressContextProvider} from "../contexts/AddressForm";
import AddressInner from "./AddressForm/Inner";

export function AddressFormPage() {
  return <div className="relative">
    <AddressContextProvider>
      <AddressInner />
    </AddressContextProvider>
  </div>
}

