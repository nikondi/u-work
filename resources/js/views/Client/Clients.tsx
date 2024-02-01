import {TableServer} from "../../components/Table/Table.jsx";
import React, {Fragment, KeyboardEventHandler, useCallback, useMemo, useRef, useState} from "react";
import ClientsAPI from "../../API/ClientsAPI.js";
import LoadingArea from "../../components/LoadingArea.jsx";
import {ResourceFetchFunction, useRowContext} from "../../components/Resource/hooks/useResource";
import SearchInput from "../../components/SearchInput";
import toast from "react-hot-toast";
import Icon from "../../components/Icon";
import useDelayedState from "../../hooks/useDelayedState";

export type Client = {
    id: number,
    name: string,
    address: Address,
    phone?: string,
    email?: string,
    phones?: string[],
}

export default function Clients() {
    const [loading, setLoading] = useState(false);

    const [word, setWord] = useState('');
    const [_word, _setWord] = useDelayedState(setWord, 500, '');
    const lastWord = useRef('');

    const fetchClients: ResourceFetchFunction = useCallback((page, setPage) => {
        if(word.trim() !== '') {
            const pg = word == lastWord.current?page:1;
            setPage(pg, pg != page);
            lastWord.current = word.trim();
            return ClientsAPI.search(30, pg, word);
        }
        else
            return ClientsAPI.get(30, page);
    }, [word]);

    const updateClient = (id: number, data: Partial<Client>) => {
        return ClientsAPI.update(id, data);
    }

    return (
        <div className="relative">
            <SearchInput value={_word} setValue={_setWord} />
            <div className="relative">
                <LoadingArea show={loading}/>
                <TableServer config={{
                    pagination: true,
                    resourceConfig: {
                        fetch: fetchClients,
                        onFetchError: (e) => {
                            toast.error('Произошла ошибка: '+e.message);
                        }
                    },
                    tableConfig: {
                        columns: [
                            { key: 'id', label: 'Номер лицевого счёта' },
                            { key: 'name', label: 'ФИО',
                                filter(value: string) {
                                    return value || <span className="text-gray-400 dark:text-gray-500">Пусто</span>;
                                }
                            },
                            { key: 'address', label: 'Адрес',
                                filter(value: Address) {
                                    if(!value)
                                        return (<span className="text-gray-400 dark:text-gray-500">Пусто</span>)

                                    return value.full;
                                }
                            },
                            { key: 'phones', label: 'Номер телефона',
                                filter(value: string[] | number[]) {
                                    if(!value || value.length == 0)
                                        return (<span className="text-gray-400 dark:text-gray-500">Пусто</span>)

                                    return <>
                                        {value.map((tel:number|string, i:number) => <Fragment key={i}><a className="underline text-blue-600 dark:text-blue-300" href={'tel:'+tel}>{tel}</a>{i < value.length - 1?', ':''}</Fragment>)}
                                    </>;
                                }
                            }
                        ],
                    }
                }}
                 setLoading={setLoading}/>
            </div>
        </div>
    )
}
