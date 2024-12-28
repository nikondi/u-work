import React from "react";
import {rectSortingStrategy, SortableContext} from "@dnd-kit/sortable";
import Card from "./Card";
import {useDroppable} from "@dnd-kit/core";
import {useKanbanContext} from "./KanbanContext";
import Icon from "@/Components/Icon";
import {Column} from "@/features/requests";
import {empty_request} from "../../const";

export function KanbanColumn({id, title, colors, items}: Column) {
  const { setNodeRef } = useDroppable({ id: id });
  const {overColumn, setCurrentRequest} = useKanbanContext();

  const addItem = () => {
    setCurrentRequest({...empty_request, type: id});
  }

  return <div className={"kanban-column"+(overColumn?.id === id?' bg-gray-500 bg-opacity-10':'')} ref={setNodeRef}>
      <div className={"px-3 py-2 rounded flex items-center text-white mb-5 "+colors} style={{height: '40px'}}>
        <div className="flex-1">{title}</div>
        <button onClick={addItem} className="mr-2 p-0.5"><Icon icon="plus" width=".85em" height=".85em"/></button>
        <span className="text-gray-300">({items.length})</span>
      </div>
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
