import React, {useCallback, useEffect, useMemo, useState} from "react";
import RequestsAPI from "../../API/RequestsAPI";
import {Request} from "./Requests";
import Icon from "../../components/Icon";
import {Link} from "react-router-dom";

export default function RequestsKanban() {
    return <div className="flex overflow-x-auto h-full">
        <KanbanList type="simple" name="Новые обращения" colors="bg-orange-500"/>
        <KanbanList type="call" name="Звонки" colors="bg-rose-400"/>
        <KanbanList type="done" name="Завершены" colors="bg-green-600"/>
    </div>;
}

type KanbanListProps = {
    type: string,
    name: string,
    colors: string,
}
function KanbanList({type, name, colors}: KanbanListProps) {
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const fetchRequests = useCallback((page: number) => {
        return RequestsAPI.get(30, page, null, {type});
    }, [type]);

    useEffect(() => {
        fetchRequests(page).then(({data}) => {
            setList(data.data);
            setTotal(data.meta.total);
        });
    }, []);

    return <div className="w-[250px] pr-2 flex flex-col">
        <div className={"px-3 py-2 rounded flex "+colors}><div className="flex-1">{name}</div><span className="text-gray-300">({total})</span></div>
        <div className="h-7 border-l border-dashed border-gray-400"></div>
        <div className="overflow-auto flex-1">
            {list.map((request: Request, i) => {
                return <React.Fragment key={request.id}>
                    <KanbanItem item={request} colors={colors}/>
                    {(i < list.length - 1) && <div className="h-2 border-l border-dashed border-gray-400"/>}
                </React.Fragment>
            })}
        </div>
    </div>;
}

type KanbanItemProps = {
    item: Request,
    colors: string,
}
function KanbanItem({item, colors}: KanbanItemProps) {
    const {address, phone, contact_phone, email} = useMemo(() => {
        const address = (item.client && item.client.address?.full) || item.addressDB?.full || item.address || null;
        const phone = (item.client && item.client.phones && item.client.phones[0]) || item.client_phone || null;
        const contact_phone = (item.client && item.client.phones && item.client.phones[1]) || item.client_phone_contact || null;
        const email = (item.email && item.email) || (item.client && item.client.email && item.client.email) || null;

        return {address, phone, contact_phone, email};
    }, [item.client, item.address, item.email]);



    return <div className="rounded-md bg-white text-gray-800 overflow-hidden flex">
        <div className={"kanban-item__color "+colors}></div>
        <div className="p-2 flex-1">
            <div className="flex items-start">
                <div className="flex-1 transition-colors leading-4 duration-150 text-gray-800 hover:text-primary-500 cursor-pointer font-semibold">
                    {item.subject || 'Заявка #'+item.id}
                </div>
                <div className="kanban-item__icons">
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
                ? <Link to={`/workers/${item.worker.id}`} className="text-blue-600">{item.worker.name}</Link>
                : <span className="text-blue-600 border-b border-dotted cursor-pointer border-blue-600">Назначить</span>
            }
        </div>
    </div>;
}
