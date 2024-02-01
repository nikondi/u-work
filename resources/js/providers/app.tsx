import React, {Suspense} from "react";
import LoadingArea from "@/components/LoadingArea";
import {AuthProvider} from "@/lib/auth";
import {BrowserRouter as Router} from 'react-router-dom';
import {Toaster} from "react-hot-toast";

export default function AppProvider({children}) {
    return <Suspense fallback={<div className="flex items-center justify-center w-screen h-screen"><LoadingArea /></div>}>
        <AuthProvider>
            <Router>
                {children}
            </Router>
        </AuthProvider>
        <Toaster position="bottom-right" />
    </Suspense>
}
