import React, {ReactNode} from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import {ExcelExport, KanbanInner} from "@/Features/Kanban/partials"
import {KanbanProvider} from "@/Features/Kanban/contexts/KanbanContext";

const KanbanPage = () => {
  return <div className="kanban-wrap">
    <KanbanProvider>
      <div className="flex justify-between">
        <ExcelExport/>
      </div>
      <KanbanInner/>
    </KanbanProvider>
  </div>;
}

KanbanPage.layout = (page: ReactNode) => <DashboardLayout children={page}/>
export default KanbanPage;
