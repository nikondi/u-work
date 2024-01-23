import React, {useCallback, useEffect, useMemo, useState} from "react";
import RequestsAPI from "../../API/RequestsAPI";
import {Request} from "./Requests";
import Icon from "../../components/Icon";
import {Link} from "react-router-dom";
import {KanbanContextProvider, useKanbanContext} from "./KanbanContext";

export default function RequestsKanban() {
    return <KanbanContextProvider>
        <div className="flex overflow-x-auto h-full">
            <KanbanList type="simple" name="Новые обращения" colors="bg-orange-500"/>
            <KanbanList type="call" name="Звонки" colors="bg-rose-400"/>
            <KanbanList type="done" name="Завершены" colors="bg-green-600"/>
        </div>
        <Popup/>
    </KanbanContextProvider>;
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
    const {setCurrentRequest} = useKanbanContext();

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
                <div className="kanban-item__subject" onClick={() => setCurrentRequest(item)}>
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
                ? <Link target="_blank" to={`/workers/${item.worker.id}`} className="text-blue-600">{item.worker.name}</Link>
                : <span className="text-blue-600 border-b border-dotted cursor-pointer border-blue-600">Назначить</span>
            }
        </div>
    </div>;
}

function Popup() {
    const {currentRequest, setCurrentRequest} = useKanbanContext();

    return currentRequest && <div className="kanban-popup">
        <div className="kanban-popup__background" onClick={() => setCurrentRequest(null)}></div>
        <div className="kanban-popup__content">
            <div className="kanban-popup__close" onClick={() => setCurrentRequest(null)}>
                <svg width="1em" height="1em" viewBox="0 0 329.269 329"><path d="M194.8 164.77 323.013 36.555c8.343-8.34 8.343-21.825 0-30.164-8.34-8.34-21.825-8.34-30.164 0L164.633 134.605 36.422 6.391c-8.344-8.34-21.824-8.34-30.164 0-8.344 8.34-8.344 21.824 0 30.164l128.21 128.215L6.259 292.984c-8.344 8.34-8.344 21.825 0 30.164a21.266 21.266 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25l128.21-128.214 128.216 128.214a21.273 21.273 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25 8.343-8.34 8.343-21.824 0-30.164zm0 0" fill="currentColor"/></svg>
            </div>

            <div className="text-2xl border-b border-gray-300 pb-2 mb-4">{currentRequest.subject || 'Заявка #'+currentRequest.id}</div>

            <div className="flex flex-col flex-1 gap-y-3 overflow-auto">
                <PopupBlock name="О заявке">
                    <PopupSubBlock name="Комментарий">{currentRequest.content}</PopupSubBlock>
                    <PopupSubBlock name="Ответственный">
                        {currentRequest.worker
                            ? <Link target="_blank" to={`/workers/${currentRequest.worker.id}`} className="text-blue-600">{currentRequest.worker.name}</Link>
                            : <span className="text-blue-600 border-b border-dotted cursor-pointer border-blue-600">Назначить</span>
                        }
                    </PopupSubBlock>
                </PopupBlock>
                <PopupBlock name="Клиент">
                    <div className="mb-2">
                        {currentRequest.client
                            ? <div className="rounded-md bg-gray-50 border border-gray-300 p-2">
                                <div><span className="text-orange-500">#{currentRequest.client.id}</span> {currentRequest.client.name}</div>
                                <div>{currentRequest.client.phone}</div>
                            </div>
                            : <div className="text-gray-500">Не определён</div>
                        }
                    </div>
                    <PopupSubBlock name="Имя">{currentRequest.client_name}</PopupSubBlock>
                    <PopupSubBlock name="Телефон">{currentRequest.client_phone}</PopupSubBlock>
                    <PopupSubBlock name="Контактный телефон">{currentRequest.client_phone_contact}</PopupSubBlock>
                    <PopupSubBlock name="Адрес">{currentRequest.address}</PopupSubBlock>

                </PopupBlock>
            </div>
        </div>
    </div>;
}
function PopupBlock({name, children}) {
    return <div className="bg-gray-100 rounded-md p-4">
        <div className="text-gray-700 uppercase text-xs pb-2 mb-2 border-b border-gray-300">{name}</div>
        <div className="flex flex-col gap-y-2">{children}</div>
    </div>
}
function PopupSubBlock({name, children}) {
    return <div>
        <div className="text-xs text-gray-500">{name}</div>
        <div className="text-base">{children || <span className="text-gray-400">Пусто</span>}</div>
    </div>
}
