import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {lazyImport} from "@/utils/lazyImport";

const { Requests } = lazyImport(() => import('../components/Requests'), "Requests");
const { RequestForm } = lazyImport(() => import('../components/RequestForm'), "RequestForm");
const { RequestsKanban } = lazyImport(() => import('../components/Kanban/RequestsKanban'), "RequestsKanban");


export const RequestRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Requests/>}/>
            <Route path="/new" element={<RequestForm type="requestCreate" key="create"/>}/>
            <Route path="/:id" element={<RequestForm type="requestUpdate" key="edit"/>}/>
            <Route path="/kanban" element={<RequestsKanban/>}/>
        </Routes>
    );
};
