import {TRequest} from "@/Features/Requests/types";
import {Active} from "@dnd-kit/core";
import {PageProps, StateFunction} from "@/types";

export type TKanbanContext = {
  columns: TKanbanColumn[]
  setColumns: StateFunction<TKanbanColumn[]>
  addItemsToColumn: (column: string, items: TRequest|TRequest[]) => void
  moveCard: (from_card: Active, toColumn: string, toIndex: number) => void
  overColumn: string
  setOverColumn: StateFunction<string>
}

export type TKanbanColumn = {
  id: string,
  items: TRequest[]
}

export type TKanbanPageProps = PageProps<{
  request: TRequest
}>
