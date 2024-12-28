import React, {useEffect} from "react";
import {rectSortingStrategy, SortableContext} from "@dnd-kit/sortable";
import {useDroppable} from "@dnd-kit/core";
import {TKanbanColumn} from "../types";
import {twMerge} from "tailwind-merge";
import Card from "../components/Card";
import {useKanban} from "../contexts/KanbanContext";
import RequestsAPI from "@/API/RequestsAPI";
import {getColumnColor} from "../helpers";

type Props = TKanbanColumn;

export default function KanbanColumn({id, items, title}: Props) {
  const {setNodeRef} = useDroppable({id: id});
  const {addItemsToColumn, overColumn} = useKanban();

  const loadItems = () => {
    RequestsAPI.get(-1, 1, {order: 'asc'}, {type: id, archived: false}).then(({data}) => addItemsToColumn(id, data.data))
  }

  useEffect(() => {
    loadItems();
  }, []);

  return <div className={twMerge("kanban-column", overColumn == id && 'bg-gray-500 bg-opacity-20')} ref={setNodeRef}>
    <div className={twMerge("px-3 py-2 rounded flex items-center text-white mb-5", getColumnColor(id))} style={{height: '40px'}}>
      <div className="flex-1">{title}</div>
      {/*<button onClick={addItem} className="mr-2 p-0.5"><Icon icon="plus" width=".85em" height=".85em"/></button>*/}
      {/*<span className="text-gray-300">({items.length})</span>*/}
    </div>
    <div className="kanban-column__inner tiny-scrollbar">
      <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
        {items.map((item) =>
          <Card id={item.id} data={item} key={item.id}/>
        )}
      </SortableContext>
      {/*{items.length == 0 && <button onClick={addItem}
                                    className="transition-colors duration-300 px-5 py-2 bg-white dark:bg-transparent mx-auto rounded-md border border-gray-300 hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-x-3">
        <Icon icon="plus"/>
        <div className="leading-3">Добавить</div>
      </button>}*/}
    </div>
  </div>
}
