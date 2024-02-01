import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {clientStatuses, defaultClient} from "../const";
import {Client} from "../types";
import {ClientsAPI} from "../api";
import {FormRow, Input, Select, Option} from "@/components/Form";


export function ClientForm() {
    const [client, setClient] = useState<Client>(defaultClient);
    const {id} = useParams();

    useEffect(() => {
        if(id) {
            ClientsAPI.getSingle(id)
                .then(({data}) => {
                    console.log(data);
                    setClient(data);
                })
        }
    }, []);

    return (
        <div className="container">
            <h1 className="text-2xl">{id && <span className="text-orange-500">#{client.id} </span>}{client.name}</h1>
            <FormRow label="ФИО" className="mt-6">
                <Input value={client.name} setValue={(v: string) => setClient({...client, name: v})} />
            </FormRow>
            <FormRow label="Статус" className="mt-6">
                <Select label="Статус" value={client.status}>
                    {Object.keys(clientStatuses).map((key: string, i: number) => <Option index={i} key={i} value={key}>{clientStatuses[key]}</Option>)}
                </Select>
            </FormRow>
        </div>
    )
}
