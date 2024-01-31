import {useKanbanContext} from "./KanbanContext";
import {Link} from "react-router-dom";
import Icon from "../../../components/Icon";
import React, {useEffect, useMemo, useState} from "react";
import Select, {Option} from "../../../components/Form/Select/Select";
import {AddressSelect, ClientSelect, WorkerSelect} from "../RequestForm";
import axiosClient from "../../../axios-client";
import toast from "react-hot-toast";
import {err} from "../../../helpers";
import {default_columns} from "./RequestsKanban";

export default function Popup() {
  const {currentRequest, setCurrentRequest} = useKanbanContext();
  const oldRequest = JSON.parse(JSON.stringify(currentRequest));

  const onKeyUp = (e: KeyboardEvent) => {
    if(e.key == 'Escape')
      setCurrentRequest(null);
  }

  const isEdit = useMemo(() => {
    return currentRequest.id == 0;
  }, [currentRequest.id]);

  const save = (e) => {
    e.preventDefault();

    const data = {...currentRequest,
        address_id: currentRequest.addressDB?.id || null,
        client_id: currentRequest.client?.id || null,
        worker_id: currentRequest.worker?.id || null
    };

    if(currentRequest.id == 0) {
      axiosClient.post('/requests', data).then(r => {
        toast.success('Заявка добавлена #'+r.data.id);
        setCurrentRequest(r.data);
      }).catch(e => err('Произошла ошибка: '+e.message));
    }
  }
  const discard = () => {
    if(currentRequest.id == 0)
      setCurrentRequest(null);
    else
      setCurrentRequest(oldRequest)
  }

  const column = useMemo(() => {
    return default_columns.find(c => c.id === currentRequest.type);
  }, [currentRequest.type]);

  useEffect(() => {
    window.addEventListener('keyup', onKeyUp);
    return () => window.removeEventListener('keyup', onKeyUp);
  }, []);

  return <div className="kanban-popup">
    <div className="kanban-popup__background" onClick={() => setCurrentRequest(null)}></div>
    <form onSubmit={save} className="kanban-popup__content">
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

        {column && <div className={"mt-0.5 mb-2 py-2 px-3 text-white rounded "+column.colors}>{column.title}</div>}

        <div className="flex flex-col flex-1 gap-y-3">
          <Block name="О заявке">
            <SubBlock name="Комментарий" contentClassName="whitespace-pre-wrap">
              {isEdit
                ? <div className="mt-2">
                  <textarea value={currentRequest.content} onChange={e => setCurrentRequest({...currentRequest, content: e.target.value})} placeholder="Комментарий" className="kanban-popup__textarea"/>
                </div>
                : currentRequest.content
              }
            </SubBlock>
            <SubBlock name="Источник">
              {currentRequest.source == 'uniwork' && 'Добавлено оператором'}
              {currentRequest.source == 'unisite' && 'С сайта uniphone.su'}
              {currentRequest.source == 'tomoru' && 'Звонок Tomoru'}
            </SubBlock>
          </Block>
            <Block name="Ответственный">
                <PopupWorker/>
            </Block>

            <Block name="Клиент">
                <div className="mb-2">
                  <PopupClient/>
                </div>
                {(!currentRequest.client || !isEdit) && <>
                  <SubBlock name="Имя" required={isEdit && !currentRequest.client_name}>{isEdit
                    ? <input className="kanban-popup__input mt-1" value={currentRequest.client_name} onChange={e => setCurrentRequest({...currentRequest, client_name: e.target.value})} placeholder="Имя" required={true} />
                    : currentRequest.client_name
                  }</SubBlock>
                  <SubBlock name="Телефон" required={isEdit && !currentRequest.client_phone && !currentRequest.email}>{isEdit
                    ? <input className="kanban-popup__input mt-1" value={currentRequest.client_phone} onChange={e => setCurrentRequest({...currentRequest, client_phone: e.target.value})} placeholder="Телефон" required={!currentRequest.client_phone && !currentRequest.email} />
                    : (currentRequest.client_phone?<a href={"tel:"+currentRequest.client_phone} className="link"><Icon icon="phone"/> {currentRequest.client_phone}</a>:null)
                  }</SubBlock>
                  <SubBlock name="E-mail" required={isEdit && !currentRequest.client_phone && !currentRequest.email}>{isEdit
                    ? <input className="kanban-popup__input mt-1" value={currentRequest.email} onChange={e => setCurrentRequest({...currentRequest, email: e.target.value})} placeholder="E-mail" required={!currentRequest.client_phone && !currentRequest.email}/>
                    : (currentRequest.email?<a href={"mailto:"+currentRequest.email} className="link"><Icon icon="envelope"/> {currentRequest.email}</a>:null)
                  }</SubBlock>
                </>}
                <SubBlock name="Контактный телефон">{isEdit
                    ? <input className="kanban-popup__input mt-1" value={currentRequest.client_phone_contact} onChange={e => setCurrentRequest({...currentRequest, client_phone_contact: e.target.value})} placeholder="Контактный телефон" />
                    : (currentRequest.client_phone_contact?<a href={"tel:"+currentRequest.client_phone_contact} className="link"><Icon icon="phone"/> {currentRequest.client_phone_contact}</a>:null)
                }</SubBlock>
            </Block>
          <Block name="Адрес">
            <div className="mb-2">
              <PopupAddress/>
            </div>
            {(isEdit && currentRequest.addressDB)
              ? <PopupAddressAdditional/>
              : <SubBlock name="Адрес" required={isEdit && !currentRequest.addressDB && !currentRequest.client && !currentRequest.address}>{isEdit
                ? <input className="kanban-popup__input mt-1" value={currentRequest.address} onChange={e => setCurrentRequest({...currentRequest, address: e.target.value})} placeholder="Адрес" required={!currentRequest.addressDB && !currentRequest.client && !currentRequest.address} />
                : currentRequest.address
              }</SubBlock>
            }
          </Block>
        </div>
      </div>
      {isEdit && <Save>
        <button className="btn btn-gray px-3 py-2" type="button" onClick={discard}>Отменить</button>
        <button className="btn btn-primary px-3 py-2" type="submit">Сохранить</button>
      </Save>}
    </form>
  </div>;
}
function Block({name, children}) {
  return <div className="bg-gray-100 rounded-md p-4">
    <div className="text-gray-700 uppercase text-xs pb-2 mb-2 border-b border-gray-300">{name}</div>
    <div className="flex flex-col gap-y-2">{children}</div>
  </div>
}
function SubBlock({name, contentClassName = "", required = false, children}) {
  return <div>
    <div className="text-xs text-gray-500">{name} {required && <span className="text-red-500 text-2xl" style={{lineHeight: '7px'}}>•</span>}</div>
    <div className={"text-base "+contentClassName}>{children || <span className="text-gray-400">Пусто</span>}</div>
  </div>
}

