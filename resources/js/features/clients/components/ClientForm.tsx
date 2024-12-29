import React, {FormEventHandler, useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {clientStatuses, defaultClient, statusToNumber} from "../const";
import {Client, ClientRaw} from "../types";
import {ClientsAPI} from "../api";
import {FormRow, Input, Option, Repeater, Select, Textarea} from "@/components/Form";
import LoadingArea from "@/components/LoadingArea";
import {err, getInputInt} from "@/helpers";
import Save from "@/Components/Save";
import toast from "react-hot-toast";

export function ClientFormPage() {
  const {id} = useParams();
  return <ClientForm id={parseInt(id)} page="single" />;
}

type Props = {
  id: number,
  page?: 'popup' | 'single'
  onSave?: (client: Client) => void
}

export function ClientForm({id, page = 'popup', onSave = null}: Props) {
  const [client, setClient] = useState<Client>(defaultClient);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if(id) {
      setLoading(true);
      ClientsAPI.getSingle(id)
        .then(({data}: {data: Client}) => {
          setClient({...data})
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const save: FormEventHandler = (e) => {
    e.preventDefault();

    const client_data: ClientRaw = {...client, password: '', status: statusToNumber[client.status]};
    setLoading(true);

    if(id) {
      ClientsAPI.update(id, client_data)
          .then(({data}) => {
            page == 'single' && data.id != id && navigate(`/clients/${data.id}`);
            toast.success(`Клиент ${data.id} сохранён`);
            onSave && onSave(data);
          })
          .catch(err)
          .finally(() => setLoading(false));
    }
    else {
      ClientsAPI.create(client_data)
          .then(({data}) => {
            page == 'single' && navigate(`/clients/${data.id}`);
            toast.success(`Клиент ${data.id} добавлен`)
            onSave && onSave(data);
          })
          .catch(err)
          .finally(() => setLoading(false));
    }
  }

  return (
      <form onSubmit={save}>
        <div className="relative">
          {loading && <LoadingArea/>}
          <div className="flex justify-between gap-x-3">
            <h1 className="text-2xl dark:text-white">{id && <span className="text-orange-500">#{client.id} </span>}{client.name}</h1>
          </div>
          <div className="mt-3 text-lg text-blue-500"><Link to={`/addresses/${client.address_id}`} target="_blank">{client.address}</Link></div>
          <FormRow label="ФИО" className="mt-4">
            <Input value={client.name || ''} setValue={(v) => setClient({...client, name: v})}/>
          </FormRow>
          <div className="flex flex-wrap -mx-2">
            <FormRow label="Номер лицевого счёта" className="mt-4 md:w-1/2 px-2">
              <Input value={client.id} setValue={(v) => setClient({...client, id: getInputInt(v)})}/>
            </FormRow>
            <FormRow label="Номер телефона" className="mt-4 md:w-1/2 px-2">
              <Repeater value={client.phone} setValue={(v: string) => setClient({...client, phone: v})} />
            </FormRow>
          </div>
          <FormRow label="E-mail" className="mt-4">
            <Input value={client.email || ''} setValue={(v: string) => setClient({...client, email: v})}/>
          </FormRow>
          <FormRow label="Статус" className="mt-4">
            <Select value={client.status}>
              {Object.keys(clientStatuses).map((key: string, i: number) => <Option index={i} key={i} value={key}>{clientStatuses[key]}</Option>)}
            </Select>
          </FormRow>
          <div className="flex flex-wrap -mx-2">
            <FormRow label="Квартира" className="mt-4 md:w-1/2 px-2">
              <Input type="number" value={client.apartment || ''} setValue={(v) => setClient({...client, apartment: getInputInt(v)})}/>
            </FormRow>
            <FormRow label="Этаж" className="mt-4 md:w-1/2 px-2">
              <Input type="number" value={client.floor || ''} setValue={(v) => setClient({...client, floor: getInputInt(v)})}/>
            </FormRow>
          </div>
          <FormRow label="Комментарий" className="mt-4">
            <Textarea label="Комментарий" value={client.comment || ''} setValue={(v: string) => setClient({...client, comment: v})}></Textarea>
          </FormRow>
        </div>
        <Save>
          <button className="btn btn-primary px-3 py-2">Сохранить</button>
        </Save>
      </form>
  )
}
