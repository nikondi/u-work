import {Request} from "../Requests";
import {useKanbanContext} from "./KanbanContext";
import React, {PointerEventHandler, useMemo} from "react";
import Icon from "../../../components/Icon";
import {Link} from "react-router-dom";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

type KanbanItemProps = {
    id: string,
    item: Request,
    colors: string,
}

function KanbanItem({id, data, children}) {
    const {active, attributes, transition, listeners, setNodeRef, transform} = useSortable({id, data});

    return <div ref={setNodeRef} {...attributes} {...listeners} style={{
        transform: CSS.Transform.toString(transform),
        position: "relative",
        zIndex: (active && active.id == id)?1000:"unset",
        transition
    }}>
        {children}
    </div>
}

export default function Card({id, item, colors}: KanbanItemProps) {
    const {setCurrentRequest} = useKanbanContext();

    const {address, phone, contact_phone, email} = useMemo(() => {
        const address = (item.client && item.client.address?.full) || item.addressDB?.full || item.address || null;
        const phone = (item.client && item.client.phones && item.client.phones[0]) || item.client_phone || null;
        const contact_phone = (item.client && item.client.phones && item.client.phones[1]) || item.client_phone_contact || null;
        const email = (item.email && item.email) || (item.client && item.client.email && item.client.email) || null;

        return {address, phone, contact_phone, email};
    }, [item.client, item.address, item.email]);

    const preventClick: PointerEventHandler = (e) => e.stopPropagation();


    return <KanbanItem id={id} data={item}>
        <div className="rounded-md shadow bg-white text-gray-800 overflow-hidden flex mb-2">
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
                    </div>
                </div>
                <div className="text-gray-400 text-xs">Ответственный</div>
                {item.worker
                    ? <Link target="_blank" to={`/workers/${item.worker.id}`} className="text-blue-600" onPointerDown={preventClick}>{item.worker.name}</Link>
                    : <span className="dotted-btn" onClick={() => setCurrentRequest(item)}>Назначить</span>
                }
            </div>
        </div>
    </KanbanItem>;
}
