import {createContext, useContext} from "react";
import {TKanbanContext} from "../../types";

export const KanbanContext = createContext<TKanbanContext>(null);
const useKanban = () => useContext(KanbanContext);

export default useKanban;
