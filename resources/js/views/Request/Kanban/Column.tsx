import React, {useCallback, useEffect, useState} from "react";
import RequestsAPI from "../../../API/RequestsAPI";
import {Request} from "../Requests";
import KanbanItem from "./Item";

type KanbanListProps = {
    type: string,
    name: string,
    colors: string,
}
export default function KanbanColumn({type, name, colors}: KanbanListProps) {
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const fetchRequests = useCallback((page: number) => {
        return RequestsAPI.get(30, page, {id: 'desc'}, {type});
    }, [type]);

    useEffect(() => {
        fetchRequests(page).then(({data}) => {
            setList(data.data);
            setTotal(data.meta.total);
        });
    }, []);

    return <div className="w-[250px] min-w-[250px] px-2 flex flex-col">
        <div className={"px-3 py-2 rounded flex text-white mb-5 "+colors}><div className="flex-1">{name}</div><span className="text-gray-300">({total})</span></div>
        <div className="overflow-auto flex-1">
            {list.map((request: Request) => <KanbanItem key={request.id} item={request} colors={colors}/>)}
        </div>
    </div>;
}
