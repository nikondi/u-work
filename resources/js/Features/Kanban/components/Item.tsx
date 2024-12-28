import React, {HTMLAttributes} from "react";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {TRequest} from "@/Features/Requests/types";

type Props = {
  id: number
  data: TRequest
} & Omit<HTMLAttributes<HTMLDivElement>, 'id'>

export default function Item({id, data, children, style, ...props}: Props) {
  const {active, attributes, transition, listeners, setNodeRef, transform} = useSortable({id, data: {item: data}});

  return <div ref={setNodeRef} {...attributes} {...listeners} style={{
    ...style,
    transform: CSS.Transform.toString(transform),
    position: "relative",
    transition,
    padding: "5px 0",
  }} {...props}>
    {
      (active && active.id == id)
        ? <div className="kanban-card-placeholder"><div className="opacity-0">{children}</div></div>
        : children
    }
  </div>
}
