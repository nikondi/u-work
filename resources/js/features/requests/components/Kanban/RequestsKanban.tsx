import React, {useEffect, useMemo, useState} from "react";
import {KanbanContextProvider, useKanbanContext} from "./KanbanContext";
import Popup from "./Popup";
import {KanbanColumn} from "./Column";
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
import Card from "./Card";
import toast from "react-hot-toast";
import {useEcho} from "@/hooks";
import {default_columns} from "../../const";
import {Request} from "../../types";
import {RequestsAPI} from "../../api";
import SidePopup, {CloseButton, PopupContent} from "@/components/SidePopup";


export function RequestsKanban() {
  return <KanbanContextProvider>
    <RequestsKanbanInner/>
  </KanbanContextProvider>
}

function RequestsKanbanInner() {
  const [data, setData] = useState([]);
  const {setOverColumn, setDraggingItem, draggingItem, currentRequest, setCurrentRequest} = useKanbanContext();

  useEcho('requests', '.update', (res: {data: Request, id: number, type: string}) => {
    setData(data.map(item => (item.id == res.id?{...item, ...res.data}:item)));
  });
  useEcho('requests', '.updateOrder', (res: {data: ({id: number, order: number})[]}) => {
    setData(data.map(item => {
      const order_item = res.data.find((r) => r.id == item.id);
      if(order_item)
        item.order = order_item.order;
      return item;
    }));
  });
  useEcho('requests', '.create', (res: {data: Request, type: string}) => {
    setData([...data, res.data]);
    toast.success(`Новая заявка #${res.data.id}`)
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
    columns.forEach(c => c.items.forEach((item) => itemWithColumnId.push({itemId: item.id, columnId: c.id})));
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
    const activeIndex = activeItems.findIndex((i: any) => i.id === activeId);
    const overIndex = overItems.findIndex((i: any) => i.id === overId);
    const newIndex = () => {
      const putOnBelowLastItem =
          overIndex === overItems.length - 1 && delta.y > 0;
      const modifier = putOnBelowLastItem ? 1 : 0;
      return overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
    };

    columns.map((c) => {
      if (c.id === activeColumn.id) {
        c.items = activeItems.filter((i: any) => i.id !== activeId);
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

    const activeIndex = activeColumn.items.findIndex((i: any) => i.id === activeId);
    const overIndex = overColumn.items.findIndex((i: any) => i.id === overId);
    const changedColumn = activeColumn.items[activeIndex].content.type != active.data.current.sortable.containerId;

    if(changedColumn) {
      activeColumn.items[activeIndex].content.type = active.data.current.sortable.containerId;
      RequestsAPI.update(active.data.current.id, {type: active.data.current.sortable.containerId}).then();
    }

    if (activeIndex !== overIndex || changedColumn) {
      columns.map((column) => {
        if(column.id === activeColumn.id) {
          column.items = arrayMove(overColumn.items, activeIndex, overIndex);
          activeColumn.items.forEach((item: {content: Request}, i: number) => {
            item.content.order = i * 10;
          });
          RequestsAPI.updateOrder(activeColumn.items.map((item: {content: Request}) => ({id: item.content.id, order: item.content.order}))).then();
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
    {currentRequest && <SidePopup onClose={() => setCurrentRequest(null)}>
        <PopupContent>
            <CloseButton onClose={() => setCurrentRequest(null)}/>
            <Popup/>
        </PopupContent>
    </SidePopup>}
  </>;
}
