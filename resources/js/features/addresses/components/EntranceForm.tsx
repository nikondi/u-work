import React, {useCallback, useEffect, useState} from "react";
import {err} from "@/helpers";
import LoadingArea from "@/components/LoadingArea";
import SidePopup, {CloseButton, PopupContent} from "@/Components/Sidepopup/SidePopup";
import {EntrancesAPI} from "../api";
import {EntranceObject} from "./EntranceObject";
import {Client, ClientForm} from "@/features/clients";
import {Entrance} from "../types";
import AddClient from "./EntranceForm/AddClient";
import {AddClientResponse} from "../types/protected";
import {FaUserPlus} from "react-icons/fa6";

export function EntranceForm({entrance}) {
  const [loading, setLoading] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client>(null);
  const [data, setData] = useState<Entrance>(entrance);
  const [addClient, setAddClient] = useState(false);

  useEffect(() => {
    setData(entrance);
  }, [entrance]);

  const fetchClients = useCallback((entrance_id = null) => {
    if(!entrance_id && !entrance.id)
      return;
    if(!entrance_id)
      entrance_id = entrance.id;

    setLoading(true);

    const getClients = EntrancesAPI.getClients(entrance_id);

    getClients.getResult
        .then(({data}) => setData((prev) => ({...prev, clients: data.data})))
        .catch(err)
        .finally(() => setLoading(false));

    return () => getClients.abort();
  }, [entrance.id]);

  useEffect(() => {
    setData(entrance);
    if(!entrance.id)
      return;
    return fetchClients();
  }, [entrance.id]);

  const handleSave = (data: AddClientResponse) => {
    setData(prev => ({...prev, id: data.entrance_id}));
    fetchClients(data.entrance_id);
  }

  return <div className="relative">
    <LoadingArea show={loading}/>
    {data.entrance && data.id && <EntranceObject entrance={data} />}
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
        <div className="flex gap-x-3.5 items-center mb-4">
          <div className="text-2xl">Жильцы</div>
          {data.entrance && <button className="text-xl hover:text-gray-400 transition-colors duration-300" onClick={() => setAddClient(true)}><FaUserPlus /></button>}
        </div>
        <table>
          <thead>
          <tr>
            <td className="p-1.5 font-bold">Квартира</td>
            <td className="p-1.5 font-bold">ФИО</td>
            <td className="p-1.5 font-bold">Этаж</td>
          </tr>
          </thead>
          <tbody>
          {data.clients && data.clients.map(((client) => <tr key={client.id} className="dark:text-gray-300 cursor-pointer hover:bg-gray-600 hover:bg-opacity-20 transition-colors duration-300" onClick={() => setCurrentClient(client)}>
              <td className="p-1.5">{client.apartment}</td>
              <td className="p-1.5">{client.name}</td>
              <td className="p-1.5">{client.floor}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
    {addClient && <AddClient onSave={handleSave} close={() => setAddClient(false)} entrance={data}/>}
  </div>
}

