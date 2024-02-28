import React, {useEffect, useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import LoadingArea from "@/components/LoadingArea";
import Icon from "@/components/Icon";
import {err} from "@/helpers";
import {Address, Entrance} from "../types";
import {defaultAddress} from "../const";
import {AddressesAPI} from "../api";
import {AddressObject} from "./AddressObject";
import {EntranceForm} from "./EntranceForm";
import {AddressContext} from "../contexts/AddressForm";

export function AddressFormPage() {
  const {id} = useParams();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<Address>(defaultAddress);
  const [currentEntrance, setCurrentEntrance] = useState<Entrance>(address.entrances[0] || null);

  const nullEntrance = useMemo(() => {
    return address.entrances.find((item) => item.entrance == null)
  }, [address.entrances]);


  useEffect(() => {
    if(id) {
      setLoading(true);
      AddressesAPI.getSingle(id)
        .then(({data}: {data: Address}) => {
          setAddress(data);
          console.log(data);
          setCurrentEntrance(data.entrances.find((e) => e.entrance !== null) || null);
        })
        .catch(err)
        .finally(() => setLoading(false));
    }
  }, [id]);

  return <div className="relative">
    {loading && <LoadingArea />}
    <AddressContext.Provider value={{
      address, setAddress,
      currentEntrance, setCurrentEntrance
    }}>
      <div className="relative min-h-16">
        <div>
          <h1 className="text-2xl mb-4">{address?.full || 'Новый адрес'}</h1>
          <AddressObject object={address.object} setObject={(v) => setAddress({...address, object: v})} address={address} />
          <div className="tab_triggers mt-4">
            {address.entrances.map((entrance) =>
                entrance.entrance?<div key={entrance.id} className={"tab_trigger "+(currentEntrance?.id == entrance.id?'current':'')} onClick={() => setCurrentEntrance(entrance)}>{entrance.entrance}</div>:null
            )}
            <div className="tab_trigger leading-4"><Icon icon="plus"/></div>
            {nullEntrance && <div className={"tab_trigger ml-3 "+(currentEntrance?.id == nullEntrance.id?'current':'')} onClick={() => setCurrentEntrance(nullEntrance)}>Не указан</div>}
          </div>
          {currentEntrance && <EntranceForm />}
        </div>
      </div>
    </AddressContext.Provider>
  </div>
}


