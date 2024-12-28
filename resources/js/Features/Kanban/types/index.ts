import {TRequest} from "@/Features/Requests/types";
import {Active} from "@dnd-kit/core";
import {StateFunction} from "@/types";

export type TKanbanContext = {
  columns: TKanbanColumn[]
  setColumns: StateFunction<TKanbanColumn[]>
  addItemsToColumn: (column: string, items: TRequest|TRequest[]) => void
  moveCard: (from_card: Active, toColumn: string, toIndex: number) => void
}

export type TKanbanColumn = {
  id: string,
  title: string,
  items: TRequest[]
}
