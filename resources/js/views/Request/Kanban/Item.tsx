import {Request} from "../Requests";
import {useKanbanContext} from "./KanbanContext";
import React, {useMemo} from "react";
import Icon from "../../../components/Icon";
import {Link} from "react-router-dom";

type KanbanItemProps = {
    item: Request,
    colors: string,
}
export default function KanbanItem({item, colors}: KanbanItemProps) {
    const {setCurrentRequest} = useKanbanContext();

    const {address, phone, contact_phone, email} = useMemo(() => {
        const address = (item.client && item.client.address?.full) || item.addressDB?.full || item.address || null;
        const phone = (item.client && item.client.phones && item.client.phones[0]) || item.client_phone || null;
        const contact_phone = (item.client && item.client.phones && item.client.phones[1]) || item.client_phone_contact || null;
        const email = (item.email && item.email) || (item.client && item.client.email && item.client.email) || null;

        return {address, phone, contact_phone, email};
    }, [item.client, item.address, item.email]);



    return <div className="rounded-md shadow bg-white text-gray-800 overflow-hidden flex mb-2">
        <div className={"kanban-card__color "+colors}></div>
        <div className="p-2 flex-1">
            <div className="flex items-start">
                <div className="kanban-card__subject" onClick={() => setCurrentRequest(item)}>
                    {item.subject || 'Заявка #'+item.id}
                </div>
                <div className="kanban-card__icons">
                    <span className={address && 'active'} title={address}>
                        <Icon icon="locate" />
                    </span>
                    {(contact_phone || phone)
                        ? <a href={'tel:'+(contact_phone || phone)}><Icon icon="phone"/></a>
                        : <span><Icon icon="phone"/></span>
                    }
                    {email
                        ? <a href={'mailto:'+email}><Icon icon="envelope"/></a>
                        : <span><Icon icon="envelope"/></span>
                    }
                </div>
            </div>
            <div className="text-gray-400 text-xs">Ответственный</div>
            {item.worker
                ? <Link target="_blank" to={`/workers/${item.worker.id}`} className="text-blue-600">{item.worker.name}</Link>
                : <span className="text-blue-600 border-b border-dotted cursor-pointer border-blue-600">Назначить</span>
            }
        </div>
    </div>;
}
