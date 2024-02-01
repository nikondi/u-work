import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import {Login} from './Login';
import storage from "@/utils/storage";

export const AuthRoutes = () => {
    if(storage.getToken())
        return <Navigate to="/" />

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="login" element={<Login />} />
        </Routes>
    );
};
