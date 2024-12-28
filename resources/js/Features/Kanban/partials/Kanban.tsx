import React from "react";
import {KanbanProvider} from "../contexts/KanbanContext";
import KanbanInner from "./KanbanInner";


export default function Kanban() {
  return <KanbanProvider>
    <KanbanInner/>
  </KanbanProvider>
}
