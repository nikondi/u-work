import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {lazyImport} from "@/utils/lazyImport";

const { Users } = lazyImport(() => import('@/features/users'), "Users");
const { WorkerForm } = lazyImport(() => import('../components/WorkerForm'), "WorkerForm");

export const WorkerRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Users type="workers"/>}/>
            <Route path="/new" element={<WorkerForm key="create"/>}/>
            <Route path="/:id" element={<WorkerForm key="edit"/>}/>
        </Routes>
    );
};
