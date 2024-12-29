import React, {Fragment, useCallback, useRef, useState} from "react";
import {TableServer} from "@/components/Table/Table.jsx";
import LoadingArea from "@/components/LoadingArea";
import {ResourceFetchFunction} from "@/hooks/useResource";
import SearchInput from "@/components/SearchInput";
import toast from "react-hot-toast";
import {useDelayedState} from "@/hooks";
import {Address} from "@/features/addresses";
import SidePopup, {CloseButton, PopupContent} from "@/Components/Sidepopup/SidePopup";
import {ClientForm} from "./ClientForm";
import {Client} from "../types";
import {ClientsAPI} from "../api";

export function Clients() {
    const [loading, setLoading] = useState(false);

    const [word, setWord] = useState('');
    const [_word, _setWord] = useDelayedState(setWord, 500, '');
    const lastWord = useRef('');

    const [currentClient, setCurrentClient] = useState<Client>(null);

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

    return (
        <div>
            {currentClient && <SidePopup onClose={() => setCurrentClient(null)}>
                <PopupContent>
                    <CloseButton onClose={() => setCurrentClient(null)}/>
                    <ClientForm id={currentClient.id}/>
                </PopupContent>
            </SidePopup>}
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
                            // linkTo: value => `/clients/${value.id}`,
                            onClick(row) {
                                setCurrentClient(row);
                            },
                            rowClass: 'cursor-pointer',
                            columns: [
                                { key: 'id', label: 'Номер лицевого счёта', linked: true },
                                { key: 'name', label: 'ФИО', linked: true,
                                    filter(value: string) {
                                        return value || <span className="text-gray-400 dark:text-gray-500">Пусто</span>;
                                    }
                                },
                                { key: 'address', label: 'Адрес', linked: true,
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
                                            {value.map((tel:number|string, i:number) => <Fragment key={i}><a className="underline text-blue-600 dark:text-blue-300" onClick={event => event.stopPropagation()} href={'tel:'+tel}>{tel}</a>{i < value.length - 1?', ':''}</Fragment>)}
                                        </>;
                                    }
                                }
                            ],
                        }
                    }}
                     setLoading={setLoading}/>
                </div>
            </div>
        </div>
    )
}
