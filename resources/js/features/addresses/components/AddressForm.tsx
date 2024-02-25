import React, {FormEventHandler, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import LoadingArea from "@/components/LoadingArea";
import Save from "@/components/Save";
import {Address, Entrance} from "../types";
import {defaultAddress} from "../const";
import {AddressesAPI} from "../api";
import Icon from "@/components/Icon";
import {ClientsAPI} from "@/features/clients/api";
import {Client} from "@/features/clients";
import {err, getInputInt} from "@/helpers";

export function AddressFormPage() {
  const {id} = useParams();
  return <AddressForm id={id}/>;
}

export function AddressForm({id}) {
  const [address, setAddress] = useState<Address>(defaultAddress);
  const [loading, setLoading] = useState(false);
  const [entrances, setEntrances] = useState<Entrance[]>([]);
  const [nullEntrance, setNullEntrance] = useState<Entrance>(null);
  const [currentEntrance, setCurrentEntrance] = useState<Entrance>(null);

  useEffect(() => {
    if(id) {
      setLoading(true);
      AddressesAPI.getSingle(id)
        .then(({data}: {data: Address}) => {
          setAddress({...data});
          AddressesAPI.getEntrances(id).then(({data}) => {
            setEntrances(data.data.filter((entrance: Entrance) => entrance.entrance));
            setNullEntrance(data.data.filter((entrance: Entrance) => !entrance.entrance))
            setCurrentEntrance(data.data[0] || null);
          });
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const onSave: FormEventHandler = (e) => {
    e.preventDefault();

  }

  return (
    <form onSubmit={onSave} className="w-full">
      <div className="relative min-h-16">
        {(loading || !address)
          ? <LoadingArea />
          : <div>
            <h1 className="text-2xl mb-8">{address?.full || 'Новый адрес'}</h1>
            <div className="tab_triggers">
              {entrances.map((entrance) =>
                <div key={entrance.id} className={"tab_trigger "+(currentEntrance?.id == entrance.id?'current':'')} onClick={() => setCurrentEntrance(entrance)}>{entrance.entrance}</div>
              )}
              <div className="tab_trigger leading-4"><Icon icon="plus"/></div>
              {nullEntrance && <div className={"tab_trigger ml-3 "+(currentEntrance?.id == nullEntrance.id?'current':'')} onClick={() => setCurrentEntrance(nullEntrance)}>Не указан</div>}
            </div>
            {currentEntrance && <EntranceForm entrance={currentEntrance}/>}
          </div>
        }
      </div>
      <Save>
        <button className="btn btn-primary px-3 py-2">Сохранить</button>
      </Save>
    </form>
  )
}

function EntranceForm({entrance: initial}: {entrance: Entrance}) {
  const [clients, setClients] = useState<Client[]>();
  const [loading, setLoading] = useState(false);
  const [entrance, setEntrance] = useState(initial)

  useEffect(() => {
    if(!initial)
      return;

    setLoading(true);
    ClientsAPI.get(-1, 0, {address_id: initial.id})
      .then(({data}) => {
        setClients(data.data);
      })
      .catch(err)
      .finally(() => setLoading(false));
  }, [initial]);

  return (loading || !entrance)
      ? <LoadingArea/>
      : <div className="p-3">
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
      </div>;
}
