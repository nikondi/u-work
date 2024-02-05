import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {lazyImport} from "@/utils/lazyImport";

const { Clients } = lazyImport(() => import('../components/Clients'), "Clients");
const { ClientFormPage } = lazyImport(() => import('../components/ClientForm'), "ClientFormPage");

export const ClientsRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Clients/>}/>
            <Route path="/new" element={<ClientFormPage key="create"/>}/>
            <Route path="/:id" element={<ClientFormPage key="edit"/>}/>
        </Routes>
    );
};
