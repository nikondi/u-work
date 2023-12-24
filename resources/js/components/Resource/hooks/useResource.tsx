import React, {createContext, ReactElement, useContext, useEffect, useState} from "react";

type ResourceConfig = {
    fetch: (page:number) => Promise<any>,
    fetchCallback?: (result:any) => any,
    onFetchError?: (error:any) => any,
    onFetchFinally?: () => any,

    pagination?: boolean,
    renderPagination?: (list: PagiLink[], setPage:(page:number) => void) => ReactElement,
    page?:number,

    renderRow: (elem:string|object|number, index:number) => ReactElement,

    search?: (word:string) => Promise<object>
};

type Row = object | string | number | null;

export type PagiLink = {
    url: string|null,
    active: boolean,
    label: string,
}

const default_config = {
    pagination: false,
    page: 1,
} as ResourceConfig;


export default function useResource(config: ResourceConfig) {
    config = {...default_config, ...config};

    const [page, setPage] = useState(config.page);
    const [pageList, setPageList] = useState<PagiLink[]>([]);
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState<Row[]>([]);

    const [pagination, setPagination] = useState<ReactElement>(null)
    const [list, setList] = useState<ReactElement[]>([]);

    const reFetch = () => {
        setPage(0);
    }

    useEffect(() => {
        setLoading(true);
        if(page == 0)
            setPage(1);
        config.fetch(page == 0?1:page).then(({data}) => {
            setContent(data.data)
            if(config.pagination)
                setPageList(data.meta.links);
            if(config.fetchCallback) config.fetchCallback(data);
        }).catch((e) => {
            if(config.onFetchError) config.onFetchError(e);

        }).finally(() => {
            if(config.onFetchFinally) config.onFetchFinally();
            setLoading(false);
        });
    }, [page, config.fetch]);

    useEffect(() => {
        if(pageList.length == 0 || !config.pagination)
            return;
        setPagination(config.renderPagination(pageList, setPage));
    }, [pageList]);

    useEffect(() => {
        if(!content)
            return;

        setList(content.map((row, i) => <RowContextProvider key={i}>{config.renderRow(row, i)}</RowContextProvider>));
    }, [content]);

    return [
        list, pagination, loading, reFetch
    ];
}


type RowContext = {
    setRow: React.Dispatch<React.SetStateAction<Row>>,
    row: Row,
}

const RowContext = createContext<RowContext>({} as RowContext);

function RowContextProvider({children}) {
    const [row, setRow] = useState<Row>(null);

    return <RowContext.Provider value={{
        row, setRow
    }}>
        {children}
    </RowContext.Provider>;
}

export const useRowContext = () => useContext(RowContext);
