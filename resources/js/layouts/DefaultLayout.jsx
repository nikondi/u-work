import {Navigate} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import axiosClient from "../axios-client.jsx";
import {useEffect} from "react";
import toast, {Toaster} from "react-hot-toast";
import Dashboard from "../components/Dashboard/Dashboard.jsx";
import ErrorBoundary from "../components/ErrorBoundary.jsx";

export default function DefaultLayout() {
  const {token} = useStateContext();

  if(!token)
    return <Navigate to="/login"/>

  return (<ErrorBoundary>
    <Dashboard/>
    <Toaster position="bottom-right" />
  </ErrorBoundary>);
}
