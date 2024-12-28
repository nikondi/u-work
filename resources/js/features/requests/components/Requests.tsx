import LoadingArea from "@/components/LoadingArea";
import HasRole from "@/components/HasRole";
import {Link} from "react-router-dom";
import {Pagination, useResource, useRowContext} from "@/hooks/useResource";
import React, {useCallback, useState} from "react";
import toast from "react-hot-toast";
import {Option, Select} from "@/components/Form";
import {err} from "@/helpers";
import {useEcho} from "@/hooks";
import {RequestsAPI} from "../api";
import {useAuth} from "@/lib/auth";
import {Request} from "@/features/requests";
import {requestTypes} from "../const";
import {stateFunction} from "@/types";
import Icon from "@/Components/Icon";

export function Requests() {
  const [filter, _setFilter] = useState<any>(null);
  const {user} = useAuth();

  const fetchRequests = useCallback((page: number) => {
    return RequestsAPI.get(30, page, {status: 'desc', created_at: 'desc', id: 'desc'}, filter);
  }, [filter]);

  const {list: requestsList, pagination, loading, setPage, page} = useResource<Request>({
    fetch: fetchRequests,
    onFetchError(e) {
      toast.error(`Ошибка при получении заявок ${e?.response?.data?.message ? e.response.data.message : ''}`);
    },
    renderRow() {
      return <RequestRow/>
    },
    pagination: true,
    renderPagination(list, setPage) {
      return <Pagination list={list} setPage={setPage}/>;
    }
  });

  useEcho('requests', '.create', ({data}: { data: Request }) => {
    if (user && (!data.worker || data.worker.id == user.id)) {
      if (page == 1)
        setPage(0);
      toast.success(`Новая заявка #${data.id}`)
    }
  });

  const setFilter = (prop: string, value: any) => {
    const tmp = {...filter};
    if (value !== null)
      tmp[prop] = value;
    else
      delete tmp[prop];

    _setFilter(tmp)
  }

  return (
      <div className="container mx-auto">
        <div className="mb-4 flex gap-x-3 items-start">
          <HasRole roles={['manager']}>
            <Link to="/requests/new" className="btn btn-primary">Добавить</Link>
          </HasRole>
          {/*<button onClick={() => { reFetch() }} className="btn btn-primary">Reload</button>*/}
          <div className="flex items-center gap-x-2">
            Статус:
            <Select className="min-w-40" value={filter?.type} label="Статус заявки" onChange={(val: string) => setFilter('type', val)}>
              <Option value={null} index={-1000}>Не выбрано</Option>
              {Object.keys(requestTypes).map((key, i) =>
                  <Option value={key} key={i} index={i}>{requestTypes[key]}</Option>)}
            </Select>
          </div>
        </div>
        <div className="relative">
          <LoadingArea show={loading}/>
          <div className="requests">
            {requestsList.map((row: any) => row)}
          </div>
          {pagination}
        </div>
      </div>
  )
}

function RequestStatus({status}) {
  let classes = 'w-2.5 h-full';

  switch (status) {
    case 'simple':
      classes += ' bg-orange-500';
      break;
    case 'call':
      classes += ' bg-rose-400';
      break;
    case 'done':
      classes += ' bg-green-600';
      break;
    case 'suggest':
      classes += ' bg-gray-300 dark:bg-gray-500';
      break;
  }

  return <div className={classes}></div>
}

