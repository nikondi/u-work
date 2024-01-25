import React, {useEffect, useState} from "react";
import {KanbanContextProvider, useKanbanContext} from "./KanbanContext";
import Popup from "./Popup";
import KanbanColumn, {Column} from "./Column";
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {arrayMove} from "@dnd-kit/sortable";
import RequestsAPI from "../../../API/RequestsAPI";
import {Request} from "../Requests";
import Card from "./Card";


const default_columns: Column[] = [
  {id: 'simple', colors: "bg-orange-500", title: "Новые обращения", items: [] },
  {id: 'call', colors: "bg-rose-400", title: "Звонки", items: [] },
  {id: 'done', colors: "bg-green-600", title: "Завершены", items: [] },
  {id: 'suggest', colors: "bg-gray-500", title: "Новые предложения", items: [] },
];

export default function RequestsKanban() {
  return <KanbanContextProvider>
    <RequestsKanbanInner/>
  </KanbanContextProvider>
}

function RequestsKanbanInner() {
  const [columns, setColumns] = useState(default_columns);
  const {setOverColumn, setDraggingItem, draggingItem} = useKanbanContext();

  useEffect(() => {
    RequestsAPI.get(-1, 0, {id: 'desc'}).then(({data}) => {
      columns.forEach((col) => {
        col.items = data.data.filter((item: Request) => item.type == col.id).map((item: Request) => ({id: 'id-'+item.id, content: item}))
      });
      setColumns([...columns]);
    });
  }, []);

  const findColumn = (unique: string | null) => {
    if(!unique)
      return null;
    if(columns.some((c) => c.id === unique))
      return columns.find((c) => c.id === unique) ?? null;

    const id = String(unique);
    const itemWithColumnId = [];
    columns.forEach(c => c.items.forEach(item => itemWithColumnId.push({itemId: item.id, columnId: c.id})));
    const columnId = itemWithColumnId.find((i) => i.itemId === id)?.columnId;
    return columns.find((c) => c.id === columnId) ?? null;
  };

  const handleDragStart = ({ active }: DragOverEvent) => {
      setDraggingItem({id: active.id, data: active.data.current});
  };
  const handleDragOver = ({ active, over, delta }: DragOverEvent) => {
    const activeId = String(active.id);
    const overId = over ? String(over.id) : null;
    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);

    setOverColumn(overColumn);

    if(!activeColumn || !overColumn || activeColumn === overColumn)
      return null;

    setColumns((prevState) => {
      const activeItems = activeColumn.items;
      const overItems = overColumn.items;
      const activeIndex = activeItems.findIndex((i) => i.id === activeId);
      const overIndex = overItems.findIndex((i) => i.id === overId);
      const newIndex = () => {
        const putOnBelowLastItem =
          overIndex === overItems.length - 1 && delta.y > 0;
        const modifier = putOnBelowLastItem ? 1 : 0;
        return overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      };
      return prevState.map((c) => {
        if (c.id === activeColumn.id) {
          c.items = activeItems.filter((i) => i.id !== activeId);
          return c;
        } else if (c.id === overColumn.id) {
          c.items = [
            ...overItems.slice(0, newIndex()),
            activeItems[activeIndex],
            ...overItems.slice(newIndex(), overItems.length)
          ];
          return c;
        } else {
          return c;
        }
      });
    });
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setOverColumn(null);
    setDraggingItem(null);
    const activeId = String(active.id);
    const overId = over ? String(over.id) : null;
    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);
    if (!activeColumn || !overColumn || activeColumn !== overColumn)
      return null;

    const activeIndex = activeColumn.items.findIndex((i) => i.id === activeId);
    const overIndex = overColumn.items.findIndex((i) => i.id === overId);

    if(activeColumn.items[activeIndex].content.type != active.data.current.sortable.containerId) {
      activeColumn.items[activeIndex].content.type = active.data.current.sortable.containerId;
      RequestsAPI.update(active.data.current.id, {type: active.data.current.sortable.containerId}).then();
    }

    if (activeIndex !== overIndex) {
      setColumns((prevState) => {
        return prevState.map((column) => {
          if(column.id === activeColumn.id) {
            column.items = arrayMove(overColumn.items, activeIndex, overIndex);
            return column;
          }
          else
            return column;
        });
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
  );

  return <>
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="flex overflow-auto px-4 sm:px-7 -mx-4 sm:-mx-7 h-full pt-2">
        {columns.map((column) => (
          <KanbanColumn key={column.id} {...column}/>
        ))}
      </div>
      <DragOverlay zIndex={1000}>
          {draggingItem && <Card id={draggingItem.id} item={draggingItem.data} colors="bg-transparent" className="cursor-grabbing"/>}
      </DragOverlay>
    </DndContext>
    <Popup/>
  </>;
}
