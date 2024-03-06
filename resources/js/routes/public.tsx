import React from 'react';
import {AuthRoutes} from "@/features/auth";

export const publicRoutes = [
    {
        path: '/*',
        element: <AuthRoutes />,
    },
];