function RequestRow() {
  const {user} = useAuth();
  const {row: request, setRow: setRequest}: { row: Request, setRow: stateFunction<Request> } = useRowContext();
  const [loading, setLoading] = useState(false);

  const takeRequest = () => {
    setLoading(true);
    RequestsAPI
        .update(request.id, {worker_id: user?user.id:null})
        .then(({data}) => setRequest(data))
        .catch(() => err())
        .finally(() => setLoading(false));
  }

  const doneRequest = () => {
    setLoading(true);
    RequestsAPI
        .update(request.id, {type: 'done'})
        .then(({data}) => setRequest(data))
        .catch(() => err())
        .finally(() => setLoading(false));
  }

  return request && <div className="request relative">
    <LoadingArea show={loading}/>
    <div className="request-left">
      <RequestStatus status={request.type}/>
    </div>
    <div className="request-right">
      <div className="request-title flex gap-x-2 items-center">
        <div className="text-orange-500 dark:text-orange-400">#{request.id}</div>
        <div>{request.client ? request.client.name : request.client_name}</div>
      </div>
        <div className="mt-2 flex gap-x-3 flex-wrap gap-y-1.5">
          <span className="request-phone text-gray-800 dark:text-white">
              <Icon icon="locate" size=".95em" />
              <div>{
                  ((request.addressDB && request.client && request.addressDB.id == request.client.address.id) ? request.client.address.full : null)
                  || ((request.addressDB || request.address)
                          ? ((request.addressDB ? (request.addressDB.full) : '') + (request.addressDB && request.address ? ', ' : '') + (request.address || ''))
                          : null
                  )
                  || <span className="text-gray-300">-</span>
              }</div>
          </span>
          <a href={
              (request.client && request.client.phones && request.client.phones[0] && 'tel:' + request.client.phones[0])
              || (request.client_phone && 'tel:' + request.client_phone)
              || '#'
          } className="request-phone">
              <Icon icon="phone" size=".85em" />
              <div>{
                  (request.client && request.client.phones && request.client.phones[0])
                  || request.client_phone
                  || <span className="text-gray-300">-</span>
              }</div>
          </a>
          <a href={
              (request.client && request.client.phones && request.client.phones[1] && 'tel:' + request.client.phones[1])
              || (request.client_phone_contact && 'tel:' + request.client_phone_contact)
              || '#'
          } className="request-phone">
              <Icon icon="phone-o" size=".85em" />
            <div>{
                  (request.client && request.client.phones && request.client.phones[1])
                  || request.client_phone_contact
                  || <span className="text-gray-300">-</span>
              }</div>
          </a>
          <a href={
              (request.email && 'mailto:' + request.email)
              || (request.client && request.client.email && 'mailto:' + request.client.email)
              || '#'
          } className="request-phone">
              <Icon icon="envelope" size=".85em" />
              <div>{
                  (request.email && request.email)
                  || (request.client && request.client.email && request.client.email)
                  || <span className="text-gray-300">-</span>
              }</div>
          </a>
          {(user && (!request.worker || request.worker.id !== user.id)) &&
            <span className="request-phone">
              <svg height=".95em" viewBox="0 0 48 48"><g><path d="M45 33.14c0-4.16.28-8.68-3.17-14.21a2 2 0 0 0-.21-2.46l-2.91-3.11A2 2 0 0 0 36.3 13a20.83 20.83 0 0 0-7.41-3.4 3 3 0 0 0-.81-1.67C27 6.74 26 7 22.08 7a3 3 0 0 0-3 2.59A21.07 21.07 0 0 0 11.7 13c-1.82-1-2.89.88-5.32 3.48a2 2 0 0 0-.21 2.46C2.73 24.45 3 29 3 33.14A4 4 0 0 0 4 41h40a4 4 0 0 0 1-7.86ZM43 33H28l.82-21.37a19.09 19.09 0 0 1 6.23 2.95l-4.47 8.94A2.61 2.61 0 0 0 33 27.29c1.47 0 1.47-.42 7.42-6.81C43.28 25.37 43 29.35 43 33Zm-2.84-15.17c-7.34 7.89-6.82 7.46-7.19 7.46a.61.61 0 0 1-.56-.88l4.84-9.68Zm-18.8-8.52c.39-.41.4-.31 4.56-.31a1 1 0 0 1 1 1L26 33h-4c-1-24.95-1.07-23.25-.64-23.69Zm-10.61 5.42c5.17 10.34 5.16 9.94 4.72 10.38a.6.6 0 0 1-.87 0l-6.76-7.28Zm-3.18 5.75 5.56 6a2.61 2.61 0 0 0 4.25-2.94l-4.47-8.94a19.28 19.28 0 0 1 6.23-2.95L20 33H5c0-4.13-.21-7.75 2.57-12.52ZM44 39H4a2 2 0 0 1 0-4h40a2 2 0 0 1 0 4Z" fill="currentColor"></path></g></svg>
              <div>{
                request.client?.address.object?.worker?.name
                || request.addressDB?.object?.worker?.name
                || request.worker?.name
                || <span className="text-gray-300">-</span>
              }</div>
            </span>
          }
        </div>
        <div className="bg-gray-300 dark:bg-gray-700 mt-2.5" style={{height: 1}}></div>
        <div className="mt-2 whitespace-pre-wrap">{request.content}</div>
        <HasRole roles={['worker']} showAdmin={false}>
          {request.type != 'done' &&
            <div className="bg-gray-300 dark:bg-gray-700 mt-2.5 mb-2" style={{height: 1}}></div>}
            <div className="flex gap-x-3 flex-wrap">
              {!request.worker && <button className="request-button" onClick={takeRequest}>
                <Icon icon="plus" size=".73em" /> Возьмусь
              </button>}
              {request.worker && request.type != 'done' && <button className="request-button" onClick={doneRequest}>
                  <Icon icon="check" size=".73em"/> Готово
              </button>}
            </div>
        </HasRole>
    </div>
  </div>;
}
