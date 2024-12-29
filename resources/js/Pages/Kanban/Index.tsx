import React, {ReactNode} from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import {ExcelExport, KanbanInner} from "@/Features/Kanban/partials"
import {KanbanProvider} from "@/Features/Kanban/contexts/KanbanContext";
import {RequestPopup} from "@/Features/Kanban/partials/RequestPopup";
import {TKanbanPageProps} from "@/Features/Kanban/types";


const KanbanPage = ({request}: TKanbanPageProps) => {
  return <div className="kanban-wrap">
    <KanbanProvider>
      <div className="flex justify-between">
        <ExcelExport/>
      </div>
      <KanbanInner/>
      {request && <RequestPopup request={request}/>}
    </KanbanProvider>
  </div>;
}

KanbanPage.layout = (page: ReactNode) => <DashboardLayout children={page}/>
export default KanbanPage;
