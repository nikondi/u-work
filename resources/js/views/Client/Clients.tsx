import {TableServer} from "../../components/Table/Table.jsx";
import React, {Fragment, KeyboardEventHandler, useCallback, useEffect, useMemo, useRef, useState} from "react";
import ClientsAPI from "../../API/ClientsAPI.js";
import LoadingArea from "../../components/LoadingArea.jsx";
import {ResourceConfig, useRowContext} from "../../components/Resource/hooks/useResource";
import SearchInput from "../../components/SearchInput";
import toast from "react-hot-toast";
import Icon from "../../components/Icon";

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
    const lastWord = useRef('');

    const timeoutRef = useRef(0);

    const fetchClients = useCallback((page:number, setPage: (page: number, silently: boolean) => void) => {
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

    const onSearch = (e: any) => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setWord(e.target.value);
        }, 500);
    }

    return (
        <div className="relative">
            <SearchInput onChange={onSearch} />
            <div className="relative">
                <LoadingArea show={loading}/>
                <TableServer config={{
                    pagination: true,
                    resourceConfig: {
                        fetch: fetchClients,
                        onFetchError: (e) => {
                            toast.error('Произошла ошибка: '+e.message);
                        }

                    } as Partial<ResourceConfig>,
                    tableConfig: {
                        columns: [
                            { key: 'id', label: 'Номер лицевого счёта' },
                            { key: 'name', label: 'ФИО',
                                filter() {
                                    return <EditableName updateClient={updateClient} formattedValue={(value) => value?value:<span className="text-gray-400 dark:text-gray-500">Пусто</span>} />;
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

function EditableName({formattedValue, updateClient}) {
    const {row, setRow}: {row: Client, setRow: stateFunction<Client>} = useRowContext();
    const [lastValue, setLastValue] = useState(row.name);
    const update = (value: string) => {
        setRow((prev) => {
            setLastValue(prev.name);
            return {...row, name: value};
        });
        updateClient(row.id, {name: value})
            .then(() => toast.success('Клиент сохранён'))
            .catch((e) => {
                toast.error('Ошибка при сохранении клиента');
                console.error(e);
                setRow({...row, name: lastValue});
            });
    }

    return <InlineEdit value={row.name} onSave={update} formattedValue={formattedValue} />;
}

type InlineEdit = {
    value: string,
    onSave: (value: string) => void,
    formattedValue?: (value: string) => React.ReactNode,
};
function InlineEdit({value, onSave, formattedValue=(value)=>value}: InlineEdit) {
    const [input, setInput] = useState(value);
    const inputRef = useRef<HTMLInputElement>();
    const unsaved = useMemo(() => {
        return value != input;
    }, [value, input]);

    const discard = () => {
        setInput(value);
        inputRef.current.blur();
    }
    const save = () => {
        if(input.trim() != value)
            onSave(input.trim());
        setInput(input.trim());

        inputRef.current.blur();
    }

    const onKeyUp: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if(e.key == 'Enter')
            save();
        else if(e.key == 'Escape')
            discard();
    }

    return <div className={"flex items-center rounded"+(unsaved?" bg-orange-300":'')}>
            <input
                ref={inputRef}
                onKeyUp={onKeyUp}
                value={input} onChange={event => setInput(event.target.value)} className="w-full bg-transparent transition-colors duration-300 rounded px-1.5 py-1 outline-none focus:bg-orange-300 hover:bg-orange-300"/>
            {unsaved && <>
                <button onClick={save} className="w-6 h-6 flex items-center justify-center transition-colors duration-300 text-gray-500 hover:text-gray-700"><Icon icon="check" width=".9em" height=".9em" /></button>
                <button onClick={discard} className="w-6 h-6 flex items-center justify-center transition-colors duration-300 text-gray-500 hover:text-gray-700"><Icon icon="times" width=".73em" height=".73em" /></button>
            </>}
        </div>
}
