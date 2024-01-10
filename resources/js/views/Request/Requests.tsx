import LoadingArea from "../../components/LoadingArea.jsx";
import {Link} from "react-router-dom";
import HasRole from "../../components/HasRole";
import useResource, {PagiLink} from "../../components/Resource/hooks/useResource";
import RequestsAPI from "../../API/RequestsAPI.js";
import React, {ReactElement, useCallback, useState} from "react";
import {Client} from "../Client/Clients";
import toast from "react-hot-toast";
import Select, {Option} from "../../components/Form/Select/Select";
import {useStateContext} from "../../contexts/ContextProvider";

export type RequestStatus = 'new' | 'done' | 'important' | 'unknown';

export type Request = {
    id:number,
    client?: Client,
    worker: | user | null,
    client_name?: string,
    client_phone: number|string,
    client_phone_contact?: number|string,
    addressDB?: Address,
    address?: string,
    content: string,
    status: RequestStatus
}

export default function Requests() {
    const {user} = useStateContext();
    const [filter, _setFilter] = useState<any>(user.hasRole('worker', 'manager', 'admin')?{status: 'new'}:null);

    const fetchRequests = useCallback((page: number) => {
        return RequestsAPI.get(30, page, {created_at: 'desc', id: 'desc'}, filter);
    }, [filter]);

    const [requests, pagination, loading]:any[] = useResource({
        fetch: fetchRequests,
        onFetchError(e) {
            toast.error(`Ошибка при получении заявок ${e?.response?.data?.message?e.response.data.message:''}`);
        },
        renderRow(request:Request) {
            return <RequestRow request={request}/>
        },
        pagination: true,
        renderPagination(list, setPage) {
            return <Pagination list={list} setPage={setPage}/>;
        }
    });

    const setFilter = (prop:string, value:any) => {
        const tmp = {...filter};
        if(value !== null)
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
                <Select className="min-w-40" value={filter?.status} label="Статус заявки" onChange={(val) => setFilter('status', val as string)}>
                    <Option value={null} index={-1000}>Не выбрано</Option>
                    {Object.keys(requestTypes).map((key, i) => <Option value={key} key={i} index={i}>{requestTypes[key]}</Option>)}
                </Select>
            </div>
            <div className="relative">
                <LoadingArea show={loading}/>
                <div className="requests">
                    {requests.map((row: ReactElement) => row)}
                </div>
                {pagination}
            </div>
        </div>
    )
}

export type PaginationProps = {
    setPage: (page:number) => void,
    list: PagiLink[],
    className?: string
};

function RequestStatus({status}) {
    let classes = 'w-2.5 h-full';

    switch (status) {
        case 'new':
            classes += ' bg-yellow-400'; break;
        case 'important':
            classes += ' bg-orange-500'; break;
        case 'done':
            classes += ' bg-green-600'; break;
        case 'unknown':
            classes += ' bg-gray-300 dark:bg-gray-500'; break;
    }

    return <div className={classes}></div>
}

