import React, {HTMLAttributes, PointerEventHandler, useMemo, useState} from "react";
import {TRequest} from "@/Features/Requests/types";
import Item from "./Item";
import toast from "react-hot-toast";
import {err} from "@/helpers";
import {twMerge} from "tailwind-merge";
import Icon from "../../../Components/Icon";
import {FaTrashAlt} from "react-icons/fa";
import {Link} from "react-router-dom";
import RequestsAPI from "@/API/RequestsAPI";

type KanbanItemProps = {
  id: number,
  data: TRequest
} & Omit<HTMLAttributes<HTMLDivElement>, "id">;


const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
const getDate = (date_string: string) => {
  const date = new Date(date_string);
  return `${date.getDay()} ${months[date.getMonth()]} ${date.getFullYear()} ${('0'+date.getHours()).slice(-2)}:${('0'+date.getMinutes()).slice(-2)}`
}

export default function Card({id, data, className = '', ...props}: KanbanItemProps) {
  // const {setCurrentRequest} = useKanban();
  const [archived, setArchived] = useState(false);

  const {address, phone, contact_phone, email} = useMemo(() => {
    const address = (data.client && data.client.address) || data.addressDB?.full || data.address || null;
    const phone = (data.client && data.client.phones && data.client.phones[0]) || data.client_phone || null;
    const contact_phone = (data.client && data.client.phones && data.client.phones[1]) || data.client_phone_contact || null;
    const email = (data.email && data.email) || (data.client && data.client.email && data.client.email) || null;

    return {address, phone, contact_phone, email};
  }, [data.client, data.address, data.email]);

  const preventClick: PointerEventHandler = (e) => e.stopPropagation();

  const archive = () => {
    if(!confirm('Точно архивировать?'))
      return;

    const toastId = toast.loading('Архивирование...');
    RequestsAPI.update(data.id, {archived: true})
      .then(() => {
        setArchived(true);
        toast.success('Карточка архивирована')
      })
      .catch(err)
      .finally(() => toast.dismiss(toastId))
  }

  if(archived)
    return;

  return <Item id={id} data={data}>
    <div className={twMerge("rounded-md shadow bg-white text-gray-800 overflow-hidden flex cursor-grab ", className)} {...props}>
      <div className="kanban-card__color"></div>
      <div className="p-2 flex-1">
        <div className="flex items-start">
          <div className="kanban-card__subject" /* onClick={() => setCurrentRequest(item)}*/ onPointerDown={preventClick}>
            {data.subject || 'Заявка #'+data.id}
          </div>
          <div className="kanban-card__icons">
            <span className={address && 'active'} title={address}>
              <Icon icon="locate" />
            </span>
            {(contact_phone || phone)
              ? <a href={'tel:'+(contact_phone || phone)} onPointerDown={preventClick}><Icon icon="phone"/></a>
              : <span><Icon icon="phone"/></span>
            }
            {email
              ? <a href={'mailto:'+email} onPointerDown={preventClick}><Icon icon="envelope"/></a>
              : <span><Icon icon="envelope"/></span>
            }
            <button type="button" onClick={archive} onPointerDown={preventClick}><FaTrashAlt /></button>
          </div>
        </div>
        <div className="text-gray-400 text-xs">Ответственный</div>
        {data.worker
          ? <Link target="_blank" to={`/workers/${data.worker.id}`} className="text-blue-600" onPointerDown={preventClick}>{data.worker.name}</Link>
          : <span className="dotted-btn" onPointerDown={preventClick}/* onClick={() => setCurrentRequest(item)}*/>Назначить</span>
        }
        <div className="border-t border-gray-300 flex justify-between mt-1.5 pt-0.5">
          <div className="text-orange-500">#{data.id}</div>
          <div className="text-gray-500">{getDate(data.created)}</div>
        </div>
      </div>
    </div>
  </Item>;
}
