import React from "react";
import {SubBlock} from "@/Components/SidePopup";
import {Empty, Icon} from "@/Components";
import {Edit, Show, useEditable} from "@/Contexts/EditableContext";
import {Input} from "@/Components/Form";
import {usePage} from "@inertiajs/react";
import {TKanbanPageProps} from "@/Features/Kanban/types";

export default function Client() {
  const {isEdit} = useEditable();
  const {request} = usePage<TKanbanPageProps>().props;

  return <>
    <div className="mb-2">
      {request.client && <a target="_blank" href={`/clients/${request.client.id}`} className="rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-500 p-2 mt-2 text-blue-600 dark:text-blue-400 flex gap-x-1">
        <span className="text-orange-500">#{request.client.id}</span>
        {request.client.name}
        {/*<span className="text-xs text-gray-400">{request.client.address.full}</span>*/}
      </a>}
      {/*{(currentRequest.client && !edit)
        ? <>
          <div className="rounded-md bg-gray-50 border border-gray-300 p-2 mt-2">
            <Link target="_blank" to={`/clients/${currentRequest.client.id}`} className="text-blue-600"><span
              className="text-orange-500">#{currentRequest.client.id}</span> {currentRequest.client.name} <span
              className="text-xs text-gray-400">{currentRequest.client.address.full}</span></Link>
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
          </div>}*/}
    </div>
    {
      !request.client && <>
        <SubBlock name="Имя" required={isEdit && !request.client_name.trim()}>
          <Edit>
            <Input name="client_name" placeholder="Имя" className="kanban-popup__input mt-1" required/>
          </Edit>
          <Show>
            <Empty>{request.client_name}</Empty>
          </Show>
        </SubBlock>
        <SubBlock name="Телефон" required={isEdit && !request.client_phone.trim()}>
          <Edit>
            <Input name="client_phone" placeholder="Телефон" className="kanban-popup__input mt-1" required/>
          </Edit>
          <Show>
            <Empty>{request.client_phone && <a href={"tel:"+request.client_phone} className="link"><Icon icon="phone"/> {request.client_phone}</a>}</Empty>
          </Show>
        </SubBlock>
        <SubBlock name="E-mail" required={isEdit && !request.email.trim()}>
          <Edit>
            <Input name="email" placeholder="E-mail" className="kanban-popup__input mt-1" required/>
          </Edit>
          <Show>
            <Empty>{request.email && <a href={"mailto:"+request.email} className="link"><Icon icon="envelope"/> {request.email}</a>}</Empty>
          </Show>
        </SubBlock>
      </>
    }
    <SubBlock name="Контактный телефон">
      <Edit>
        <Input name="client_phone_contact" placeholder="Контактный телефон" className="kanban-popup__input mt-1"/>
      </Edit>
      <Show>
        <Empty>{request.client_phone_contact && <a href={"tel:"+request.client_phone_contact} className="link"><Icon icon="phone"/> {request.client_phone_contact}</a>}</Empty>
      </Show>
    </SubBlock>

  </>
}