function RequestRow({request}: {request: Request}) {
    console.log(request.client?.address);
    return <div className="request">
        <div className="request-left">
            <RequestStatus status={request.status}/>
        </div>
        <div className="request-right">
            <div className="request-title flex gap-x-2 items-center">
                <div className="text-orange-500 dark:text-orange-400">#{request.id}</div>
                <div>{request.client?request.client.name:request.client_name}</div>
            </div>
            <div className="mt-2 flex gap-x-3 flex-wrap gap-y-1.5">
                <a href={
                    (request.client && request.client.phones && request.client.phones[0] && 'tel:'+request.client.phones[0])
                    || (request.client_phone && 'tel:'+request.client_phone)
                    || '#'
                } className="request-phone">
                    <svg height=".85em" className="inline" viewBox="0 0 513.64 513.64"><g><path d="m499.66 376.96-71.68-71.68c-25.6-25.6-69.12-15.359-79.36 17.92-7.68 23.041-33.28 35.841-56.32 30.72-51.2-12.8-120.32-79.36-133.12-133.12-7.68-23.041 7.68-48.641 30.72-56.32 33.28-10.24 43.52-53.76 17.92-79.36l-71.68-71.68c-20.48-17.92-51.2-17.92-69.12 0L18.38 62.08c-48.64 51.2 5.12 186.88 125.44 307.2s256 176.641 307.2 125.44l48.64-48.64c17.921-20.48 17.921-51.2 0-69.12z" fill="currentColor"></path></g></svg>
                    <div>{
                        (request.client && request.client.phones && request.client.phones[0])
                        || request.client_phone
                        || <span className="text-gray-300">-</span>
                    }</div>
                </a>
                <a href={
                    (request.client && request.client.phones && request.client.phones[1] && 'tel:'+request.client.phones[1])
                    || (request.client_phone_contact && 'tel:'+request.client_phone_contact)
                    || '#'
                } className="request-phone">
                    <svg height=".85em" className="inline" viewBox="0 0 482.6 482.6"><g><path d="M98.339 320.8c47.6 56.9 104.9 101.7 170.3 133.4 24.9 11.8 58.2 25.8 95.3 28.2 2.3.1 4.5.2 6.8.2 24.9 0 44.9-8.6 61.2-26.3.1-.1.3-.3.4-.5 5.8-7 12.4-13.3 19.3-20 4.7-4.5 9.5-9.2 14.1-14 21.3-22.2 21.3-50.4-.2-71.9l-60.1-60.1c-10.2-10.6-22.4-16.2-35.2-16.2-12.8 0-25.1 5.6-35.6 16.1l-35.8 35.8c-3.3-1.9-6.7-3.6-9.9-5.2-4-2-7.7-3.9-11-6-32.6-20.7-62.2-47.7-90.5-82.4-14.3-18.1-23.9-33.3-30.6-48.8 9.4-8.5 18.2-17.4 26.7-26.1 3-3.1 6.1-6.2 9.2-9.3 10.8-10.8 16.6-23.3 16.6-36s-5.7-25.2-16.6-36l-29.8-29.8c-3.5-3.5-6.8-6.9-10.2-10.4-6.6-6.8-13.5-13.8-20.3-20.1-10.3-10.1-22.4-15.4-35.2-15.4-12.7 0-24.9 5.3-35.6 15.5l-37.4 37.4c-13.6 13.6-21.3 30.1-22.9 49.2-1.9 23.9 2.5 49.3 13.9 80 17.5 47.5 43.9 91.6 83.1 138.7zm-72.6-216.6c1.2-13.3 6.3-24.4 15.9-34l37.2-37.2c5.8-5.6 12.2-8.5 18.4-8.5 6.1 0 12.3 2.9 18 8.7 6.7 6.2 13 12.7 19.8 19.6 3.4 3.5 6.9 7 10.4 10.6l29.8 29.8c6.2 6.2 9.4 12.5 9.4 18.7s-3.2 12.5-9.4 18.7c-3.1 3.1-6.2 6.3-9.3 9.4-9.3 9.4-18 18.3-27.6 26.8l-.5.5c-8.3 8.3-7 16.2-5 22.2.1.3.2.5.3.8 7.7 18.5 18.4 36.1 35.1 57.1 30 37 61.6 65.7 96.4 87.8 4.3 2.8 8.9 5 13.2 7.2 4 2 7.7 3.9 11 6 .4.2.7.4 1.1.6 3.3 1.7 6.5 2.5 9.7 2.5 8 0 13.2-5.1 14.9-6.8l37.4-37.4c5.8-5.8 12.1-8.9 18.3-8.9 7.6 0 13.8 4.7 17.7 8.9l60.3 60.2c12 12 11.9 25-.3 37.7-4.2 4.5-8.6 8.8-13.3 13.3-7 6.8-14.3 13.8-20.9 21.7-11.5 12.4-25.2 18.2-42.9 18.2-1.7 0-3.5-.1-5.2-.2-32.8-2.1-63.3-14.9-86.2-25.8-62.2-30.1-116.8-72.8-162.1-127-37.3-44.9-62.4-86.7-79-131.5-10.3-27.5-14.2-49.6-12.6-69.7z" fill="currentColor"></path></g></svg>
                    <div>{
                        (request.client && request.client.phones && request.client.phones[1])
                        || request.client_phone_contact
                        || <span className="text-gray-300">-</span>
                    }</div>
                </a>
                <span className="request-phone">
                    <svg height=".95em" viewBox="0 0 24 24"><g><path d="M12 0C7.038 0 3 4.066 3 9.065c0 7.103 8.154 14.437 8.501 14.745a.749.749 0 0 0 .998.001C12.846 23.502 21 16.168 21 9.065 21 4.066 16.962 0 12 0zm0 14c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z" fill="currentColor"></path></g></svg>
                    <div>{
                        (request.client && request.client.address?.full)
                        || request.addressDB?.full
                        || request.address
                        || <span className="text-gray-300">-</span>
                    }</div>
                </span>
                <span className="request-phone">
                    <svg height=".95em" viewBox="0 0 48 48"><g><path d="M45 33.14c0-4.16.28-8.68-3.17-14.21a2 2 0 0 0-.21-2.46l-2.91-3.11A2 2 0 0 0 36.3 13a20.83 20.83 0 0 0-7.41-3.4 3 3 0 0 0-.81-1.67C27 6.74 26 7 22.08 7a3 3 0 0 0-3 2.59A21.07 21.07 0 0 0 11.7 13c-1.82-1-2.89.88-5.32 3.48a2 2 0 0 0-.21 2.46C2.73 24.45 3 29 3 33.14A4 4 0 0 0 4 41h40a4 4 0 0 0 1-7.86ZM43 33H28l.82-21.37a19.09 19.09 0 0 1 6.23 2.95l-4.47 8.94A2.61 2.61 0 0 0 33 27.29c1.47 0 1.47-.42 7.42-6.81C43.28 25.37 43 29.35 43 33Zm-2.84-15.17c-7.34 7.89-6.82 7.46-7.19 7.46a.61.61 0 0 1-.56-.88l4.84-9.68Zm-18.8-8.52c.39-.41.4-.31 4.56-.31a1 1 0 0 1 1 1L26 33h-4c-1-24.95-1.07-23.25-.64-23.69Zm-10.61 5.42c5.17 10.34 5.16 9.94 4.72 10.38a.6.6 0 0 1-.87 0l-6.76-7.28Zm-3.18 5.75 5.56 6a2.61 2.61 0 0 0 4.25-2.94l-4.47-8.94a19.28 19.28 0 0 1 6.23-2.95L20 33H5c0-4.13-.21-7.75 2.57-12.52ZM44 39H4a2 2 0 0 1 0-4h40a2 2 0 0 1 0 4Z" fill="currentColor"></path></g></svg>
                    <div>{
                        request.client?.address?.worker?.name
                        || request.addressDB?.worker?.name
                        || request.worker?.name
                        || <span className="text-gray-300">-</span>
                    }</div>
                </span>
            </div>
            <div className="bg-gray-300 dark:bg-gray-700 mt-2.5" style={{height: 1}}></div>
            <div className="mt-2">{request.content}</div>
        </div>
    </div>;
}

export const requestTypes = {
    'unknown': 'Неизвестно',
    'new': 'Новая',
    'done': 'Завершена',
    'important': 'Срочная',
};

export function Pagination({setPage, list, className = '', ...attributes}: PaginationProps) {
    const classes = 'pagination '+className;

    const changePage = (page:PagiLink) => {
        if(!page.url || page.active)
            return;
        setPage(parseInt(page.label));
    }

    return <div className={classes} {...attributes}>
        {list.map((page, i) => {
            if(i == 0 || i == list.length - 1)
                return;
            let classes = '';
            if(page.active) classes += ' active';
            if(!page.url) classes += ' no-link';

            return <div key={i} onClick={() => changePage(page)} className={classes}>{page.label}</div>;
        })}
    </div>
}
