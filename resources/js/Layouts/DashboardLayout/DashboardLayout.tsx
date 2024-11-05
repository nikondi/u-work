import ErrorBoundary from "@/components/ErrorBoundary";
import React, {PropsWithChildren} from "react";
import {Sidebar, TopBar} from "./partials";
import {PageProvider} from "@/Contexts/PageContext";
import {AuthProvider} from "@/Contexts/AuthContext";


export default function DashboardLayout({children}: PropsWithChildren) {
  return (
    <AuthProvider>
      <PageProvider>
        <div className="dark:text-white text-gray-800 h-screen flex overflow-hidden text-sm">
          <Sidebar/>
          <div className="flex-grow overflow-hidden h-full flex flex-col">
            <TopBar/>
            <div className="flex-grow flex overflow-x-hidden">
              <div className="flex-grow bg-gray-100 dark:bg-gray-900 overflow-y-auto sm:p-7 p-4">
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </div>
            </div>
          </div>
        </div>
      </PageProvider>
    </AuthProvider>
  );
}

