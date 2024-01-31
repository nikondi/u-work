import React, {useEffect, useMemo, useState} from "react";
import {KanbanContextProvider, useKanbanContext} from "./KanbanContext";
import Popup from "./Popup";
import KanbanColumn, {Column} from "./Column";
import {Request} from "../../../API/RequestsAPI";
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
import Card from "./Card";
import useEcho from "../../../hooks/useEcho";


export const default_columns: Column[] = [
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
  const [data, setData] = useState([]);
  const {setOverColumn, setDraggingItem, draggingItem, currentRequest} = useKanbanContext();

  useEcho('requests', '.update', res => {
    setData(data.map(item => (item.id == res.id?{...item, ...res.data}:item)));
  });
  useEcho('requests', '.updateOrder', res => {
    setData(data.map(item => {
      const order_item = res.data.find((r) => r.id == item.id);
      if(order_item)
        item.order = order_item.order;
      return item;
    }));
  });
  useEcho('requests', '.create', res => {
    setData([...data, res.data]);
  });

  const columns = useMemo(() => {
    return default_columns.map((c) => {
      c.items = data
          .filter((item: Request) => item.type == c.id)
          .map((item: Request) => ({id: 'id-'+item.id, content: item}))
          .sort((i1, i2) => (i1.content.order - i2.content.order || i2.content.id - i1.content.id));
      return c;
    });
  }, [data]);

  useEffect(() => {
    RequestsAPI.get(-1, 0, {order: 'asc', id: 'desc'}, {temp: false, archived: false}).then(({data}) => {
      setData(data.data);
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

    columns.map((c) => {
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
    const changedColumn = activeColumn.items[activeIndex].content.type != active.data.current.sortable.containerId;

    if(changedColumn) {
      activeColumn.items[activeIndex].content.type = active.data.current.sortable.containerId;
      RequestsAPI.update(active.data.current.id, {type: active.data.current.sortable.containerId}).then();
    }

    if (activeIndex !== overIndex || changedColumn) {
      columns.map((column) => {
        if(column.id === activeColumn.id) {
          column.items = arrayMove(overColumn.items, activeIndex, overIndex);
          activeColumn.items.forEach((item, i) => {
            item.content.order = i * 10;
          });
          RequestsAPI.updateOrder(activeColumn.items.map((item) => ({id: item.content.id, order: item.content.order}))).then();
          return column;
        }
        else
          return column;
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
      <div className="kanban tiny-scrollbar">
        {columns.map((column) => (
          <KanbanColumn key={column.id} {...column}/>
        ))}
      </div>
      <DragOverlay zIndex={1000}>
          {draggingItem && <Card id={draggingItem.id} item={draggingItem.data} colors="bg-transparent" className="cursor-grabbing"/>}
      </DragOverlay>
    </DndContext>
    {currentRequest && <Popup/>}
  </>;
}
