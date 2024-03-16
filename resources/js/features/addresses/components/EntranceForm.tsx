import React, {useEffect, useState} from "react";
import {err} from "@/helpers";
import LoadingArea from "@/components/LoadingArea";
import SidePopup, {CloseButton, PopupContent} from "@/components/SidePopup";
import {EntrancesAPI} from "../api";
import {EntranceObject} from "./EntranceObject";
import {useAddressContext} from "../contexts/AddressForm";
import {Client, ClientForm} from "@/features/clients";

export function EntranceForm() {
  const {currentEntrance: entrance, setCurrentEntrance: setEntrance} = useAddressContext();
  const [loading, setLoading] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client>(null);

  const fetchClients = () => {
    setLoading(true);
    EntrancesAPI.getClients(entrance.id)
        .then(({data}) => setEntrance((prev) => ({...prev, clients: data.data})))
        .catch(err)
        .finally(() => setLoading(false));
  }

  useEffect(() => {
    if(!entrance.id)
      return;
    fetchClients();
  }, [entrance.entrance]);

  return <div className="relative">
    <LoadingArea show={loading}/>
    {entrance.entrance && entrance.id && <EntranceObject />}
    {currentClient && <SidePopup onClose={() => setCurrentClient(null)}>
      <PopupContent>
        <CloseButton onClose={() => setCurrentClient(null)}/>
        <ClientForm id={currentClient.id} onSave={fetchClients}/>
      </PopupContent>
    </SidePopup>}
    <div className="p-3">
      {/*<table>
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
      </table>*/}
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
          {entrance.clients && entrance.clients.map(((client) => <tr key={client.id} className="dark:text-gray-300 cursor-pointer hover:bg-gray-600 hover:bg-opacity-20 transition-colors duration-300" onClick={() => setCurrentClient(client)}>
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
