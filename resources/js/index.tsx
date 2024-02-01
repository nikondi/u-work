import React from "react";
import App from "./App";
import {createRoot} from "react-dom/client";
import './bootstrap';
import '../css/app.scss'

createRoot(document.getElementById('app')).render(<React.StrictMode><App/></React.StrictMode>)
