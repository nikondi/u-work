import React, {PropsWithChildren, useState} from "react";
import {KanbanContext} from "./KanbanContext";
import {TKanbanColumn} from "@/Features/Kanban/types";
import {TRequestCard} from "@/Features/Requests/types";
import {Active} from "@dnd-kit/core";
import {arrayMove} from "@dnd-kit/sortable";

const initial_columns: TKanbanColumn[] = [
  {id: 'simple', colors: "bg-orange-500", title: "Новые обращения", items: []},
  {id: 'order', colors: "bg-orange-500", title: "Заказы", items: []},
  {id: 'call', colors: "bg-rose-400", title: "Звонки", items: []},
  {id: 'done', colors: "bg-green-600", title: "Завершены", items: []},
  {id: 'suggest', colors: "bg-gray-500", title: "Новые предложения", items: []},
];

export default function KanbanProvider({children}: PropsWithChildren) {
  const [columns, setColumns] = useState(initial_columns);

  const addItemsToColumn = (column: string, items: TRequestCard|TRequestCard[]) => {
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

    console.log(toColumn, toIndex)

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
      columns, addItemsToColumn, moveCard, setColumns
    }}>
      {children}
    </KanbanContext.Provider>
  )
}
