import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {lazyImport} from "@/utils/lazyImport";

const { Addresses } = lazyImport(() => import('../components/Addresses'), "Addresses");


export const AddressesRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Addresses/>}/>
        </Routes>
    );
};
