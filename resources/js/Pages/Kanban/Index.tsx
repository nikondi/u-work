import {ReactNode} from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import {Kanban} from "@/Features/Kanban/partials"

const KanbanPage = () => {
  return <div className="kanban-wrap">
    <Kanban/>
  </div>;
}

KanbanPage.layout = (page: ReactNode) => <DashboardLayout children={page}/>
export default KanbanPage;
