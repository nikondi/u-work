import {Navigate} from "react-router-dom";
import {Authorized, useStateContext} from "../contexts/ContextProvider.jsx";
import {Toaster} from "react-hot-toast";
import ErrorBoundary from "../components/ErrorBoundary.jsx";
import DashboardLayout from "../components/DashboardLayout/DashboardLayout.jsx";

export default function DefaultLayout() {
  const {token} = useStateContext();

  if(!token)
    return <Navigate to="/login"/>

  return (
    <ErrorBoundary>
      <Authorized>
        <DashboardLayout/>
        <Toaster position="bottom-right" />
      </Authorized>
    </ErrorBoundary>
  );
}
