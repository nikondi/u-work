import './bootstrap';
import React from 'react'
import ReactDOM from 'react-dom/client'
import '../css/app.scss'
import {RouterProvider} from "react-router-dom";
import router from "./router.jsx";
import {ContextProvider} from "./contexts/ContextProvider";

ReactDOM.createRoot(document.getElementById('app')).render(
  <>
     <ContextProvider>
       <RouterProvider router={router} />
     </ContextProvider>
   </>,
);

