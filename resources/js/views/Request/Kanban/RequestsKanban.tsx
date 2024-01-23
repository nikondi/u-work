import React from "react";
import {KanbanContextProvider} from "./KanbanContext";
import Popup from "./Popup";
import KanbanColumn from "./Column";

export default function RequestsKanban() {
    return <KanbanContextProvider>
        <div className="flex overflow-x-auto px-4 sm:px-7 -mx-4 sm:-mx-7 h-full">
            <KanbanColumn type="simple" name="Новые обращения" colors="bg-orange-500"/>
            <KanbanColumn type="call" name="Звонки" colors="bg-rose-400"/>
            <KanbanColumn type="done" name="Завершены" colors="bg-green-600"/>
            <KanbanColumn type="suggest" name="Новые предложения" colors="bg-gray-500"/>
        </div>
        <Popup/>
    </KanbanContextProvider>;
}



