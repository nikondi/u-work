import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {lazyImport} from "@/utils/lazyImport";

const { Clients } = lazyImport(() => import('../components/Clients'), "Clients");
const { ClientForm } = lazyImport(() => import('../components/ClientForm'), "ClientForm");

export const ClientsRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Clients/>}/>
            <Route path="/new" element={<ClientForm key="create"/>}/>
            <Route path="/:id" element={<ClientForm key="edit"/>}/>
        </Routes>
    );
};
