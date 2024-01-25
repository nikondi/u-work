import {useKanbanContext} from "./KanbanContext";
import {Link} from "react-router-dom";
import Icon from "../../../components/Icon";
import React, {useEffect, useMemo, useState} from "react";
import Select, {Option} from "../../../components/Form/Select/Select";
import {AddressSelect, ClientSelect, WorkerSelect} from "../RequestForm";

export default function Popup() {
    const {currentRequest, setCurrentRequest} = useKanbanContext();

    const onKeyUp = (e: KeyboardEvent) => {
        if(e.key == 'Escape')
            setCurrentRequest(null);
    }

    const isEdit = useMemo(() => {
        return currentRequest.id == 0;
    }, [currentRequest.id]);

    useEffect(() => {
        window.addEventListener('keyup', onKeyUp);
        return () => window.removeEventListener('keyup', onKeyUp);
    }, []);

    return <div className="kanban-popup">
        <div className="kanban-popup__background" onClick={() => setCurrentRequest(null)}></div>
        <div className="kanban-popup__content">
            <div className="kanban-popup__close" onClick={() => setCurrentRequest(null)}>
                <svg width="1em" height="1em" viewBox="0 0 329.269 329"><path d="M194.8 164.77 323.013 36.555c8.343-8.34 8.343-21.825 0-30.164-8.34-8.34-21.825-8.34-30.164 0L164.633 134.605 36.422 6.391c-8.344-8.34-21.824-8.34-30.164 0-8.344 8.34-8.344 21.824 0 30.164l128.21 128.215L6.259 292.984c-8.344 8.34-8.344 21.825 0 30.164a21.266 21.266 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25l128.21-128.214 128.216 128.214a21.273 21.273 0 0 0 15.082 6.25c5.46 0 10.922-2.09 15.082-6.25 8.343-8.34 8.343-21.824 0-30.164zm0 0" fill="currentColor"/></svg>
            </div>
            <div className="overflow-auto py-4 px-6 h-full">
                <div className="text-2xl border-b border-gray-300 pb-2 mb-4">
                    {isEdit
                        ? <input value={currentRequest.subject} onChange={e => setCurrentRequest({...currentRequest, subject: e.target.value})} className="kanban-popup__input" placeholder="Название" />
                        : (currentRequest.subject || 'Заявка #'+currentRequest.id)
                    }
                </div>

                <div className="flex flex-col flex-1 gap-y-3">
                    <PopupBlock name="О заявке">
                        <PopupSubBlock name="Комментарий" contentClassName="whitespace-pre-wrap">
                            {isEdit
                                ? <div className="mt-2">
                                    <textarea value={currentRequest.content} onChange={e => setCurrentRequest({...currentRequest, content: e.target.value})} placeholder="Комментарий" className="kanban-popup__textarea"/>
                                </div>
                                : currentRequest.content
                            }
                        </PopupSubBlock>
                        <PopupSubBlock name="Ответственный">
                            <PopupWorker/>
                        </PopupSubBlock>
                        <PopupSubBlock name="Источник">
                            {currentRequest.source == 'uniwork' && 'Добавлено оператором'}
                            {currentRequest.source == 'unisite' && 'С сайта uniphone.su'}
                            {currentRequest.source == 'tomoru' && 'Звонок Tomoru'}
                        </PopupSubBlock>
                    </PopupBlock>
                    <PopupBlock name="Клиент">
                        <div className="mb-2">
                            <PopupClient/>
                        </div>
                        <PopupSubBlock name="Имя">{isEdit
                            ? <input className="kanban-popup__input mt-1" value={currentRequest.client_name} onChange={e => setCurrentRequest({...currentRequest, client_name: e.target.value})} placeholder="Имя" />
                            : currentRequest.client_name
                        }</PopupSubBlock>
                        <PopupSubBlock name="Телефон">{isEdit
                            ? <input className="kanban-popup__input mt-1" value={currentRequest.client_phone} onChange={e => setCurrentRequest({...currentRequest, client_phone: e.target.value})} placeholder="Телефон" />
                            : (currentRequest.client_phone?<a href={"tel:"+currentRequest.client_phone} className="link"><Icon icon="phone"/> {currentRequest.client_phone}</a>:null)
                        }</PopupSubBlock>
                        <PopupSubBlock name="Контактный телефон">{isEdit
                            ? <input className="kanban-popup__input mt-1" value={currentRequest.client_phone_contact} onChange={e => setCurrentRequest({...currentRequest, client_phone_contact: e.target.value})} placeholder="Контактный телефон" />
                            : (currentRequest.client_phone_contact?<a href={"tel:"+currentRequest.client_phone_contact} className="link"><Icon icon="phone"/> {currentRequest.client_phone_contact}</a>:null)
                        }</PopupSubBlock>
                        <PopupSubBlock name="E-mail">{isEdit
                            ? <input className="kanban-popup__input mt-1" value={currentRequest.email} onChange={e => setCurrentRequest({...currentRequest, email: e.target.value})} placeholder="E-mail" />
                            : (currentRequest.email?<a href={"mailto:"+currentRequest.email} className="link"><Icon icon="envelope"/> {currentRequest.email}</a>:null)
                        }</PopupSubBlock>
                    </PopupBlock>
                    <PopupBlock name="Адрес">
                        <div className="mb-2">
                            <PopupAddress/>
                        </div>
                        <PopupSubBlock name="Адрес">{isEdit
                            ? <input className="kanban-popup__input mt-1" value={currentRequest.address} onChange={e => setCurrentRequest({...currentRequest, address: e.target.value})} placeholder="Адрес" />
                            : currentRequest.address
                        }</PopupSubBlock>
                    </PopupBlock>
                </div>
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
function PopupSubBlock({name, contentClassName = "", children}) {
    return <div>
        <div className="text-xs text-gray-500">{name}</div>
        <div className={"text-base "+contentClassName}>{children || <span className="text-gray-400">Пусто</span>}</div>
    </div>
}


function PopupWorker() {
    const [edit, setEdit] = useState(false);
    const {currentRequest, setCurrentRequest} = useKanbanContext();

    return (currentRequest.worker && !edit)
            ? <>
                <div className="rounded-md bg-gray-50 border border-gray-300 p-2 mt-2">
                    <Link target="_blank" to={`/workers/${currentRequest.worker.id}`} className="text-blue-600">{currentRequest.worker.name}</Link>
                </div>
                <span className="dotted-btn" onClick={() => setEdit(true)}>Изменить</span>
            </>
            : (edit
                ? <div className="mt-2">
                    <Select label="Выбрать исполнителя" value={currentRequest.worker} onChange={v => setCurrentRequest({...currentRequest, worker: v})}>
                        <WorkerSelect worker={currentRequest.worker}/>
                    </Select>
                    <span className="dotted-btn" onClick={() => setEdit(false)}>Сохранить</span>
                </div>
                : <span className="dotted-btn" onClick={() => setEdit(true)}>Назначить</span>)

}

function PopupClient() {
    const [edit, setEdit] = useState(false);
    const {currentRequest, setCurrentRequest} = useKanbanContext();

    return (currentRequest.client && !edit)
            ? <>
                <div className="rounded-md bg-gray-50 border border-gray-300 p-2 mt-2">
                    <Link target="_blank" to={`/clients/${currentRequest.client.id}`} className="text-blue-600"><span className="text-orange-500">#{currentRequest.client.id}</span> {currentRequest.client.name}</Link>
                </div>
                <span className="dotted-btn" onClick={() => setEdit(true)}>Изменить</span>
            </>
            : (edit
                ? <div className="mt-2">
                    <Select label="Выбрать клиента" value={currentRequest.client} onChange={v => setCurrentRequest({...currentRequest, client: v})}>
                        <Option index={-1001} value={null}>Не выбрано</Option>
                        <ClientSelect client={currentRequest.client}/>
                    </Select>
                    <span className="dotted-btn" onClick={() => setEdit(false)}>Сохранить</span>
                </div>
                : <div>
                    <div className="text-gray-400 text-base">Не выбран</div>
                    <span className="dotted-btn" onClick={() => setEdit(true)}>Выбрать</span>
                </div>
        )

}

function PopupAddress() {
    const [edit, setEdit] = useState(false);
    const {currentRequest, setCurrentRequest} = useKanbanContext();

    return (currentRequest.addressDB && !edit)
            ? <>
                <div className="rounded-md bg-gray-50 border border-gray-300 p-2 mt-2">
                    <Link target="_blank" to={`/addresses/${currentRequest.client.id}`} className="text-blue-600">{currentRequest.addressDB.full}</Link>
                </div>
                <span className="dotted-btn" onClick={() => setEdit(true)}>Изменить</span>
            </>
            : (edit
                ? <div className="mt-2">
                    <Select label="Выбрать адрес" value={currentRequest.client} onChange={v => setCurrentRequest({...currentRequest, addressDB: v})}>
                        <Option index={-1001} value={null}>Не выбрано</Option>
                        <AddressSelect address={currentRequest.addressDB}/>
                    </Select>
                    <span className="dotted-btn" onClick={() => setEdit(false)}>Сохранить</span>
                </div>
                : <div>
                    <div className="text-gray-400 text-base">Не выбран</div>
                    <span className="dotted-btn" onClick={() => setEdit(true)}>Выбрать</span>
                </div>
        )

}
