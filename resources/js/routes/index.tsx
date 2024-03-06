import React, {useMemo} from "react";
import {useAuth} from "@/lib/auth";
import {protectedRoutes} from "@/routes/protected";
import {publicRoutes} from "@/routes/public";
import {useRoutes} from "react-router-dom";
import {lazyImport} from "@/utils/lazyImport";

const {NotFound} = lazyImport(() => import('@/features/notFound'), 'NotFound');

export const AppRoutes = () => {
  const {user} = useAuth();

  const commonRoutes = [
    {path: '*', element: <NotFound/>}
  ];

  const routes = useMemo(() => {
    if(user === false)
      return [];
    else
      return user ? protectedRoutes : publicRoutes;
  }, [user])

  const element = useRoutes([...routes, ...commonRoutes]);

  return <>{element}</>;
}
