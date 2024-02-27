import React, {useEffect, useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import LoadingArea from "@/components/LoadingArea";
import {Address, Entrance} from "../types";
import {defaultAddress} from "../const";
import {AddressesAPI} from "../api";
import Icon from "@/components/Icon";
import {err, getInputInt} from "@/helpers";
import {EntrancesAPI} from "@/features/addresses/api/EntrancesAPI";

export function AddressFormPage() {
  const {id} = useParams();
  return <AddressForm id={id}/>;
}

export function AddressForm({id}) {
  const [address, setAddress] = useState<Address>(defaultAddress);
  const [loading, setLoading] = useState(false);
  const [currentEntrance, setCurrentEntrance] = useState<Entrance>(null);

  useEffect(() => {
    if(id) {
      setLoading(true);
      AddressesAPI.getSingle(id)
        .then(({data}: {data: Address}) => {
          setAddress({...data});
        })
        .catch(err)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const nullEntrance = useMemo(() => {
    return address.entrances.find((item) => item.entrance == null)
  }, [address.entrances]);

  return (
    <div className="relative min-h-16">
      {(loading || !address)
        ? <LoadingArea />
        : <div>
          <h1 className="text-2xl mb-8">{address?.full || 'Новый адрес'}</h1>
          <div className="tab_triggers">
            {address.entrances.map((entrance) =>
                entrance.entrance?<div key={entrance.id} className={"tab_trigger "+(currentEntrance?.id == entrance.id?'current':'')} onClick={() => setCurrentEntrance(entrance)}>{entrance.entrance}</div>:null
            )}
            <div className="tab_trigger leading-4"><Icon icon="plus"/></div>
            {nullEntrance && <div className={"tab_trigger ml-3 "+(currentEntrance?.id == nullEntrance.id?'current':'')} onClick={() => setCurrentEntrance(nullEntrance)}>Не указан</div>}
          </div>
          {currentEntrance && <EntranceForm entrance={currentEntrance}/>}
        </div>
      }
    </div>
  )
}

function EntranceForm({entrance: initial}: {entrance: Entrance}) {
  const [entrance, setEntrance] = useState(initial)
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    setEntrance(initial);
    setLoading(true);
    EntrancesAPI.getClients(initial.id)
      .then(({data}) => setClients(data.data))
      .catch(err)
      .finally(() => setLoading(false));
  }, [initial]);

  return <div className="relative">
    {loading && <LoadingArea/>}
      <div className="p-3">
        <table>
        <tbody>
          <tr>
            <td className="p-1.5">Кол-во этажей:</td>
            <td className="p-1.5"><input type="text" className="bg-transparent border rounded px-2 py-0.5" value={entrance.floors || ''} onChange={(e) => setEntrance({...entrance, floors: getInputInt(e.target.value)})} /></td>
          </tr>
          <tr>
            <td className="p-1.5">Квартир на этаже:</td>
            <td className="p-1.5"><input type="text" className="bg-transparent border rounded px-2 py-0.5" value={entrance.per_floor || ''} onChange={(e) => setEntrance({...entrance, per_floor: getInputInt(e.target.value)})} /></td>
          </tr>
        </tbody>
        </table>
        <div className="mt-3">
          <div className="text-2xl mb-4">Жильцы</div>
          <table>
            <thead>
            <tr>
              <td className="p-1.5 font-bold">Квартира</td>
              <td className="p-1.5 font-bold">ФИО</td>
              <td className="p-1.5 font-bold">Этаж</td>
            </tr>
            </thead>
            <tbody>
            {clients && clients.map(((client) => <tr key={client.id}>
                  <td className="p-1.5">{client.apartment}</td>
                  <td className="p-1.5">{client.name}</td>
                  <td className="p-1.5">{client.floor}</td>
                </tr>
            ))}
            </tbody>
          </table>

        </div>
      </div>
  </div>
}
