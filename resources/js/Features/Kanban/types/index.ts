import {TRequestCard} from "@/Features/Requests/types";
import {Active} from "@dnd-kit/core";
import {StateFunction} from "@/types";

export type TKanbanContext = {
  columns: TKanbanColumn[]
  setColumns: StateFunction<TKanbanColumn[]>
  addItemsToColumn: (column: string, items: TRequestCard|TRequestCard[]) => void
  moveCard: (from_card: Active, toColumn: string, toIndex: number) => void
}

export type TKanbanColumn = {
  id: string,
  colors: string,
  title: string,
  items: TRequestCard[]
}
