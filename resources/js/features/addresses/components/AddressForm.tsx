import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import LoadingArea from "@/components/LoadingArea";
import Icon from "@/components/Icon";
import {err} from "@/helpers";
import {Address, Entrance} from "../types";
import {defaultAddress, defaultEntrance} from "../const";
import {AddressesAPI, EntrancesAPI} from "../api";
import {AddressObject} from "./AddressObject";
import {EntranceForm} from "./EntranceForm";
import {AddressContext} from "../contexts/AddressForm";
import {FaTimes, FaUsers} from "react-icons/fa";
import {ClientsEntrances} from "./MoveClients";
import toast from "react-hot-toast";

export function AddressFormPage() {
  const {id} = useParams();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<Address>(defaultAddress);
  const [currentEntrance, setCurrentEntrance] = useState<Entrance>(address.entrances[0] || null);
  const [moveClients, setMoveClients] = useState(false);

  const nullEntrance = useMemo(() => {
    return address.entrances.find((item) => item.entrance == null)
  }, [address.entrances]);

  const notNullEntrancesCount = useMemo(() => {
    return address.entrances.filter((entrance) => entrance.entrance).length;
  }, [address.entrances]);

  const addEntrance = useCallback(() => {
    const lastEntrance = address.entrances[address.entrances.length - 1].entrance;
    setAddress({...address, entrances: [...address.entrances, {
      ...defaultEntrance,
      address_id: address.id,
      entrance: lastEntrance?(lastEntrance + 1):1,
    }]})
  }, [address]);

  const deleteCurrentEntrance = () => {
    const num = currentEntrance.entrance;
    if(!confirm(`Точно удалить подъезд ${num}?`))
      return;
    if(!currentEntrance.id)
      setAddress((prev) => ({...prev, entrances: prev.entrances.slice(0, prev.entrances.length - 1)}))
    else {
      const toast_id = toast.loading('Удаление...');
      EntrancesAPI.delete(currentEntrance.id)
          .then(() => {
            toast.success(`Подъезд ${num} удалён`);
            fetchAddress();
          })
          .catch(err)
          .finally(() => toast.dismiss(toast_id));
    }
  }

  const fetchAddress = () => {
    setLoading(true);
    AddressesAPI.getSingle(id)
        .then(({data}: {data: Address}) => {
          setAddress(data);
          setCurrentEntrance(data.entrances.find((e) => e.entrance !== null) || data.entrances.find((e) => e.entrance == null) || null);
        })
        .catch(err)
        .finally(() => setLoading(false));
  }

  useEffect(() => {
    if(id)
      fetchAddress();
  }, [id]);

  return <div className="relative">
    {loading && <LoadingArea />}
    <AddressContext.Provider value={{
      address, setAddress,
      currentEntrance, setCurrentEntrance,
      fetchAddress
    }}>
      <div className="relative min-h-16">
        <div>
          <div className="flex justify-between">
            <h1 className="text-2xl mb-4">{address?.full || 'Новый адрес'}</h1>
            <div className="flex gap-x-3">
              <button className="btn btn-primary" type="button" onClick={() => setMoveClients(true)}><FaUsers/></button>
            </div>
          </div>
          <AddressObject />
          <div className="tab_triggers mt-4">
            {address.entrances.map((entrance, i) => {
              const isCurrent = currentEntrance?.entrance == entrance.entrance;
              return entrance.entrance ?
                  <div key={`ent-${entrance.entrance}` || entrance.id} className={"tab_trigger " + (isCurrent ? 'current' : '')} onClick={() => !isCurrent && setCurrentEntrance(entrance)}>
                    {entrance.entrance}
                    {isCurrent && (i + 1 == notNullEntrancesCount) && <><div className="w-2"></div><button onClick={deleteCurrentEntrance} className="tab_trigger-button right-1 rounded-full hover:bg-red-500 p-1 absolute"><FaTimes /></button></>}
                  </div>
                  : null
              }
            )}
            <div className="tab_trigger leading-4" onClick={addEntrance}><Icon icon="plus"/></div>
            {nullEntrance && <div className={"tab_trigger ml-3 "+(currentEntrance?.id == nullEntrance.id?'current':'')} onClick={() => setCurrentEntrance(nullEntrance)}>Не указан</div>}
          </div>
          {currentEntrance && <EntranceForm />}
        </div>
      </div>
      {moveClients && <ClientsEntrances close={() => setMoveClients(false)} />}
    </AddressContext.Provider>
  </div>
}

