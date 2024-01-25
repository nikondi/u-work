import React from "react";
import {rectSortingStrategy, SortableContext} from "@dnd-kit/sortable";
import Card from "./Card";
import {useDroppable} from "@dnd-kit/core";
import {useKanbanContext} from "./KanbanContext";
import {empty_request, Request} from "../../../API/RequestsAPI";
import Icon from "../../../components/Icon";

export type Column = {
  id: string,
  colors: string,
  title: string,
  items: {id: string, content: Request}[]
}

export default function KanbanColumn({id, title, colors, items}: Column) {
  const { setNodeRef } = useDroppable({ id: id });
  const {overColumn, setCurrentRequest} = useKanbanContext();

  const addItem = () => {
    setCurrentRequest({...empty_request});
  }

  return <div className={"kanban-column"+(overColumn?.id === id?' bg-gray-500 bg-opacity-10':'')} ref={setNodeRef}>
      <div className={"px-3 py-2 rounded flex text-white mb-5 "+colors}><div className="flex-1">{title}</div><span className="text-gray-300">({items.length})</span></div>
      <div className="kanban-column__inner tiny-scrollbar">
        <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
          {items.map((item) => <Card id={item.id} key={item.id} item={item.content} colors={colors}/>)}
        </SortableContext>
          {items.length == 0 && <button onClick={addItem} className="transition-colors duration-300 px-5 py-2 bg-white dark:bg-transparent mx-auto rounded-md border border-gray-300 hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-x-3">
              <Icon icon="plus"/>
              <div className="leading-3">Добавить</div>
          </button>}
      </div>
    </div>
}
