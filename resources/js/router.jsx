import {createBrowserRouter} from "react-router-dom";
import Login from "./views/Login.jsx";
import NotFound from "./views/NotFound.jsx";
import DefaultLayout from "./layouts/DefaultLayout.jsx";
import GuestLayout from "./layouts/GuestLayout.jsx";
import Dashboard from "./views/Dashboard.jsx";
import Requests from "./views/Request/Requests";
import Clients from "./views/Client/Clients";
import RequestForm from "./views/Request/RequestForm";

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout/>,
    children: [
      {
        path: '/',
        element: <Dashboard/>
      },
      {
        path: '/users',
        element: <Dashboard/>
      },
      {
        path: '/clients',
        element: <Clients/>
      },
      {
        path: '/requests',
        element: <Requests/>
      },
      {
        path: '/requests/new',
        element: <RequestForm type="requestCreate"/>
      },
      {
        path: '/requests/:id',
        element: <RequestForm type="requestUpdate"/>
      },

    ],
  },
  {
    path: '/',
    element: <GuestLayout/>,
    children: [
      {
        path: '/login',
        element: <Login/>
      },
    ]
  },
  {
    path: '*',
    element: <NotFound/>
  },
]);

export default router;
