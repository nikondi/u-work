import React, {createContext, ReactElement, useContext, useEffect, useRef, useState} from "react";
import {stateFunction} from "@/types";

type renderRowFunction<T> = (elem: T, index: number) => ReactElement;
export type ResourceFetchFunction = (page: number, setPage: (page: number, silently: boolean) => void) => (Promise<any> | (false | undefined | null));
export type ResourceConfig<T = any> = {
  fetch: ResourceFetchFunction,
  fetchCallback?: (result: any, page: number) => any,
  onFetchError?: (error: any) => any,
  onFetchFinally?: () => any,

  pagination?: boolean,
  renderPagination?: (list: PaginationLink[], setPage: (page: number) => void) => ReactElement,
  page?: number,

  renderRow?: renderRowFunction<T>
};

export type PaginationLink = {
  url: string | null,
  active: boolean,
  label: string,
}


const default_config = {
  pagination: false,
  page: 1,
} as Partial<ResourceConfig>;

export function useResource<Row = any>(config: ResourceConfig<Row>) {
  config = {...default_config, ...config};

  const [page, _setPage] = useState(config.page);
  const [setPageSilent, setSetPageSilent] = useState(false);
  const [pageList, setPageList] = useState<PaginationLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<Row[]>([]);

  const [pagination, setPagination] = useState<ReactElement>(null)
  const [list, setList] = useState<ReactElement[] | Row[]>([]);
  const timeoutRef = useRef<null | ReturnType<typeof setTimeout>>(null);

  const setPage = (page: number, silently: boolean = false) => {
    setSetPageSilent(silently);
    _setPage(page);
  }

  useEffect(() => {
    if (!config.fetch)
      return;

    if (setPageSilent)
      return;

    if (page == 0) {
      setPage(1);
      return;
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setLoading(true);
      const fetch = config.fetch(page, setPage);
      if (!fetch) {
        setLoading(false);
        return;
      }

      fetch.then(({data}) => {
        setContent(data.data)
        if (config.pagination && data.meta?.links)
          setPageList(data.meta.links);
        else
          setPageList([]);
        if (config.fetchCallback) config.fetchCallback(data, page);
      }).catch((e: object) => {
        if (config.onFetchError) config.onFetchError(e);

      }).finally(() => {
        if (config.onFetchFinally) config.onFetchFinally();
        setLoading(false);
      });
    }, 50);
  }, [page, config.fetch, setPageSilent]);

  useEffect(() => {
    if (pageList.length == 0 || !config.pagination)
      return;
    setPagination(config.renderPagination(pageList, setPage));
  }, [pageList]);

  useEffect(() => {
    if (!content)
      return;

    setList(content.map((row: Row, i) => {
      return config.renderRow
          // @ts-ignore
          ? <RowContextProvider key={row.id || i} initial={row}>{config.renderRow(row, i)}</RowContextProvider>
          : null;
    }));
  }, [content]);

  return {
    list, content, pagination, loading, setPage, page
  };
}


const RowContext = createContext(null);

function RowContextProvider({children, initial = null}) {
  const [row, setRow] = useState<typeof initial>(initial);

  return <RowContext.Provider value={{
    row, setRow
  }}>
    {children}
  </RowContext.Provider>;
}

type RowContext = { row: any, setRow: stateFunction };
export const useRowContext = () => useContext<RowContext>(RowContext);


type PaginationProps = {
  setPage: (page: number) => void,
  list: PaginationLink[],
  className?: string
};

export function Pagination({setPage, list, className = '', ...attributes}: PaginationProps) {
  const classes = 'pagination ' + className;

  const changePage = (page: PaginationLink) => {
    if (!page.url || page.active)
      return;
    setPage(parseInt(page.label));
  }

  return <div className={classes} {...attributes}>
    {list.map((page, i) => {
      if (i == 0 || i == list.length - 1)
        return;
      let classes = '';
      if (page.active) classes += ' active';
      if (!page.url) classes += ' no-link';

      return <div key={i} onClick={() => changePage(page)} className={classes}>{page.label}</div>;
    })}
  </div>
}
