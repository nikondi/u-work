import React, {useEffect, useRef, useState} from "react";

export default function SearchInput({value, setValue, inputTimeout = 0}) {
    const timeoutRef = useRef<number>(null);
    const [_value, _setValue] = useState(value);

    useEffect(() => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setValue(_value);
        }, inputTimeout);
    }, [_value]);

    return (
        <div className="w-80 relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"><svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/></svg></div>
            <input type="search" value={_value} onChange={e => _setValue(e.target.value)} className="block w-full ps-10 bg-gray-200 dark:bg-gray-700 dark:border-gray-600 rounded-lg py-3 px-4 text-sm bg-transparent text-gray-900 bg-none border-0 focus:ring-blue-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Поиск..." required />
        </div>
    )
}
