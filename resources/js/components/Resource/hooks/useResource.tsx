import React, {createContext, ReactElement, useContext, useEffect, useRef, useState} from "react";

export type ResourceConfig = {
    fetch: (page:number, setPage: (page: number, silently: boolean) => void) => Promise<any>,
    fetchCallback?: (result:any) => any,
    onFetchError?: (error:any) => any,
    onFetchFinally?: () => any,

    pagination?: boolean,
    renderPagination?: (list: PagiLink[], setPage:(page:number) => void) => ReactElement,
    page?:number,

    renderRow: (elem:string|object|number, index:number) => ReactElement,
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

    const [page, _setPage] = useState(config.page);
    const [setPageSilent, setSetPageSilent] = useState(false);
    const [pageList, setPageList] = useState<PagiLink[]>([]);
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState<Row[]>([]);

    const [pagination, setPagination] = useState<ReactElement>(null)
    const [list, setList] = useState<ReactElement[]>([]);
    const timeoutRef = useRef<number>(null);

    const setPage = (page:number, silently: boolean = false) => {
        setSetPageSilent(silently);
        _setPage(page);
    }

    useEffect(() => {
        if(!config.fetch)
            return;

        if(setPageSilent)
            return;

        if(page == 0) {
            setPage(1);
            return;
        }

        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setLoading(true);
            config.fetch(page, setPage).then(({data}) => {
                setContent(data.data)
                if(config.pagination && data.meta?.links)
                    setPageList(data.meta.links);
                else
                    setPageList([]);
                if(config.fetchCallback) config.fetchCallback(data);
            }).catch((e:object) => {
                if(config.onFetchError) config.onFetchError(e);

            }).finally(() => {
                if(config.onFetchFinally) config.onFetchFinally();
                setLoading(false);
            });
        }, 50);
    }, [page, config.fetch, setPageSilent]);

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
        list, pagination, loading, setPage
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
