import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import storage from "@/utils/storage";

export function GuestLayout() {
    if(storage.getToken())
        return <Navigate to="/" />

    return (<Outlet />)
}
