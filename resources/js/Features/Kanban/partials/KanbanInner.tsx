import {useKanban} from "../contexts/KanbanContext";
import React, {useState} from "react";
import {
  closestCenter,
  DndContext,
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

export default function KanbanInner() {
  const {columns, moveCard} = useKanban();
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

    moveCard(active, overColumn, overIndex);
  };

  const handleDragEnd = () => {
    setDraggingItem(null);
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
