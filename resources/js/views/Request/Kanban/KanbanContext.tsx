import React, {createContext, useContext, useState} from "react";
import {Request} from "../../../API/RequestsAPI";
import {Column} from "./Column";

type KanbanContext = {
  currentRequest: Request,
  setCurrentRequest: stateFunction<Request>,
  overColumn: Column,
  setOverColumn: stateFunction<Column>,
  draggingItem: {id: string, data: (Request & {sortable: any}) | any},
  setDraggingItem: stateFunction
}

const KanbanContext = createContext<KanbanContext>(null);

export const KanbanContextProvider = ({children}) => {
  const [currentRequest, setCurrentRequest] = useState(null);
  const [overColumn, setOverColumn] = useState(null);
  const [draggingItem, setDraggingItem] = useState(null);

  return (
    <KanbanContext.Provider value={{
      currentRequest, setCurrentRequest,
      overColumn, setOverColumn,
      draggingItem, setDraggingItem
    }}>
      {children}
    </KanbanContext.Provider>
  )
}

export const useKanbanContext = () => useContext(KanbanContext);
