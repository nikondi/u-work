import React, {
    createContext, isValidElement,
    PropsWithChildren,
    ReactElement,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import {untranslit} from "../../helpers.js";
import {Link} from "react-router-dom";
import useResource, {ResourceConfig} from "../Resource/hooks/useResource";
import {twMerge} from "tailwind-merge";
import {Pagination} from "../../views/Request/Requests";
import SearchInput from "../SearchInput";

type TableProps = {
    config: TableConfig
};

type TableConfig = {
    columns: ColumnConfig[],
    content: any[],
    linkTo?: (value: any) => string | null,
    buttons?: ReactElement[],
    primaryKey?: string,
    rowModules?: ReactElement[],
};

type ColumnConfig = {
    key: string,
    label?: string,
    sortable?: boolean,
    searchable?: boolean,
    filter?: (value: any) => any|null,
    sortFiltered?: boolean,
    linked?: boolean
};

type Sort = {
    column: ColumnConfig,
    order: 'asc' | 'desc',
};

const default_tableConfig = {columns: [], content: [], primaryKey: null, linkTo: null, buttons: [], rowModules: []} as TableConfig;
const default_config_column = {key: '', label: null, sortable: false, searchable: false, filter: (value:any) => value?value:null, sortFiltered: false, linked: true} as ColumnConfig;

const TableContext = createContext(null);

function TableContextProvider({children}) {
    const [tableConfig, setTableConfig] = useState<TableConfig>(default_tableConfig);

    return <TableContext.Provider value={{
        tableConfig, setTableConfig
    }}>
        {children}
    </TableContext.Provider>
}

const useTableContext = () => useContext(TableContext);

const Table = ({children, config}:PropsWithChildren<TableProps>) => {
    return <TableContextProvider>
        <TableContent config={config}>{children}</TableContent>
    </TableContextProvider>
}

const TableContent = ({children, config = {}}) => {
    const [sort, _setSort] = useState<Sort>(null);
    const [content, setContent] = useState([]);
    const [searchPhrase, setSearchPhrase] = useState('');

    const {tableConfig, setTableConfig} = useTableContext();

    useEffect(() => {
        setTableConfig({...default_tableConfig, ...config});
    }, [config]);

    const search_columns = [];

    tableConfig.columns.forEach((config_column:ColumnConfig, k:number) => {
        tableConfig.columns[k] = {...default_config_column, ...config_column}
        if(!tableConfig.columns[k].label)
            tableConfig.columns[k].label = config_column.key;
    });

    const columns = tableConfig.columns;

    columns.forEach(function(column: ColumnConfig) {
        if(column.searchable)
            search_columns.push(column.key);
    });

    useEffect(() => {
        if(!tableConfig.content)
            return;

        let initial_content = [];
        if(Array.isArray(tableConfig.content[0])) {
            tableConfig.content.forEach((row: any) => {
                const column = {};
                for(let i = row.length; i < tableConfig.columns.length; i++)
                    row[i] = '';

                row.forEach((col: any, i: number) => {
                    if(i >= tableConfig.columns.length)
                        return false;

                    column[tableConfig.columns[i].key] = col;
                });
                initial_content.push(column);
            });
        }
        else {
            initial_content = tableConfig.content;
            columns.forEach((column: ColumnConfig) => {
                initial_content.forEach((row, i) => {
                    if(!row[column.key])
                        initial_content[i][column.key] = '';
                });
            });
        }

        setContent(initial_content);
    }, [tableConfig.content]);

    function setSort(new_sort: Sort) {
        if(sort && new_sort.column.key === sort.column.key && new_sort.order === sort.order)
            _setSort(null);
        else
            _setSort(new_sort);
    }

    const sortedContent = useMemo(() => {
        if(sort != null && content.length) {
            const column = sort.column;
            const cont = [...content].sort((a, b) => {
                const a_value = column.sortFiltered?(column.filter(a[column.key]) ?? ''):(a[column.key] ?? '');
                const b_value = column.sortFiltered?(column.filter(b[column.key]) ?? ''):(b[column.key] ?? '');

                if(parseFloat(a_value).toString() === a_value.toString()) // Число
                    return parseFloat(a_value) - parseFloat(b_value);
                else
                    return (a_value.toString()).localeCompare(b_value.toString());
            });
            return sort.order === 'desc'?cont.reverse():cont;
        }
        else
            return content;
    }, [sort, content]);

    const sortedFilteredContent = useMemo(() => {
        if(!searchPhrase.trim())
            return sortedContent;
        const phrase = searchPhrase.trim().toLowerCase();
        const phrase_unt = untranslit(phrase);
        return [...sortedContent].filter((row) => {
            let find = false;
            search_columns.forEach(function(column) {
                const col_phrase = row[column].toString().toLowerCase();
                if(col_phrase.indexOf(phrase) >= 0 || col_phrase.indexOf(phrase_unt) >= 0) {
                    find = true;
                    return false;
                }
            });
            return find;
        })
    }, [sortedContent, searchPhrase]);

    return (<>
        {search_columns.length > 0 && <div className="mb-3 flex justify-between items-center">
            <div>
                {tableConfig.buttons.map((button: ReactElement|string) => button)}
            </div>
            <SearchInput value={searchPhrase} setValue={value => setSearchPhrase(value)} />
        </div>}
        <table className="w-full text-left mt-5">
            <thead>
            <tr className="text-gray-700 dark:text-gray-400">
                {columns.map((column: ColumnConfig) => (
                    <th key={'heading-'+column.key} className="tbl-heading">
                        <div className="tbl-heading-inner">
                            <span>{column.label}</span>
                            {column.sortable && <SortButtons sort={sort} setSort={setSort} column={column}/>}
                        </div>
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {sortedFilteredContent.length > 0 ?
                sortedFilteredContent.map((row, k) => (
                    <RowContextProvider key={k} index={k}>
                        <Row item={row}/>
                    </RowContextProvider>
                ))
                : <tr><td colSpan={tableConfig.columns.length} className="px-5 py-3 text-center">Пусто...</td></tr>
            }
            {children}
            </tbody>
        </table>
        </>
    )
}

export default Table;

const RowContext = createContext(null);

function RowContextProvider({children, index}) {
    const [row, setRow] = useState({});

    const getRowIndex = useCallback(() => {
        if(!index)
            return null;

        return index;
    }, [index]);

    return <RowContext.Provider value={{
        row, setRow, getRowIndex
    } as any}>
        {children}
    </RowContext.Provider>;
}

export const useRowContext = () => useContext(RowContext);

function Row({item}) {
    const {tableConfig} = useTableContext();
    const {row, setRow} = useRowContext();

    useEffect(() => {
        setRow(item);
    }, [item]);

    return <tr className="tbl-row relative">
        {tableConfig.columns.map((column: ColumnConfig) => tableConfig.linkTo && column.linked
            ? <td key={column.key}><Link className="tbl-column" to={tableConfig.linkTo(row)}>{column.filter(row[column.key]?row[column.key]:'')}</Link></td>
            : <td key={column.key} className="tbl-column">{column.filter(row[column.key]?row[column.key]:'')}</td>
        )}
        {tableConfig.rowModules.map((module: ReactElement) => module)}
    </tr>
}


type TableServerConfig = {
    tableConfig: Partial<TableConfig>,
    resourceConfig: ResourceConfig | Partial<ResourceConfig>,
    pagination?: boolean
}

type TableServerProps = {
    config: TableServerConfig,
    className?: string,
    setLoading?: (v:boolean) => any
};

const default_tableServer_config = {pagination: false} as Partial<TableServerConfig>;

export function TableServer({config, className = '', setLoading, children} : PropsWithChildren<TableServerProps>) {
    const [sort, _setSort] = useState<Sort>(null);

    config = {...default_tableServer_config, ...config};
    config.tableConfig = {...default_tableConfig, ...config.tableConfig};

    const {list: rows, pagination, loading: resourceLoading}: any = useResource({
        ...config.resourceConfig,
        renderRow: (row :any, i: number) => {
            return <tr className="tbl-row relative" key={i}>
                {config.tableConfig.columns.map((column) => {
                    let val = row[column.key];
                    if(column.filter)
                        val = column.filter(val);
                    if(typeof val != 'string' && !isValidElement(val))
                        val = JSON.stringify(val);

                    return config.tableConfig.linkTo && column.linked
                            ? <td key={column.key}><Link className="tbl-column" to={config.tableConfig.linkTo(row)}>{val}</Link></td>
                            : <td key={column.key} className="tbl-column">{val}</td>;
                })}
                {config.tableConfig.rowModules.map((module: ReactElement) => module)}
            </tr>
        },
        renderPagination: (list, setPage) => <Pagination setPage={setPage} list={list}/>,
        pagination: config.pagination
    } as ResourceConfig);

    function setSort(new_sort: Sort) {
        if(sort && new_sort.column.key === sort.column.key && new_sort.order === sort.order)
            _setSort(null);
        else
            _setSort(new_sort);
    }

    useEffect(() => {
        if(setLoading)
            setLoading(resourceLoading);
    }, [resourceLoading, setLoading]);

    return <div className={twMerge('relative', className)}>
        <table className="w-full text-left mt-5">
            <thead>
            <tr className="text-gray-700 dark:text-gray-400">
                {config.tableConfig.columns.map((column: ColumnConfig) => (
                    <th key={'heading-'+column.key} className="tbl-heading">
                        <div className="tbl-heading-inner">
                            <span>{column.label}</span>
                            {column.sortable && <SortButtons sort={sort} setSort={setSort} column={column}/>}
                        </div>
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
                {rows.map((row: ReactElement) => row)}
            </tbody>
        </table>
        {config.pagination && <div className="mt-6">{pagination}</div>}
        {children}
    </div>
}


function SortButtons({sort, setSort, column}) {
    return <div className="sort text-gray-500">
        <button className={'sort-asc'+(sort?.column.key === column.key && sort.order === 'asc'?' active':'')} onClick={() => setSort({column: column, order: 'asc'})}><svg width="10" style={{ transform: 'rotate(180deg)' }} viewBox="0 0 123.959 123.958"><path d="M117.979 28.017h-112c-5.3 0-8 6.4-4.2 10.2l56 56c2.3 2.3 6.1 2.3 8.401 0l56-56c3.799-3.8 1.099-10.2-4.201-10.2z" fill="currentColor"></path></svg></button>
        <button className={'sort-desc'+(sort?.column.key === column.key && sort.order === 'desc'?' active':'')} onClick={() => setSort({column: column, order: 'desc'})}><svg width="10" viewBox="0 0 123.959 123.958"><path d="M117.979 28.017h-112c-5.3 0-8 6.4-4.2 10.2l56 56c2.3 2.3 6.1 2.3 8.401 0l56-56c3.799-3.8 1.099-10.2-4.201-10.2z" fill="currentColor"></path></svg></button>
    </div>
}
