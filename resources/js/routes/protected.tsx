import React, {Suspense} from "react";
import LoadingArea from "@/components/LoadingArea";
import {Outlet} from "react-router-dom";
import DashboardLayout from "@/Layout/DashboardLayout/DashboardLayout";
import {UsersRoutes} from "@/features/users";
import {WorkerRoutes} from "@/features/workers";
import {ClientsRoutes} from "@/features/clients";
import {RequestRoutes} from "@/features/requests";
import {AddressesRoutes} from "@/features/addresses";
import {ObjectsRoutes} from "@/features/objects";
import {Dashboard} from "@/features/dashboard";


const App = () => {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="fixed inset-0"><LoadingArea/></div>}>
        <Outlet/>
      </Suspense>
    </DashboardLayout>
  );
};

export const protectedRoutes = [
  {
    path: '/',
    element: <App/>,
    children: [
      {path: '/', element: <Dashboard/>},

      {path: '/users/*', element: <UsersRoutes/>},
      {path: '/workers/*', element: <WorkerRoutes/>},
      {path: '/clients/*', element: <ClientsRoutes/>},
      {path: '/requests/*', element: <RequestRoutes/>},
      {path: '/addresses/*', element: <AddressesRoutes/>},
      {path: '/objects/*', element: <ObjectsRoutes/>},
    ],
  },
];
