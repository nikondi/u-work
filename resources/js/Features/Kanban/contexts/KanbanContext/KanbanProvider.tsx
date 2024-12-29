import React, {PropsWithChildren, useState} from "react";
import {KanbanContext} from "./KanbanContext";
import {TKanbanColumn} from "@/Features/Kanban/types";
import {TRequest} from "@/Features/Requests/types";
import {Active} from "@dnd-kit/core";
import {arrayMove} from "@dnd-kit/sortable";

const initial_columns: TKanbanColumn[] = [
  {id: 'simple',items: []},
  {id: 'order',items: []},
  {id: 'call',items: []},
  {id: 'done',items: []},
  {id: 'suggest',items: []},
];

export default function KanbanProvider({children}: PropsWithChildren) {
  const [columns, setColumns] = useState(initial_columns);
  const [overColumn, setOverColumn] = useState<string>(null);

  const addItemsToColumn = (column: string, items: TRequest|TRequest[]) => {
    if(!Array.isArray(items))
      items = [items];

    setColumns((prev) => {
      return prev.map((col) => {
        if(col.id == column) {
          const exists = col.items.map((item) => item.id);
          return {...col, items: [...col.items, ...items.filter((item) => !exists.includes(item.id))]}
        }
        return col;
      });
    })
  }

  const moveCard = (from_card: Active, toColumn: string, toIndex: number ) => {
    const fromColumn = from_card.data.current.sortable.containerId;
    let fromIndex = from_card.data.current.sortable.index;

    if(fromColumn !== toColumn) {
      setColumns((prev) => {
        return prev.map((col) => {
          if(col.id == fromColumn)
            return {...col, items: col.items.filter((item) => item.id != from_card.id)}
          if(col.id == toColumn) {
            const new_items = [...col.items, from_card.data.current.item];
            fromIndex = new_items.length - 1;
            return {...col, items: new_items}
          }
          return col;
        })
      })
    }

    setColumns((prev) => prev.map((col) => {
      if(col.id == toColumn)
        return {...col, items: arrayMove(col.items, fromIndex, toIndex)}
      return col;
    }))
  }

  return (
    <KanbanContext.Provider value={{
      columns, addItemsToColumn, moveCard, setColumns,
      overColumn, setOverColumn
    }}>
      {children}
    </KanbanContext.Provider>
  )
}
