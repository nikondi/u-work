import {ReactNode} from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";

const Welcome = () => {
  return <>
    В разработке :)
  </>
}

Welcome.layout = (page: ReactNode) => <DashboardLayout children={page}/>
export default Welcome;
