import React, {Suspense} from "react";
import LoadingArea from "@/components/LoadingArea";
import {Outlet} from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import {lazyImport} from "@/utils/lazyImport";
import {UsersRoutes} from "@/features/users";
import {WorkerRoutes} from "@/features/workers";
import {ClientsRoutes} from "@/features/clients";
import {RequestRoutes} from "@/features/requests/routes";

const { Dashboard } = lazyImport(() => import('@/features/dashboard'), 'Dashboard');
/*import Users from "@/views/Users";
import UserForm from "@/views/UserForm";
import WorkerForm from "@/views/Worker/WorkerForm";
import Clients from "@/views/Client/Clients";
import ClientForm from "@/views/Client/ClientForm";
import RequestsKanban from "@/views/Request/Kanban/RequestsKanban";
import Requests from "@/views/Request/Requests";
import RequestForm from "@/views/Request/RequestForm";*/


const App = () => {
    return (
        <DashboardLayout>
            <Suspense fallback={<div className="relative"><LoadingArea/></div>}>
                <Outlet />
            </Suspense>
        </DashboardLayout>
    );
};

export const protectedRoutes = [
    {
        path: '/',
        element: <App />,
        children: [
            {path: '/', element: <Dashboard/>},

            {path: '/users/*', element: <UsersRoutes/>},
            {path: '/workers/*', element: <WorkerRoutes/>},
            {path: '/clients/*', element: <ClientsRoutes/>},
            {path: '/requests/*', element: <RequestRoutes/>},



/*            ,

            {path: '/kanban', element: <RequestsKanban/>},
            {path: '/requests', element: <Requests/>},
            {path: '/requests/new', element: <RequestForm type="requestCreate"/>},
            {path: '/requests/:id', element: <RequestForm type="requestUpdate"/>},*/
        ],
    },
];
