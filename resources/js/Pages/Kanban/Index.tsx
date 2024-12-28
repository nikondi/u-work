import React, {ReactNode} from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import {ExcelExport, Kanban} from "@/Features/Kanban/partials"

const KanbanPage = () => {
  return <div className="kanban-wrap">
    <ExcelExport/>
    <Kanban/>
  </div>;
}

KanbanPage.layout = (page: ReactNode) => <DashboardLayout children={page}/>
export default KanbanPage;
