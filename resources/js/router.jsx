import {createBrowserRouter} from "react-router-dom";
import Login from "./views/Login.jsx";
import NotFound from "./views/NotFound.jsx";
import DefaultLayout from "./layouts/DefaultLayout.jsx";
import GuestLayout from "./layouts/GuestLayout.jsx";
import Dashboard from "./views/Dashboard.jsx";
import Requests from "./views/Request/Requests";
import Clients from "./views/Client/Clients";
import RequestForm from "./views/Request/RequestForm";
import Users from "./views/Users";
import UserForm from "./views/UserForm.tsx";
import RequestsKanban from "./views/Request/Kanban/RequestsKanban";
import WorkerForm from "./views/Worker/WorkerForm";

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
        element: <Users/>
      },
      {
        path: '/users/new',
        element: <UserForm key="userCreate"/>
      },
      {
        path: '/users/:id',
        element: <UserForm key="userUpdate"/>
      },
      {
        path: '/workers',
        element: <Users key="workerList" type="workers"/>
      },
      {
        path: '/workers/new',
        element: <WorkerForm key="create"/>
      },
      {
        path: '/workers/:id',
        element: <WorkerForm key="edit"/>
      },
      {
        path: '/clients',
        element: <Clients/>
      },
      {
        path: '/kanban',
        element: <RequestsKanban/>
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
