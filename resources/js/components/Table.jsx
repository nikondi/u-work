import {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";
import PropTypes from "prop-types";
import {untranslit} from "../helpers.jsx";
import {Link} from "react-router-dom";

const TableContext = createContext({
    tableConfig: {columns: [], content: [], buttons: [], primaryKey: '', rowModules: []}, setTableConfig: () => {}
});

function TableContextProvider({children}) {
    const [tableConfig, setTableConfig] = useState({columns: [], content: [], buttons: [], rowModules: []});

    return <TableContext.Provider value={{
        tableConfig, setTableConfig
    }}>
        {children}
    </TableContext.Provider>
}

const useTableContext = () => useContext(TableContext);

const Table = ({children, config = {}}) => {
    return <TableContextProvider>
        <TableContent config={config}>{children}</TableContent>
    </TableContextProvider>
}

const TableContent = ({children, config = {}}) => {
    const [sort, _setSort] = useState(null);
    const [content, setContent] = useState([]);
    const [searchPhrase, setSearchPhrase] = useState('');

    const {tableConfig, setTableConfig} = useTableContext();

    useEffect(() => {
        setTableConfig({...tableConfig, ...config});
    }, [config]);

    const default_config_column = {key: '', label: '', sortable: false, searchable: false, filter: (value) => value?value:null, sortFiltered: false, linked: true};
    const search_columns = [];

    tableConfig.columns.forEach((config_column, k) => {tableConfig.columns[k] = {...default_config_column, ...config_column}});

    const columns = tableConfig.columns;

    columns.forEach(function(column) {
        if(column.searchable)
            search_columns.push(column.key);
    });

    useEffect(() => {
        if(!tableConfig.content)
            return;

        let initial_content = [];
        if(Array.isArray(tableConfig.content[0])) {
            tableConfig.content.forEach((row) => {
                const column = {};
                for(let i = row.length; i < tableConfig.columns.length; i++)
                    row[i] = '';

                row.forEach((col, i) => {
                    if(i >= tableConfig.columns.length)
                        return false;

                    column[tableConfig.columns[i].key] = col;
                });
                initial_content.push(column);
            });
        }
        else {
            initial_content = tableConfig.content;
            columns.forEach((column) => {
                initial_content.forEach((row, i) => {
                    if(!row[column.key])
                        initial_content[i][column.key] = '';
                });
            });
        }

        setContent(initial_content);
    }, [tableConfig.content]);

    function setSort(new_sort) {
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

    const sortedFiltererdContent = useMemo(() => {
        if(!searchPhrase.trim())
            return sortedContent;
        const phrase = searchPhrase.trim().toLowerCase();
        const phrase_unt = untranslit(phrase);
        return [...sortedContent].filter((row) => {
            let find = false;
            search_columns.forEach(function(column) {
                const col_phrase = row[column].toLowerCase();
                if(col_phrase.indexOf(phrase) >= 0 || col_phrase.indexOf(phrase_unt) >= 0) {
                    find = true;
                    return false;
                }
            });
            return find;
        })
    }, [sortedContent, searchPhrase]);

    return (<>
        {search_columns.length > 0 && <>
            <div className="mb-3 flex justify-between items-center">
                <div>
                    {tableConfig.buttons.map(button => button)}
                </div>
                <div className="w-80 relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"><svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/></svg></div>
                    <input type="search" value={searchPhrase} onChange={e => setSearchPhrase(e.target.value)} className="block w-full ps-10 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 rounded-lg py-3 px-4 text-sm bg-transparent text-gray-900 bg-none border-0 focus:ring-blue-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Поиск..." required />
                </div>
            </div>
        </>}
        <table className="w-full text-left mt-5">
            <thead>
            <tr className="text-gray-700 dark:text-gray-400">
                {columns.map((column) => (
                    <th key={'heading-'+column.key} className="tbl-heading">
                        <div className="tbl-heading-inner">
                            <span>{column.label}</span>
                            {column.sortable && <>
                                <div className="sort text-gray-500">
                                    <button className={'sort-asc'+(sort?.column.key === column.key && sort.order === 'asc'?' active':'')} onClick={() => setSort({column: column, order: 'asc'})}>
                                        <svg width="10" style={{ transform: 'rotate(180deg)' }} viewBox="0 0 123.959 123.958"><path d="M117.979 28.017h-112c-5.3 0-8 6.4-4.2 10.2l56 56c2.3 2.3 6.1 2.3 8.401 0l56-56c3.799-3.8 1.099-10.2-4.201-10.2z" fill="currentColor"></path></svg>
                                    </button>
                                    <button className={'sort-desc'+(sort?.column.key === column.key && sort.order === 'desc'?' active':'')} onClick={() => setSort({column: column, order: 'desc'})}>
                                        <svg width="10" viewBox="0 0 123.959 123.958"><path d="M117.979 28.017h-112c-5.3 0-8 6.4-4.2 10.2l56 56c2.3 2.3 6.1 2.3 8.401 0l56-56c3.799-3.8 1.099-10.2-4.201-10.2z" fill="currentColor"></path></svg>
                                    </button>
                                </div>
                            </>}
                        </div>
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {sortedFiltererdContent.length > 0 ?
                sortedFiltererdContent.map((row, k) => (
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

Table.propTypes = {
    children: PropTypes.any,
    config: PropTypes.object
}

export default Table;

const RowContext = createContext({
    row: {}, setRow: () => {}, getRowIndex: () => {}
});

function RowContextProvider({children, index}) {
    const [row, setRow] = useState({});

    const getRowIndex = useCallback(() => {
        if(!index)
            return null;

        return index;
    }, [index]);

    return <RowContext.Provider value={{
        row, setRow, getRowIndex
    }}>
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
        {tableConfig.columns.map(column => tableConfig.linkTo && column.linked
            ? <td key={column.key}><Link className="tbl-column" to={tableConfig.linkTo(row)}>{column.filter(row[column.key]?row[column.key]:'')}</Link></td>
            : <td key={column.key} className="tbl-column">{column.filter(row[column.key]?row[column.key]:'')}</td>
        )}
        {tableConfig.rowModules.map((module) => module)}
    </tr>
}
