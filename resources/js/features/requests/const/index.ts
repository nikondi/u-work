import {Column, Request} from "../types"


export const empty_request: Request = {
    id: 0,
    type: 'simple',
    order: 0,
    source: 'uniwork',
    subject: '',
    client: null,
    worker: null,
    client_name: '',
    client_phone: '',
    client_phone_contact: '',
    email: '',
    addressDB: null,
    address: '',
    content: '',
    status: 'new',
    created: null,
};

export const requestTypes = {
    'simple': 'Новые обращения',
    'call': 'Звонки',
    'done': 'Завершены',
    'suggest': 'Новые предложения',
};

export const default_columns: Column[] = [
    {id: 'simple', colors: "bg-orange-500", title: "Новые обращения", items: [] },
    {id: 'call', colors: "bg-rose-400", title: "Звонки", items: [] },
    {id: 'done', colors: "bg-green-600", title: "Завершены", items: [] },
    {id: 'suggest', colors: "bg-gray-500", title: "Новые предложения", items: [] },
];
