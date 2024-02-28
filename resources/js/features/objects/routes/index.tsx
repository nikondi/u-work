import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {lazyImport} from "@/utils/lazyImport";

const { ObjectsPage } = lazyImport(() => import('../pages/ObjectsPage'), "ObjectsPage");


export const ObjectsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ObjectsPage/>}/>
    </Routes>
  );
};
