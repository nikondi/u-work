import {usePage} from "@inertiajs/react";
import {TKanbanPageProps} from "../../types";
import {Form, FormHandler, Input, Textarea} from "@/Components/Form";
import {IRequestForm} from "@/Features/Requests/types";
import {Edit, EditToggle, Show, useEditable} from "@/Contexts/EditableContext";
import {Icon, Save} from "@/Components";
import {Block, SubBlock} from "@/Components/SidePopup";
import {getColumnColor, getColumnLabel, getRequestSourceLabel} from "@/Features/Kanban/helpers";
import toast from "react-hot-toast";
import {Client} from "./RequestFormPartials";

const baseData: IRequestForm = {
  client_id: null,
  type: 'simple',
  source: 'uniwork',
  subject: '',
  worker_id: null,
  address_id: null,
  email: '',
  client_name: '',
  client_phone: '',
  client_phone_contact: '',
  address: '',
  content: '',
  status: 'new'
}

export default function RequestForm() {
  const {request} = usePage<TKanbanPageProps>().props;
  const {setIsEdit} = useEditable();

  const onSubmit: FormHandler<IRequestForm> = (form) => {
    if (request.id > 0) {
      form.put(route('requests.update', [request.id]), {
        onSuccess: () => setIsEdit(false),
        onError: (r) => {
          toast.error('Произошла ошибка');
          console.error(r);
        }
      })
    }
  }

  const data: IRequestForm = request
    ? {
      type: request.type,
      source: request.source,
      subject: request.subject,
      client_id: request.client?.id,
      worker_id: request.worker?.id,
      address_id: request.addressDB?.id,
      address: request.address,
      email: request.email,
      client_name: request.client_name,
      client_phone: request.client_phone,
      client_phone_contact: request.client_phone_contact,
      content: request.content,
      status: request.status
    }
    : baseData;

  return <Form onSubmit={onSubmit} initialData={data}>
    <div className="text-2xl dark:text-white border-b border-gray-300 pb-2 mb-4 flex gap-x-2 items-center">
      <Edit>
        <Input name="subject" className="kanban-popup__input text-xl flex-1" placeholder="Название"/>
      </Edit>
      <Show>
        <div className="flex-1">{data.subject || 'Заявка #' + request.id}</div>
        {request && <EditToggle component={(setIsEdit) =>
          <button type="button" onClick={() => setIsEdit(true)}><Icon icon="pencil" width="20" height="20"/>
          </button>}>
        </EditToggle>}
      </Show>
      {request && <div className="text-orange-500 text-xl">#{request.id}</div>}
    </div>

    {data.type && <div className={"mt-0.5 mb-2 py-2 px-3 text-white rounded " + getColumnColor(data.type)}>{getColumnLabel(data.type)}</div>}

    <div className="flex flex-col flex-1 gap-y-3">
      <Block name="О заявке">
        <SubBlock name="Комментарий" contentClassName="whitespace-pre-wrap">
          <Edit>
            <div className="mt-2">
              <Textarea name="content" placeholder="Комментарий" className="kanban-popup__textarea"/>
            </div>
          </Edit>
          <Show>
            {data.content}
          </Show>
        </SubBlock>
        <SubBlock name="Источник">
          {getRequestSourceLabel(data.source)}
        </SubBlock>
      </Block>

      <Block name="Клиент">
        <Client/>
      </Block>

      <Block name="Ответственный">
        {/*<PopupWorker setEditMode={setEditMode}/>*/}
      </Block>

      <Block name="Адрес">
        {/*<div className="mb-2">
          <PopupAddress setEditMode={setEditMode}/>
        </div>
        {(isEdit && currentRequest.addressDB)
          ? <PopupAddressAdditional/>
          : <SubBlock name="Адрес">{isEdit
            ? <input className="kanban-popup__input mt-1" value={currentRequest.address || ''} onChange={e => setCurrentRequest({...currentRequest, address: e.target.value})} placeholder="Адрес" />
            : currentRequest.address
          }</SubBlock>
        }*/}
      </Block>
    </div>
    <Edit>
      <Save>
        <EditToggle component={(setIsEdit) =>
          <button className="btn btn-gray px-3 py-2" type="button" onClick={() => setIsEdit(false)}>Отменить</button>}>
        </EditToggle>
        <button className="btn btn-primary px-3 py-2" type="submit">Сохранить</button>
      </Save>
    </Edit>
  </Form>
}
