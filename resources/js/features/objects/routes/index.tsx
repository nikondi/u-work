import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {lazyImport} from "@/utils/lazyImport";

const { Objects } = lazyImport(() => import('../pages/Objects'), "Objects");


export const ObjectsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Objects/>}/>
    </Routes>
  );
};
