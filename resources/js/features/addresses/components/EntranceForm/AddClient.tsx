import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Entrance} from "../../types";
import {EntrancesAPI} from "../../api";
import {Client, ClientsAPI} from "@/features/clients";
import {useDelayedState} from "@/hooks";
import {err} from "@/helpers";
import Save from "@/components/Save";
import SearchInput from "@/components/SearchInput";
import toast from "react-hot-toast";
import {AddClientResponse} from "../../types/protected";

type Props = {
  onSave: (data: AddClientResponse) => void
  close: () => void,
  entrance: Entrance
}

export default function AddClient({onSave, close, entrance}: Props) {
  const [clientsList, setClientsList] = useState<Client[]>([]);
  const [addingClients, setAddingClients] = useState<Client[]>([]);

  const clients = useMemo(() => {
    return clientsList.filter((client) => !addingClients.find((c) => c.id == client.id));
  }, [clientsList, addingClients]);

  const addClient = (client: Client) => setAddingClients((prev) => [client, ...prev]);
  const removeClient = (index: number) => setAddingClients((prev) => prev.filter((_c, i) => i !== index));

  const [word, setWord] = useState(null);
  const [_word, _setWord] = useDelayedState(setWord, 500, '');
  const lastWord = useRef('');

  const fetchClients = useCallback(() => {
    const trimmed = word && word.trim();
    if(trimmed && trimmed !== '' && trimmed != lastWord.current) {
      lastWord.current = trimmed;
      return ClientsAPI.searchNotInAddress(60, word, entrance.address_id);
    }
    else
      return ClientsAPI.getNotInAddress(60, entrance.address_id);
  }, [word, entrance.address_id]);

  const loadClients = () => {
    const getClients = fetchClients();
    getClients.getResult
        .then(({data}) => setClientsList(data.data))
        .catch(err);

    return () => getClients.abort();
  }

  useEffect(() => {
    return loadClients();
  }, [word]);

  const save = () => {
    EntrancesAPI.addClients(entrance.id, entrance.entrance, entrance.address_id, addingClients.map((client) => client.id))
        .then(({data}) => {
          toast.success('Клиенты добавлены!');
          onSave && onSave(data);
          close();
        })
        .catch(err);
  };

  return <div className="fixed inset-0 z-10 flex justify-center items-start p-5">
    <div className="bg-black bg-opacity-40 backdrop-blur-sm absolute inset-0" onClick={close}></div>

    <Save>
      <button type="button" className="btn btn-red" onClick={() => close()}>Отменить</button>
      <button type="button" className="btn btn-primary" onClick={save}>Сохранить</button>
    </Save>
    <div className="bg-white dark:bg-blue-950 rounded-md relative z-20 shadow-lg w-full p-6" style={{maxWidth: '1600px'}}>
      <div className="flex gap-x-3 items-center mb-3">
        <div className="text-xl">Добавить жильцов в подъезд {entrance.entrance}</div>
        <SearchInput value={_word} setValue={_setWord} />
      </div>
      <div className="flex gap-x-3">
        <div className="flex-1 flex flex-col gap-y-1.5 bg-gray-500 dark:bg-white bg-opacity-15 dark:bg-opacity-15 rounded-md p-3 overflow-auto" style={{height: 'calc(100vh - 205px)'}}>
          {clients.map((client) => <AddingClientCard key={client.id} client={client} onClick={() => addClient(client)}/>)}
        </div>
        <div className="flex-1 flex flex-col gap-y-1.5 bg-gray-500 dark:bg-white bg-opacity-15 dark:bg-opacity-15 rounded-md p-3 overflow-auto" style={{height: 'calc(100vh - 205px)'}}>
          {addingClients.map((client, i) => <AddingClientCard key={client.id} client={client} onClick={() => removeClient(i)}/>)}
        </div>
      </div>
    </div>
  </div>;
}

function AddingClientCard({client, onClick}: {client: Client, onClick: () => void}) {
  return <div onClick={onClick} className="hover:bg-blue-600 hover:bg-opacity-5 dark:hover:bg-opacity-50 dark:bg-opacity-20 bg-white cursor-pointer transition-colors duration-300 py-1 px-2 rounded">
    <div><span className="text-orange-300">#{client.id}</span> {client.name}</div>
    <div className="text-gray-400">{client.address}</div>
  </div>
}
