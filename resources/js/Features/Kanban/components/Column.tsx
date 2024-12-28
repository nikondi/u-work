import React, {useEffect, useState} from "react";
import {rectSortingStrategy, SortableContext} from "@dnd-kit/sortable";
import {useDroppable} from "@dnd-kit/core";
import {TKanbanColumn} from "@/Features/Kanban/types";
import {twMerge} from "tailwind-merge";
import Card from "@/Features/Kanban/components/Card";
import {useKanban} from "@/Features/Kanban/contexts/KanbanContext";
import RequestsAPI from "@/API/RequestsAPI";

type Props = TKanbanColumn;

export default function KanbanColumn({id, colors, items, title}: Props) {
  const {setNodeRef} = useDroppable({id: id});
  const {addItemsToColumn} = useKanban();

  const [page, setPage] = useState(1);

  const loadItems = () => {
    RequestsAPI.get(10, page, null, {type: id}).then(({data}) => addItemsToColumn(id, data.data))
  }

  useEffect(() => {
    loadItems();
  }, []);

  return <div className={twMerge("kanban-column border border-gray-500")} ref={setNodeRef}>
    <div className={twMerge("px-3 py-2 rounded flex items-center text-white mb-5", colors)} style={{height: '40px'}}>
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