function Save({children}) {
  return <div className="h-20">
    <div className="absolute shadow-md bottom-0 left-0 right-0 p-4 bg-white flex justify-end gap-x-3">
      {children}
    </div>
  </div>
}

function PopupAddressAdditional() {
  const [apartment, setApartment] = useState('');
  const [floor, setFloor] = useState('');
  const {currentRequest, setCurrentRequest} = useKanbanContext();

  const filterNumber = (value: string) => {
    return value.replace(/\D/g, '');
  }

  useEffect(() => {
    setCurrentRequest({...currentRequest, address: 'кв. '+apartment+', '+floor+' этаж'});
  }, [floor, apartment]);

  return <>
    <SubBlock name="Квартира">
      <input type="text" className="kanban-popup__input mt-1" value={apartment} onChange={e => setApartment(filterNumber(e.target.value))} placeholder="Квартира" />
    </SubBlock>
    <SubBlock name="Этаж">
      <input type="text" className="kanban-popup__input mt-1" value={floor} onChange={e => setFloor(filterNumber(e.target.value))} placeholder="Этаж" />
    </SubBlock>
  </>
}

function PopupWorker() {
  const [edit, setEdit] = useState(false);
  const {currentRequest, setCurrentRequest} = useKanbanContext();

  return (currentRequest.worker && !edit)
      ? <div>
        <div className="rounded-md bg-gray-50 border border-gray-300 p-2 mt-2">
          <Link target="_blank" to={`/workers/${currentRequest.worker.id}`} className="text-blue-600">{currentRequest.worker.name}</Link>
        </div>
        <span className="dotted-btn" onClick={() => setEdit(true)}>Изменить</span>
      </div>
      : (edit
        ? <div className="mt-2">
          <Select label="Выбрать исполнителя" value={currentRequest.worker} onChange={v => setCurrentRequest({...currentRequest, worker: v})}>
            <Option index={-1001} value={null}>Не выбрано</Option>
            <WorkerSelect worker={currentRequest.worker}/>
          </Select>
          <span className="dotted-btn" onClick={() => setEdit(false)}>Сохранить</span>
        </div>
        : <div>
              <div className="text-gray-400 text-base">Не назначен</div>
              <span className="dotted-btn" onClick={() => setEdit(true)}>Назначить</span>
          </div>)

}

function PopupClient() {
  const [edit, setEdit] = useState(false);
  const {currentRequest, setCurrentRequest} = useKanbanContext();

  return (currentRequest.client && !edit)
      ? <>
        <div className="rounded-md bg-gray-50 border border-gray-300 p-2 mt-2">
          <Link target="_blank" to={`/clients/${currentRequest.client.id}`} className="text-blue-600"><span className="text-orange-500">#{currentRequest.client.id}</span> {currentRequest.client.name} <span className="text-xs text-gray-400">{currentRequest.client.address.full}</span></Link>
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
          <Link target="_blank" to={`/addresses/${currentRequest.addressDB.id}`} className="text-blue-600">{currentRequest.addressDB.full}</Link>
        </div>
        <span className="dotted-btn" onClick={() => setEdit(true)}>Изменить</span>
      </>
      : (edit
        ? <div className="mt-2">
          <Select label="Выбрать адрес" value={currentRequest.addressDB} onChange={v => setCurrentRequest({...currentRequest, addressDB: v})}>
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
