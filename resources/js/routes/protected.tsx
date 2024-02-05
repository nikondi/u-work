import React, {Suspense} from "react";
import LoadingArea from "@/components/LoadingArea";
import {Outlet} from "react-router-dom";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import {lazyImport} from "@/utils/lazyImport";
import {UsersRoutes} from "@/features/users";
import {WorkerRoutes} from "@/features/workers";
import {ClientsRoutes} from "@/features/clients";
import {RequestRoutes} from "@/features/requests/routes";
import SidePopup from "@/components/SidePopup";

const { Dashboard } = lazyImport(() => import('@/features/dashboard'), 'Dashboard');



const App = () => {
    return (
        <SidePopup>
            <DashboardLayout>
                <Suspense fallback={<div className="relative"><LoadingArea/></div>}>
                    <Outlet />
                </Suspense>
            </DashboardLayout>
        </SidePopup>
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
