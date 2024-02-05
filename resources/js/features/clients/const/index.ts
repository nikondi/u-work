import {Client} from "../types";

export const defaultClient = {
    id: 0,
    name: '',
    phone: '',
    address: null,
    email: '',
    floor: '',
    apartment: '',
    comment: ''
} as Client;

export const clientStatuses = {
    invalid: 'Нет договора',
    active: 'Действующий',
    reject: 'Отказался',
    first_contact: 'Первичный контакт'
};

export const statusToNumber = {
    invalid: 0,
    active: 1,
    reject: 3,
    first_contact: 4
};
