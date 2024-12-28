import {useKanban} from "../contexts/KanbanContext";
import React, {useState} from "react";
import {
  closestCenter,
  DndContext, DragEndEvent,
  DragOverEvent,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {Column} from "../components";
import Card from "@/Features/Kanban/components/Card";
import {TRequest} from "@/Features/Requests/types";
import RequestsAPI from "@/API/RequestsAPI";

export default function KanbanInner() {
  const {columns, moveCard, setOverColumn} = useKanban();
  const [draggingItem, setDraggingItem] = useState<TRequest>();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 400,
        tolerance: 20,
      }
    }),
  );


  const handleDragStart = ({active}: DragOverEvent) => {
    setDraggingItem(active.data.current.item);
  };
  const handleDragOver = ({active, over, delta, collisions}: DragOverEvent) => {
    let overColumn = String(collisions.filter((c) => isNaN(+c.id))[0].id);
    let overIndex = 0;
    if(over.data.current) {
      overColumn = over.data.current.sortable.containerId;
      overIndex = over.data.current.sortable.index;

      // if(delta.y > 0 && columns.find(({id}) => id == overColumn).items.length - 1 == overIndex)
      //   overIndex += 1;
    }
    else {
      if(delta.y > 0)
        overIndex = columns.find((col) => col.id == overColumn).items.length;
    }
    setOverColumn(overColumn);

    moveCard(active, overColumn, overIndex);
  };

  const handleDragEnd = ({active}: DragEndEvent) => {
    setDraggingItem(null);
    setOverColumn(null);

    const newColumn = active.data.current.sortable.containerId;
    const item = active.data.current.item;
    const changedColumn = item.type != newColumn;

    item.type = newColumn;
    const activeColumn = columns.find(({id}) => newColumn == id);

    const reOrder = () => {
      return RequestsAPI.updateOrder(activeColumn.items.map((item, i) => ({
        id: item.id,
        order: i * 10
      })));
    }
    const changeColumn = () => {
      return RequestsAPI.update(item.id, { type: newColumn });
    }

    let prom = new Promise((resolve) => resolve(1));
    if(changedColumn)
      prom = prom.then(changeColumn);
    prom.then(reOrder);
  };

  return <DndContext
    sensors={sensors}
    collisionDetection={closestCenter}
    onDragStart={handleDragStart}
    onDragEnd={handleDragEnd}
    onDragOver={handleDragOver}
  >
    <div className="kanban">
      {columns.map((column) => <Column key={column.id} {...column}/>)}
    </div>
    <DragOverlay zIndex={1000}>
      {draggingItem &&
        <Card id={draggingItem.id} data={draggingItem} className="cursor-grabbing"/>}
    </DragOverlay>
  </DndContext>
}
