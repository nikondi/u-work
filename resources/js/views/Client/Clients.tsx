import Table from "../../components/Table/Table.jsx";
import {Fragment, useEffect, useState} from "react";
import ClientsAPI from "../../API/ClientsAPI.js";
import LoadingArea from "../../components/LoadingArea.jsx";
import React from "react";
import {Address} from "../Address/Addresses";
import {Pagination} from "../Request/Requests";

export type Client = {
    name: string,
}

export default function Clients() {
    const [content, setContent] = useState();
    const [page, setPage] = useState(1);
    const [pageList, setPageList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        ClientsAPI.get(30, page).then(({data}) => {
            setContent(data.data)
            setPageList(data.meta.links);
        }).catch().finally(() => setLoading(false));
    }, [page]);

    return (
        <div className="relative">
            <LoadingArea show={loading}/>
            <Pagination list={pageList} setPage={setPage}></Pagination>
            <Table config={{
                columns: [
                    {
                        key: 'id',
                        label: 'Номер лицевого счёта',
                        searchable: true,
                    },
                    {
                        key: 'name',
                        label: 'ФИО',
                        searchable: true,
                        filter(value: string) {
                            if(!value.trim())
                                return (<span className="text-gray-400 dark:text-gray-500">Пусто</span>)
                            return value;
                        }
                    },
                    {
                        key: 'address',
                        label: 'Адрес',
                        filter(value: Address) {
                            if(!value)
                                return (<span className="text-gray-400 dark:text-gray-500">Пусто</span>)

                            return value.full;
                        }
                    },
                    {
                        key: 'phones',
                        label: 'Номер телефона',
                        filter(value: string[] | number[]) {
                            if(!value || value.length == 0)
                                return (<span className="text-gray-400 dark:text-gray-500">Пусто</span>)

                            return value.map((tel:number|string, i:number) => <Fragment key={i}><a className="underline text-blue-600 dark:text-blue-300" href={'tel:'+tel}>{tel}</a>{i < value.length - 1?', ':''}</Fragment>);
                        }
                    }
                ],
                content: content,
            }}/>
        </div>
    )
}
