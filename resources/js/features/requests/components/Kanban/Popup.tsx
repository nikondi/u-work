import {useKanbanContext} from "./KanbanContext";
import {Link} from "react-router-dom";
import React, {FormEventHandler, useEffect, useMemo, useState} from "react";
import {ClientSelect, WorkerSelect} from "../RequestForm";
import toast from "react-hot-toast";
import {err} from "@/helpers";
import {RequestsAPI} from "../../api";
import {default_columns} from "../../const";
import LoadingArea from "@/components/LoadingArea";
import Icon from "@/components/Icon";
import {Select, Option} from "@/components/Form";
import {AddressSelect} from "@/features/search_selects";

export default function Popup() {
  const {currentRequest, setCurrentRequest} = useKanbanContext();
  const [oldRequest, setOldRequest] = useState(JSON.parse(JSON.stringify(currentRequest)));
  const [loading, setLoading] = useState(false);

  const [editMode, setEditMode] = useState(false);

  const onKeyUp = (e: KeyboardEvent) => {
    if(e.key == 'Escape')
      setCurrentRequest(null);
  }

  const isEdit = useMemo(() => {
    return currentRequest.id == 0 || editMode;
  }, [currentRequest.id, editMode]);

  useEffect(() => {
    if(currentRequest.id != 0) {
      setLoading(true);
      RequestsAPI.single(currentRequest.id)
          .then((data) => setCurrentRequest(data))
          .catch(e => err('Ошибка при загрузке: '+e.message))
          .finally(() => setLoading(false));
    }
  }, []);

  const save: FormEventHandler = (e) => {
    e.preventDefault();

    const data = {...currentRequest,
        address_id: currentRequest.addressDB?.id || null,
        client_id: currentRequest.client?.id || null,
        worker_id: currentRequest.worker?.id || null
    };

    setLoading(true);

    if(currentRequest.id == 0) {
      RequestsAPI.create(data)
          .then(r => {
            toast.success('Заявка добавлена #'+r.data.id);
            setCurrentRequest(r.data);
          })
          .catch(e => err('Произошла ошибка: '+e.message))
          .finally(() => setLoading(false));
    }
    else {
      RequestsAPI.update(currentRequest.id, data)
          .then(r => {
            toast.success('Заявка #'+r.data.id+' сохранена');
            setCurrentRequest(r.data);
            setEditMode(false);
            setOldRequest(JSON.parse(JSON.stringify(r.data)))
          })
          .catch(e => err('Произошла ошибка: '+e.message))
            .finally(() => setLoading(false));
    }
  }
  const discard = () => {
    if(currentRequest.id == 0)
      setCurrentRequest(null);
    else {
      setCurrentRequest(oldRequest)
      setEditMode(false);
    }
  }

  const column = useMemo(() => {
    return default_columns.find(c => c.id === currentRequest.type);
  }, [currentRequest.type]);

  useEffect(() => {
    window.addEventListener('keyup', onKeyUp);
    return () => window.removeEventListener('keyup', onKeyUp);
  }, []);

  return <form onSubmit={save}>
      <LoadingArea show={loading}/>
      <div className="text-2xl border-b border-gray-300 pb-2 mb-4 flex gap-x-2">
        <div className="flex-1">{isEdit
          ? <input value={currentRequest.subject || ''} onChange={e => setCurrentRequest({...currentRequest, subject: e.target.value})} className="kanban-popup__input" placeholder="Название" />
          : <>{currentRequest.subject || 'Заявка #'+currentRequest.id} <button type="button" onClick={() => setEditMode(true)}><Icon icon="pencil" width="20" height="20"/></button></>
        }</div>
        {currentRequest.id && <div className="text-orange-500 text-xl">#{currentRequest.id}</div>}
      </div>

      {column && <div className={"mt-0.5 mb-2 py-2 px-3 text-white rounded "+column.colors}>{column.title}</div>}

      <div className="flex flex-col flex-1 gap-y-3">
        <Block name="О заявке">
          <SubBlock name="Комментарий" contentClassName="whitespace-pre-wrap">
            {isEdit
              ? <div className="mt-2">
                <textarea value={currentRequest.content || ''} onChange={e => setCurrentRequest({...currentRequest, content: e.target.value})} placeholder="Комментарий" className="kanban-popup__textarea"/>
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
              <PopupWorker setEditMode={setEditMode}/>
          </Block>

          <Block name="Клиент">
              <div className="mb-2">
                <PopupClient setEditMode={setEditMode}/>
              </div>
              {(!currentRequest.client || !isEdit) && <>
                <SubBlock name="Имя" required={isEdit && !currentRequest.client_name}>{isEdit
                  ? <input className="kanban-popup__input mt-1" value={currentRequest.client_name || ''} onChange={e => setCurrentRequest({...currentRequest, client_name: e.target.value})} placeholder="Имя" required={true} />
                  : currentRequest.client_name
                }</SubBlock>
                <SubBlock name="Телефон" required={isEdit && !currentRequest.client_phone && !currentRequest.email}>{isEdit
                  ? <input className="kanban-popup__input mt-1" value={currentRequest.client_phone} onChange={e => setCurrentRequest({...currentRequest, client_phone: e.target.value})} placeholder="Телефон" required={!currentRequest.client_phone && !currentRequest.email} />
                  : (currentRequest.client_phone?<a href={"tel:"+currentRequest.client_phone || ''} className="link"><Icon icon="phone"/> {currentRequest.client_phone}</a>:null)
                }</SubBlock>
                <SubBlock name="E-mail" required={isEdit && !currentRequest.client_phone && !currentRequest.email}>{isEdit
                  ? <input className="kanban-popup__input mt-1" value={currentRequest.email || ''} onChange={e => setCurrentRequest({...currentRequest, email: e.target.value})} placeholder="E-mail" required={!currentRequest.client_phone && !currentRequest.email}/>
                  : (currentRequest.email?<a href={"mailto:"+currentRequest.email} className="link"><Icon icon="envelope"/> {currentRequest.email}</a>:null)
                }</SubBlock>
              </>}
              <SubBlock name="Контактный телефон">{isEdit
                  ? <input className="kanban-popup__input mt-1" value={currentRequest.client_phone_contact || ''} onChange={e => setCurrentRequest({...currentRequest, client_phone_contact: e.target.value})} placeholder="Контактный телефон" />
                  : (currentRequest.client_phone_contact?<a href={"tel:"+currentRequest.client_phone_contact} className="link"><Icon icon="phone"/> {currentRequest.client_phone_contact}</a>:null)
              }</SubBlock>
          </Block>
        <Block name="Адрес">
          <div className="mb-2">
            <PopupAddress setEditMode={setEditMode}/>
          </div>
          {(isEdit && currentRequest.addressDB)
            ? <PopupAddressAdditional/>
            : <SubBlock name="Адрес">{isEdit
              ? <input className="kanban-popup__input mt-1" value={currentRequest.address || ''} onChange={e => setCurrentRequest({...currentRequest, address: e.target.value})} placeholder="Адрес" />
              : currentRequest.address
            }</SubBlock>
          }
        </Block>
      </div>
      {isEdit && <Save>
        <button className="btn btn-gray px-3 py-2" type="button" onClick={discard}>Отменить</button>
        <button className="btn btn-primary px-3 py-2" type="submit">Сохранить</button>
      </Save>}
    </form>;
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

function PopupWorker({setEditMode}) {
  const [edit, setEdit] = useState(false);
  const {currentRequest, setCurrentRequest} = useKanbanContext();

  return (currentRequest.worker && !edit)
      ? <div>
        <div className="rounded-md bg-gray-50 border border-gray-300 p-2 mt-2">
          <Link target="_blank" to={`/workers/${currentRequest.worker.id}`} className="text-blue-600">{currentRequest.worker.name}</Link>
        </div>
        <span className="dotted-btn" onClick={() => {setEdit(true); setEditMode(true)}}>Изменить</span>
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
              <span className="dotted-btn" onClick={() => {setEdit(true); setEditMode(true)}}>Назначить</span>
          </div>)

}

function PopupClient({setEditMode}) {
  const [edit, setEdit] = useState(false);
  const {currentRequest, setCurrentRequest} = useKanbanContext();

  return (currentRequest.client && !edit)
      ? <>
        <div className="rounded-md bg-gray-50 border border-gray-300 p-2 mt-2">
          <Link target="_blank" to={`/clients/${currentRequest.client.id}`} className="text-blue-600"><span className="text-orange-500">#{currentRequest.client.id}</span> {currentRequest.client.name} <span className="text-xs text-gray-400">{currentRequest.client.address.full}</span></Link>
        </div>
        <span className="dotted-btn" onClick={() => {setEdit(true); setEditMode(true)}}>Изменить</span>
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

function PopupAddress({setEditMode}) {
  const [edit, setEdit] = useState(false);
  const {currentRequest, setCurrentRequest} = useKanbanContext();

  return (currentRequest.addressDB && !edit)
      ? <>
        <div className="rounded-md bg-gray-50 border border-gray-300 p-2 mt-2">
          <Link target="_blank" to={`/addresses/${currentRequest.addressDB.id}`} className="text-blue-600">{currentRequest.addressDB.full}</Link>
        </div>
        <span className="dotted-btn" onClick={() => {setEdit(true); setEditMode(true)}}>Изменить</span>
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
