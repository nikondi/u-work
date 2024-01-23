import React, {createContext, useContext, useState} from "react";
import {Request} from "../Requests";

type KanbanContext = {
    currentRequest: Request,
    setCurrentRequest: stateFunction<Request>,
}

const KanbanContext = createContext<KanbanContext>(null);

export const KanbanContextProvider = ({children}) => {
    const [currentRequest, setCurrentRequest] = useState(null);

    return (
        <KanbanContext.Provider value={{
            currentRequest, setCurrentRequest
        }}>
            {children}
        </KanbanContext.Provider>
    )
}

export const useKanbanContext = () => useContext(KanbanContext);
