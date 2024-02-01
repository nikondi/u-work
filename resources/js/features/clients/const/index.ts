import {Client} from "../types";
import {defaultAddress} from "@/features/addresses";

export const defaultClient = {
    id: 0,
    name: '',
    phone: '',
    address: defaultAddress,
} as Client;

export const clientStatuses = {
    invalid: 'Нет договора',
    active: 'Действующий',
    reject: 'Отказался',
    first_contact: 'Первичный контакт'
};
