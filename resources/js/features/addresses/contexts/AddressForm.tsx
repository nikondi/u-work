import React, {createContext, useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Address, Entrance} from "../types";
import {stateFunction} from "@/types";
import {AddressesAPI} from "../api/AddressesAPI";
import {defaultAddress} from "../const";
import {err} from "@/helpers";

type AddressContext = {
  address: Address, setAddress: stateFunction<Address>,
  currentEntrance: Entrance, setCurrentEntrance: stateFunction<Entrance>
  loading: boolean, setLoading: stateFunction<boolean>
  fetchAddress: () => void
}
const AddressContext = createContext<AddressContext>(null);
export const useAddressContext = () => {
  const value = useContext(AddressContext);
  if(!value)
    throw new Error('Address context is empty');

  return value;
};

export function AddressContextProvider({children}) {
  const {id} = useParams();

  const [address, setAddress] = useState<Address>(defaultAddress);
  const [currentEntrance, setCurrentEntrance] = useState<Entrance>(address.entrances[0] || null);
  const [loading, setLoading] = useState(false);

  const fetchAddress = () => {
    setLoading(true);
    const getAddress = AddressesAPI.getSingle(id);
    getAddress.getResult
        .then(({data}: {data: Address}) => {
          setAddress(data);
          setCurrentEntrance(data.entrances.find((e) => e.entrance !== null) || data.entrances.find((e) => e.entrance == null) || null);
        })
        .catch(err)
        .finally(() => setLoading(false));
    return () => getAddress.abort();
  };

  useEffect(() => {
    if(id)
      return fetchAddress();
  }, [id]);

  const value = {
    address, setAddress,
    currentEntrance, setCurrentEntrance,
    loading, setLoading,
    fetchAddress
  };

  return <AddressContext.Provider value={value}>
    {value?children:'Загрузка...'}
  </AddressContext.Provider>
}
