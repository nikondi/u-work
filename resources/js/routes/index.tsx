import React from "react";
import {useAuth} from "@/lib/auth";
import {protectedRoutes} from "@/routes/protected";
import {publicRoutes} from "@/routes/public";
import {useRoutes} from "react-router-dom";

export const AppRoutes = () => {
  const {user} = useAuth();

  const commonRoutes = [];

  const routes = user ? protectedRoutes : publicRoutes;

  const element = useRoutes([...routes, ...commonRoutes]);

  return <>{element}</>;
}
