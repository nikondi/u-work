import {Navigate} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import axiosClient from "../axios-client.jsx";
import {useEffect} from "react";
import toast, {Toaster} from "react-hot-toast";
import Dashboard from "../components/Dashboard/Dashboard.jsx";

export default function DefaultLayout() {
  const {token, setUser} = useStateContext();

  if(!token)
    return <Navigate to="/login"/>

  useEffect(() => {
    axiosClient.get('/user').then(({data}) => {
      setUser(data);
    }).catch((e) => {
        toast.error(`Произошла ошибка: ${e.message}`);
    });
  }, []);

  return (<>
    <Dashboard/>
    <Toaster position="bottom-right" />
  </>);
}
