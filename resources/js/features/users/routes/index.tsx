import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {lazyImport} from "@/utils/lazyImport";

const { Users } = lazyImport(() => import('../components/Users'), 'Users');
const { UserForm } = lazyImport(() => import('../components/UserForm'), 'UserForm');

export const UsersRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Users />} />
            <Route path="/new" element={<UserForm key="userCreate"/>}/>
            <Route path="/:id" element={<UserForm key="userUpdate"/>}/>
        </Routes>
    );
};
