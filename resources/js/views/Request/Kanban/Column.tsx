import React from "react";
import {Request} from "../Requests";
import {rectSortingStrategy, SortableContext} from "@dnd-kit/sortable";
import Card from "./Card";
import {useDroppable} from "@dnd-kit/core";
import {useKanbanContext} from "./KanbanContext";

export type Column = {
  id: string,
  colors: string,
  title: string,
  items: {id: string, content: Request}[]
}

export default function KanbanColumn({id, title, colors, items}: Column) {
  const { setNodeRef } = useDroppable({ id: id });
  const {overColumn} = useKanbanContext();

  return <div className={"w-[250px] min-w-[250px] px-2 pt-2 -mt-2 flex flex-col h-full rounded transition-colors"+(overColumn?.id === id?' bg-gray-500 bg-opacity-10':'')} ref={setNodeRef}>
      <div className={"px-3 py-2 rounded flex text-white mb-5 "+colors}><div className="flex-1">{title}</div><span className="text-gray-300">({items.length})</span></div>
      <div className="flex-1">
        <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
          {items.map((item) => <Card id={item.id} key={item.id} item={item.content} colors={colors}/>)}
        </SortableContext>
      </div>
    </div>
}
