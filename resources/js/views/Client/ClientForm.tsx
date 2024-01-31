import React, {useEffect, useMemo, useState} from "react";
import Input from "../../components/Form/Input";
import {Client} from "./Clients";
import {defaultAddress} from "../Address/AddressForm";
import {FormRow} from "../../components/Form/Form";
import Select, {Option} from "../../components/Form/Select/Select";

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

export default function ClientForm() {
    const [client, setClient] = useState<Client>(defaultClient);

    return (
        <>
            <ClientNameInputs client={client} setClient={setClient}/>
            <FormRow label="Статус" className="mt-6">
                <Select label="Статус">
                    {Object.keys(clientStatuses).map((key: string, i: number) => <Option index={i} key={i} value={key}>{clientStatuses[key]}</Option>)}
                </Select>
            </FormRow>
        </>
    )
}

const name_regex = /[^А-я-]/g;

function ClientNameInputs({client, setClient}: {client: Client, setClient: stateFunction<Client>}) {
    const separated_name = useMemo(() => {
        if(!client.name)
            return ['', '', ''];

        const name_arr = client.name.split(' ').filter((val) => val.trim());
        for(let i = 0; i <= 3 - name_arr.length; i++)
            name_arr.push('');

        return name_arr;
    }, [client.name])

    const [surname, _setSurname] = useState(separated_name[0]);
    const [name, _setName] = useState(separated_name[1]);
    const [lastname, _setLastname] = useState(separated_name[2]);

    useEffect(() => {
        setClient({...client, name: `${surname} ${name} ${lastname}`})
    }, [name, surname, lastname]);


    const setName = (_name: string) => _setName(_name.replace(name_regex, ''));
    const setSurname = (_surname: string) => _setSurname(_surname.replace(name_regex, '').trim());
    const setLastname = (_lastname: string) => _setLastname(_lastname.replace(name_regex, '').trim());

    return <div className="flex">
        {client.name}
        <div className="w-1/3 pr-1">
            <Input label="Фамилия*" value={surname} setValue={setSurname}/>
        </div>
        <div className="w-1/3 px-1">
            <Input label="Имя*" value={name} setValue={setName}/>
        </div>
        <div className="w-1/3 pl-1">
            <Input label="Отчество" value={lastname} setValue={setLastname}/>
        </div>
    </div>
}
