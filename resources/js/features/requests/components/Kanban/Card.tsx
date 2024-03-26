import {useKanbanContext} from "./KanbanContext";
import React, {HTMLAttributes, PointerEventHandler, useMemo, useState} from "react";
import {Link} from "react-router-dom";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {twMerge} from "tailwind-merge";
import {Request} from "../../types";
import Icon from "@/components/Icon";
import {RequestsAPI} from "@/features/requests";
import {err} from "@/helpers";
import toast from "react-hot-toast";
import {FaTrashAlt} from "react-icons/fa";

type KanbanItemProps = {
  id: string,
  item: Request,
  colors: string,
} & HTMLAttributes<HTMLDivElement>;

function KanbanItem({id, data, children}) {
  const {active, attributes, transition, listeners, setNodeRef, transform} = useSortable({id, data});

  return <div ref={setNodeRef} {...attributes} {...listeners} style={{
      transform: CSS.Transform.toString(transform),
      position: "relative",
      transition,
      padding: "5px 0",
    }}>
      {(active && active.id == id) ?
          <div className="kanban-card-placeholder"><div className="opacity-0">{children}</div></div>
      : children}
  </div>
}

const monthes = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

const getDate = (date_string: string) => {
  const date = new Date(date_string);
  return `${date.getDay()} ${monthes[date.getMonth()]} ${date.getFullYear()} ${('0'+date.getHours()).slice(-2)}:${('0'+date.getMinutes()).slice(-2)}`
}

export default function Card({id, item, colors, className = '', ...props}: KanbanItemProps) {
  const {setCurrentRequest} = useKanbanContext();
  const [archived, setArchived] = useState(false);

  const {address, phone, contact_phone, email} = useMemo(() => {
    const address = (item.client && item.client.address) || item.addressDB?.full || item.address || null;
    const phone = (item.client && item.client.phones && item.client.phones[0]) || item.client_phone || null;
    const contact_phone = (item.client && item.client.phones && item.client.phones[1]) || item.client_phone_contact || null;
    const email = (item.email && item.email) || (item.client && item.client.email && item.client.email) || null;

    return {address, phone, contact_phone, email};
  }, [item.client, item.address, item.email]);

  const preventClick: PointerEventHandler = (e) => e.stopPropagation();

  const archive = () => {
    const toastId = toast.loading('Архивирование...');
    RequestsAPI.update(item.id, {archived: true})
      .then(() => {
        setArchived(true);
        toast.success('Карточка архивирована')
      })
      .catch(err)
      .finally(() => toast.dismiss(toastId))
  }

  if(archived)
    return;

  return <KanbanItem id={id} data={item}>
    <div className={twMerge("rounded-md shadow bg-white text-gray-800 overflow-hidden flex cursor-grab ", className)} {...props}>
      <div className={"kanban-card__color "+colors}></div>
      <div className="p-2 flex-1">
        <div className="flex items-start">
          <div className="kanban-card__subject" onClick={() => setCurrentRequest(item)} onPointerDown={preventClick}>
            {item.subject || 'Заявка #'+item.id}
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
        {item.worker
          ? <Link target="_blank" to={`/workers/${item.worker.id}`} className="text-blue-600" onPointerDown={preventClick}>{item.worker.name}</Link>
          : <span className="dotted-btn" onPointerDown={preventClick} onClick={() => setCurrentRequest(item)}>Назначить</span>
        }
        <div className="border-t border-gray-300 flex justify-between mt-1.5 pt-0.5">
          <div className="text-orange-500">#{item.id}</div>
          <div className="text-gray-500">{getDate(item.created)}</div>
        </div>
      </div>
    </div>
  </KanbanItem>;
}
