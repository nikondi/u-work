import ErrorBoundary from "@/components/ErrorBoundary";
import React, {PropsWithChildren} from "react";
import {Sidebar, TopBar} from "./partials";
import {PageProvider} from "@/Contexts/PageContext";
import {AuthProvider} from "@/Contexts/AuthContext";
import {Head, usePage} from "@inertiajs/react";
import {PageProps} from "@/types";
import {Toaster} from "react-hot-toast";


export default function DashboardLayout({children}: PropsWithChildren) {
  const {title, h1} = usePage<PageProps>().props;

  return <>
    <Head>
      <title>{title}</title>
    </Head>
    <AuthProvider>
      <PageProvider>
        <div className="dark:text-white text-gray-800 h-screen flex overflow-hidden text-sm">
          <Sidebar/>
          <div className="flex-grow overflow-hidden h-full flex flex-col">
            <TopBar/>
            <div className="flex-grow flex overflow-x-hidden">
              <div className="flex-grow bg-gray-100 dark:bg-gray-900 overflow-y-auto sm:p-7 p-4">
                {h1 && <h1 className="heading">{h1}</h1>}
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </div>
            </div>
          </div>
        </div>
      </PageProvider>
    </AuthProvider>
    <Toaster position="bottom-right" toastOptions={{
      style: {
        background: 'rgba(54,54,54,.85)',
        color: '#fff',
        backdropFilter: 'blur(15px)'
      },
      duration: 5000
    }} />
  </>;
}

